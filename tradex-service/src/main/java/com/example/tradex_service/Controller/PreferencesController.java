package com.example.tradex_service.Controller;

import com.example.tradex_service.DTO.Request.PreferencesRequestDTO;
import com.example.tradex_service.Models.Preferences;
import com.example.tradex_service.Service.PreferencesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/preferences")
public class PreferencesController {

    private final PreferencesService preferencesService;

    public PreferencesController(PreferencesService preferencesService) {
        this.preferencesService = preferencesService;
    }

    // ----------------- Save (POST) -----------------
    @PostMapping("/save/{clientId}")
    public ResponseEntity<Map<String, Object>> savePreferences(@PathVariable String clientId,
                                                               @RequestBody PreferencesRequestDTO dto) {
        Preferences prefs = mapDtoToPreferences(clientId, dto);
        preferencesService.savePreferences(prefs);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Preferences saved.");
        return ResponseEntity.ok(response);
    }

    // ----------------- Update (PUT) -----------------
    @PutMapping("/update/{clientId}")
    public ResponseEntity<Map<String, Object>> updatePreferences(@PathVariable String clientId,
                                                                 @RequestBody PreferencesRequestDTO dto) {
        Preferences prefs = mapDtoToPreferences(clientId, dto);
        preferencesService.updatePreferences(prefs);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Preferences updated.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<Preferences> getPreferences(@PathVariable String clientId) {
        Preferences prefs = preferencesService.getPreferences(clientId);
        if (prefs == null) {
            return ResponseEntity.ok(new Preferences()); // or return empty/default prefs
        }
        return ResponseEntity.ok(prefs);
    }


    // ----------------- Helper method -----------------
    private Preferences mapDtoToPreferences(String clientId, PreferencesRequestDTO dto) {
        Preferences prefs = new Preferences();
        prefs.setClientId(clientId);

        // ✅ Directly set strings and boolean
        prefs.setPurpose(dto.getPurpose());       // string
        prefs.setRisk(dto.getRisk());             // string
        prefs.setIncome(dto.getIncome());         // string
        prefs.setLength(dto.getLength());         // string
        prefs.setRoboAdvisor(dto.isRoboAdvisor()); // boolean

        return prefs;
    }
}
