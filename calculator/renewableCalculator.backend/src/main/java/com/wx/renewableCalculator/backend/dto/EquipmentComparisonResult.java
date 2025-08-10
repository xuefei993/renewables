package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentComparisonResult {
    
    private List<EquipmentOption> solarPanelOptions;
    private List<EquipmentOption> heatPumpOptions;
    private List<EquipmentOption> batteryOptions;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipmentOption {
        
        // Equipment basic info
        private Long equipmentId;
        private String equipmentName;
        private String manufacturer;
        private String equipmentType;        // "solar", "heatpump", "battery"
        
        // Technical specifications
        private Map<String, Object> specifications;  // Flexible specs (power, capacity, etc.)
        
        // Financial data
        private Double installationCost;     // Total installation cost (£)
        private Double equipmentCost;        // Equipment cost only (£)
        
        // Annual performance data
        private Double annualGeneration;     // Annual generation/output (kWh)
        private Double annualCostSavings;    // Annual cost savings (£)
        private Double annualExportRevenue;  // Annual export revenue (£)
        private Double annualDirectCO2Savings;    // Annual direct CO2 savings (kg)
        private Double annualIndirectCO2Savings;  // Annual indirect CO2 savings (kg)
        private Double annualTotalCO2Savings;     // Total CO2 savings (kg)
        
        // Monthly breakdown data (for charts)
        private List<Double> monthlyGeneration;      // 12 months of generation data
        private List<Double> monthlyCostSavings;     // 12 months of cost savings
        private List<Double> monthlyExportRevenue;   // 12 months of export revenue
        private List<Double> monthlyDirectCO2Savings;   // 12 months of direct CO2 savings
        private List<Double> monthlyIndirectCO2Savings; // 12 months of indirect CO2 savings
        
        // Performance metrics
        private Double paybackPeriodYears;   // Simple payback period
        private Double roi10Years;           // 10-year ROI percentage
        private Double efficiency;           // Equipment efficiency (%)
        
        // Installation details
        private Integer recommendedQuantity; // Recommended number of units
        private Double totalSystemCapacity;  // Total system capacity (kW or kWh)
        
        // Suitability score (0-100)
        private Double suitabilityScore;     // How suitable for this property
        private String suitabilityReason;    // Explanation of suitability
    }
    
    // System combination recommendations
    private List<SystemCombination> recommendedCombinations;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemCombination {
        private String combinationName;
        private List<Long> includedEquipmentIds;
        private Double totalInstallationCost;
        private Double totalAnnualSavings;
        private Double totalAnnualCO2Savings;
        private Double combinedPaybackPeriod;
        private Double combinedROI;
        private String recommendation;       // Why this combination is recommended
    }
} 