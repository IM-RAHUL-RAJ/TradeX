package com.example.tradex_service.DTO.Response;

import lombok.Data;

@Data
public class StockRecommendationDTO {
    private String symbol;
    private String companyName;
    private String recommendation; // BUY, HOLD, SELL
    private Double targetPrice;
    private String reasoning;
    private String riskLevel;
    private Double allocationPercentage;
}