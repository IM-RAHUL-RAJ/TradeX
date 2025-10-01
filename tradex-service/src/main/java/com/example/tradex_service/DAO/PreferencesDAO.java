package com.example.tradex_service.DAO;

import com.example.tradex_service.Models.Preferences;

public interface PreferencesDAO {
    void savePreferences(Preferences preferences);
    void updatePreferences(Preferences preferences);

    Preferences getPreferencesByClientId(String clientId);
}

