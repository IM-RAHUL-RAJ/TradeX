package com.example.tradex_service.DAO;



import com.example.tradex_service.DAO.DaoImpl.WalletDaoImpl;
import com.example.tradex_service.Mapper.WalletMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WalletDaoImplTest {

    @InjectMocks
    private WalletDaoImpl walletDao;

    @Mock
    private WalletMapper walletMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void fetchCashBalance_ReturnsBalanceWhenExists() {
        String clientId = "client123";
        BigDecimal expectedBalance = new BigDecimal("1000.50");

        when(walletMapper.findCashBalanceByClientId(clientId)).thenReturn(expectedBalance);

        BigDecimal balance = walletDao.fetchCashBalance(clientId);

        assertEquals(expectedBalance, balance);
        verify(walletMapper, times(1)).findCashBalanceByClientId(clientId);
    }

    @Test
    void fetchCashBalance_ReturnsZeroWhenNull() {
        String clientId = "clientEmpty";

        when(walletMapper.findCashBalanceByClientId(clientId)).thenReturn(null);

        BigDecimal balance = walletDao.fetchCashBalance(clientId);

        assertEquals(BigDecimal.ZERO, balance);
        verify(walletMapper, times(1)).findCashBalanceByClientId(clientId);
    }

    @Test
    void deposit_CallsMapperWithCorrectParameters() {
        String clientId = "client123";
        BigDecimal depositAmount = new BigDecimal("500.00");

        walletDao.deposit(clientId, depositAmount);

        verify(walletMapper, times(1)).incrementCashBalance(clientId, depositAmount);
    }

    @Test
    void withdraw_ReturnsTrueWhenRowsUpdatedGreaterThanZero() {
        String clientId = "client123";
        BigDecimal withdrawAmount = new BigDecimal("300.00");

        when(walletMapper.decrementCashBalance(clientId, withdrawAmount)).thenReturn(1);

        boolean result = walletDao.withdraw(clientId, withdrawAmount);

        assertTrue(result);
        verify(walletMapper, times(1)).decrementCashBalance(clientId, withdrawAmount);
    }

    @Test
    void withdraw_ReturnsFalseWhenNoRowsUpdated() {
        String clientId = "client123";
        BigDecimal withdrawAmount = new BigDecimal("300.00");

        when(walletMapper.decrementCashBalance(clientId, withdrawAmount)).thenReturn(0);

        boolean result = walletDao.withdraw(clientId, withdrawAmount);

        assertFalse(result);
        verify(walletMapper, times(1)).decrementCashBalance(clientId, withdrawAmount);
    }
}

