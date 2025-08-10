package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SolarPotentialResult {
    private BigDecimal solarPotential;      // Calculated solar potential value
    private BigDecimal shadingFactor;       // Applied shading factor
    private BigDecimal utilisationFactor;   // Applied utilisation factor
    private BigDecimal tiltOrientationFactor; // Applied tilt and orientation factor
    private Integer solarPanelCount;        // Estimated number of solar panels that can be installed
} 