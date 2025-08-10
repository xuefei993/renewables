package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarInstallationCostRequest {
    
    private Double systemSizeKw;  // System size (rated power of solar panels) in kW
    
} 