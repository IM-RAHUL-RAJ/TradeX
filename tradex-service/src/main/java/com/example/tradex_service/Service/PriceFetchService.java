package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Response.PriceResponse;

import java.util.List;

public interface PriceFetchService {
    List<PriceResponse> fetchAllPrices();
    List<PriceResponse> fetchPricesByCategory(String category);
}
