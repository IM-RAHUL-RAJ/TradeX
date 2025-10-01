package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.PortfolioPositionDao;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.Mapper.PortfolioPositionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PortfolioPositionDaoImpl implements PortfolioPositionDao {
    private final PortfolioPositionMapper portfolioPositionMapper;
    private final com.example.tradex_service.DAO.InstrumentDao instrumentDao;

    @Autowired
    public PortfolioPositionDaoImpl(PortfolioPositionMapper portfolioPositionMapper, com.example.tradex_service.DAO.InstrumentDao instrumentDao) {
        this.portfolioPositionMapper = portfolioPositionMapper;
        this.instrumentDao = instrumentDao;
    }

    @Override
    public PortfolioResponseDto fetchPortfolioResponse(String clientId) {
        List<PortfolioPositionResponseDto> positions = portfolioPositionMapper.findPositionsByClientId(clientId);

        PortfolioResponseDto response = new PortfolioResponseDto();
        response.setPositions(positions);
        // Optionally retrieve and set cashBalance here if applicable
//        response.setCashBalance(0.0);
        return response;
    }

    @Override
    public void upsertPosition(String clientId, String instrumentId, double quantity, double executionPrice) {
        int count = portfolioPositionMapper.countPosition(instrumentId, clientId);
        if (count > 0) {
            // Update existing position
            PortfolioPositionResponseDto pos = portfolioPositionMapper.findPosition(instrumentId, clientId);
            double newCost = quantity * executionPrice;
            pos.setQuantity(quantity);
            pos.setCost(newCost);
            portfolioPositionMapper.updatePosition(pos);
        } else {
            // Insert new position
            String description = "";
            double cost = quantity * executionPrice;
            try {
                var instrument = instrumentDao.findById(instrumentId);
                if (instrument != null) {
                    description = instrument.getDescription();
                }
            } catch (Exception e) { /* ignore, fallback to empty description */ }
            PortfolioPositionResponseDto newPos = new PortfolioPositionResponseDto();
            newPos.setInstrumentId(instrumentId);
            newPos.setClientId(clientId);
            newPos.setQuantity(quantity);
            newPos.setDescription(description);
            newPos.setCost(cost);
            portfolioPositionMapper.insertPosition(newPos);
        }
    }


    @Override
    public void deletePosition(String clientId, String instrumentId) {
        portfolioPositionMapper.deletePosition(instrumentId, clientId);
    }
}
