package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Response.PortfolioResponseDto;

public interface PortfolioService {
    PortfolioResponseDto getPortfolioByClientId(String clientId);
}
