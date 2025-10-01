package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Response.PortfolioReportDto;
import com.example.tradex_service.DTO.Response.TradeHistoryReportDto;
import com.example.tradex_service.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/portfolio/{clientId}")
    public ResponseEntity<PortfolioReportDto> getPortfolioReport(@PathVariable String clientId) {
        PortfolioReportDto report = reportService.getPortfolioReport(clientId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/trade-history/{clientId}")
    public ResponseEntity<TradeHistoryReportDto> getTradeHistoryReport(@PathVariable String clientId) {
        TradeHistoryReportDto report = reportService.getTradeHistoryReport(clientId);
        return ResponseEntity.ok(report);
    }
}