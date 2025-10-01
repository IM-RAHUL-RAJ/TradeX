package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DTO.Response.PriceResponse;
import com.example.tradex_service.Service.PriceFetchService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceFetchServiceImpl implements PriceFetchService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String BASE_URL = "http://fmts-nodejs:3000/fmts/trades/prices";

    @Override
    public List<PriceResponse> fetchAllPrices() {
        // Get raw JSON string because server sends Content-Type: application/octet-stream
        String response = restTemplate.getForObject(BASE_URL, String.class);

        try {
            return objectMapper.readValue(response, new TypeReference<List<PriceResponse>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse prices from response", e);
        }
    }

    @Override
    public List<PriceResponse> fetchPricesByCategory(String category) {
        String response = restTemplate.getForObject(BASE_URL + "/" + category, String.class);

        try {
            return objectMapper.readValue(response, new TypeReference<List<PriceResponse>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse prices by category from response", e);
        }
    }
}
