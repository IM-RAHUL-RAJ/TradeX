package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.PriceDao;
import com.example.tradex_service.Mapper.PriceMapper;
import com.example.tradex_service.Models.Price;
import org.springframework.stereotype.Repository;

@Repository
public class PriceDaoImpl implements PriceDao {

    private final PriceMapper priceMapper;

    public PriceDaoImpl(PriceMapper priceMapper) {
        this.priceMapper = priceMapper;
    }

    @Override
    public int insertPrice(Price price) {
        return priceMapper.insert(price);
    }

    @Override
    public Price findByInstrument(String instrumentId) {
        return priceMapper.findByInstrument(instrumentId);
    }

    @Override
    public int updatePrice(Price price) {
        return priceMapper.update(price);
    }
}
