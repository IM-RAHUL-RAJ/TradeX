package com.example.tradex_service.Service.ServiceImpl;


import com.example.tradex_service.DAO.PortfolioPositionDao;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.Models.PortfolioPosition;
import com.example.tradex_service.Service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    @Autowired
    private PortfolioPositionDao portfolioPositionDao;

    @Override
    public PortfolioResponseDto getPortfolioByClientId(String clientId) {
        return portfolioPositionDao.fetchPortfolioResponse(clientId);
    }
}