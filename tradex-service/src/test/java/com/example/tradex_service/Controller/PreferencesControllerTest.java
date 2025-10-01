package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.PreferencesRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PreferencesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String TEST_CLIENT_ID = "client_ctrl_001";

    private final ObjectMapper objectMapper = new ObjectMapper();

    PreferencesRequestDTO dto = new PreferencesRequestDTO();

    @BeforeEach
    void setUp() {
        // Insert test client if not exists
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM client WHERE clientId = ?",
                Integer.class,
                TEST_CLIENT_ID
        );

        if (count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO client (clientId, email, password, dateOfBirth, country, postalCode) " +
                            "VALUES (?, ?, ?, ?, ?, ?)",
                    TEST_CLIENT_ID,
                    "ctrl@example.com",
                    "secret",
                    "19900101",
                    "SG",
                    "789012"
            );
        }
        dto.setPurpose("RETIREMENT");
        dto.setRisk("CONSERVATIVE");
        dto.setIncome("RANGE_20001_40000");
        dto.setLength("RANGE_5_7_YEARS");
        dto.setRoboAdvisor(true);
    }

    @Test
    void savePreferences_shouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/preferences/save/" + TEST_CLIENT_ID)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"success\":true,\"message\":\"Preferences saved.\"}"));
    }

    @Test
    void updatePreferences_shouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/preferences/save/" + TEST_CLIENT_ID)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Update preferences
        PreferencesRequestDTO updated = new PreferencesRequestDTO();
        updated.setPurpose("BUSINESS_INVESTMENT");
        updated.setRisk("ABOVE_AVERAGE");
        updated.setIncome("RANGE_40001_60000");
        updated.setLength("RANGE_7_10_YEARS");
        updated.setRoboAdvisor(false);

        mockMvc.perform(put("/api/preferences/update/" + TEST_CLIENT_ID)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"success\":true,\"message\":\"Preferences updated.\"}"));
    }

    @Test
    void getPreferences_shouldReturnDefaultIfNotFound() throws Exception {
        // Only call GET for a client that does not exist, do not insert preferences for it
        mockMvc.perform(get("/api/preferences/nonexistent-client"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(new com.example.tradex_service.Models.Preferences())));
    }
}
