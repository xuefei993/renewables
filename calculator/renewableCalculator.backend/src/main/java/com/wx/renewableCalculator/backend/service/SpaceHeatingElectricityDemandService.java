package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest;
import com.wx.renewableCalculator.backend.entity.HeatPump;
import com.wx.renewableCalculator.backend.repository.HeatPumpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service for calculating space heating electricity demand using thermodynamic approach
 * New calculation method: 
 * 1. Calculate heat loss coefficients per unit floor area (Ufabric + Hv)
 * 2. Calculate monthly heat loss using temperature differences
 * 3. Subtract internal and solar gains (15 kWh/m²·yr)
 * 4. Calculate electricity demand based on heating method
 */
@Service
public class SpaceHeatingElectricityDemandService {

    @Autowired
    private HeatPumpRepository heatPumpRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Building component U-values (W/m²·K) and area weights from Table 1
    private static final Map<String, Double> WALL_U_VALUES = new HashMap<>();
    private static final Map<String, Double> WALL_WEIGHTS = new HashMap<>();
    static {
        WALL_U_VALUES.put("brick", 2.0);
        WALL_U_VALUES.put("cavity-uninsulated", 1.5);  // Cavity (has no insulation)
        WALL_U_VALUES.put("cavity-insulated", 0.5);    // Cavity (has insulation)
        WALL_U_VALUES.put("cavity", 1.5);              // Fallback for old data
        WALL_U_VALUES.put("stone", 1.7);
        WALL_U_VALUES.put("modern", 0.3);
        
        // All wall types have the same weight
        WALL_WEIGHTS.put("brick", 0.3);
        WALL_WEIGHTS.put("cavity-uninsulated", 0.3);
        WALL_WEIGHTS.put("cavity-insulated", 0.3);
        WALL_WEIGHTS.put("cavity", 0.3);
        WALL_WEIGHTS.put("stone", 0.3);
        WALL_WEIGHTS.put("modern", 0.3);
    }

    private static final Map<String, Double> WINDOW_U_VALUES = new HashMap<>();
    private static final Map<String, Double> WINDOW_WEIGHTS = new HashMap<>();
    static {
        WINDOW_U_VALUES.put("single", 5.0);
        WINDOW_U_VALUES.put("double", 2.8);
        WINDOW_U_VALUES.put("triple", 1.0);
        
        // All window types have the same weight
        WINDOW_WEIGHTS.put("single", 0.15);
        WINDOW_WEIGHTS.put("double", 0.15);
        WINDOW_WEIGHTS.put("triple", 0.15);
    }

    private static final Map<String, Double> ROOF_U_VALUES = new HashMap<>();
    private static final Map<String, Double> ROOF_WEIGHTS = new HashMap<>();
    static {
        ROOF_U_VALUES.put("yes", 0.2);  // With insulation
        ROOF_U_VALUES.put("no", 0.6);   // Without insulation
        
        // All roof types have the same weight
        ROOF_WEIGHTS.put("yes", 0.2);
        ROOF_WEIGHTS.put("no", 0.2);
    }

    private static final Map<String, Double> FLOOR_U_VALUES = new HashMap<>();
    private static final Map<String, Double> FLOOR_WEIGHTS = new HashMap<>();
    static {
        FLOOR_U_VALUES.put("yes", 0.13);    // With insulation
        FLOOR_U_VALUES.put("no", 0.6);      // Without insulation
        FLOOR_U_VALUES.put("modern", 0.18); // Modern
        
        // All floor types have the same weight
        FLOOR_WEIGHTS.put("yes", 0.2);
        FLOOR_WEIGHTS.put("no", 0.2);
        FLOOR_WEIGHTS.put("modern", 0.2);
    }

    // Shape factors by house type (φshape)
    private static final Map<String, Double> SHAPE_FACTORS = new HashMap<>();
    static {
        SHAPE_FACTORS.put("detached", 1.0);
        SHAPE_FACTORS.put("semi-detached", 0.85);
        SHAPE_FACTORS.put("end-terraced", 0.80);
        SHAPE_FACTORS.put("terraced", 0.70);
    }

