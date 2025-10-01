package com.example.tradex_service.DAO;



import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.Models.Trade;

import java.util.List;

public interface TradeDao {
    TradeHistoryResponseDto fetchTradeHistoryResponse(String clientId);
    int insertTrade(Trade trade);
    Trade findById(Long tradeId);
    List<Trade> findByClient(Long clientId);
    int updateStatus(Long tradeId, String status);
}

