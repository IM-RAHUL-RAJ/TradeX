package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DAO.ReportDao;
import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportDao reportDao;

    @Override
    public PortfolioReportDto getPortfolioReport(String clientId) {
        return reportDao.fetchPortfolioReport(clientId);
    }

    @Override
    public TradeHistoryReportDto getTradeHistoryReport(String clientId) {
        return reportDao.fetchTradeHistoryReport(clientId);
    }
}
