package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class GasDemandResult {

    // Monthly gas demand (month 1-12 -> kWh or cubic meters)
    private Map<Integer, BigDecimal> monthlyGasDemand;

    // Total annual gas demand
    private BigDecimal annualGasDemand;

    // Calculation method used
    private String calculationMethod;  // "user_monthly", "user_annual_distributed", "estimated"

    // Monthly proportions used (for reference when distributing annual usage)
    private Map<Integer, BigDecimal> monthlyProportions;

    // Additional calculation details
    private String description;

    // Peak demand information
    private BigDecimal peakMonthDemand;
    private Integer peakMonth;

    private BigDecimal lowMonthDemand;
    private Integer lowMonth;

    // Components breakdown for estimation method
    private BigDecimal spaceHeatingComponent;  // Space heating portion (85%)
    private BigDecimal hotWaterComponent;      // Hot water portion (15%)
} 