package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ElectricityDemandRequest {
    
    // Case 1: User knows monthly electricity usage
    private Map<Integer, Double> monthlyElectricityUsage;  // Month (1-12) -> kWh
    
    // Case 2: User knows annual electricity usage but not monthly breakdown
    private Double annualElectricityUsage;  // Total annual kWh
    private Boolean hasHeatPump;  // Whether the household uses heat pump
    
    // Case 3: User doesn't know usage - will be estimated (to be implemented later)
    private Boolean needsEstimation;
    
    // Additional information for estimation (for future implementation)
    private String propertyType;  // e.g., "detached", "semi-detached", "flat"
    private Integer bedrooms;     // Number of bedrooms
    private Integer occupants;    // Number of people living in the house
    private String heatingType;   // e.g., "gas", "electric", "heat-pump"
    private String insulationLevel; // e.g., "poor", "average", "good", "excellent"
    
    // Hot water system information
    private String hotWaterType;  // "heat-pump", "gas-boiler", "electricity"
    private Integer heatPumpId;   // ID of heat pump if using heat pump for hot water
    
    // Space heating calculation parameters
    private Double houseArea;     // House area in m²
    private String buildYear;     // e.g., "before-1930", "1930-1980", "1981-2002", "after-2003"
    private String wallType;      // e.g., "brick", "cavity", "stone", "modern"
    private String windowType;    // e.g., "single", "double", "triple", "terraced"
    private String roofInsulation; // e.g., "yes", "no" (affects roof insulation factor)
    private String floorInsulation; // e.g., "yes", "no" (affects floor insulation factor)
    private String houseType;     // e.g., "semi-detached", "detached"
    private String epcRating;     // e.g., "A", "B", "C", "D", "E", "F", "G"
    
    // Location information (may affect demand patterns)
    private Double latitude;
    private Double longitude;
    private String location;
} 