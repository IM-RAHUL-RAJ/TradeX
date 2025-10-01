package com.example.tradex_service.DAO;

import com.example.tradex_service.Models.Price;

public interface PriceDao {
    int insertPrice(Price price);
    Price findByInstrument(String instrumentId);
    int updatePrice(Price price);
}
