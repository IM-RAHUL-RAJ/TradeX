package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Request.TradeBuySellRequest;
import com.example.tradex_service.DTO.Response.TradeBuySellResponse;

public interface TradeBuySellService {
    String executeTrade(TradeBuySellRequest request, String token);
}
