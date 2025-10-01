package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class PortfolioReportDto {
    private String clientId;
    private Double totalValue;
    private Double cashBalance;
    private List<PortfolioPositionResponseDto> positions;
    private String reportGeneratedAt;
}
