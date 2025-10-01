package com.example.tradex_service.DTO.Response;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PortfolioResponseDto {
    private List<PortfolioPositionResponseDto> positions;
//    private Double cashBalance;
}

