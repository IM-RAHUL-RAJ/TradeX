package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DAO.PreferencesDAO;
import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.Service.PreferencesService;
import org.springframework.stereotype.Service;

@Service
public class PreferencesServiceImpl implements PreferencesService {

    private final PreferencesDAO preferencesDAO;

    public PreferencesServiceImpl(PreferencesDAO preferencesDAO) {
        this.preferencesDAO = preferencesDAO;
    }

    @Override
    public void savePreferences(Preferences preferences) {
        validatePreferences(preferences);

        Preferences existing = preferencesDAO.getPreferencesByClientId(preferences.getClientId());
        if (existing != null) {
            preferencesDAO.updatePreferences(preferences);
        } else {
            preferencesDAO.savePreferences(preferences);
        }
    }

    @Override
    public void updatePreferences(Preferences preferences) {
        validatePreferences(preferences);
        preferencesDAO.updatePreferences(preferences);
    }

    /**
     * Validates that all required fields are set.
     * For boolean roboAdvisor, no need for null check as primitive defaults to false.
     */
    private void validatePreferences(Preferences preferences) {
        if (preferences.getPurpose() == null || preferences.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Investment purpose is required");
        }
        if (preferences.getRisk() == null || preferences.getRisk().trim().isEmpty()) {
            throw new IllegalArgumentException("Risk tolerance is required");
        }
        if (preferences.getIncome() == null || preferences.getIncome().trim().isEmpty()) {
            throw new IllegalArgumentException("Income category is required");
        }
        if (preferences.getLength() == null || preferences.getLength().trim().isEmpty()) {
            throw new IllegalArgumentException("Investment length is required");
        }
        // No validation needed for boolean roboAdvisor
    }

    @Override
    public Preferences getPreferences(String clientId) {
        return preferencesDAO.getPreferencesByClientId(clientId);
    }
}
