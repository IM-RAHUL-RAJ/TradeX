package com.example.tradex_service.Service;

import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.DTO.Response.RoboAdvisorResponseDTO;

public interface GeminiService {
    RoboAdvisorResponseDTO getStockRecommendations(Preferences preferences, String clientId);
    RoboAdvisorResponseDTO getPortfolioAnalysis(Preferences preferences, String clientId);
    RoboAdvisorResponseDTO getMarketInsights(Preferences preferences, String clientId);
}