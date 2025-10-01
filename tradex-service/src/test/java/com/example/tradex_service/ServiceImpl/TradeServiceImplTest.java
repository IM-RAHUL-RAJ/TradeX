package com.example.tradex_service.ServiceImpl;

import com.example.tradex_service.DAO.TradeDao;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.Service.ServiceImpl.TradeServiceImpl;
import com.example.tradex_service.Service.TradeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TradeServiceImplTest {

    @InjectMocks
    private TradeServiceImpl tradeService;

    @Mock
    private TradeDao tradeDao;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetTradeHistoryByClientIdReturnsResponse() {
        String clientId = "C001";
        TradeHistoryResponseDto dto = new TradeHistoryResponseDto();
        when(tradeDao.fetchTradeHistoryResponse(clientId)).thenReturn(dto);

        TradeHistoryResponseDto result = tradeService.getTradeHistoryByClientId(clientId);

        assertNotNull(result);
        verify(tradeDao, times(1)).fetchTradeHistoryResponse(clientId);
    }

    @Test
    public void testGetTradeHistoryByClientIdHandlesNull() {
        String clientId = "unknown";
        when(tradeDao.fetchTradeHistoryResponse(clientId)).thenReturn(null);

        TradeHistoryResponseDto result = tradeService.getTradeHistoryByClientId(clientId);

        assertNull(result);
    }
}

