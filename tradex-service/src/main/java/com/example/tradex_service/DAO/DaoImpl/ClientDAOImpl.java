package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.ClientDAO;
import com.example.tradex_service.Mapper.ClientMapper;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public class ClientDAOImpl implements ClientDAO{

    private final ClientMapper clientMapper;

    @Autowired
    public ClientDAOImpl(ClientMapper clientMapper) {
        this.clientMapper = clientMapper;
    }

    @Override
    public Client findByClientId(String clientId) {
        return clientMapper.findByClientId(clientId);
    }

    @Override
    public Set<ClientIdentification> findIdentificationsByClientId(String clientId) {
        return clientMapper.findIdentificationsByClientId(clientId);
    }

    @Override
    public Client findByEmail(String email) {
        return clientMapper.findByEmail(email);
    }

    @Override
    public Client findByEmailAndPassword(String email, String password) {
        return clientMapper.findByEmailAndPassword(email, password);
    }

    @Override
    public void addClient(Client client) {
        clientMapper.addClient(client);
    }

    @Override
    public void updatePassword(String clientId, String password) {
        clientMapper.updatePassword(clientId, password);
    }

    @Override
    public void updateEmail(String clientId, String email) {
        clientMapper.updateEmail(clientId, email);
    }

    @Override
    public int countIdentification(String type, String value) {
        return clientMapper.countIdentification(type, value);
    }

    @Override
    public void addIdentification(String clientId, String type, String value) {
        clientMapper.addIdentification(clientId, type, value);
    }
    // --- Cash balance methods ---
    @Override
    public double getCashBalance(String clientId) {
        Double balance = clientMapper.getCashBalance(clientId);
        return balance != null ? balance : 0.0;
    }

    @Override
    public int updateCashBalance(String clientId, double cashBalance) {
        return clientMapper.updateCashBalance(clientId, cashBalance);
    }
}