package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubsidyCheckRequest {
    
    // Equipment selection
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    
    // Property details
    private String houseType;           // DETACHED, SEMI_DETACHED, etc.
    private String epcRating;           // A, B, C, D, E, F, G
    private String regionCode;          // UK region code
    private String postcode;            // For region determination
    
    // Financial details
    private Double annualIncome;        // For means-tested subsidies
    
    // System specifications
    private Double solarCapacityKw;     // Solar system capacity
    private Double heatPumpCapacityKw;  // Heat pump capacity
    private Double batteryCapacityKwh;  // Battery capacity
    
    // Installation costs (to calculate percentage-based subsidies)
    private Double totalInstallationCost;
    private Double solarInstallationCost;
    private Double heatPumpInstallationCost;
    private Double batteryInstallationCost;
} 