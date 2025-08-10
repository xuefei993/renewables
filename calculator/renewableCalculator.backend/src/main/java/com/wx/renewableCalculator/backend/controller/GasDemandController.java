package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.GasDemandRequest;
import com.wx.renewableCalculator.backend.dto.GasDemandResult;
import com.wx.renewableCalculator.backend.service.GasDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gas-demand")
@CrossOrigin(origins = "http://localhost:3000")
public class GasDemandController {

    @Autowired
    private GasDemandService gasDemandService;

    /**
     * Calculate monthly gas demand
     * POST /api/gas-demand/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<GasDemandResult> calculateGasDemand(
            @RequestBody GasDemandRequest request) {

        try {
            GasDemandResult result = gasDemandService.calculateGasDemand(request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly proportion patterns for reference
     * GET /api/gas-demand/proportions
     */
    @GetMapping("/proportions")
    public ResponseEntity<Map<String, double[]>> getGasMonthlyProportions() {
        Map<String, double[]> proportions = gasDemandService.getGasMonthlyProportions();
        return ResponseEntity.ok(proportions);
    }

    /**
     * Validate monthly gas usage input
     * POST /api/gas-demand/validate-monthly
     */
    @PostMapping("/validate-monthly")
    public ResponseEntity<Map<String, Object>> validateMonthlyInput(
            @RequestBody Map<Integer, Double> monthlyUsage) {

        boolean isValid = gasDemandService.validateMonthlyInput(monthlyUsage);

        return ResponseEntity.ok(Map.of(
            "valid", isValid,
            "message", isValid ? "Monthly gas usage input is valid" : "Monthly gas usage input is invalid or incomplete"
        ));
    }
} 