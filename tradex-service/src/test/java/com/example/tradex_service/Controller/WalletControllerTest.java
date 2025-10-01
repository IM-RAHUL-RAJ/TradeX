package com.example.tradex_service.Controller;


import com.example.tradex_service.DTO.Request.WalletRequestDto;
import com.example.tradex_service.DTO.Response.WalletResponseDto;
import com.example.tradex_service.Service.WalletService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class WalletControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WalletService walletService;

    @InjectMocks
    private WalletController walletController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(walletController).build();
    }

    @Test
    void testGetWalletBalance() throws Exception {
        String clientId = "C001";

        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(clientId);
        response.setCashBalance(BigDecimal.valueOf(1000));

        when(walletService.getWalletByClientId(clientId)).thenReturn(response);

        mockMvc.perform(get("/api/wallet/{clientId}", clientId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientId").value(clientId))
                .andExpect(jsonPath("$.cashBalance").value(1000));
    }

    @Test
    void testDeposit() throws Exception {
        String clientId = "C001";

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(BigDecimal.valueOf(500));

        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(clientId);
        response.setCashBalance(BigDecimal.valueOf(1500));

        when(walletService.deposit(any(WalletRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/wallet/{clientId}/deposit", clientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cashBalance").value(1500));
    }

    @Test
    void testWithdrawSuccess() throws Exception {
        String clientId = "C001";

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(BigDecimal.valueOf(300));

        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(clientId);
        response.setCashBalance(BigDecimal.valueOf(1200));

        when(walletService.withdraw(any(WalletRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/wallet/{clientId}/withdraw", clientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cashBalance").value(1200));
    }

    @Test
    void testWithdrawInsufficientFunds() throws Exception {
        String clientId = "C001";

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(BigDecimal.valueOf(2000));

        when(walletService.withdraw(any(WalletRequestDto.class)))
                .thenThrow(new RuntimeException("Insufficient funds to withdraw"));

        mockMvc.perform(post("/api/wallet/{clientId}/withdraw", clientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}

