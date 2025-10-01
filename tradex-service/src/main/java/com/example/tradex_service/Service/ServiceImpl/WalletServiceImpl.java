package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DAO.WalletDao;
import com.example.tradex_service.DTO.Request.WalletRequestDto;
import com.example.tradex_service.DTO.Response.WalletResponseDto;
import com.example.tradex_service.Service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletDao walletDao;

    @Override
    public WalletResponseDto getWalletByClientId(String clientId) {
        BigDecimal balance = walletDao.fetchCashBalance(clientId);
        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(clientId);
        response.setCashBalance(balance);
        return response;
    }

    @Override
    @Transactional
    public WalletResponseDto deposit(WalletRequestDto request) {
        walletDao.deposit(request.getClientId(), request.getAmount());
        BigDecimal updatedBalance = walletDao.fetchCashBalance(request.getClientId());

        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(request.getClientId());
        response.setCashBalance(updatedBalance);
        return response;
    }

    @Override
    @Transactional
    public WalletResponseDto withdraw(WalletRequestDto request) {
        boolean success = walletDao.withdraw(request.getClientId(), request.getAmount());
        if (!success) {
            throw new RuntimeException("Insufficient funds to withdraw");
        }
        BigDecimal updatedBalance = walletDao.fetchCashBalance(request.getClientId());

        WalletResponseDto response = new WalletResponseDto();
        response.setClientId(request.getClientId());
        response.setCashBalance(updatedBalance);
        return response;
    }
}
