package com.example.tradex_service.Service;

import com.example.tradex_service.DTO.Response.ClientResponse;
import com.example.tradex_service.DTO.Response.FMTSResponse;
import com.example.tradex_service.Models.Client;

import java.util.Optional;

public interface ClientService {

    // Verify client with FMTS and return FMTS response
    FMTSResponse verifyClientWithFMTS(Client client);

    // Register client locally (with FMTS verification) and return FMTS response
    FMTSResponse registerClient(Client client);

    // Get client by clientId
    Optional<Client> getClientById(String clientId);

    Optional<Client> getClientByEmail(String email);

    // Update client password
    void setPassword(String clientId, String password);

    // Update client email
    void setEmail(String clientId, String email);
    Optional<Client> login(String email, String password);
}
