package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySavingsRequest {
    
    // Equipment selection flags
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    private Boolean hasSupportEquipment;
    
    // Solar panel parameters
    private Double solarGenerationKwh;        // Monthly solar generation
    private Double electricityRate;           // Electricity rate (pence/kWh)
    private Double exportRate;                // Export rate for excess electricity
    
    // Self-consumption parameters
    private Double homeOccupancyFactor;       // s: 0=away, 0.5=half day, 1=most day
    private Double monthlyElectricityUsageKwh; // Monthly electricity consumption
    
    // Heat pump parameters
    private Double gasConsumptionKwh;         // Monthly gas consumption to replace
    private Double gasRate;                   // Gas rate (pence/kWh)
    private Double heatPumpCop;               // Heat pump COP
    
    // Battery parameters
    private Double batteryCapacityKwh;        // Battery capacity
    private Double peakElectricityRate;       // Peak rate (pence/kWh)
    private Double offPeakElectricityRate;    // Off-peak rate (pence/kWh)
    
    // Support equipment (if any)
    private Double supportEquipmentSavings;   // Any additional savings
    
    // Month (1-12) for seasonal adjustments
    private Integer month;
} 