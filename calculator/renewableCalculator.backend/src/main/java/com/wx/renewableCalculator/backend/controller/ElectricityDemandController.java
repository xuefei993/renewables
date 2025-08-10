package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest;
import com.wx.renewableCalculator.backend.dto.ElectricityDemandResult;
import com.wx.renewableCalculator.backend.service.EnergyDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/electricity-demand")
@CrossOrigin(origins = "http://localhost:3000")
public class ElectricityDemandController {

    @Autowired
    private EnergyDemandService energyDemandService;

    /**
     * Calculate monthly electricity demand
     * POST /api/electricity-demand/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<ElectricityDemandResult> calculateElectricityDemand(
            @RequestBody ElectricityDemandRequest request) {

        try {
            ElectricityDemandResult result = energyDemandService.calculateElectricityDemand(request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly proportion patterns for reference
     * GET /api/electricity-demand/proportions
     */
    @GetMapping("/proportions")
    public ResponseEntity<Map<String, double[]>> getMonthlyProportions() {
        Map<String, double[]> proportions = energyDemandService.getMonthlyProportions();
        return ResponseEntity.ok(proportions);
    }

    /**
     * Validate monthly electricity usage input
     * POST /api/electricity-demand/validate-monthly
     */
    @PostMapping("/validate-monthly")
    public ResponseEntity<Map<String, Object>> validateMonthlyInput(
            @RequestBody Map<Integer, Double> monthlyUsage) {
        
        boolean isValid = energyDemandService.validateMonthlyInput(monthlyUsage);
        
        return ResponseEntity.ok(Map.of(
            "valid", isValid,
            "message", isValid ? "Monthly usage input is valid" : "Monthly usage input is invalid or incomplete"
        ));
    }
} 