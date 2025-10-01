package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.WalletDao;
import com.example.tradex_service.Mapper.WalletMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public class WalletDaoImpl implements WalletDao {

    @Autowired
    private WalletMapper walletMapper;

    @Override
    public BigDecimal fetchCashBalance(String clientId) {
        BigDecimal balance = walletMapper.findCashBalanceByClientId(clientId);
        return balance != null ? balance : BigDecimal.ZERO;
    }

    @Override
    public void deposit(String clientId, BigDecimal amount) {
        walletMapper.incrementCashBalance(clientId, amount);
    }

    @Override
    public boolean withdraw(String clientId, BigDecimal amount) {
        // Returns number of rows affected, if 0 then withdrawal failed due to insufficient funds
        int updatedRows = walletMapper.decrementCashBalance(clientId, amount);
        return updatedRows > 0;
    }
}
