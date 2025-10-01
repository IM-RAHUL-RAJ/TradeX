package com.example.tradex_service.Models;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoboAdvisor {
    private String clientId;
    private String recommendationType; // "STOCK_RECOMMENDATIONS", "PORTFOLIO_ANALYSIS", "MARKET_INSIGHTS"
    private String aiResponse; // JSON string containing the Gemini response
    private LocalDateTime generatedAt;
    private boolean isActive;
}