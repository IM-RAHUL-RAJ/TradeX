package com.example.tradex_service.ServiceImpl;

import com.example.tradex_service.DAO.ReportDao;
import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.Service.ReportService;
import com.example.tradex_service.Service.ServiceImpl.ReportServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class ReportServiceImplTest {

    @Mock
    private ReportDao reportDao;

    @InjectMocks
    private ReportServiceImpl reportService; // The class under test

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    @Test
    void testGetPortfolioReport() {
        String clientId = "client-123";

        PortfolioReportDto mockReport = new PortfolioReportDto();
        mockReport.setClientId(clientId);
        mockReport.setTotalValue(15000.0);

        // Mock DAO call
        when(reportDao.fetchPortfolioReport(clientId)).thenReturn(mockReport);

        // Call service
        PortfolioReportDto result = reportService.getPortfolioReport(clientId);

        // Assert
        assertEquals("client-123", result.getClientId());
        assertEquals(15000.0, result.getTotalValue());
    }

    @Test
    void testGetTradeHistoryReport() {
        String clientId = "client-456";

        TradeHistoryReportDto mockHistory = new TradeHistoryReportDto();
        mockHistory.setClientId(clientId);
        mockHistory.setTotalVolume(50000.0);

        // Mock DAO call
        when(reportDao.fetchTradeHistoryReport(clientId)).thenReturn(mockHistory);

        // Call service
        TradeHistoryReportDto result = reportService.getTradeHistoryReport(clientId);

        // Assert
        assertEquals("client-456", result.getClientId());
        assertEquals(50000.0, result.getTotalVolume());
    }
}