    // Air change rates by build year (h⁻¹)
    private static final Map<String, Double> AIR_CHANGE_RATES = new HashMap<>();
    static {
        AIR_CHANGE_RATES.put("before-1930", 0.9);
        AIR_CHANGE_RATES.put("1930-1980", 0.7);
        AIR_CHANGE_RATES.put("1981-2002", 0.55);
        AIR_CHANGE_RATES.put("after-2003", 0.45);
    }

    // Constants
    private static final double CEILING_HEIGHT = 2.4; // meters
    private static final double AIR_HEAT_CONSTANT = 0.33; // W/(m³·K) = ρ·c_p conversion
    private static final double INDOOR_TEMPERATURE = 20.0; // °C
    private static final double ANNUAL_INTERNAL_GAINS = 15.0; // kWh/m²·yr
    
    // Days in each month
    private static final int[] DAYS_IN_MONTH = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    /**
     * Calculate monthly space heating demand using new thermodynamic approach
     * @param request Electricity demand request with house parameters
     * @param latitude Latitude for weather data (from step 1)
     * @param longitude Longitude for weather data (from step 1)
     * @return Map of monthly space heating demand in kWh (month -> kWh)
     */
    public Map<Integer, Double> calculateMonthlySpaceHeatingDemand(ElectricityDemandRequest request, 
                                                                  Double latitude, Double longitude) {
        Map<Integer, Double> monthlyDemand = new HashMap<>();
        
        // Validate required parameters
        if (request.getHouseArea() == null || request.getHouseArea() <= 0) {
            for (int month = 1; month <= 12; month++) {
                monthlyDemand.put(month, 0.0);
            }
            return monthlyDemand;
        }
        
        try {
            // Get monthly outdoor temperatures
            Map<Integer, Double> monthlyTemperatures = getMonthlyTemperatures(latitude, longitude);
            
            // Calculate heat loss coefficient per unit floor area
            double heatLossCoefficient = calculateHeatLossCoefficient(request);
            
            // Calculate monthly space heating demand
            for (int month = 1; month <= 12; month++) {
                double outdoorTemp = monthlyTemperatures.getOrDefault(month, 5.0); // Default 5°C if not available
                double temperatureDifference = INDOOR_TEMPERATURE - outdoorTemp;
                
                // Skip heating if outdoor temperature is above indoor temperature
                if (temperatureDifference <= 0) {
                    monthlyDemand.put(month, 0.0);
                    continue;
                }
                
                // Calculate monthly heat loss per unit area (kWh/m²)
                double hoursInMonth = DAYS_IN_MONTH[month - 1] * 24.0;
                double monthlyHeatLossPerArea = heatLossCoefficient * temperatureDifference * hoursInMonth / 1000.0; // Convert W to kWh
                
                // Subtract monthly internal gains (15 kWh/m²·yr ÷ 12 months)
                double monthlyInternalGains = ANNUAL_INTERNAL_GAINS / 12.0;
                double netHeatLossPerArea = Math.max(0.0, monthlyHeatLossPerArea - monthlyInternalGains);
                
                // Calculate total monthly space heating demand for the house
                double monthlySpaceHeatingDemand = netHeatLossPerArea * request.getHouseArea();
                
                monthlyDemand.put(month, monthlySpaceHeatingDemand);
            }
            
            double annualDemand = monthlyDemand.values().stream().mapToDouble(Double::doubleValue).sum();
            System.out.println(String.format("New space heating calculation: Heat loss coefficient: %.3f W/m²·K, Annual demand: %.1f kWh", 
                heatLossCoefficient, annualDemand));
            
        } catch (Exception e) {
            System.err.println("Error in space heating calculation: " + e.getMessage());
            // Return zero demand if calculation fails
            for (int month = 1; month <= 12; month++) {
                monthlyDemand.put(month, 0.0);
            }
        }
        
        return monthlyDemand;
    }

