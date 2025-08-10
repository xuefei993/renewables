package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarbonSavingsResult {
    
    // Total carbon savings
    private Double totalCarbonSavingsKgCO2;      // Total monthly carbon savings (kgCO₂)
    
    // Direct emissions (Scope 1)
    private Double directEmissionsSavingsKgCO2;  // CSdirect,save (kgCO₂)
    private Double gasConsumptionReplacedKwh;    // Gas consumption replaced by heat pump
    
    // Indirect emissions (Scope 2) - Before upgrade
    private Double indirectEmissionsBeforeKgCO2; // CSbefore (kgCO₂)
    private Double totalElectricityBeforeKwh;    // Total electricity demand before upgrade
    
    // Indirect emissions (Scope 2) - After upgrade
    private Double indirectEmissionsAfterKgCO2;  // CSindirect,after (kgCO₂)
    private Double totalElectricityAfterKwh;     // Total electricity demand after upgrade
    
    // Indirect emissions savings
    private Double indirectEmissionsSavingsKgCO2; // Before - After
    
    // Breakdown of electricity changes
    private Double solarSelfConsumedKwh;         // Solar energy self-consumed
    private Double heatPumpElectricitySavedKwh;  // Electricity saved by replacing gas heating
    private Double hotWaterHeatPumpUsageKwh;     // Additional electricity for hot water heat pump
    private Double heatingHeatPumpUsageKwh;      // Additional electricity for heating heat pump
    
    // Equipment status
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    
    // Calculation parameters used
    private Integer month;
    private Double gasEmissionFactor;            // kgCO₂/kWh for gas
    private Double electricityEmissionFactor;    // kgCO₂/kWh for electricity
    
    // Percentage reduction
    private Double carbonReductionPercentage;    // Total carbon reduction as percentage
} 