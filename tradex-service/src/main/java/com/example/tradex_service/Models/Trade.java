package com.example.tradex_service.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a trade (buy/sell) executed by a client.
 */
@Data
@Builder
@AllArgsConstructor
public class Trade {
	private String instrumentId;
    private double quantity;
    private double executionPrice;
    private Direction direction;
    private String clientId;
    private Order order;
    private String tradeId;
    private double cashValue;
    private LocalDateTime executionDate;
    private LocalDateTime tradeTime;
}
