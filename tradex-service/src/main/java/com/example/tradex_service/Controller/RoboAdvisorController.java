 
package com.example.tradex_service.Controller;
import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.Service.GeminiService;
import com.example.tradex_service.Service.PreferencesService;
import com.example.tradex_service.DTO.Response.RoboAdvisorResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/robo-advisor")
public class RoboAdvisorController {
    private final GeminiService geminiService;
    private final PreferencesService preferencesService;
    public RoboAdvisorController(GeminiService geminiService, PreferencesService preferencesService) {
        this.geminiService = geminiService;
        this.preferencesService = preferencesService;
    }
    @GetMapping("/recommendations/{clientId}")
    public ResponseEntity<RoboAdvisorResponseDTO> getStockRecommendations(@PathVariable String clientId) {
        try {
            // Get client preferences
            Preferences preferences = preferencesService.getPreferences(clientId);
            if (preferences == null) {
                RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
                errorResponse.setClientId(clientId);
                errorResponse.setSuccess(false);
                errorResponse.setMessage("Client preferences not found. Please set your preferences first.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            // Check if robo advisor is enabled
            if (!preferences.isRoboAdvisor()) {
                RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
                errorResponse.setClientId(clientId);
                errorResponse.setSuccess(false);
                errorResponse.setMessage("Robo advisor is not enabled for this client.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            RoboAdvisorResponseDTO response = geminiService.getStockRecommendations(preferences, clientId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
            errorResponse.setClientId(clientId);
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error generating recommendations: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    @GetMapping("/portfolio-analysis/{clientId}")
    public ResponseEntity<RoboAdvisorResponseDTO> getPortfolioAnalysis(@PathVariable String clientId) {
        try {
            Preferences preferences = preferencesService.getPreferences(clientId);
            if (preferences == null) {
                RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
                errorResponse.setClientId(clientId);
                errorResponse.setSuccess(false);
                errorResponse.setMessage("Client preferences not found.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            RoboAdvisorResponseDTO response = geminiService.getPortfolioAnalysis(preferences, clientId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
            errorResponse.setClientId(clientId);
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error generating portfolio analysis: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    @GetMapping("/market-insights/{clientId}")
    public ResponseEntity<RoboAdvisorResponseDTO> getMarketInsights(@PathVariable String clientId) {
        try {
            Preferences preferences = preferencesService.getPreferences(clientId);
            if (preferences == null) {
                RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
                errorResponse.setClientId(clientId);
                errorResponse.setSuccess(false);
                errorResponse.setMessage("Client preferences not found.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            RoboAdvisorResponseDTO response = geminiService.getMarketInsights(preferences, clientId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            RoboAdvisorResponseDTO errorResponse = new RoboAdvisorResponseDTO();
            errorResponse.setClientId(clientId);
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error generating market insights: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
 
 