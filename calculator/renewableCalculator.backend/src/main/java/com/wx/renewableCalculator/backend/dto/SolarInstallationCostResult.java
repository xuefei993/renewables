package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarInstallationCostResult {
    
    private Double systemSizeKw;        // Input system size in kW
    private Double minimumCost;         // Minimum installation cost (£)
    private Double maximumCost;         // Maximum installation cost (£)
    private Double averageCost;         // Average of min and max cost (£)
    
} 