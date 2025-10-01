package com.example.tradex_service.Service;

import com.example.tradex_service.Models.Preferences;

public interface PreferencesService {
    void savePreferences(Preferences preferences);
    void updatePreferences(Preferences preferences);

    Preferences getPreferences(String clientId);
}