package com.example.tradex_service.Controller;

import com.example.tradex_service.DAO.DaoImpl.TradeDaoImpl;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import com.example.tradex_service.Mapper.TradeHistoryMapper;
import com.example.tradex_service.Mapper.TradeMapper;
import com.example.tradex_service.Models.Trade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TradeDaoImplTest {

    @Mock
    private TradeMapper tradeMapper;

    @Mock
    private TradeHistoryMapper tradeHistoryMapper;

    @InjectMocks
    private TradeDaoImpl tradeDaoImpl;

    @Mock
    private Trade mockTrade;

    @Mock
    private TradeResponseDto mockTradeResponseDto;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(tradeDaoImpl, "tradeHistoryMapper", tradeHistoryMapper);

    }

    @Test
    void insertTrade_shouldReturnInsertedCount() {
        when(tradeMapper.insert(mockTrade)).thenReturn(1);

        int result = tradeDaoImpl.insertTrade(mockTrade);

        assertEquals(1, result);
        verify(tradeMapper, times(1)).insert(mockTrade);
    }

    @Test
    void findById_shouldReturnTrade() {
        when(tradeMapper.findById(100L)).thenReturn(mockTrade);

        Trade result = tradeDaoImpl.findById(100L);

        assertNotNull(result);
        verify(tradeMapper, times(1)).findById(100L);
    }

    @Test
    void findByClient_shouldReturnTradesList() {
        List<Trade> tradesList = Arrays.asList(mockTrade, mockTrade);
        when(tradeMapper.findByClient(10L)).thenReturn(tradesList);

        List<Trade> result = tradeDaoImpl.findByClient(10L);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(tradeMapper, times(1)).findByClient(10L);
    }

    @Test
    void updateStatus_shouldReturnUpdateCount() {
        when(tradeMapper.updateStatus(100L, "COMPLETED")).thenReturn(1);

        int result = tradeDaoImpl.updateStatus(100L, "COMPLETED");

        assertEquals(1, result);
        verify(tradeMapper, times(1)).updateStatus(100L, "COMPLETED");
    }

    @Test
    void fetchTradeHistoryResponse_shouldReturnFilledResponseDto() {
        List<TradeResponseDto> tradeResponses = Arrays.asList(mockTradeResponseDto, mockTradeResponseDto);
        when(tradeHistoryMapper.findTradesByClientId("client123")).thenReturn(tradeResponses);

        TradeHistoryResponseDto response = tradeDaoImpl.fetchTradeHistoryResponse("client123");

        assertNotNull(response);
        assertEquals(2, response.getTrades().size());
        verify(tradeHistoryMapper, times(1)).findTradesByClientId("client123");
    }
}
