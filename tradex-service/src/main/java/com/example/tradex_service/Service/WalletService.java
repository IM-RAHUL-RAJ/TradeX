package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Request.WalletRequestDto;
import com.example.tradex_service.DTO.Response.WalletResponseDto;

public interface WalletService {

    WalletResponseDto getWalletByClientId(String clientId);

    WalletResponseDto deposit(WalletRequestDto request);

    WalletResponseDto withdraw(WalletRequestDto request);
}
