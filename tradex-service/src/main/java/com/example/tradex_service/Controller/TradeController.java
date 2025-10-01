package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.TradeBuySellRequest;
import com.example.tradex_service.DTO.Response.TradeBuySellResponse;
import com.example.tradex_service.DTO.Response.TradeHistoryResponseDto;
import com.example.tradex_service.Service.TradeBuySellService;
import com.example.tradex_service.Service.TradeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/trades")   
@RequiredArgsConstructor
public class TradeController {

    private final TradeBuySellService tradeBuySellService;
    private final TradeService tradeService;

    @PostMapping("/execute")
    public ResponseEntity<String> executeTrade(@RequestBody TradeBuySellRequest request, @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing FMTS token");
        }
        String response = tradeBuySellService.executeTrade(request, token);
        // If error, return bad request
        if (response.equals("Quantity cannot be negative") ||
            response.equals("Quantity cannot be zero") ||
            response.equals("Insufficient cash balance") ||
            response.equals("Insufficient holdings") ||
            response.startsWith("FMTS error")) {
            return ResponseEntity.badRequest().body(response);
        }
        // Return the response as JSON string
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{clientId}")
    public ResponseEntity<TradeHistoryResponseDto> getTradeHistory(@PathVariable String clientId) {
        TradeHistoryResponseDto tradeHistory = tradeService.getTradeHistoryByClientId(clientId);
        return ResponseEntity.ok(tradeHistory);
    }
}
