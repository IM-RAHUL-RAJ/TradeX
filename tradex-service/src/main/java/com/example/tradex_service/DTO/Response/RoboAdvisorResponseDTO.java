package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class RoboAdvisorResponseDTO {
    private String clientId;
    private List<StockRecommendationDTO> stockRecommendations;
    private PortfolioAnalysisDTO portfolioAnalysis;
    private MarketInsightsDTO marketInsights;
    private String overallStrategy;
    private String generatedAt;
    private boolean success;
    private String message;
}
 