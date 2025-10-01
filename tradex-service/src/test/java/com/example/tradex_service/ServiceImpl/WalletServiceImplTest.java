package com.example.tradex_service.ServiceImpl;


import com.example.tradex_service.DAO.WalletDao;
import com.example.tradex_service.DTO.Request.WalletRequestDto;
import com.example.tradex_service.DTO.Response.WalletResponseDto;
import com.example.tradex_service.Service.ServiceImpl.WalletServiceImpl;
import com.example.tradex_service.Service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class WalletServiceImplTest {

    @InjectMocks
    private WalletServiceImpl walletService;

    @Mock
    private WalletDao walletDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetWalletByClientIdReturnsBalance() {
        String clientId = "C001";
        when(walletDao.fetchCashBalance(clientId)).thenReturn(BigDecimal.valueOf(1000));

        WalletResponseDto dto = walletService.getWalletByClientId(clientId);
        assertEquals(clientId, dto.getClientId());
        assertEquals(BigDecimal.valueOf(1000), dto.getCashBalance());
    }

    @Test
    void testDepositUpdatesBalance() {
        String clientId = "C002";
        BigDecimal depositAmount = BigDecimal.valueOf(500);
        BigDecimal expectedBalance = BigDecimal.valueOf(1500);

        doNothing().when(walletDao).deposit(clientId, depositAmount);
        when(walletDao.fetchCashBalance(clientId)).thenReturn(expectedBalance);

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(depositAmount);

        WalletResponseDto response = walletService.deposit(request);

        verify(walletDao).deposit(clientId, depositAmount);
        verify(walletDao).fetchCashBalance(clientId);

        assertEquals(expectedBalance, response.getCashBalance());
    }

    @Test
    void testWithdrawSuccessful() {
        String clientId = "C001";
        BigDecimal withdrawAmount = BigDecimal.valueOf(300);
        BigDecimal remainingBalance = BigDecimal.valueOf(700);

        when(walletDao.withdraw(clientId, withdrawAmount)).thenReturn(true);
        when(walletDao.fetchCashBalance(clientId)).thenReturn(remainingBalance);

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(withdrawAmount);

        WalletResponseDto response = walletService.withdraw(request);

        assertEquals(clientId, response.getClientId());
        assertEquals(remainingBalance, response.getCashBalance());
    }

    @Test
    void testWithdrawInsufficientFundsThrows() {
        String clientId = "C001";
        BigDecimal withdrawAmount = BigDecimal.valueOf(2000);

        when(walletDao.withdraw(clientId, withdrawAmount)).thenReturn(false);

        WalletRequestDto request = new WalletRequestDto();
        request.setClientId(clientId);
        request.setAmount(withdrawAmount);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> walletService.withdraw(request));
        assertEquals("Insufficient funds to withdraw", exception.getMessage());
    }
}

