package com.example.tradex_service.DAO;

import com.example.tradex_service.DAO.InstrumentDao;
import com.example.tradex_service.DAO.DaoImpl.PortfolioPositionDaoImpl;
import com.example.tradex_service.DTO.Response.PortfolioPositionResponseDto;
import com.example.tradex_service.DTO.Response.PortfolioResponseDto;
import com.example.tradex_service.Mapper.PortfolioPositionMapper;
import com.example.tradex_service.Models.Instrument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PortfolioPositionDaoImplTest {

    @Mock
    private PortfolioPositionMapper portfolioPositionMapper;

    @Mock
    private InstrumentDao instrumentDao;

    @InjectMocks
    private PortfolioPositionDaoImpl portfolioPositionDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ---------- fetchPortfolioResponse ----------
    @Test
    void testFetchPortfolioResponse_returnsPositions() {
        String clientId = "c1";
        PortfolioPositionResponseDto pos = new PortfolioPositionResponseDto();
        pos.setInstrumentId("I1");
        pos.setQuantity(10.0);
        pos.setCost(100.0);

        when(portfolioPositionMapper.findPositionsByClientId(clientId))
                .thenReturn(List.of(pos));

        PortfolioResponseDto response = portfolioPositionDao.fetchPortfolioResponse(clientId);

        assertNotNull(response);
        assertEquals(1, response.getPositions().size());
        assertEquals("I1", response.getPositions().get(0).getInstrumentId());
    }

    @Test
    void testFetchPortfolioResponse_emptyPositions() {
        String clientId = "c2";
        when(portfolioPositionMapper.findPositionsByClientId(clientId))
                .thenReturn(Collections.emptyList());

        PortfolioResponseDto response = portfolioPositionDao.fetchPortfolioResponse(clientId);

        assertNotNull(response);
        assertTrue(response.getPositions().isEmpty());
    }

    // ---------- upsertPosition (update path) ----------
    @Test
    void testUpsertPosition_updatesExistingPosition() {
        String clientId = "c3";
        String instrumentId = "I2";
        double quantity = 5.0;
        double executionPrice = 20.0; // newCost = 100

        PortfolioPositionResponseDto existing = new PortfolioPositionResponseDto();
        existing.setInstrumentId(instrumentId);
        existing.setClientId(clientId);
        existing.setQuantity(2.0);
        existing.setCost(50.0);

        when(portfolioPositionMapper.countPosition(instrumentId, clientId)).thenReturn(1);
        when(portfolioPositionMapper.findPosition(instrumentId, clientId)).thenReturn(existing);

        portfolioPositionDao.upsertPosition(clientId, instrumentId, quantity, executionPrice);

        assertEquals(quantity, existing.getQuantity());
        assertEquals(100.0, existing.getCost());
        verify(portfolioPositionMapper).updatePosition(existing);
        verify(portfolioPositionMapper, never()).insertPosition(any());
    }

    // ---------- upsertPosition (insert path, with instrument description) ----------
    @Test
    void testUpsertPosition_insertsNewPosition_withDescription() {
        String clientId = "c4";
        String instrumentId = "I3";
        double quantity = 3.0;
        double executionPrice = 50.0; // cost = 150

        Instrument instrument = new Instrument();
        instrument.setInstrumentId(instrumentId);
        instrument.setDescription("Test Instrument");

        when(portfolioPositionMapper.countPosition(instrumentId, clientId)).thenReturn(0);
        when(instrumentDao.findById(instrumentId)).thenReturn(instrument);

        portfolioPositionDao.upsertPosition(clientId, instrumentId, quantity, executionPrice);

        verify(portfolioPositionMapper).insertPosition(argThat(pos ->
                pos.getInstrumentId().equals(instrumentId)
                        && pos.getClientId().equals(clientId)
                        && pos.getQuantity() == quantity
                        && pos.getCost() == 150.0
                        && pos.getDescription().equals("Test Instrument")
        ));
    }

    // ---------- upsertPosition (insert path, no instrument found) ----------
    @Test
    void testUpsertPosition_insertsNewPosition_withoutInstrument() {
        String clientId = "c5";
        String instrumentId = "I4";
        double quantity = 2.0;
        double executionPrice = 40.0; // cost = 80

        when(portfolioPositionMapper.countPosition(instrumentId, clientId)).thenReturn(0);
        when(instrumentDao.findById(instrumentId)).thenReturn(null);

        portfolioPositionDao.upsertPosition(clientId, instrumentId, quantity, executionPrice);

        verify(portfolioPositionMapper).insertPosition(argThat(pos ->
                pos.getInstrumentId().equals(instrumentId)
                        && pos.getClientId().equals(clientId)
                        && pos.getQuantity() == quantity
                        && pos.getCost() == 80.0
                        && pos.getDescription().isEmpty()
        ));
    }

    // ---------- upsertPosition (insert path, instrumentDao throws exception) ----------
    @Test
    void testUpsertPosition_insertsNewPosition_instrumentDaoThrows() {
        String clientId = "c6";
        String instrumentId = "I5";
        double quantity = 1.0;
        double executionPrice = 10.0; // cost = 10

        when(portfolioPositionMapper.countPosition(instrumentId, clientId)).thenReturn(0);
        when(instrumentDao.findById(instrumentId)).thenThrow(new RuntimeException("DB error"));

        portfolioPositionDao.upsertPosition(clientId, instrumentId, quantity, executionPrice);

        verify(portfolioPositionMapper).insertPosition(argThat(pos ->
                pos.getInstrumentId().equals(instrumentId)
                        && pos.getClientId().equals(clientId)
                        && pos.getQuantity() == quantity
                        && pos.getCost() == 10.0
                        && pos.getDescription().isEmpty()
        ));
    }

    // ---------- deletePosition ----------
    @Test
    void testDeletePosition_callsMapper() {
        String clientId = "c7";
        String instrumentId = "I6";

        portfolioPositionDao.deletePosition(clientId, instrumentId);

        verify(portfolioPositionMapper).deletePosition(instrumentId, clientId);
    }
}
