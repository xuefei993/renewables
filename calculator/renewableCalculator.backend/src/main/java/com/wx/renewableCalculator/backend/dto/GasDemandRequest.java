package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class GasDemandRequest {

    // Case 1: User knows monthly gas usage
    private Map<Integer, Double> monthlyGasUsage;  // Month (1-12) -> kWh or cubic meters

    // Case 2: User knows annual gas usage but not monthly breakdown
    private Double annualGasUsage;  // Total annual gas usage

    // Case 3: User doesn't know usage - will be estimated using space heating + hot water demand
    private Boolean needsEstimation;

    // Estimation parameters (reuse from electricity demand)
    private Integer occupants;    // Number of people living in the house
    private String hotWaterType;  // "heat-pump", "gas-boiler", "electricity"
    private String heatingType;   // e.g., "gas", "electric", "heat-pump"
    
    // Space heating calculation parameters
    private Double houseArea;     // House area in m²
    private String buildYear;     // e.g., "before-1930", "1930-1980", "1981-2002", "after-2003"
    private String wallType;      // e.g., "brick", "cavity", "stone", "modern"
    private String windowType;    // e.g., "single", "double", "triple", "terraced"
    private String roofInsulation; // e.g., "yes", "no"
    private String floorInsulation; // e.g., "yes", "no"
    private String houseType;     // e.g., "semi-detached", "detached"
    private String epcRating;     // e.g., "A", "B", "C", "D", "E", "F", "G"

    // Location information (may affect demand patterns)
    private Double latitude;
    private Double longitude;
    private String location;
} 