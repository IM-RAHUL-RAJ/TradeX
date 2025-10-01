package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class PortfolioAnalysisDTO {
    private String overallRisk;
    private Double riskScore; // 1-10 scale
    private String diversificationLevel;
    private List<String> riskFactors;
    private String recommendations;
}