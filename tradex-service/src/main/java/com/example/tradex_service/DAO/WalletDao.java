package com.example.tradex_service.DAO;

import java.math.BigDecimal;

public interface WalletDao {
    BigDecimal fetchCashBalance(String clientId);

    void deposit(String clientId, BigDecimal amount);

    boolean withdraw(String clientId, BigDecimal amount);
}
