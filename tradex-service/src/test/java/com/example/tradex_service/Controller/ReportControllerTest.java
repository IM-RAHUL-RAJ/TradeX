package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.Service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReportController.class) // Only load the ReportController
public class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportService reportService; // Mock the service layer

    @Test
    void testGetPortfolioReport() throws Exception {
        PortfolioReportDto mockReport = new PortfolioReportDto();
        mockReport.setClientId("481076889");
        mockReport.setPositions(List.of()); // Empty positions for simplicity
        mockReport.setTotalValue(10000.0);

        // Mock service method
        when(reportService.getPortfolioReport("481076889")).thenReturn(mockReport);

        mockMvc.perform(get("/api/reports/portfolio/481076889")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientId").value("481076889"))
                .andExpect(jsonPath("$.totalValue").value(10000.0));
    }

    @Test
    void testGetTradeHistoryReport() throws Exception {
        TradeHistoryReportDto mockTradeHistory = new TradeHistoryReportDto();
        mockTradeHistory.setClientId("481076889");
        mockTradeHistory.setTrades(List.of()); // Empty trades for simplicity
        mockTradeHistory.setTotalTrades(50000);

        // Mock service method
        when(reportService.getTradeHistoryReport("481076889")).thenReturn(mockTradeHistory);

        mockMvc.perform(get("/api/reports/trade-history/client-456")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientId").value("client-456"))
                .andExpect(jsonPath("$.totalTradeVolume").value(50000.0));
    }
}
