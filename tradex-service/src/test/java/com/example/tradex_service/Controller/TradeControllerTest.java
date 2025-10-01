package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.TradeBuySellRequest;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.Service.TradeBuySellService;
import com.example.tradex_service.Service.TradeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TradeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TradeBuySellService tradeBuySellService;

    @Mock
    private TradeService tradeService;

    @InjectMocks
    private TradeController tradeController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(tradeController).build();
    }

    @Test
    void testGetTradeHistorySuccess() throws Exception {
        String clientId = "C001";
        TradeHistoryResponseDto history = new TradeHistoryResponseDto();

        when(tradeService.getTradeHistoryByClientId(clientId)).thenReturn(history);

        mockMvc.perform(get("/trades/{clientId}", clientId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(history)));
    }

    @Test
    void testExecuteTradeValidationError() throws Exception {
        TradeBuySellRequest request = new TradeBuySellRequest();
        request.setClientId("C001");
        request.setInstrumentId("TSLA");
        request.setQuantity(-5);
        request.setTargetPrice(300.0);

        when(tradeBuySellService.executeTrade(Mockito.any(), Mockito.anyString()))
                .thenReturn("Quantity cannot be negative");

        mockMvc.perform(post("/trades/execute")
                        .header("Authorization", "Bearer dummyToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Quantity cannot be negative"));
    }

    @Test
    void testExecuteTradeMissingToken() throws Exception {
        TradeBuySellRequest request = new TradeBuySellRequest();
        request.setClientId("C001");
        request.setInstrumentId("TSLA");
        request.setQuantity(5);
        request.setTargetPrice(300.0);

        mockMvc.perform(post("/trades/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Missing FMTS token"));
    }

    @Test
    void testExecuteTradeSuccess() throws Exception {
        TradeBuySellRequest request = new TradeBuySellRequest();
        request.setClientId("C001");
        request.setInstrumentId("TSLA");
        request.setQuantity(10);
        request.setTargetPrice(300.0);

        when(tradeBuySellService.executeTrade(Mockito.any(), Mockito.anyString()))
                .thenReturn("Trade executed successfully");

        mockMvc.perform(post("/trades/execute")
                        .header("Authorization", "Bearer dummyToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Trade executed successfully"));
    }
}
