package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarbonSavingsRequest {
    
    // Equipment selection flags
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    
    // Gas consumption (for direct emissions)
    private Double gasConsumptionKwh;           // Egas - Monthly gas consumption (kWh)
    
    // Electricity consumption (for indirect emissions)
    private Double totalElectricityDemandKwh;   // Etotal - Total electricity demand before upgrade (kWh)
    
    // Solar energy parameters
    private Double solarSelfConsumedKwh;        // Esolar,cm - Solar self-consumed energy (kWh)
    
    // Heat pump parameters
    private Double heatPumpElectricitySavedKwh; // Eheat_pump - Electricity saved by heat pump (kWh)
    private Double hotWaterHeatPumpUsageKwh;    // Dhot_water - Hot water heat pump electricity usage (kWh)
    private Double heatingHeatPumpUsageKwh;     // Dheating,m - Heating heat pump electricity usage (kWh)
    
    // Month (1-12) for reporting
    private Integer month;
    
    // Optional: specific emission factors (use defaults if not provided)
    private Double gasEmissionFactor;           // Default: 0.183 kgCO₂/kWh
    private Double electricityEmissionFactor;   // Default: 0.148 kgCO₂/kWh
} 