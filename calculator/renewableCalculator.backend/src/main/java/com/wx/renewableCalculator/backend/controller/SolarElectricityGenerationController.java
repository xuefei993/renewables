package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.MonthlyElectricityGenerationRequest;
import com.wx.renewableCalculator.backend.dto.MonthlyElectricityGenerationResult;
import com.wx.renewableCalculator.backend.service.SolarElectricityGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solar-generation")
@CrossOrigin(origins = "http://localhost:3000")
public class SolarElectricityGenerationController {

    @Autowired
    private SolarElectricityGenerationService solarElectricityGenerationService;

    /**
     * Calculate monthly electricity generation
     * POST /api/solar-generation/monthly
     */
    @PostMapping("/monthly")
    public ResponseEntity<MonthlyElectricityGenerationResult> calculateMonthlyElectricityGeneration(
            @RequestBody MonthlyElectricityGenerationRequest request) {
        
        MonthlyElectricityGenerationResult result = solarElectricityGenerationService
                .calculateMonthlyElectricityGeneration(request);
        
        return ResponseEntity.ok(result);
    }
} 