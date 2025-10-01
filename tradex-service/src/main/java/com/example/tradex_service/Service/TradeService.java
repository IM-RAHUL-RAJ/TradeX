package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;

public interface TradeService {
    TradeHistoryResponseDto getTradeHistoryByClientId(String clientId);
}

