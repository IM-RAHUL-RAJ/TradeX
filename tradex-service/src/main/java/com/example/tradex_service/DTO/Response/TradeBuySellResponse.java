package com.example.tradex_service.DTO.Response;

import com.example.tradex_service.Models.Order;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for Buy/Sell trade execution.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TradeBuySellResponse {
    private String tradeId;
    private String instrumentId;
    private double quantity;
    private double executionPrice;
    private String direction;
    private String clientId;
    private double cashValue;
    private String timestamp;
    private Order order; // Add order field to match FMTS response
}
