package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.PreferencesDAO;
import com.example.tradex_service.Mapper.PreferencesMapper;
import com.example.tradex_service.Models.Preferences;
import org.springframework.stereotype.Repository;

@Repository
public class PreferencesDAOImpl implements PreferencesDAO {

    private final PreferencesMapper preferencesMapper;

    public PreferencesDAOImpl(PreferencesMapper preferencesMapper) {

        this.preferencesMapper = preferencesMapper;
    }

    @Override
    public void savePreferences(Preferences preferences) {
        preferencesMapper.insertPreferences(preferences);
    }

    @Override
    public void updatePreferences(Preferences preferences) {
        preferencesMapper.updatePreferences(preferences);
    }

    @Override
    public Preferences getPreferencesByClientId(String clientId) {
        return preferencesMapper.selectPreferencesByClientId(clientId);
    }
}

