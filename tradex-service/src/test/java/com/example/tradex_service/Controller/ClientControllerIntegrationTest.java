package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Response.ClientResponse;
import com.example.tradex_service.DTO.Response.FMTSResponse;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import com.example.tradex_service.Service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
public class ClientControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientService clientService;

    @Test
    public void testRegisterClientSuccess() throws Exception {
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

        FMTSResponse fmtsResponse = new FMTSResponse();
        fmtsResponse.setClientId("client-123");
        fmtsResponse.setEmail(client.getEmail());

        when(clientService.registerClient(any(Client.class))).thenReturn(fmtsResponse);

        String clientJson = objectMapper.writeValueAsString(client);

        String response = mockMvc.perform(post("/client/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(clientJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        FMTSResponse responseBody = objectMapper.readValue(response, FMTSResponse.class);
        assertThat(responseBody.getClientId()).isEqualTo("client-123");
        assertThat(responseBody.getEmail()).isEqualTo(client.getEmail());
    }

    @Test
    public void testRegisterClientValidationFailure() throws Exception {
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

        when(clientService.registerClient(any(Client.class)))
                .thenThrow(new RuntimeException("Invalid SSN format"));

        String clientJson = objectMapper.writeValueAsString(client);

        mockMvc.perform(post("/client/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(clientJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Invalid SSN format")));
    }

    @Test
    public void testLoginSuccess() throws Exception {
        Client dbClient = new Client();
        dbClient.setClientId("client-123");
        dbClient.setEmail("abi@gmail.com");
        dbClient.setPassword("Leap@2025");

        Client clientRequest = new Client();
        clientRequest.setEmail("abi@gmail.com");
        clientRequest.setPassword("Leap@2025");

        FMTSResponse fmtsResponse = new FMTSResponse();
        fmtsResponse.setClientId(dbClient.getClientId());
        fmtsResponse.setEmail(dbClient.getEmail());

        when(clientService.login(clientRequest.getEmail(), clientRequest.getPassword()))
                .thenReturn(Optional.of(dbClient));
        when(clientService.verifyClientWithFMTS(any(Client.class))).thenReturn(fmtsResponse);

        String loginJson = objectMapper.writeValueAsString(clientRequest);

        mockMvc.perform(post("/client/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientId").value(dbClient.getClientId()))
                .andExpect(jsonPath("$.email").value(dbClient.getEmail()));
    }

    @Test
    public void testLoginFailureInvalidPassword() throws Exception {
        Client clientRequest = new Client();
        clientRequest.setEmail("shrinidhi6@gmail.com");
        clientRequest.setPassword("wrongpassword");

        when(clientService.login(clientRequest.getEmail(), clientRequest.getPassword()))
                .thenReturn(Optional.empty());

        String loginJson = objectMapper.writeValueAsString(clientRequest);

        mockMvc.perform(post("/client/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Invalid email or password")));
    }

    @Test
    public void testGetClientSuccess() throws Exception {
        Client dbClient = new Client();
        dbClient.setClientId("client-123");
        dbClient.setEmail("abc@gmail.com");
        dbClient.setCountry("US");
        dbClient.setDateOfBirth("19900101");
        dbClient.setPostalCode("12345");
        dbClient.setIdentifications(Set.of(new ClientIdentification("SSN","159-45-6789")));

        when(clientService.getClientById("client-123")).thenReturn(Optional.of(dbClient));

        String response = mockMvc.perform(get("/client/client-123"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ClientResponse clientData = objectMapper.readValue(response, ClientResponse.class);
        assertThat(clientData.getClientId()).isEqualTo("client-123");
        assertThat(clientData.getEmail()).isEqualTo("abc@gmail.com");
    }

    @Test
    public void testGetClientNotFound() throws Exception {
        when(clientService.getClientById("nonexistent-id")).thenReturn(Optional.empty());

        mockMvc.perform(get("/client/nonexistent-id"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Client not found"));
    }

    @Test
    public void testCheckEmail() throws Exception {
        when(clientService.getClientByEmail("testemail@example.com")).thenReturn(Optional.empty());

        mockMvc.perform(get("/client/check-email")
                        .param("email", "testemail@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}
