package com.example.tradex_service.DTO.Request;


import lombok.Data;
import java.math.BigDecimal;

@Data
public class WalletRequestDto {
    private String clientId;
    private BigDecimal amount;
}

