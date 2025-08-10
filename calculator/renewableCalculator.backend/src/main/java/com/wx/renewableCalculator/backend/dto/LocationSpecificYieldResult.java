package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class LocationSpecificYieldResult {
    private Double latitude;
    private Double longitude;
    private String location;
    
    // Monthly data: month (1-12) -> yield value
    private Map<Integer, BigDecimal> monthlyYield;  // Location Specific Yield Per Month (kWh/kWp)
    private Map<Integer, BigDecimal> monthlySolarIrradiance;  // Daily solar irradiance per month (kWh/m²/day)
    private Map<Integer, Integer> daysInMonth;  // Days in each month
    
    private BigDecimal averageYearlyYield;  // Average monthly yield over the year
} 