    /**
     * Calculate Espace heating for all 12 months using new approach
     * @param request Electricity demand request  
     * @param latitude Latitude for weather data
     * @param longitude Longitude for weather data
     * @return Map of monthly space heating electricity demand in kWh (month -> kWh)
     */
    public Map<Integer, Double> calculateESpaceHeating(ElectricityDemandRequest request, 
                                                      Double latitude, Double longitude) {
        Map<Integer, Double> monthlyElectricityDemand = new HashMap<>();
        
        // Get monthly space heating demand
        Map<Integer, Double> monthlySpaceHeatingDemand = calculateMonthlySpaceHeatingDemand(request, latitude, longitude);
        
        String heatingType = request.getHeatingType();
        Double heatPumpCOP = getHeatPumpCOP(request, heatingType);
        
        // Calculate monthly electricity demand based on heating type
        for (int month = 1; month <= 12; month++) {
            double monthlySpaceHeatingDemandKWh = monthlySpaceHeatingDemand.getOrDefault(month, 0.0);
            
            double monthlyElectricityDemandKWh = calculateMonthlyElectricityDemand(
                monthlySpaceHeatingDemandKWh, heatingType, heatPumpCOP);
            
            monthlyElectricityDemand.put(month, monthlyElectricityDemandKWh);
        }
        
        return monthlyElectricityDemand;
    }

    /**
     * Calculate heat loss coefficient per unit floor area (W/m²·K)
     * Heat Loss = Ufabric + Hv
     * Ufabric = (∑Ui×ωi) × φshape
     * Hv = 0.33 × air change rate × height
     */
    private double calculateHeatLossCoefficient(ElectricityDemandRequest request) {
        // Calculate fabric heat loss coefficient (Ufabric)
        double wallU = WALL_U_VALUES.getOrDefault(request.getWallType(), 1.5); // Default cavity-uninsulated
        double wallWeight = WALL_WEIGHTS.getOrDefault(request.getWallType(), 0.3);
        
        double windowU = WINDOW_U_VALUES.getOrDefault(request.getWindowType(), 2.8); // Default double
        double windowWeight = WINDOW_WEIGHTS.getOrDefault(request.getWindowType(), 0.15);
        
        double roofU = ROOF_U_VALUES.getOrDefault(request.getRoofInsulation(), 0.6); // Default no insulation
        double roofWeight = ROOF_WEIGHTS.getOrDefault(request.getRoofInsulation(), 0.2);
        
        double floorU = FLOOR_U_VALUES.getOrDefault(request.getFloorInsulation(), 0.6); // Default no insulation
        double floorWeight = FLOOR_WEIGHTS.getOrDefault(request.getFloorInsulation(), 0.2);
        
        // Sum of U-values weighted by area factors
        double sumUiWi = (wallU * wallWeight) + (windowU * windowWeight) + (roofU * roofWeight) + (floorU * floorWeight);
        
        // Apply shape factor
        double shapeFactor = SHAPE_FACTORS.getOrDefault(request.getHouseType(), 0.85); // Default semi-detached
        double fabricLoss = sumUiWi * shapeFactor;
        
        // Calculate ventilation heat loss coefficient (Hv)
        double airChangeRate = AIR_CHANGE_RATES.getOrDefault(request.getBuildYear(), 0.55); // Default 1981-2002
        double ventilationLoss = AIR_HEAT_CONSTANT * airChangeRate * CEILING_HEIGHT;
        
        double totalHeatLoss = fabricLoss + ventilationLoss;
        
        System.out.println(String.format("Heat loss calculation: Ufabric=%.3f (%.1f×%.2f×%.2f), Hv=%.3f (%.2f×%.2f×%.1f), Total=%.3f W/m²·K",
            fabricLoss, sumUiWi, shapeFactor, 1.0, ventilationLoss, AIR_HEAT_CONSTANT, airChangeRate, CEILING_HEIGHT, totalHeatLoss));
        
        return totalHeatLoss;
    }

