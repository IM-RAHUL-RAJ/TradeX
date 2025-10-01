package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.TradeDao;
import com.example.tradex_service.Mapper.TradeMapper;
import com.example.tradex_service.Models.Trade;
import org.springframework.stereotype.Repository;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import com.example.tradex_service.Mapper.TradeHistoryMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Repository
public class TradeDaoImpl implements TradeDao {

    private final TradeMapper tradeMapper;
    
    @Autowired
    private TradeHistoryMapper tradeHistoryMapper;

    public TradeDaoImpl(TradeMapper tradeMapper) {
        this.tradeMapper = tradeMapper;
    }

    @Override
    public int insertTrade(Trade trade) {
        return tradeMapper.insert(trade);
    }

    @Override
    public Trade findById(Long tradeId) {
        return tradeMapper.findById(tradeId);
    }

    @Override
    public List<Trade> findByClient(Long clientId) {
        return tradeMapper.findByClient(clientId);
    }

    @Override
    public int updateStatus(Long tradeId, String status) {
        return tradeMapper.updateStatus(tradeId, status);
    }
    
    @Override
    public TradeHistoryResponseDto fetchTradeHistoryResponse(String clientId) {
        List<TradeResponseDto> trades = tradeHistoryMapper.findTradesByClientId(clientId);

        TradeHistoryResponseDto response = new TradeHistoryResponseDto();
        response.setTrades(trades);
        return response;
    }
}
