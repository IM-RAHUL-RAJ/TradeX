package com.example.tradex_service.DAO;

import com.example.tradex_service.DTO.Response.PortfolioResponseDto;

public interface PortfolioPositionDao {
    PortfolioResponseDto fetchPortfolioResponse(String clientId);
    void upsertPosition(String clientId, String instrumentId, double quantity, double executionPrice);
    void deletePosition(String clientId, String instrumentId);
}
