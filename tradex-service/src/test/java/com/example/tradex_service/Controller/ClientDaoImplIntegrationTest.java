package com.example.tradex_service.Controller;

import com.example.tradex_service.DAO.DaoImpl.ClientDAOImpl;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Models.ClientIdentification;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback
public class ClientDaoImplIntegrationTest {

    @Autowired
    private ClientDAOImpl clientDAO;

    @Test
    public void testAddAndFindClient() {
        // Positive test: Add client and identification and verify retrieval
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");

        Client client = new Client();
        client.setClientId("testClientId123");
        client.setEmail("testdao@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));

        clientDAO.addClient(client);

        for (ClientIdentification ci : client.getIdentifications()) {
            clientDAO.addIdentification(client.getClientId(), ci.getType(), ci.getValue());
        }

        Client dbClient = clientDAO.findByClientId("testClientId123");
        assertThat(dbClient).isNotNull();
        assertThat(dbClient.getEmail()).isEqualTo("testdao@example.com");

        Set<ClientIdentification> identifications = clientDAO.findIdentificationsByClientId("testClientId123");
        assertThat(identifications).isNotNull();
        assertThat(identifications).hasSize(1);

        ClientIdentification dbIdentification = identifications.iterator().next();
        assertThat(dbIdentification.getType()).isEqualTo("SSN");
        assertThat(dbIdentification.getValue()).isEqualTo("159-45-6789");
    }

    @Test
    public void testCountIdentification() {
        // Positive test: Count identifications increases with insertions
        String clientId = "testClientId123";
        String type = "SSN";
        String value = "000-00-0000";

        Client client = clientDAO.findByClientId(clientId);
        if (client == null) {
            Client newClient = new Client();
            newClient.setClientId(clientId);
            newClient.setEmail("counttest@example.com");
            newClient.setPassword("password");
            newClient.setCountry("US");
            newClient.setDateOfBirth("19900101");
            newClient.setPostalCode("12345");
            newClient.setIdentifications(Set.of());

            clientDAO.addClient(newClient);
        }

        int countBefore = clientDAO.countIdentification(type, value);
        clientDAO.addIdentification(clientId, type, value);
        int countAfter = clientDAO.countIdentification(type, value);

        assertThat(countAfter).isEqualTo(countBefore + 1);
    }

    @Test
    public void testGetCashBalance() {
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");
        Client client = new Client();
        client.setClientId("cashClientId");
        client.setEmail("cash@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));
        clientDAO.addClient(client);
        clientDAO.addIdentification(client.getClientId(), identification.getType(), identification.getValue());
        // Set initial cash balance
        int updated = clientDAO.updateCashBalance("cashClientId", 5000.0);
        assertThat(updated).isGreaterThan(0);
        double balance = clientDAO.getCashBalance("cashClientId");
        assertThat(balance).isEqualTo(5000.0);
    }

    @Test
    public void testGetCashBalanceForNonExistentClient() {
        double balance = clientDAO.getCashBalance("nonexistent-client-id-xyz");
        assertThat(balance).isEqualTo(0.0);
    }

    @Test
    public void testFindByEmailAndPassword() {
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");
        Client client = new Client();
        client.setClientId("emailPassClientId");
        client.setEmail("emailpass@example.com");
        client.setPassword("SecretPass");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));
        clientDAO.addClient(client);
        clientDAO.addIdentification(client.getClientId(), identification.getType(), identification.getValue());
        Client found = clientDAO.findByEmailAndPassword("emailpass@example.com", "SecretPass");
        assertThat(found).isNotNull();
        assertThat(found.getClientId()).isEqualTo("emailPassClientId");
    }

    @Test
    public void testUpdatePassword() {
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");
        Client client = new Client();
        client.setClientId("updatePassClientId");
        client.setEmail("updatepass@example.com");
        client.setPassword("OldPass");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));
        clientDAO.addClient(client);
        clientDAO.addIdentification(client.getClientId(), identification.getType(), identification.getValue());
        clientDAO.updatePassword("updatePassClientId", "NewPass");
        Client updated = clientDAO.findByClientId("updatePassClientId");
        assertThat(updated.getPassword()).isEqualTo("NewPass");
    }

    @Test
    public void testUpdateEmail() {
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");
        Client client = new Client();
        client.setClientId("updateEmailClientId");
        client.setEmail("oldemail@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));
        clientDAO.addClient(client);
        clientDAO.addIdentification(client.getClientId(), identification.getType(), identification.getValue());
        clientDAO.updateEmail("updateEmailClientId", "newemail@example.com");
        Client updated = clientDAO.findByClientId("updateEmailClientId");
        assertThat(updated.getEmail()).isEqualTo("newemail@example.com");
    }

    @Test
    public void testUpdateCashBalance() {
        ClientIdentification identification = new ClientIdentification();
        identification.setType("SSN");
        identification.setValue("159-45-6789");
        Client client = new Client();
        client.setClientId("updateCashClientId");
        client.setEmail("cashupdate@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(identification));
        clientDAO.addClient(client);
        clientDAO.addIdentification(client.getClientId(), identification.getType(), identification.getValue());
        int updated = clientDAO.updateCashBalance("updateCashClientId", 12345.67);
        assertThat(updated).isGreaterThan(0);
        double balance = clientDAO.getCashBalance("updateCashClientId");
        assertThat(balance).isEqualTo(12345.67);
    }

    // Negative tests below

    @Test
    public void testAddIdentificationParentKeyNotFound() {
        // Negative test: Adding identification with non-existent clientId fails
        String invalidClientId = "nonexistent-id";
        String type = "SSN";
        String value = "111-22-3333";

        assertThatThrownBy(() -> clientDAO.addIdentification(invalidClientId, type, value))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    public void testAddClientDuplicateId() {
        // Negative test: Adding a client with duplicate clientId throws error
        ClientIdentification cid = new ClientIdentification();
        cid.setType("SSN");
        cid.setValue("159-45-6789");

        Client client = new Client();
        client.setClientId("duplicateClientId");
        client.setEmail("dup@example.com");
        client.setPassword("Password123");
        client.setCountry("US");
        client.setDateOfBirth("19900101");
        client.setPostalCode("12345");
        client.setIdentifications(Set.of(cid));

        clientDAO.addClient(client);

        assertThatThrownBy(() -> clientDAO.addClient(client))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    public void testFindClientByNonExistentId() {
        // Negative test: find returns null if clientId not found
        Client client = clientDAO.findByClientId("random-nonexistent-id");
        assertThat(client).isNull();
    }

    @Test
    public void testCountIdentificationForNonExistentTypeValue() {
        // Negative test: countIdentification returns zero for unknown type/value
        int count = clientDAO.countIdentification("NON_EXISTENT_TYPE", "nonexistent-value");
        assertThat(count).isZero();
    }
}
