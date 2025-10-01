package com.example.tradex_service.ServiceImpl;

import com.example.tradex_service.DTO.Response.FMTSResponse;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import com.example.tradex_service.Service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
public class ClientServiceIntegrationTest {

    @Autowired
    private ClientService clientService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testRegisterAndGetClient() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("159-45-6789");

        Client client = new Client();
        client.setClientId("");
        client.setEmail("test6@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        FMTSResponse response = clientService.registerClient(client);
        assertThat(response).isNotNull();
        assertThat(response.getClientId()).isNotEmpty();

        Client dbClient = clientService.getClientById(response.getClientId()).orElse(null);
        assertThat(dbClient).isNotNull();
        assertThat(dbClient.getEmail()).isEqualTo(client.getEmail());
        assertThat(dbClient.getIdentifications()).hasSize(1);
    }

    @Test
    public void testRegisterClientInvalidSSN() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("invalid-ssn");

        Client client = new Client();
        client.setClientId("");
        client.setEmail("abc@gmail.com");
        client.setPassword("short");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        assertThatThrownBy(() -> clientService.registerClient(client))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid SSN format");
    }

    @Test
    public void testLoginSuccess() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("759-45-6789");

        Client client = new Client();
        client.setClientId("");
        client.setEmail("shrinidhi8@gmail.com");
        client.setPassword("valid!!123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        clientService.registerClient(client);

        assertThat(clientService.login(client.getEmail(), "valid!!123")).isPresent();
    }

    @Test
    public void testLoginFailure() {
        assertThat(clientService.login("nonexistent@example.com", "password")).isEmpty();
    }

    @Test
    public void testSetPasswordAndLogin() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("123-45-6789");

        Client client = new Client();
        client.setClientId("");
        client.setEmail("pwtest@example.com");
        client.setPassword("oldPassword");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        FMTSResponse response = clientService.registerClient(client);
        String clientId = response.getClientId();
        clientService.setPassword(clientId, "newPassword");
        assertThat(clientService.login(client.getEmail(), "newPassword")).isPresent();
        assertThat(clientService.login(client.getEmail(), "oldPassword")).isEmpty();
    }

    @Test
    public void testSetEmailAndGetClientByEmail() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("321-45-6789");

        Client client = new Client();
        client.setClientId("");
        client.setEmail("oldemail@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        FMTSResponse response = clientService.registerClient(client);
        String clientId = response.getClientId();
        clientService.setEmail(clientId, "newemail@example.com");
        assertThat(clientService.getClientByEmail("newemail@example.com")).isPresent();
        assertThat(clientService.getClientByEmail("oldemail@example.com")).isEmpty();
    }

    @Test
    public void testDuplicateIdentification() {
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("555-55-5555");

        Client client1 = new Client();
        client1.setClientId("");
        client1.setEmail("dup1@example.com");
        client1.setPassword("Password123");
        client1.setCountry("US");
        client1.setDateOfBirth("19900101");
        client1.setPostalCode("12345");
        client1.setIdentifications(Set.of(cid));
        clientService.registerClient(client1);

        Client client2 = new Client();
        client2.setClientId("");
        client2.setEmail("dup2@example.com");
        client2.setPassword("Password123");
        client2.setCountry("US");
        client2.setDateOfBirth("19900101");
        client2.setPostalCode("12345");
        client2.setIdentifications(Set.of(cid));

        assertThatThrownBy(() -> clientService.registerClient(client2))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("identification already exists");
    }

    @Test
    public void testValidAndInvalidPANAndAadhar() {
        // Valid PAN
        ClientIdentification pan = new ClientIdentification();
        pan.setType("PAN");
        pan.setValue("ABCDE1234F");
        Client clientPan = new Client();
        clientPan.setClientId("");
        clientPan.setEmail("pan@example.com");
        clientPan.setPassword("Password123");
        clientPan.setCountry("IN");
        clientPan.setDateOfBirth("19900101");
        clientPan.setPostalCode("560001");
        clientPan.setIdentifications(Set.of(pan));
        FMTSResponse panResp = clientService.registerClient(clientPan);
        assertThat(panResp).isNotNull();

        // Invalid PAN
        ClientIdentification panInvalid = new ClientIdentification();
        panInvalid.setType("PAN");
        panInvalid.setValue("BADPAN123");
        Client clientPanInvalid = new Client();
        clientPanInvalid.setClientId("");
        clientPanInvalid.setEmail("badpan@example.com");
        clientPanInvalid.setPassword("Password123");
        clientPanInvalid.setCountry("IN");
        clientPanInvalid.setDateOfBirth("19900101");
        clientPanInvalid.setPostalCode("560001");
        clientPanInvalid.setIdentifications(Set.of(panInvalid));
        assertThatThrownBy(() -> clientService.registerClient(clientPanInvalid))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid PAN format");

        // Valid AADHAR
        ClientIdentification aadhar = new ClientIdentification();
        aadhar.setType("AADHAR");
        aadhar.setValue("123456789012");
        Client clientAadhar = new Client();
        clientAadhar.setClientId("");
        clientAadhar.setEmail("aadhar@example.com");
        clientAadhar.setPassword("Password123");
        clientAadhar.setCountry("IN");
        clientAadhar.setDateOfBirth("19900101");
        clientAadhar.setPostalCode("560001");
        clientAadhar.setIdentifications(Set.of(aadhar));
        FMTSResponse aadharResp = clientService.registerClient(clientAadhar);
        assertThat(aadharResp).isNotNull();

        // Invalid AADHAR
        ClientIdentification aadharInvalid = new ClientIdentification();
        aadharInvalid.setType("AADHAR");
        aadharInvalid.setValue("12345");
        Client clientAadharInvalid = new Client();
        clientAadharInvalid.setClientId("");
        clientAadharInvalid.setEmail("badaadhar@example.com");
        clientAadharInvalid.setPassword("Password123");
        clientAadharInvalid.setCountry("IN");
        clientAadharInvalid.setDateOfBirth("19900101");
        clientAadharInvalid.setPostalCode("560001");
        clientAadharInvalid.setIdentifications(Set.of(aadharInvalid));
        assertThatThrownBy(() -> clientService.registerClient(clientAadharInvalid))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid AADHAR format");
    }
}
