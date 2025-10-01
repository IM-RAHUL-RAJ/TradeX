package com.example.tradex_service.DTO.Response;

import com.example.tradex_service.Models.ClientIdentification;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;
import java.util.Set;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClientResponse {
    private String clientId;
    private String email;
    private String dateOfBirth;
    private String country;
    private String postalCode;
    private double cashBalance;
    private Set<ClientIdentification> identifications;

}
