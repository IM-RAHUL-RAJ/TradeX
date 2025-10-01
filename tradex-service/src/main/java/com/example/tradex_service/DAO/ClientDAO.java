package com.example.tradex_service.DAO;

import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;

import java.util.Set;

public interface ClientDAO {
    Client findByClientId(String clientId);
    Set<ClientIdentification> findIdentificationsByClientId(String clientId);
    Client findByEmail(String email);
    Client findByEmailAndPassword(String email, String password);
    void addClient(Client client);
    void updatePassword(String clientId, String password);
    void updateEmail(String clientId, String email);
    int countIdentification(String type, String value);
    void addIdentification(String clientId, String type, String value);
    double getCashBalance(String clientId);
    int updateCashBalance(String clientId, double newBalance);
}