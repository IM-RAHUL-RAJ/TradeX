package com.example.tradex_service.DTO.Request;

import lombok.Data;

import java.util.Set;

@Data
public class ClientDTO {
    private String email;
    private String password;
    private String clientId;
    private String country;
    private String dateOfBirth;
    private String postalCode;
    private double cashBalance;
    private Set<ClientIdentificationDTO> identifications;
   private String token;
}