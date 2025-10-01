package com.example.tradex_service.DTO.Response;

import com.example.tradex_service.Models.Direction;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TradeResponseDto {
    private String tradeId;
    private String instrumentId;
    private Double quantity;
    private Double executionPrice;
    private Direction direction;
    private String clientId;
    private LocalDateTime executionDate;
    private Double cashValue;
}

