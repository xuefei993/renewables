package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentComparisonRequest {
    
    // Selected equipment types
    private Boolean hasSolarPanels;
    private Boolean hasHeatPump;
    private Boolean hasBattery;
    
    // Specific equipment IDs for comparison
    private List<Long> solarPanelTypeIds;    // Multiple solar panel types to compare
    private List<Long> heatPumpTypeIds;      // Multiple heat pump types to compare  
    private List<Long> batteryIds;           // Multiple battery types to compare
    
    // User property parameters for calculations
    private Double houseArea;                // m²
    private Integer occupants;
    private Double roofArea;                 // Total roof area for solar installation
    private Double latitude;
    private Double longitude;
    
    // Energy consumption data
    private Double annualElectricityUsageKwh;
    private Double annualGasUsageKwh;
    private Double monthlyElectricityUsageKwh;  // For SCR calculation
    private Double homeOccupancyFactor;         // 0-1, for self-consumption rate
    
    // Tariff information
    private Double electricityRate;         // pence/kWh
    private Double gasRate;                // pence/kWh
    private Double exportRate;             // pence/kWh for solar export
    private Double peakElectricityRate;    // For battery calculations
    private Double offPeakElectricityRate;
    
    // Installation factors
    private Double solarInstallationComplexity; // 1.0 = standard, 1.5 = complex
    private Double heatPumpInstallationComplexity;
    private Double batteryInstallationComplexity;
} 