    /**
     * Get monthly outdoor temperatures from OpenMeteo API
     */
    private Map<Integer, Double> getMonthlyTemperatures(Double latitude, Double longitude) {
        Map<Integer, Double> monthlyTemps = new HashMap<>();
        
        try {
            String url = String.format(
                "https://archive-api.open-meteo.com/v1/archive?latitude=%.4f&longitude=%.4f" +
                "&start_date=2023-01-01&end_date=2023-12-31&daily=temperature_2m_mean&timezone=auto",
                latitude, longitude
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode dailyTemps = root.path("daily").path("temperature_2m_mean");
            
            // Calculate monthly averages
            double[] monthlySum = new double[12];
            int[] monthlyCounts = new int[12];
            
            for (int day = 0; day < dailyTemps.size(); day++) {
                double temp = dailyTemps.get(day).asDouble();
                int month = getDayMonth(day + 1); // day is 0-based, convert to 1-based
                monthlySum[month - 1] += temp;
                monthlyCounts[month - 1]++;
            }
            
            for (int month = 1; month <= 12; month++) {
                if (monthlyCounts[month - 1] > 0) {
                    monthlyTemps.put(month, monthlySum[month - 1] / monthlyCounts[month - 1]);
                } else {
                    monthlyTemps.put(month, 5.0); // Default temperature
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching weather data: " + e.getMessage());
            // Use default UK temperatures if API fails
            double[] defaultTemps = {4.0, 4.5, 7.0, 9.5, 13.0, 16.0, 18.0, 17.5, 15.0, 11.0, 7.5, 5.0};
            for (int month = 1; month <= 12; month++) {
                monthlyTemps.put(month, defaultTemps[month - 1]);
            }
        }
        
        return monthlyTemps;
    }

    /**
     * Convert day of year to month
     */
    private int getDayMonth(int dayOfYear) {
        int[] cumulativeDays = {31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
        for (int month = 0; month < 12; month++) {
            if (dayOfYear <= cumulativeDays[month]) {
                return month + 1;
            }
        }
        return 12;
    }

    /**
     * Get heat pump COP if using heat pump for space heating
     */
    private Double getHeatPumpCOP(ElectricityDemandRequest request, String heatingType) {
        if ("heat-pump".equals(heatingType) && request.getHeatPumpId() != null) {
            Optional<HeatPump> heatPumpOpt = heatPumpRepository.findById(request.getHeatPumpId());
            if (heatPumpOpt.isPresent()) {
                Double cop = heatPumpOpt.get().getCop().doubleValue();
                System.out.println(String.format("Space heating heat pump COP: %.2f", cop));
                return cop;
            } else {
                System.out.println("Heat pump not found for space heating, using default COP 3.0");
                return 3.0; // Default COP if heat pump not found
            }
        }
        return null;
    }

    /**
     * Calculate monthly electricity demand based on heating type (no monthly proportions used)
     */
    private double calculateMonthlyElectricityDemand(double monthlySpaceHeatingDemandKWh, 
                                                    String heatingType, Double heatPumpCOP) {
        if ("heat-pump".equals(heatingType) && heatPumpCOP != null) {
            // Espace heating = space heating demand / heat pump COP
            return monthlySpaceHeatingDemandKWh / heatPumpCOP;
        } else if ("gas".equals(heatingType) || "gas-boiler".equals(heatingType)) {
            // Espace heating = 0 (gas boiler doesn't use electricity for space heating)
            return 0.0;
        } else if ("electric".equals(heatingType) || "electricity".equals(heatingType)) {
            // Espace heating = space heating demand (direct electric heating)
            return monthlySpaceHeatingDemandKWh;
        } else {
            // Default: assume no electricity demand for space heating
            return 0.0;
        }
    }

    /**
     * Legacy method for backward compatibility - now calls new calculation with default coordinates
     */
    public Map<Integer, Double> calculateESpaceHeating(ElectricityDemandRequest request) {
        // Use London coordinates as default if not provided
        return calculateESpaceHeating(request, 51.5074, -0.1278);
    }

    /**
     * Calculate annual space heating demand for use by other services (e.g., gas demand calculation)
     * This method provides the total annual space heating demand that can be used by gas calculations
     * @param request Electricity demand request with house parameters
     * @param latitude Latitude for weather data (from step 1)
     * @param longitude Longitude for weather data (from step 1)
     * @return Annual space heating demand in kWh
     */
    public double calculateAnnualSpaceHeatingDemand(ElectricityDemandRequest request, 
                                                   Double latitude, Double longitude) {
        Map<Integer, Double> monthlyDemand = calculateMonthlySpaceHeatingDemand(request, latitude, longitude);
        return monthlyDemand.values().stream().mapToDouble(Double::doubleValue).sum();
    }

    /**
     * Legacy method for annual calculation with default coordinates
     */
    public double calculateAnnualSpaceHeatingDemand(ElectricityDemandRequest request) {
        // Use London coordinates as default if not provided
        return calculateAnnualSpaceHeatingDemand(request, 51.5074, -0.1278);
    }
} 