package com.example.tradex_service.Models;


import lombok.Data;

@Data
public class PortfolioPosition {
    private String instrumentId;
    private String description;
    private double quantity;
    private double cost;
    private String clientId;
}
