package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.Service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/{clientId}")
    public ResponseEntity<PortfolioResponseDto> getPortfolio(@PathVariable String clientId) {
        PortfolioResponseDto portfolio = portfolioService.getPortfolioByClientId(clientId);
        return ResponseEntity.ok(portfolio);
    }
}


