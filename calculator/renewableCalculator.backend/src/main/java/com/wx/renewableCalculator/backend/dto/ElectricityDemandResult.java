package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class ElectricityDemandResult {
    
    // Monthly electricity demand (month 1-12 -> kWh)
    private Map<Integer, BigDecimal> monthlyElectricityDemand;
    
    // Total annual electricity demand
    private BigDecimal annualElectricityDemand;
    
    // Calculation method used
    private String calculationMethod;  // "user_monthly", "user_annual_distributed", "estimated"
    
    // Whether heat pump proportions were used (for annual distribution)
    private Boolean usedHeatPumpProportions;
    
    // Monthly proportions used (for reference when distributing annual usage)
    private Map<Integer, BigDecimal> monthlyProportions;
    
    // Additional calculation details
    private String description;
    
    // Peak demand information
    private BigDecimal peakMonthDemand;
    private Integer peakMonth;
    
    private BigDecimal lowMonthDemand;
    private Integer lowMonth;
} 