package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.SolarInstallationCostRequest;
import com.wx.renewableCalculator.backend.dto.SolarInstallationCostResult;
import com.wx.renewableCalculator.backend.service.SolarInstallationCostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solar")
@CrossOrigin(origins = "http://localhost:3000")
public class SolarInstallationCostController {
    
    @Autowired
    private SolarInstallationCostService solarInstallationCostService;
    
    /**
     * Calculate solar panel installation cost based on system size
     * 
     * @param request Contains system size in kW
     * @return Installation cost calculation result with min, max, and average costs
     */
    @PostMapping("/installation-cost")
    public ResponseEntity<SolarInstallationCostResult> calculateInstallationCost(
            @RequestBody SolarInstallationCostRequest request) {
        
        try {
            SolarInstallationCostResult result = solarInstallationCostService.calculateInstallationCost(request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get installation cost for a specific system size (GET endpoint for quick access)
     * 
     * @param systemSizeKw System size in kW
     * @return Installation cost calculation result
     */
    @GetMapping("/installation-cost/{systemSizeKw}")
    public ResponseEntity<SolarInstallationCostResult> getInstallationCost(
            @PathVariable Double systemSizeKw) {
        
        try {
            SolarInstallationCostRequest request = new SolarInstallationCostRequest(systemSizeKw);
            SolarInstallationCostResult result = solarInstallationCostService.calculateInstallationCost(request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 