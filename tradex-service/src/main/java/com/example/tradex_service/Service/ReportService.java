package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;

public interface ReportService {
    PortfolioReportDto getPortfolioReport(String clientId);
    TradeHistoryReportDto getTradeHistoryReport(String clientId);
}