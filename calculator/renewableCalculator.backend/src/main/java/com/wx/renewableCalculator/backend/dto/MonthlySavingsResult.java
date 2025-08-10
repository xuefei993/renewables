package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySavingsResult {
    
    // Total monthly savings
    private Double totalMonthlySavings;       // Stm (pence)
    
    // Individual equipment savings
    private Double solarSavings;              // Ssolar,m (pence)
    private Double heatPumpSavings;           // Sheat pump,m (pence)
    private Double batterySavings;            // Sbattery,m (pence)
    private Double supportEquipmentSavings;   // Ssupport,m (pence)
    
    // Solar-specific calculations
    private Double selfConsumptionRate;       // SCRm (%)
    private Double solarSelfConsumedKwh;      // Self-consumed solar energy
    private Double solarExportedKwh;          // Exported solar energy
    private Double solarSelfConsumptionSavings; // Savings from self-consumption
    private Double solarExportSavings;        // Savings from export
    
    // Heat pump calculations
    private Double gasReplacedKwh;            // Gas consumption replaced by heat pump
    private Double heatPumpElectricityUsedKwh; // Electricity used by heat pump
    private Double netHeatPumpSavings;        // Net savings after electricity cost
    
    // Battery calculations
    private Double batteryStoredEnergyKwh;    // Energy stored in battery
    private Double peakShiftingSavings;       // Savings from peak shifting
    
    // Equipment status
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    private Boolean hasSupportEquipment;
    
    // Calculation parameters used
    private Integer month;
    private Double homeOccupancyFactor;
} 