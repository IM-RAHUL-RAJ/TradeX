package com.example.tradex_service.DAO;


import com.example.tradex_service.DAO.DaoImpl.PriceDaoImpl;
import com.example.tradex_service.Mapper.PriceMapper;
import com.example.tradex_service.Models.Price;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PriceDaoImplTest {

    @Mock
    private PriceMapper priceMapper;

    @InjectMocks
    private PriceDaoImpl priceDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void insertPriceDelegatesToMapper() {
        Price price = new Price();
        when(priceMapper.insert(price)).thenReturn(1);

        int result = priceDao.insertPrice(price);

        assertEquals(1, result);
        verify(priceMapper).insert(price);
    }

    @Test
    void findByInstrumentDelegatesToMapper() {
        String instrumentId = "INSTR1";
        Price price = new Price();
        when(priceMapper.findByInstrument(instrumentId)).thenReturn(price);

        Price result = priceDao.findByInstrument(instrumentId);

        assertSame(price, result);
        verify(priceMapper).findByInstrument(instrumentId);
    }

    @Test
    void updatePriceDelegatesToMapper() {
        Price price = new Price();
        when(priceMapper.update(price)).thenReturn(1);

        int result = priceDao.updatePrice(price);

        assertEquals(1, result);
        verify(priceMapper).update(price);
    }
}
