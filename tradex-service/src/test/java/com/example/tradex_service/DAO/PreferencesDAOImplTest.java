package com.example.tradex_service.DAO;

import com.example.tradex_service.Mapper.PreferencesMapper;
import com.example.tradex_service.Models.Preferences;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class PreferencesDAOImplTest {

    @Autowired
    private PreferencesMapper preferencesMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String TEST_CLIENT_ID = "client_dao_001";

    @BeforeEach
    void setUp() {
        // Insert client if not exists
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM client WHERE clientId = ?",
                Integer.class,
                TEST_CLIENT_ID
        );

        if (count != null && count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO client (clientId, email, password, dateOfBirth, country, postalCode) " +
                            "VALUES (?, ?, ?, ?, ?, ?)",
                    TEST_CLIENT_ID,
                    "dao@example.com",
                    "secret",
                    "19900101",
                    "SG",
                    "123456"
            );
        }
    }

    @Test
    void insertPreferences_shouldPersistData() {
        Preferences prefs = new Preferences();
        prefs.setClientId(TEST_CLIENT_ID);
        prefs.setPurpose("Retirement");
        prefs.setRisk("Conservative");
        prefs.setIncome("20001-40000");
        prefs.setLength("5-7 years");
        prefs.setRoboAdvisor(true);

        preferencesMapper.insertPreferences(prefs);

        Preferences saved = preferencesMapper.selectPreferencesByClientId(TEST_CLIENT_ID);
        assertThat(saved).isNotNull();
        assertThat(saved.getPurpose()).isEqualTo("Retirement");
    }

    @Test
    void updatePreferences_shouldModifyRecord() {
        // Insert initial preferences
        Preferences prefs = new Preferences();
        prefs.setClientId(TEST_CLIENT_ID);
        prefs.setPurpose("Retirement");
        prefs.setRisk("Conservative");
        prefs.setIncome("20001-40000");
        prefs.setLength("5-7 years");
        prefs.setRoboAdvisor(true);

        preferencesMapper.insertPreferences(prefs);

        // Update
        prefs.setPurpose("Business Investment");
        prefs.setRisk("Above Average");
        preferencesMapper.updatePreferences(prefs);

        Preferences updated = preferencesMapper.selectPreferencesByClientId(TEST_CLIENT_ID);
        assertThat(updated.getPurpose()).isEqualTo("Business Investment");
        assertThat(updated.getRisk()).isEqualTo("Above Average");
        assertThat(updated.getIncome()).isEqualTo("20001-40000"); // unchanged
    }
}