package com.example.tradex_service.DTO.Request;

import lombok.Data;

/**
 * Request DTO for capturing client investment preferences.
 * This DTO is used to receive JSON input from the client.
 */

import lombok.Data;

@Data
public class PreferencesRequestDTO {

    private String purpose;
    private String risk;
    private String income;
    private String length;

    // ✅ Change from String to boolean
    private boolean roboAdvisor;
}

