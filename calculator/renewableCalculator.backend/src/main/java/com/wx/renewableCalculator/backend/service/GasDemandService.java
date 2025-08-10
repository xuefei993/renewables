package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest;
import com.wx.renewableCalculator.backend.dto.GasDemandRequest;
import com.wx.renewableCalculator.backend.dto.GasDemandResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for calculating gas demand using three different methods:
 * 1. User provided monthly gas usage
 * 2. User provided annual gas usage (distributed by proportions)
 * 3. Estimated from space heating + hot water demand
 */
@Service
public class GasDemandService {

    @Autowired
    private SpaceHeatingElectricityDemandService spaceHeatingElectricityDemandService;

    // Standard monthly gas demand proportions (%) - used for Case 2
    private static final double[] STANDARD_GAS_MONTHLY_PROPORTIONS = {
        15.0, 14.0, 12.0, 9.0, 6.0, 3.0, 3.0, 3.0, 5.0, 8.0, 11.0, 11.0
    };

    // Monthly space heating demand proportions for gas (%)
    private static final double[] GAS_SPACE_HEATING_PROPORTIONS = {
        17.0, 15.0, 12.0, 8.0, 4.0, 1.0, 1.0, 1.0, 3.0, 6.0, 11.0, 14.0
    };

    // Monthly hot water demand proportions for gas (%)
    private static final double[] GAS_HOT_WATER_PROPORTIONS = {
        9.4, 8.5, 9.1, 8.1, 8.2, 7.5, 7.3, 7.3, 7.8, 8.3, 8.4, 10.1
    };

    // Allocation factors: 0.85 to space heating, 0.15 to hot water
    private static final double SPACE_HEATING_ALLOCATION = 0.85;
    private static final double HOT_WATER_ALLOCATION = 0.15;

    /**
     * Calculate monthly gas demand based on user input
     */
    public GasDemandResult calculateGasDemand(GasDemandRequest request) {
        // Case 1: User provided monthly gas usage
        if (request.getMonthlyGasUsage() != null && !request.getMonthlyGasUsage().isEmpty()) {
            return calculateFromMonthlyInput(request);
        }
        
        // Case 2: User provided annual gas usage - distribute by proportions
        if (request.getAnnualGasUsage() != null && request.getAnnualGasUsage() > 0) {
            return calculateFromAnnualInput(request);
        }
        
        // Case 3: Need estimation using space heating + hot water demand
        if (request.getNeedsEstimation() != null && request.getNeedsEstimation()) {
            return calculateFromEstimation(request);
        }
        
        throw new IllegalArgumentException("No valid gas demand input provided. Please provide either monthly usage, annual usage, or request estimation.");
    }

