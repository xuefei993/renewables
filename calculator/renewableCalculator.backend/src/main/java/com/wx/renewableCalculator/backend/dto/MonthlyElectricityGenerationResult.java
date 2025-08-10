package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MonthlyElectricityGenerationResult {
    private BigDecimal monthlyElectricityGeneration;  // Monthly electricity generation in kWh
    private BigDecimal totalInstalledCapacity;  // Total Installed Capacity used in calculation
    private BigDecimal locationSpecificYieldPerMonth;  // Location Specific Yield Per Month used
    private BigDecimal tiltOrientationCorrectionFactor;  // Tilt and Orientation Correction Factor
    private BigDecimal shadingCorrectionFactor;  // Shading Correction Factor
} 