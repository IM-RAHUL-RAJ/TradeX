package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.InstrumentDao;
import com.example.tradex_service.Mapper.InstrumentMapper;
import com.example.tradex_service.Models.Instrument;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InstrumentDaoImpl implements InstrumentDao {

    private final InstrumentMapper instrumentMapper;

    public InstrumentDaoImpl(InstrumentMapper instrumentMapper) {
        this.instrumentMapper = instrumentMapper;
    }

    @Override
    public int insertInstrument(Instrument instrument) {
        return instrumentMapper.insert(instrument);
    }

    @Override
    public Instrument findById(String instrumentId) {
        return instrumentMapper.findById(instrumentId);
    }

    @Override
    public List<Instrument> findAll() {
        return instrumentMapper.findAll();
    }
}
