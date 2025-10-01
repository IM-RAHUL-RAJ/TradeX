package com.example.tradex_service.ServiceImpl;


import com.example.tradex_service.DAO.PortfolioPositionDao;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.Service.PortfolioService;
import com.example.tradex_service.Service.ServiceImpl.PortfolioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PortfolioServiceImplTest {

    @InjectMocks
    private PortfolioServiceImpl portfolioService;

    @Mock
    private PortfolioPositionDao portfolioPositionDao;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetPortfolioByClientIdReturnsResponse() {
        String clientId = "C001";
        PortfolioResponseDto dto = new PortfolioResponseDto();
        when(portfolioPositionDao.fetchPortfolioResponse(clientId)).thenReturn(dto);

        PortfolioResponseDto result = portfolioService.getPortfolioByClientId(clientId);

        assertNotNull(result);
        verify(portfolioPositionDao, times(1)).fetchPortfolioResponse(clientId);
    }

    @Test
    public void testGetPortfolioByClientIdHandlesNull() {
        String clientId = "unknown";
        when(portfolioPositionDao.fetchPortfolioResponse(clientId)).thenReturn(null);

        PortfolioResponseDto result = portfolioService.getPortfolioByClientId(clientId);

        assertNull(result);
    }
}
