package com.example.tradex_service.DTO.Response;

import lombok.Data;

@Data
public class PortfolioPositionResponseDto {
    private String instrumentId;
    private String description;
    private Double quantity;
    private Double cost;
    private String clientId;
}

