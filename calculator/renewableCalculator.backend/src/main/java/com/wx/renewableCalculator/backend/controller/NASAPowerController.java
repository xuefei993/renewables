package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.service.NASAPowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nasa-power")
@CrossOrigin(origins = "http://localhost:3000")
public class NASAPowerController {

    @Autowired
    private NASAPowerService nasaPowerService;

    /**
     * Fetch solar irradiance data from NASA POWER API
     * POST /api/nasa-power/solar-data
     */
    @PostMapping("/solar-data")
    public ResponseEntity<Map<String, Object>> fetchSolarData(@RequestBody Map<String, Object> request) {
        Double latitude = ((Number) request.get("latitude")).doubleValue();
        Double longitude = ((Number) request.get("longitude")).doubleValue();
        String location = (String) request.getOrDefault("location", "");
        
        Map<String, Object> result = nasaPowerService.fetchAndStoreSolarData(latitude, longitude, location);
        
        return ResponseEntity.ok(result);
    }

    /**
     * Fetch solar irradiance data from NASA POWER API (GET method for convenience)
     * GET /api/nasa-power/solar-data?latitude={lat}&longitude={lng}&location={loc}
     */
    @GetMapping("/solar-data")
    public ResponseEntity<Map<String, Object>> fetchSolarDataGet(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false, defaultValue = "") String location) {
        
        Map<String, Object> result = nasaPowerService.fetchAndStoreSolarData(latitude, longitude, location);
        
        return ResponseEntity.ok(result);
    }
} 