    /**
     * Calculate gas demand from user's monthly input
     */
    private GasDemandResult calculateFromMonthlyInput(GasDemandRequest request) {
        GasDemandResult result = new GasDemandResult();
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        
        double totalAnnual = 0.0;
        double peakDemand = 0.0;
        double lowDemand = Double.MAX_VALUE;
        int peakMonth = 1, lowMonth = 1;
        
        for (int month = 1; month <= 12; month++) {
            Double demandValue = request.getMonthlyGasUsage().getOrDefault(month, 0.0);
            monthlyDemand.put(month, BigDecimal.valueOf(demandValue).setScale(2, RoundingMode.HALF_UP));
            totalAnnual += demandValue;
            
            if (demandValue > peakDemand) { peakDemand = demandValue; peakMonth = month; }
            if (demandValue < lowDemand) { lowDemand = demandValue; lowMonth = month; }
        }
        
        result.setMonthlyGasDemand(monthlyDemand);
        result.setAnnualGasDemand(BigDecimal.valueOf(totalAnnual).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("user_monthly");
        result.setDescription("Monthly gas demand calculated from user's monthly input");
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Calculate gas demand from user's annual input using monthly proportions
     */
    private GasDemandResult calculateFromAnnualInput(GasDemandRequest request) {
        GasDemandResult result = new GasDemandResult();
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        Map<Integer, BigDecimal> monthlyProportions = new HashMap<>();
        
        double annualUsage = request.getAnnualGasUsage();
        double peakDemand = 0.0;
        double lowDemand = Double.MAX_VALUE;
        int peakMonth = 1, lowMonth = 1;
        
        for (int month = 1; month <= 12; month++) {
            double proportion = STANDARD_GAS_MONTHLY_PROPORTIONS[month - 1] / 100.0;
            double monthlyUsage = annualUsage * proportion;
            
            monthlyDemand.put(month, BigDecimal.valueOf(monthlyUsage).setScale(2, RoundingMode.HALF_UP));
            monthlyProportions.put(month, BigDecimal.valueOf(proportion * 100).setScale(1, RoundingMode.HALF_UP));
            
            if (monthlyUsage > peakDemand) { peakDemand = monthlyUsage; peakMonth = month; }
            if (monthlyUsage < lowDemand) { lowDemand = monthlyUsage; lowMonth = month; }
        }
        
        result.setMonthlyGasDemand(monthlyDemand);
        result.setAnnualGasDemand(BigDecimal.valueOf(annualUsage).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("user_annual_distributed");
        result.setMonthlyProportions(monthlyProportions);
        result.setDescription(String.format("Annual gas demand (%,.0f kWh) distributed using standard gas proportions", annualUsage));
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Calculate gas demand from estimation
     * Formula: Gas demand = space heating demand + hot water demand
     * Allocation: 0.85 to space heating, 0.15 to hot water
     */
    private GasDemandResult calculateFromEstimation(GasDemandRequest request) {
        if (request.getOccupants() == null || request.getOccupants() <= 0) {
            throw new IllegalArgumentException("Number of occupants is required for gas demand estimation");
        }
        
        GasDemandResult result = new GasDemandResult();
        
        // Calculate annual demands
        double annualSpaceHeatingDemand = calculateAnnualSpaceHeatingDemand(request);
        double annualHotWaterDemand = calculateAnnualHotWaterDemand(request);
        
        // Apply allocation factors
        double spaceHeatingComponent = annualSpaceHeatingDemand * SPACE_HEATING_ALLOCATION;
        double hotWaterComponent = annualHotWaterDemand * HOT_WATER_ALLOCATION;
        
        System.out.println(String.format(
            "Gas demand estimation: Space heating (%.1f × %.2f) + Hot water (%.1f × %.2f) = %.1f + %.1f = %.1f kWh/year",
            annualSpaceHeatingDemand, SPACE_HEATING_ALLOCATION, annualHotWaterDemand, HOT_WATER_ALLOCATION,
            spaceHeatingComponent, hotWaterComponent, spaceHeatingComponent + hotWaterComponent));
        
        // Calculate monthly gas demand using specific proportions
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        double totalAnnual = 0.0;
        
        for (int month = 1; month <= 12; month++) {
            double spaceHeatingProportion = GAS_SPACE_HEATING_PROPORTIONS[month - 1] / 100.0;
            double hotWaterProportion = GAS_HOT_WATER_PROPORTIONS[month - 1] / 100.0;
            
            double monthlySpaceHeating = spaceHeatingComponent * spaceHeatingProportion;
            double monthlyHotWater = hotWaterComponent * hotWaterProportion;
            double totalForMonth = monthlySpaceHeating + monthlyHotWater;
            
            monthlyDemand.put(month, BigDecimal.valueOf(totalForMonth).setScale(2, RoundingMode.HALF_UP));
            totalAnnual += totalForMonth;
        }
        
        // Find peak and low months
        double peakDemand = monthlyDemand.values().stream().mapToDouble(bd -> bd.doubleValue()).max().orElse(0.0);
        double lowDemand = monthlyDemand.values().stream().mapToDouble(bd -> bd.doubleValue()).min().orElse(0.0);
        
        int peakMonth = 1, lowMonth = 1;
        for (Map.Entry<Integer, BigDecimal> entry : monthlyDemand.entrySet()) {
            if (entry.getValue().doubleValue() == peakDemand) peakMonth = entry.getKey();
            if (entry.getValue().doubleValue() == lowDemand) lowMonth = entry.getKey();
        }
        
        result.setMonthlyGasDemand(monthlyDemand);
        result.setAnnualGasDemand(BigDecimal.valueOf(totalAnnual).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("estimated");
        result.setSpaceHeatingComponent(BigDecimal.valueOf(spaceHeatingComponent).setScale(2, RoundingMode.HALF_UP));
        result.setHotWaterComponent(BigDecimal.valueOf(hotWaterComponent).setScale(2, RoundingMode.HALF_UP));
        result.setDescription(String.format(
            "Estimated gas demand for %d residents: Space heating component=%.1f kWh/year (85%%), Hot water component=%.1f kWh/year (15%%), Total=%.1f kWh/year", 
            request.getOccupants(), spaceHeatingComponent, hotWaterComponent, totalAnnual));
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Calculate annual space heating demand (reuse logic from space heating service)
     */
    private double calculateAnnualSpaceHeatingDemand(GasDemandRequest request) {
        if (!"gas".equals(request.getHeatingType()) && !"gas-boiler".equals(request.getHeatingType())) {
            return 0.0; // No gas space heating demand
        }
        
        ElectricityDemandRequest electricityRequest = convertToElectricityRequest(request);
        
        // Use coordinates if available, otherwise use default (London)
        if (request.getLatitude() != null && request.getLongitude() != null) {
            return spaceHeatingElectricityDemandService.calculateAnnualSpaceHeatingDemand(
                electricityRequest, request.getLatitude(), request.getLongitude());
        } else {
            System.out.println("Warning: No location coordinates provided for gas heating calculation, using London default coordinates");
            return spaceHeatingElectricityDemandService.calculateAnnualSpaceHeatingDemand(electricityRequest);
        }
    }

    /**
     * Calculate annual hot water demand
     */
    private double calculateAnnualHotWaterDemand(GasDemandRequest request) {
        if (!"gas-boiler".equals(request.getHotWaterType())) {
            return 0.0; // No gas hot water demand
        }
        
        int residentsNumber = request.getOccupants();
        double baseHotWaterDemand = 1250 + residentsNumber + 600;
        
        System.out.println(String.format("Annual hot water demand: (1250 + %d + 600) = %.1f kWh/year", 
            residentsNumber, baseHotWaterDemand));
        
        return baseHotWaterDemand;
    }

    /**
     * Convert GasDemandRequest to ElectricityDemandRequest for reusing calculation logic
     */
    private com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest convertToElectricityRequest(GasDemandRequest gasRequest) {
        com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest electricityRequest = 
            new com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest();
        
        electricityRequest.setOccupants(gasRequest.getOccupants());
        electricityRequest.setHeatingType(gasRequest.getHeatingType());
        electricityRequest.setHouseArea(gasRequest.getHouseArea());
        electricityRequest.setBuildYear(gasRequest.getBuildYear());
        electricityRequest.setWallType(gasRequest.getWallType());
        electricityRequest.setWindowType(gasRequest.getWindowType());
        electricityRequest.setRoofInsulation(gasRequest.getRoofInsulation());
        electricityRequest.setFloorInsulation(gasRequest.getFloorInsulation());
        electricityRequest.setHouseType(gasRequest.getHouseType());
        electricityRequest.setEpcRating(gasRequest.getEpcRating());
        
        return electricityRequest;
    }

    /**
     * Validate monthly gas usage input
     */
    public boolean validateMonthlyInput(Map<Integer, Double> monthlyUsage) {
        if (monthlyUsage == null || monthlyUsage.isEmpty()) return false;
        
        for (int month = 1; month <= 12; month++) {
            Double usage = monthlyUsage.get(month);
            if (usage == null || usage < 0) return false;
        }
        
        return true;
    }

    /**
     * Get the monthly proportion arrays for reference
     */
    public Map<String, double[]> getGasMonthlyProportions() {
        Map<String, double[]> proportions = new HashMap<>();
        proportions.put("standard", STANDARD_GAS_MONTHLY_PROPORTIONS.clone());
        proportions.put("space_heating", GAS_SPACE_HEATING_PROPORTIONS.clone());
        proportions.put("hot_water", GAS_HOT_WATER_PROPORTIONS.clone());
        return proportions;
    }
} 