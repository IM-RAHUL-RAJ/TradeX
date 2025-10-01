package com.example.tradex_service.DAO;

import com.example.tradex_service.DAO.DaoImpl.ReportDaoImpl;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import com.example.tradex_service.Mapper.ReportMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ReportDaoImplTest {

    @Mock
    private ReportMapper reportMapper;

    @InjectMocks
    private ReportDaoImpl reportDao; // class under test

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFetchPortfolioReport_withCashBalance() {
        String clientId = "client-123";

        // Mock portfolio positions
        PortfolioPositionResponseDto pos1 = new PortfolioPositionResponseDto();
        pos1.setInstrumentId("AAPL");
        pos1.setQuantity(10.0);
        pos1.setCost(100.0); // value = 1000

        PortfolioPositionResponseDto pos2 = new PortfolioPositionResponseDto();
        pos2.setInstrumentId("TSLA");
        pos2.setQuantity(5.0);
        pos2.setCost(200.0); // value = 1000

        List<PortfolioPositionResponseDto> mockPositions = Arrays.asList(pos1, pos2);

        when(reportMapper.getPortfolioPositionsForReport(clientId)).thenReturn(mockPositions);
        when(reportMapper.getCashBalanceByClientId(clientId)).thenReturn(500.0);

        // Call method
        PortfolioReportDto report = reportDao.fetchPortfolioReport(clientId);

        // Verify
        assertEquals("client-123", report.getClientId());
        assertEquals(2, report.getPositions().size());
        assertEquals(2500.0, report.getTotalValue()); // 1000+1000+500
        assertEquals(500.0, report.getCashBalance());
        assertNotNull(report.getReportGeneratedAt());
    }

    @Test
    void testFetchPortfolioReport_withoutCashBalance() {
        String clientId = "client-456";

        PortfolioPositionResponseDto pos1 = new PortfolioPositionResponseDto();
        pos1.setInstrumentId("GOOG");
        pos1.setQuantity(2.0);
        pos1.setCost(1500.0); // value = 3000

        when(reportMapper.getPortfolioPositionsForReport(clientId))
                .thenReturn(Collections.singletonList(pos1));
        when(reportMapper.getCashBalanceByClientId(clientId)).thenReturn(null);

        PortfolioReportDto report = reportDao.fetchPortfolioReport(clientId);

        assertEquals("client-456", report.getClientId());
        assertEquals(3000.0, report.getTotalValue());
        assertEquals(0.0, report.getCashBalance());
        assertNotNull(report.getReportGeneratedAt());
    }

    @Test
    void testFetchTradeHistoryReport_withValues() {
        String clientId = "client-789";

        TradeResponseDto trade1 = new TradeResponseDto();
        trade1.setInstrumentId("AAPL");
        trade1.setQuantity(10.0);
        trade1.setExecutionPrice(150.0);

        TradeResponseDto trade2 = new TradeResponseDto();
        trade2.setInstrumentId("MSFT");
        trade2.setQuantity(20.0);
        trade2.setExecutionPrice(200.0);

        List<TradeResponseDto> mockTrades = Arrays.asList(trade1, trade2);

        when(reportMapper.getTradeHistoryForReport(clientId)).thenReturn(mockTrades);
        when(reportMapper.getTotalTradeCount(clientId)).thenReturn(2);
        when(reportMapper.getTotalTradeVolume(clientId)).thenReturn(7000.0);

        TradeHistoryReportDto report = reportDao.fetchTradeHistoryReport(clientId);

        assertEquals("client-789", report.getClientId());
        assertEquals(2, report.getTrades().size());
        assertEquals(2, report.getTotalTrades());
        assertEquals(7000.0, report.getTotalVolume());
        assertNotNull(report.getReportGeneratedAt());
    }

    @Test
    void testFetchTradeHistoryReport_withNulls() {
        String clientId = "client-000";

        when(reportMapper.getTradeHistoryForReport(clientId)).thenReturn(Collections.emptyList());
        when(reportMapper.getTotalTradeCount(clientId)).thenReturn(null);
        when(reportMapper.getTotalTradeVolume(clientId)).thenReturn(null);

        TradeHistoryReportDto report = reportDao.fetchTradeHistoryReport(clientId);

        assertEquals("client-000", report.getClientId());
        assertEquals(0, report.getTrades().size());
        assertEquals(0, report.getTotalTrades());
        assertEquals(0.0, report.getTotalVolume());
        assertNotNull(report.getReportGeneratedAt());
    }
}
