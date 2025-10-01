package com.example.tradex_service.Models;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class Order {
    private String orderId;
    private String instrumentId; // <-- add flat instrumentId field
    private String clientId;
    private int quantity;
    private BigDecimal targetPrice;
    private String direction;       // Could also be enum if you prefer
}
