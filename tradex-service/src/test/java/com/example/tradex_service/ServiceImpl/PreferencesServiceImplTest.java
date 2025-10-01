package com.example.tradex_service.ServiceImpl;

import com.example.tradex_service.DAO.PreferencesDAO;
import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.Service.ServiceImpl.PreferencesServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PreferencesServiceImplTest {

    @Mock
    private PreferencesDAO preferencesDAO;

    @InjectMocks
    private PreferencesServiceImpl service;

    private Preferences validPreferences;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        validPreferences = new Preferences();
        validPreferences.setClientId("client-123");
        validPreferences.setPurpose("Retirement");
        validPreferences.setRisk("Medium");
        validPreferences.setIncome("High");
        validPreferences.setLength("Long-term");
        validPreferences.setRoboAdvisor(true);
    }

    @Test
    void savePreferences_NewPreferences_CallsSave() {
        when(preferencesDAO.getPreferencesByClientId("client-123")).thenReturn(null);

        service.savePreferences(validPreferences);

        verify(preferencesDAO, times(1)).savePreferences(validPreferences);
        verify(preferencesDAO, never()).updatePreferences(any());
    }

    @Test
    void savePreferences_ExistingPreferences_CallsUpdate() {
        when(preferencesDAO.getPreferencesByClientId("client-123")).thenReturn(new Preferences());

        service.savePreferences(validPreferences);

        verify(preferencesDAO, times(1)).updatePreferences(validPreferences);
        verify(preferencesDAO, never()).savePreferences(any());
    }

    @Test
    void updatePreferences_CallsDAOUpdate() {
        service.updatePreferences(validPreferences);

        verify(preferencesDAO, times(1)).updatePreferences(validPreferences);
    }

    @Test
    void getPreferences_ReturnsFromDAO() {
        when(preferencesDAO.getPreferencesByClientId("client-123")).thenReturn(validPreferences);

        Preferences result = service.getPreferences("client-123");

        assertEquals(validPreferences, result);
    }

    @Test
    void savePreferences_InvalidPurpose_Throws() {
        validPreferences.setPurpose(null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.savePreferences(validPreferences));
        assertTrue(ex.getMessage().contains("Investment purpose is required"));
    }

    @Test
    void savePreferences_InvalidRisk_Throws() {
        validPreferences.setRisk("");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.savePreferences(validPreferences));
        assertTrue(ex.getMessage().contains("Risk tolerance is required"));
    }

    @Test
    void savePreferences_InvalidIncome_Throws() {
        validPreferences.setIncome(null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.savePreferences(validPreferences));
        assertTrue(ex.getMessage().contains("Income category is required"));
    }

    @Test
    void savePreferences_InvalidLength_Throws() {
        validPreferences.setLength(" ");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.savePreferences(validPreferences));
        assertTrue(ex.getMessage().contains("Investment length is required"));
    }
}
