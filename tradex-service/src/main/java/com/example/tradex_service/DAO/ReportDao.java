package com.example.tradex_service.DAO;

import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;

public interface ReportDao {
    PortfolioReportDto fetchPortfolioReport(String clientId);
    TradeHistoryReportDto fetchTradeHistoryReport(String clientId);
}