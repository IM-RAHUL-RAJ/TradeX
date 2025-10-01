package com.example.tradex_service.DAO;


import com.example.tradex_service.DAO.DaoImpl.InstrumentDaoImpl;
import com.example.tradex_service.Mapper.InstrumentMapper;
import com.example.tradex_service.Models.Instrument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InstrumentDaoImplTest {

    @Mock
    private InstrumentMapper instrumentMapper;

    @InjectMocks
    private InstrumentDaoImpl instrumentDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void insertInstrumentDelegatesToMapper() {
        Instrument instrument = new Instrument();
        when(instrumentMapper.insert(instrument)).thenReturn(1);

        int result = instrumentDao.insertInstrument(instrument);

        assertEquals(1, result);
        verify(instrumentMapper).insert(instrument);
    }

    @Test
    void findByIdDelegatesToMapper() {
        String instrumentId = "INSTR123";
        Instrument instrument = new Instrument();
        when(instrumentMapper.findById(instrumentId)).thenReturn(instrument);

        Instrument result = instrumentDao.findById(instrumentId);

        assertSame(instrument, result);
        verify(instrumentMapper).findById(instrumentId);
    }

    @Test
    void findAllDelegatesToMapper() {
        List<Instrument> instruments = new ArrayList<>();
        when(instrumentMapper.findAll()).thenReturn(instruments);

        List<Instrument> result = instrumentDao.findAll();

        assertSame(instruments, result);
        verify(instrumentMapper).findAll();
    }
}

