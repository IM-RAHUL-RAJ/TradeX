package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DAO.ClientDAO;
import com.example.tradex_service.DAO.TradeDao;
import com.example.tradex_service.DAO.PortfolioPositionDao;
import com.example.tradex_service.DAO.OrderDao;
import com.example.tradex_service.DAO.PriceDao;
import com.example.tradex_service.DTO.Request.TradeBuySellRequest;
import com.example.tradex_service.DTO.Response.TradeBuySellResponse;
import com.example.tradex_service.Models.Direction;
import com.example.tradex_service.Models.Order;
import com.example.tradex_service.Models.Price;
import com.example.tradex_service.Models.Trade;
import com.example.tradex_service.Service.TradeBuySellService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class TradeBuySellServiceImpl implements TradeBuySellService {

    private final ClientDAO clientDao;
    private final TradeDao tradeDao;
    private final PortfolioPositionDao portfolioPositionDao;
    private final OrderDao orderDao;
    private final PriceDao priceDao;


    private static final Logger logger = LoggerFactory.getLogger(TradeBuySellServiceImpl.class);

    // Helper method to generate a unique 10-digit orderId
    private String generateUniqueOrderId() {
        String orderId;
        do {
            orderId = String.valueOf(1000000000L + (long)(Math.random() * 9000000000L));
        } while (orderDao.findById(orderId) != null);
        return orderId;
    }

    @Override
    public String executeTrade(TradeBuySellRequest request, String token) {
        // 1. Validate quantity
        if (request.getQuantity() < 0) {
            return "Quantity cannot be negative";
        }
        if (request.getQuantity() == 0) {
            return "Quantity cannot be zero";
        }
        // 2. Validate holdings/cash
        if (request.getDirection() == Direction.SELL) {
            PortfolioResponseDto portfolio = portfolioPositionDao.fetchPortfolioResponse(request.getClientId());
            double owned = 0;
            if (portfolio != null && portfolio.getPositions() != null) {
                for (PortfolioPositionResponseDto pos : portfolio.getPositions()) {
                    if (pos.getInstrumentId().equals(request.getInstrumentId())) {
                        owned = pos.getQuantity();
                        break;
                    }
                }
            }
            if (owned < request.getQuantity()) {
                return "Insufficient holdings";
            }
        } else if (request.getDirection() == Direction.BUY) {
            double cash = clientDao.getCashBalance(request.getClientId());
            double estCost = request.getQuantity() * request.getTargetPrice() * 1.01; // 1% fee
            if (cash < estCost) {
                return "Insufficient cash balance";
            }
        }
        // 3. Call FMTS
        Map<String, Object> fmtsRequest = new HashMap<>();
        fmtsRequest.put("orderId", request.getOrderId());
        fmtsRequest.put("instrumentId", request.getInstrumentId());
        fmtsRequest.put("clientId", request.getClientId());
        fmtsRequest.put("quantity", request.getQuantity());
        fmtsRequest.put("targetPrice", request.getTargetPrice());
        fmtsRequest.put("direction", request.getDirection() == Direction.BUY ? "B" : "S");
        fmtsRequest.put("token", token);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(fmtsRequest, headers);
        RestTemplate restTemplate = new RestTemplate();
        String fmtsUrl = "http://fmts-nodejs:3000/fmts/trades/trade";
        try {
            ResponseEntity<String> rawResponse = restTemplate.postForEntity(fmtsUrl, entity, String.class);
            if (rawResponse.getBody() == null || rawResponse.getBody().trim().equals("null") || rawResponse.getBody().trim().isEmpty()) {
                return "FMTS error or empty response";
            }
            ObjectMapper mapper = new ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(rawResponse.getBody());

            // 1. Generate unique orderId
            String generatedOrderId = generateUniqueOrderId();

            // 2. Build Order object from FMTS response
            com.fasterxml.jackson.databind.JsonNode orderNode = root.get("order");
            Order order = Order.builder()
                .orderId(generatedOrderId)
                .instrumentId(orderNode.get("instrumentId").asText())
                .quantity(orderNode.get("quantity").asInt())
                .targetPrice(new java.math.BigDecimal(orderNode.get("targetPrice").asText()))
                .direction(orderNode.get("direction").asText())
                .clientId(orderNode.get("clientId").asText())
                .build();
            orderDao.insertOrder(order);

            // 3. Build Trade object
            Trade trade = Trade.builder()
                .tradeId(root.get("tradeId").asText())
                .instrumentId(root.get("instrumentId").asText())
                .quantity(root.get("quantity").asDouble())
                .executionPrice(root.get("executionPrice").asDouble())
                .direction(root.get("direction").asText().equals("B") ? Direction.BUY : Direction.SELL)
                .clientId(root.get("clientId").asText())
                .order(order)
                .cashValue(root.get("cashValue").asDouble())
                .executionDate(java.time.LocalDateTime.now())
                .tradeTime(java.time.LocalDateTime.now())
                .build();
            tradeDao.insertTrade(trade);

            // 4. Build Price object
            Price price = Price.builder()
                .instrumentId(root.get("instrumentId").asText())
                .bidPrice(root.get("executionPrice").asDouble())
                .askPrice(root.get("executionPrice").asDouble())
                .priceTimestamp(java.time.LocalDateTime.now().toString())
                .instrument(null)
                .build();
            // Check if price exists, then update or insert
            if (priceDao.findByInstrument(price.getInstrumentId()) != null) {
                priceDao.updatePrice(price);
            } else {
                priceDao.insertPrice(price);
            }

            // 5. Update client cash balance
            double cashBalance = clientDao.getCashBalance(order.getClientId());
            if (order.getDirection().equals("B")) {
                // Subtract cost for BUY
                cashBalance -= order.getQuantity() * order.getTargetPrice().doubleValue() * 1.01;
            } else if (order.getDirection().equals("S")) {
                // Add proceeds for SELL
                cashBalance += order.getQuantity() * order.getTargetPrice().doubleValue();
            }
            clientDao.updateCashBalance(order.getClientId(), cashBalance);

            // 6. Update portfolio position
            double newQuantity;
            PortfolioResponseDto portfolio = portfolioPositionDao.fetchPortfolioResponse(order.getClientId());
            double owned = 0;
            if (portfolio != null && portfolio.getPositions() != null) {
                for (PortfolioPositionResponseDto pos : portfolio.getPositions()) {
                    if (pos.getInstrumentId().equals(order.getInstrumentId())) {
                        owned = pos.getQuantity();
                        break;
                    }
                }
            }
            if (order.getDirection().equals("B")) {
                newQuantity = owned + request.getQuantity();
            } else {
                newQuantity = owned - request.getQuantity();
            }
            if (newQuantity == 0) {
                portfolioPositionDao.deletePosition(order.getClientId(), order.getInstrumentId());
            } else {
                portfolioPositionDao.upsertPosition(order.getClientId(), order.getInstrumentId(), newQuantity, trade.getExecutionPrice());
            }

            // 7. Return FMTS response as JSON string
            return rawResponse.getBody();
        } catch (Exception ex) {
            logger.error("Exception while calling FMTS or inserting data: {}", ex.getMessage(), ex);
            return "FMTS error or exception";
        }
    }
}
