package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.SubsidyCheckRequest;
import com.wx.renewableCalculator.backend.dto.SubsidyCheckResult;
import com.wx.renewableCalculator.backend.service.SubsidyCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subsidies")
@CrossOrigin(origins = "http://localhost:3000")
public class SubsidyController {
    
    @Autowired
    private SubsidyCalculationService subsidyCalculationService;
    
    /**
     * Check available subsidies for user's configuration
     */
    @PostMapping("/check")
    public ResponseEntity<SubsidyCheckResult> checkSubsidies(@RequestBody SubsidyCheckRequest request) {
        try {
            SubsidyCheckResult result = subsidyCalculationService.checkAvailableSubsidies(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Log the error (in a real application)
            System.err.println("Error checking subsidies: " + e.getMessage());
            e.printStackTrace();
            
            // Return empty result instead of error
            SubsidyCheckResult emptyResult = new SubsidyCheckResult();
            emptyResult.setAvailableSubsidies(java.util.Collections.emptyList());
            emptyResult.setTotalPotentialSavings(java.math.BigDecimal.ZERO);
            emptyResult.setRecommendationSummary("Unable to check subsidies at this time. Please try again later.");
            
            return ResponseEntity.ok(emptyResult);
        }
    }
    
    /**
     * Get a quick subsidy estimate based on basic parameters
     */
    @GetMapping("/quick-check")
    public ResponseEntity<SubsidyCheckResult> quickCheck(
            @RequestParam(required = false) Boolean hasSolarPanels,
            @RequestParam(required = false) Boolean hasHeatPump,
            @RequestParam(required = false) Boolean hasBattery,
            @RequestParam(required = false) String houseType,
            @RequestParam(required = false) String epcRating,
            @RequestParam(required = false) Double totalCost
    ) {
        SubsidyCheckRequest request = new SubsidyCheckRequest();
        request.setHasSolarPanels(hasSolarPanels);
        request.setHasHeatPump(hasHeatPump);
        request.setHasBattery(hasBattery);
        request.setHouseType(houseType);
        request.setEpcRating(epcRating);
        request.setTotalInstallationCost(totalCost);
        request.setRegionCode("UK"); // Default to UK-wide subsidies
        
        return checkSubsidies(request);
    }
} 