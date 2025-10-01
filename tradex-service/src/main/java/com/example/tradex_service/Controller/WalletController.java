package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.WalletRequestDto;
import com.example.tradex_service.DTO.Response.WalletResponseDto;
import com.example.tradex_service.Service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/{clientId}")
    public ResponseEntity<WalletResponseDto> getWalletBalance(@PathVariable String clientId) {
        WalletResponseDto response = walletService.getWalletByClientId(clientId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{clientId}/deposit")
    public ResponseEntity<WalletResponseDto> deposit(@PathVariable String clientId, @RequestBody WalletRequestDto request) {
        if (!clientId.equals(request.getClientId())) {
            return ResponseEntity.badRequest().build();
        }
        WalletResponseDto response = walletService.deposit(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{clientId}/withdraw")
    public ResponseEntity<WalletResponseDto> withdraw(@PathVariable String clientId, @RequestBody WalletRequestDto request) {
        if (!clientId.equals(request.getClientId())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            WalletResponseDto response = walletService.withdraw(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(null); // Or return an error DTO with details
        }
    }
}
