package com.example.tradex_service.DAO;

import com.example.tradex_service.Models.Instrument;
import java.util.List;

public interface InstrumentDao {
    int insertInstrument(Instrument instrument);
    Instrument findById(String instrumentId);
    List<Instrument> findAll();
}
