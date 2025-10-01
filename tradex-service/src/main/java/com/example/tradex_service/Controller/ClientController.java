package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.ClientLoginDTO;
import com.example.tradex_service.DTO.Response.ClientResponse;
import com.example.tradex_service.DTO.Response.FMTSResponse;
import com.example.tradex_service.Models.Client;
import com.example.tradex_service.Service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/client")
public class ClientController {

    @Autowired
    private ClientService clientService; // Use interface for better flexibility
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Client clientRequest) {
        try {
            // Step 1: Verify credentials locally
            Optional<Client> localClient = clientService.login(clientRequest.getEmail(), clientRequest.getPassword());

            if (localClient.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password.");
            }

            // Step 2: Reuse existing clientId from DB
            Client client = localClient.get();
            clientRequest.setClientId(client.getClientId());

            // Step 3: Call FMTS with same clientId
            FMTSResponse fmtsResponse = clientService.verifyClientWithFMTS(clientRequest);

            // ✅ Ensure FMTS response respects DB's clientId
            fmtsResponse.setClientId(client.getClientId());

            return ResponseEntity.ok(fmtsResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Login failed: " + e.getMessage());
        }
    }

    // Register a new client (FMTS + local DB)
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody Client client) {
        try {
            FMTSResponse fmtsResponse = clientService.registerClient(client);
            return ResponseEntity.ok(fmtsResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }
    @GetMapping("/{clientId}")
    public ResponseEntity<?> getClient(@PathVariable String clientId) {
        Optional<Client> clientOpt = clientService.getClientById(clientId);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();

            // Map Client entity to ClientResponse DTO
            ClientResponse response = new ClientResponse();
            response.setClientId(client.getClientId());
            response.setEmail(client.getEmail());
            response.setDateOfBirth(client.getDateOfBirth());
            response.setCountry(client.getCountry());
            response.setPostalCode(client.getPostalCode());
            response.setIdentifications(client.getIdentifications());

            // Password is intentionally omitted in ClientResponse
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }
    }
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = clientService.getClientByEmail(email).isPresent();
        return ResponseEntity.ok(exists);
    }


    // Set password for a registered client
//    @PostMapping("/{clientId}/password")
//    public ResponseEntity<?> setPassword(@PathVariable String clientId, @RequestBody PasswordDTO dto) {
//        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must not be empty");
//        }
//        try {
//            clientService.setPassword(clientId, dto.getPassword());
//            return ResponseEntity.ok("Password updated successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//    }
//
//    // Set email for a registered client
//    @PostMapping("/{clientId}/email")
//    public ResponseEntity<?> setEmail(@PathVariable String clientId, @RequestBody EmailDTO dto) {
//        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email must not be empty");
//        }
//        try {
//            clientService.setEmail(clientId, dto.getEmail());
//            return ResponseEntity.ok("Email updated successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//    }

    // DTO classes
//    public static class PasswordDTO {
//        private String password;
//        public String getPassword() { return password; }
//        public void setPassword(String password) { this.password = password; }
//    }
//
//    public static class EmailDTO {
//        private String email;
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//    }
}