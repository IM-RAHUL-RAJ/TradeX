package com.example.tradex_service.DTO.Request;

import com.example.tradex_service.Models.Direction;
import lombok.Data;

@Data
public class TradeBuySellRequest {
    private String orderId;
    private String instrumentId;
    private String clientId;
    private double quantity;
    private double targetPrice;
    private Direction direction;
    private String token;
}
