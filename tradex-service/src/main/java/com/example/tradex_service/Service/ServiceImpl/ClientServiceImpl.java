package com.example.tradex_service.Service.ServiceImpl;

import com.example.tradex_service.DAO.ClientDAO;
import com.example.tradex_service.DTO.Response.FMTSResponse;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import com.example.tradex_service.Service.ClientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ClientServiceImpl implements ClientService {

    private static final Logger logger = LoggerFactory.getLogger(ClientServiceImpl.class);
    private static final String FMTS_URL = "http://fmts-nodejs:3000/fmts/client";

    private final ClientDAO clientDao;
    private final RestTemplate restTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    public ClientServiceImpl(ClientDAO clientDao) {
        this.clientDao = clientDao;
        this.restTemplate = new RestTemplate();
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Calls FMTS service for validation of client details.
     * Does NOT generate or override clientId.
     */
    @Override
    @Transactional
    public FMTSResponse verifyClientWithFMTS(Client client) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            HttpEntity<Client> request = new HttpEntity<>(client, headers);
            ResponseEntity<String> response = restTemplate.exchange(FMTS_URL, HttpMethod.POST, request, String.class);

            logger.info("FMTS HTTP Status: {}", response.getStatusCode());

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("FMTS service error: " + response.getStatusCode());
            }

            String responseBody = response.getBody();
            logger.info("FMTS response JSON: {}", responseBody);

            ObjectMapper mapper = new ObjectMapper();
            FMTSResponse fmtsResponse = mapper.readValue(responseBody, FMTSResponse.class);

            // ✅ Ensure we never override clientId during verification
            if (client.getClientId() != null && !client.getClientId().isEmpty()) {
                fmtsResponse.setClientId(client.getClientId());
            }

            return fmtsResponse;

        } catch (JsonProcessingException e) {
            logger.error("Failed to parse FMTS response JSON", e);
            throw new RuntimeException("Failed to parse FMTS response JSON", e);
        }
    }

    /**
     * Register new client.
     * Uses FMTS for validation but ensures only ONE clientId is persisted.
     */
    @Override
    @Transactional
    public FMTSResponse registerClient(Client client) {
        // Check duplicates
        if (clientDao.findByClientId(client.getClientId()) != null) {
            throw new RuntimeException("Client with this ID already exists");
        }
        if (clientDao.findByEmail(client.getEmail()) != null) {
            throw new RuntimeException("Client with this email already exists");
        }

        Set<ClientIdentification> identifications = client.getIdentifications() != null
                ? Set.copyOf(client.getIdentifications())
                : Set.of();

        // Validate identifications for country
        for (ClientIdentification ci : identifications) {
            validateIdentification(client.getCountry(), ci);
            if (clientDao.countIdentification(ci.getType(), ci.getValue()) > 0) {
                throw new RuntimeException("Client with this identification already exists");
            }
        }

        // Call FMTS service for validation
        FMTSResponse fmtsResponse = verifyClientWithFMTS(client);

        // ✅ Decide final clientId
        String finalClientId = (client.getClientId() != null && !client.getClientId().isEmpty())
                ? client.getClientId()
                : fmtsResponse.getClientId();

        // Map to DB entity
        Client dbClient = new Client();
        dbClient.setClientId(finalClientId);
        dbClient.setEmail(client.getEmail());
        dbClient.setPassword(passwordEncoder.encode(client.getPassword()));
        dbClient.setDateOfBirth(fmtsResponse.getDateOfBirth());
        dbClient.setCountry(fmtsResponse.getCountry());
        dbClient.setPostalCode(fmtsResponse.getPostalCode());
        dbClient.setCashBalance(client.getCashBalance());
        dbClient.setIdentifications(identifications);

        // Insert client
        clientDao.addClient(dbClient);
        logger.info("Inserted client into DB: {}", dbClient.getClientId());

        // Insert identifications
        for (ClientIdentification ci : identifications) {
            clientDao.addIdentification(dbClient.getClientId(), ci.getType(), ci.getValue());
            logger.info("Inserted identification {}:{} for clientId {}", ci.getType(), ci.getValue(), dbClient.getClientId());
        }

        // ✅ Return FMTS response with consistent clientId
        fmtsResponse.setClientId(finalClientId);
        return fmtsResponse;
    }

    private void validateIdentification(String country, ClientIdentification ci) {
        String type = ci.getType().toUpperCase();
        String value = ci.getValue();

        switch (country.toUpperCase()) {
            case "US":
                if (!"SSN".equals(type)) {
                    throw new RuntimeException("For US clients, only SSN is allowed");
                }
                if (!value.matches("\\d{3}-\\d{2}-\\d{4}")) {
                    throw new RuntimeException("Invalid SSN format");
                }
                break;

            case "IN":
                if (!"PAN".equals(type) && !"AADHAR".equals(type)) {
                    throw new RuntimeException("For India clients, only PAN or AADHAR is allowed");
                }
                if ("PAN".equals(type) && !value.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")) {
                    throw new RuntimeException("Invalid PAN format");
                }
                if ("AADHAR".equals(type) && !value.matches("\\d{12}")) {
                    throw new RuntimeException("Invalid AADHAR format");
                }
                break;

            default:
                throw new RuntimeException("Unsupported country: " + country);
        }
    }

    /**
     * Get client by ID
     */
    @Override
    public Optional<Client> getClientById(String clientId) {
        return Optional.ofNullable(clientDao.findByClientId(clientId));
    }

    /**
     * Login with email + password.
     * ✅ Uses DB only, never generates new clientId.
     */
    @Override
    public Optional<Client> login(String email, String rawPassword) {
        Client client = clientDao.findByEmail(email);
        if (client != null && passwordEncoder.matches(rawPassword, client.getPassword())) {
            return Optional.of(client); // ✅ Return existing client
        }
        return Optional.empty();
    }

    @Override
    @Transactional
    public void setPassword(String clientId, String password) {
        clientDao.updatePassword(clientId, passwordEncoder.encode(password));
        logger.info("Password updated for clientId: {}", clientId);
    }

    @Override
    @Transactional
    public void setEmail(String clientId, String email) {
        clientDao.updateEmail(clientId, email);
        logger.info("Email updated for clientId: {}", clientId);
    }

    @Override
    public Optional<Client> getClientByEmail(String email) {
        return Optional.ofNullable(clientDao.findByEmail(email));
    }
}