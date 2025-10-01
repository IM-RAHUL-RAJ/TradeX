package com.example.tradex_service.DTO.Response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WalletResponseDto {
    private String clientId;
    private BigDecimal cashBalance;
}
