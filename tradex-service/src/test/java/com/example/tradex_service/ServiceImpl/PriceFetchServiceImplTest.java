package com.example.tradex_service.ServiceImpl;

import com.example.tradex_service.DTO.Response.PriceResponse;
import com.example.tradex_service.Service.ServiceImpl.PriceFetchServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class PriceFetchServiceImplTest {

    private PriceFetchServiceImpl priceFetchService;

    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);
        priceFetchService = new PriceFetchServiceImpl(restTemplate);
    }

    @Test
    void fetchAllPrices_shouldReturnParsedPriceResponseList() throws Exception {
        PriceResponse samplePrice = new PriceResponse();
        samplePrice.setInstrument(new com.example.tradex_service.Models.Instrument());
        samplePrice.getInstrument().setInstrumentId("inst-456");
        samplePrice.setAskPrice(BigDecimal.valueOf(123.45));
        samplePrice.setBidPrice(BigDecimal.valueOf(120.95));

        String responseBody = objectMapper.writeValueAsString(List.of(samplePrice));

        mockServer.expect(once(), requestTo("http://localhost:3000/fmts/trades/prices"))
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        List<PriceResponse> prices = priceFetchService.fetchAllPrices();

        mockServer.verify();

        assertNotNull(prices);
        assertEquals(1, prices.size());
        assertEquals("inst-456", prices.get(0).getInstrument().getInstrumentId());
        assertEquals(BigDecimal.valueOf(123.45), prices.get(0).getAskPrice());
        assertEquals(BigDecimal.valueOf(120.95), prices.get(0).getBidPrice());
    }

    @Test
    void fetchPricesByCategory_shouldReturnParsedPriceResponseList() throws Exception {
        String category = "equities";
        PriceResponse samplePrice = new PriceResponse();
        samplePrice.setInstrument(new com.example.tradex_service.Models.Instrument());
        samplePrice.getInstrument().setInstrumentId("inst-789");
        samplePrice.setAskPrice(BigDecimal.valueOf(133.45));
        samplePrice.setBidPrice(BigDecimal.valueOf(130.95));

        String responseBody = objectMapper.writeValueAsString(List.of(samplePrice));

        mockServer.expect(once(), requestTo("http://localhost:3000/fmts/trades/prices/" + category))
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        List<PriceResponse> prices = priceFetchService.fetchPricesByCategory(category);

        mockServer.verify();

        assertNotNull(prices);
        assertEquals(1, prices.size());
        assertEquals("inst-789", prices.get(0).getInstrument().getInstrumentId());
    }

    @Test
    void fetchAllPrices_shouldThrowRuntimeExceptionOnInvalidJson() {
        mockServer.expect(once(), requestTo("http://localhost:3000/fmts/trades/prices"))
                .andRespond(withSuccess("invalid json", MediaType.APPLICATION_JSON));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> priceFetchService.fetchAllPrices());
        assertTrue(exception.getMessage().contains("Failed to parse prices"));
        mockServer.verify();
    }

    @Test
    void fetchPricesByCategory_shouldThrowRuntimeExceptionOnInvalidJson() {
        String category = "equities";
        mockServer.expect(once(), requestTo("http://localhost:3000/fmts/trades/prices/" + category))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> priceFetchService.fetchPricesByCategory(category));
        assertTrue(exception.getMessage().contains("Failed to parse prices"));
        mockServer.verify();
    }

    @Test
    void fetchPricesByCategory_shouldHandleEmptyResponse() throws Exception {
        String category = "bonds";
        mockServer.expect(once(), requestTo("http://localhost:3000/fmts/trades/prices/" + category))
                .andRespond(withSuccess("[]", MediaType.APPLICATION_JSON));

        List<PriceResponse> prices = priceFetchService.fetchPricesByCategory(category);

        mockServer.verify();

        assertNotNull(prices);
        assertTrue(prices.isEmpty());
    }
}
