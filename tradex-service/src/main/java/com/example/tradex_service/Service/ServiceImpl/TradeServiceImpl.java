package com.example.tradex_service.Service.ServiceImpl;


import com.example.tradex_service.DAO.TradeDao;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import com.example.tradex_service.Models.Trade;
import com.example.tradex_service.Service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeServiceImpl implements TradeService {

    @Autowired
    private TradeDao tradeDao;

    @Override
    public TradeHistoryResponseDto getTradeHistoryByClientId(String clientId) {
        return tradeDao.fetchTradeHistoryResponse(clientId);
    }
}