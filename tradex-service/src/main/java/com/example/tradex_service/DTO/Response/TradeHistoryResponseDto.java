package com.example.tradex_service.DTO.Response;

import lombok.Data;

import java.util.List;

@Data
public class TradeHistoryResponseDto {
    private List<TradeResponseDto> trades;
}

