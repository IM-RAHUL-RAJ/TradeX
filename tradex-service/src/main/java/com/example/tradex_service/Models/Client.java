package com.example.tradex_service.Models;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class Client {
    private String clientId;
    private String email;
    private String password;
    private String dateOfBirth;  // YYYYMMDD ISO 8601 basic format
    private String country;      // ISO 3166-1 alpha-2 code
    private String postalCode;   // Non-alphanumeric remove
    private Set<ClientIdentification> identifications;
    private Preferences preferences;
    private double cashBalance;
    private List<PortfolioPosition> portfolio;

}
