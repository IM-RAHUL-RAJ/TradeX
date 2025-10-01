package com.example.tradex_service.DTO.Request;

import lombok.Data;

@Data
public class TradeHistoryRequestDto {
    private String clientId;
    private Integer maxRecords = 100; // Optional, limit to last 100 trades
}

