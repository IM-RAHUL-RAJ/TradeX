package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.ReportDao;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.DTO.Response.TradeResponseDto;
import com.example.tradex_service.Mapper.ReportMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class ReportDaoImpl implements ReportDao {

    @Autowired
    private ReportMapper reportMapper;

    @Override
    public PortfolioReportDto fetchPortfolioReport(String clientId) {
        List<PortfolioPositionResponseDto> positions = reportMapper.getPortfolioPositionsForReport(clientId);
        Double cashBalance = reportMapper.getCashBalanceByClientId(clientId);

        // Calculate total portfolio value
        Double totalValue = positions.stream()
                .mapToDouble(pos -> pos.getCost() * pos.getQuantity())
                .sum();

        if (cashBalance != null) {
            totalValue += cashBalance;
        }

        PortfolioReportDto report = new PortfolioReportDto();
        report.setClientId(clientId);
        report.setPositions(positions);
        report.setCashBalance(cashBalance != null ? cashBalance : 0.0);
        report.setTotalValue(totalValue);
        report.setReportGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return report;
    }

    @Override
    public TradeHistoryReportDto fetchTradeHistoryReport(String clientId) {
        List<TradeResponseDto> trades = reportMapper.getTradeHistoryForReport(clientId);
        Integer totalTrades = reportMapper.getTotalTradeCount(clientId);
        Double totalVolume = reportMapper.getTotalTradeVolume(clientId);

        TradeHistoryReportDto report = new TradeHistoryReportDto();
        report.setClientId(clientId);
        report.setTrades(trades);
        report.setTotalTrades(totalTrades != null ? totalTrades : 0);
        report.setTotalVolume(totalVolume != null ? totalVolume : 0.0);
        report.setReportGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return report;
    }
}