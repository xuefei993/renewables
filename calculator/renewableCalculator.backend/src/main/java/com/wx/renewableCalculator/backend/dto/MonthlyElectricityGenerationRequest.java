package com.wx.renewableCalculator.backend.dto;

import lombok.Data;

@Data
public class MonthlyElectricityGenerationRequest {
    private Integer totalInstalledCapacity;  // Total Installed Capacity (kW)
    private Double locationSpecificYieldPerMonth;  // Location Specific Yield Per Month (kWh/kWp)
    private Integer tiltAngle;  // Tilt angle in degrees
    private String orientation;  // Roof orientation (e.g., 's', 'sw', 'n')
    private String shadingLevel;  // Shading level (e.g., 'no-shading', 'light', etc.)
} 