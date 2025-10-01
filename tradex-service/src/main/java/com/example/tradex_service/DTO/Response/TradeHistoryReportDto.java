package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class TradeHistoryReportDto {
    private String clientId;
    private Integer totalTrades;
    private Double totalVolume;
    private List<TradeResponseDto> trades;
    private String reportGeneratedAt;
}
