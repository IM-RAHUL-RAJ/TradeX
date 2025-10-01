//package com.example.tradex_service.ServiceImpl;
//
//import com.example.tradex_service.DAO.*;
//import com.example.tradex_service.DTO.Request.TradeBuySellRequest;
//import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
//import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
//import com.example.tradex_service.Models.Direction;
//import com.example.tradex_service.Models.Order;
//import com.example.tradex_service.Models.Price;
//import com.example.tradex_service.Models.Trade;
//import com.example.tradex_service.Service.ServiceImpl.TradeBuySellServiceImpl;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import org.springframework.http.*;
//import org.springframework.web.client.RestTemplate;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class TradeBuySellServiceImplTest {
//
//    @Mock private ClientDAO clientDao;
//    @Mock private TradeDao tradeDao;
//    @Mock private PortfolioPositionDao portfolioPositionDao;
//    @Mock private OrderDao orderDao;
//    @Mock private PriceDao priceDao;
//    @InjectMocks private TradeBuySellServiceImpl tradeService;
//
//    @BeforeEach
//    void setup() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    private TradeBuySellRequest baseRequest(Direction direction) {
//        TradeBuySellRequest req = new TradeBuySellRequest();
//        req.setClientId("C1");
//        req.setInstrumentId("IBM");
//        req.setQuantity(10);
//        req.setTargetPrice(100.0);
//        req.setDirection(direction);
//        req.setOrderId("O123");
//        return req;
//    }
//
//    @Test
//    void testRejectsNegativeQuantity() {
//        TradeBuySellRequest req = baseRequest(Direction.BUY);
//        req.setQuantity(-5);
//        String result = tradeService.executeTrade(req, "tkn");
//        assertEquals("Quantity cannot be negative", result);
//    }
//
//    @Test
//    void testRejectsZeroQuantity() {
//        TradeBuySellRequest req = baseRequest(Direction.BUY);
//        req.setQuantity(0);
//        String result = tradeService.executeTrade(req, "tkn");
//        assertEquals("Quantity cannot be zero", result);
//    }
//
//    @Test
//    void testRejectsInsufficientHoldingsOnSell() {
//        TradeBuySellRequest req = baseRequest(Direction.SELL);
//        PortfolioResponseDto portfolio = new PortfolioResponseDto();
//        portfolio.setPositions(List.of(
//                new PortfolioPositionResponseDto("TSLA", 5, BigDecimal.valueOf(200)) // different instrument
//        ));
//        when(portfolioPositionDao.fetchPortfolioResponse("C1")).thenReturn(portfolio);
//
//        String result = tradeService.executeTrade(req, "tkn");
//        assertEquals("Insufficient holdings", result);
//    }
//
//    @Test
//    void testRejectsInsufficientCashOnBuy() {
//        TradeBuySellRequest req = baseRequest(Direction.BUY);
//        when(clientDao.getCashBalance("C1")).thenReturn(100.0); // not enough
//        String result = tradeService.executeTrade(req, "tkn");
//        assertEquals("Insufficient cash balance", result);
//    }
//
//    @Test
//    void testSuccessfulBuyFlow() throws Exception {
//        TradeBuySellRequest req = baseRequest(Direction.BUY);
//        when(clientDao.getCashBalance("C1")).thenReturn(5000.0);
//        when(orderDao.findById(anyString())).thenReturn(null); // ensure orderId unique
//
//        // Mock FMTS response
//        String fmtsJson = """
//                {
//                   "tradeId":"T123",
//                   "instrumentId":"IBM",
//                   "quantity":10,
//                   "executionPrice":100.0,
//                   "direction":"B",
//                   "clientId":"C1",
//                   "cashValue":1000.0,
//                   "order":{
//                      "instrumentId":"IBM",
//                      "quantity":10,
//                      "targetPrice":"100",
//                      "direction":"B",
//                      "clientId":"C1"
//                   }
//                }
//                """;
//
//        ResponseEntity<String> fmtsResp = new ResponseEntity<>(fmtsJson, HttpStatus.OK);
//
//        // Spy RestTemplate so we can intercept postForEntity
//        try (MockedConstruction<RestTemplate> mocked = mockConstruction(RestTemplate.class,
//                (mock, ctx) -> when(mock.postForEntity(anyString(), any(), eq(String.class))).thenReturn(fmtsResp))) {
//
//            PortfolioResponseDto portfolio = new PortfolioResponseDto();
//            portfolio.setPositions(List.of());
//            when(portfolioPositionDao.fetchPortfolioResponse("C1")).thenReturn(portfolio);
//
//            String result = tradeService.executeTrade(req, "tkn");
//
//            assertTrue(result.contains("T123"));
//            verify(orderDao).insertOrder(any(Order.class));
//            verify(tradeDao).insertTrade(any(Trade.class));
//            verify(priceDao).insertPrice(any(Price.class));
//            verify(clientDao).updateCashBalance(eq("C1"), anyDouble());
//            verify(portfolioPositionDao).upsertPosition(eq("C1"), eq("IBM"), eq(10.0), anyDouble());
//        }
//    }
//
//    @Test
//    void testFMTSExceptionHandled() {
//        TradeBuySellRequest req = baseRequest(Direction.BUY);
//        when(clientDao.getCashBalance("C1")).thenReturn(5000.0);
//        try (MockedConstruction<RestTemplate> mocked = mockConstruction(RestTemplate.class,
//                (mock, ctx) -> when(mock.postForEntity(anyString(), any(), eq(String.class))).thenThrow(new RuntimeException("FMTS down")))) {
//            String result = tradeService.executeTrade(req, "tkn");
//            assertEquals("FMTS error or exception", result);
//        }
//    }
//}
