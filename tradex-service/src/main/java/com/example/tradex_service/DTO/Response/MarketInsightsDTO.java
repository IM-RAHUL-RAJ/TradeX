package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class MarketInsightsDTO {
    private String marketTrend;
    private String sectorRecommendations;
    private String economicOutlook;
    private List<String> keyInsights;
}
 