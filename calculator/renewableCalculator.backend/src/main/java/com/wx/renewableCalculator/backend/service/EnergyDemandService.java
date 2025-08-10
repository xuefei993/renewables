package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest;
import com.wx.renewableCalculator.backend.dto.ElectricityDemandResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

/**
 * Main service for coordinating electricity demand calculations
 * Delegates specific calculations to specialized services
 */
@Service
public class EnergyDemandService {

    @Autowired
    private BasicElectricityDemandService basicElectricityDemandService;

    @Autowired
    private HotWaterElectricityDemandService hotWaterElectricityDemandService;

    @Autowired
    private SpaceHeatingElectricityDemandService spaceHeatingElectricityDemandService;

    // Monthly electricity demand proportions for standard households (%)
    private static final double[] STANDARD_MONTHLY_PROPORTIONS = {
        11.0, 10.0, 9.0, 8.0, 7.0, 6.0,   // Jan-Jun
        6.0, 6.0, 7.0, 8.0, 9.0, 13.0     // Jul-Dec
    };

    // Monthly electricity demand proportions for households with heat pumps (%)
    private static final double[] HEAT_PUMP_MONTHLY_PROPORTIONS = {
        12.0, 11.0, 10.0, 8.0, 6.0, 5.0,  // Jan-Jun
        5.0, 5.0, 6.0, 7.0, 9.0, 16.0     // Jul-Dec
    };

    /**
     * Calculate monthly electricity demand based on user input
     * 
     * @param request Electricity demand calculation parameters
     * @return Monthly electricity demand results
     */
    public ElectricityDemandResult calculateElectricityDemand(ElectricityDemandRequest request) {
        
        ElectricityDemandResult result = new ElectricityDemandResult();
        
        // Case 1: User provided monthly electricity usage
        if (request.getMonthlyElectricityUsage() != null && !request.getMonthlyElectricityUsage().isEmpty()) {
            return calculateFromMonthlyInput(request);
        }
        
        // Case 2: User provided annual electricity usage - distribute by proportions
        if (request.getAnnualElectricityUsage() != null && request.getAnnualElectricityUsage() > 0) {
            return calculateFromAnnualInput(request);
        }
        
        // Case 3: Need estimation (using specialized services)
        if (request.getNeedsEstimation() != null && request.getNeedsEstimation()) {
            return calculateFromEstimation(request);
        }
        
        // If no valid input provided
        throw new IllegalArgumentException("No valid electricity demand input provided. Please provide either monthly usage, annual usage, or request estimation.");
    }

    /**
     * Calculate electricity demand from user's monthly input
     */
    private ElectricityDemandResult calculateFromMonthlyInput(ElectricityDemandRequest request) {
        ElectricityDemandResult result = new ElectricityDemandResult();
        
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        double totalAnnual = 0.0;
        double peakDemand = 0.0;
        double lowDemand = Double.MAX_VALUE;
        int peakMonth = 1;
        int lowMonth = 1;
        
        // Process user's monthly input
        for (int month = 1; month <= 12; month++) {
            Double demandValue = request.getMonthlyElectricityUsage().getOrDefault(month, 0.0);
            BigDecimal monthlyDemandBD = BigDecimal.valueOf(demandValue).setScale(2, RoundingMode.HALF_UP);
            
            monthlyDemand.put(month, monthlyDemandBD);
            totalAnnual += demandValue;
            
            // Track peak and low months
            if (demandValue > peakDemand) {
                peakDemand = demandValue;
                peakMonth = month;
            }
            if (demandValue < lowDemand) {
                lowDemand = demandValue;
                lowMonth = month;
            }
        }
        
        result.setMonthlyElectricityDemand(monthlyDemand);
        result.setAnnualElectricityDemand(BigDecimal.valueOf(totalAnnual).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("user_monthly");
        result.setDescription("Monthly electricity demand calculated from user's monthly input");
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Calculate electricity demand from user's annual input using monthly proportions
     */
    private ElectricityDemandResult calculateFromAnnualInput(ElectricityDemandRequest request) {
        ElectricityDemandResult result = new ElectricityDemandResult();
        
        // Determine which proportions to use
        boolean hasHeatPump = request.getHasHeatPump() != null && request.getHasHeatPump();
        double[] proportions = hasHeatPump ? HEAT_PUMP_MONTHLY_PROPORTIONS : STANDARD_MONTHLY_PROPORTIONS;
        
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        Map<Integer, BigDecimal> monthlyProportions = new HashMap<>();
        double annualUsage = request.getAnnualElectricityUsage();
        
        double peakDemand = 0.0;
        double lowDemand = Double.MAX_VALUE;
        int peakMonth = 1;
        int lowMonth = 1;
        
        // Distribute annual usage across months
        for (int month = 1; month <= 12; month++) {
            double proportion = proportions[month - 1] / 100.0;
            double monthlyUsage = annualUsage * proportion;
            
            monthlyDemand.put(month, BigDecimal.valueOf(monthlyUsage).setScale(2, RoundingMode.HALF_UP));
            monthlyProportions.put(month, BigDecimal.valueOf(proportion * 100).setScale(1, RoundingMode.HALF_UP)); // Store as percentage
            
            // Track peak and low months
            if (monthlyUsage > peakDemand) {
                peakDemand = monthlyUsage;
                peakMonth = month;
            }
            if (monthlyUsage < lowDemand) {
                lowDemand = monthlyUsage;
                lowMonth = month;
            }
        }
        
        result.setMonthlyElectricityDemand(monthlyDemand);
        result.setAnnualElectricityDemand(BigDecimal.valueOf(annualUsage).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("user_annual_distributed");
        result.setUsedHeatPumpProportions(hasHeatPump);
        result.setMonthlyProportions(monthlyProportions);
        result.setDescription(String.format("Annual electricity demand (%,.0f kWh) distributed using %s proportions", 
            annualUsage, hasHeatPump ? "heat pump" : "standard"));
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Calculate electricity demand from estimation using specialized services
     * Formula: Etotal = Ebasic + Ehot water + Espace heating
     */
    private ElectricityDemandResult calculateFromEstimation(ElectricityDemandRequest request) {
        ElectricityDemandResult result = new ElectricityDemandResult();
        
        // Validate required input
        if (!basicElectricityDemandService.validateBasicInput(request.getOccupants())) {
            throw new IllegalArgumentException("Number of occupants (residents) is required for estimation");
        }
        
        int residentsNumber = request.getOccupants();
        
        // Calculate Ebasic using specialized service
        double eBasicMonthly = basicElectricityDemandService.calculateEBasic(residentsNumber);
        
        // Calculate monthly hot water demands using specialized service
        Map<Integer, Double> eHotWaterMonthly = hotWaterElectricityDemandService.calculateEHotWater(request);
        
        // Calculate monthly space heating demands using specialized service with location data
        Map<Integer, Double> eSpaceHeatingMonthly;
        if (request.getLatitude() != null && request.getLongitude() != null) {
            eSpaceHeatingMonthly = spaceHeatingElectricityDemandService.calculateESpaceHeating(
                request, request.getLatitude(), request.getLongitude());
        } else {
            // Use default coordinates (London) if location not provided
            System.out.println("Warning: No location coordinates provided, using London default coordinates for space heating calculation");
            eSpaceHeatingMonthly = spaceHeatingElectricityDemandService.calculateESpaceHeating(request);
        }
        
        // Calculate total monthly demand for each month: Etotal = Ebasic + Ehot water + Espace heating
        Map<Integer, BigDecimal> monthlyDemand = new HashMap<>();
        double totalAnnual = 0.0;
        
        for (int month = 1; month <= 12; month++) {
            double hotWaterForMonth = eHotWaterMonthly.getOrDefault(month, 0.0);
            double spaceHeatingForMonth = eSpaceHeatingMonthly.getOrDefault(month, 0.0);
            double totalForMonth = eBasicMonthly + hotWaterForMonth + spaceHeatingForMonth;
            monthlyDemand.put(month, BigDecimal.valueOf(totalForMonth).setScale(2, RoundingMode.HALF_UP));
            totalAnnual += totalForMonth;
        }
        
        result.setMonthlyElectricityDemand(monthlyDemand);
        result.setAnnualElectricityDemand(BigDecimal.valueOf(totalAnnual).setScale(2, RoundingMode.HALF_UP));
        result.setCalculationMethod("estimated");
        
        // Calculate average monthly hot water and space heating for description
        double avgHotWaterMonthly = eHotWaterMonthly.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double avgSpaceHeatingMonthly = eSpaceHeatingMonthly.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double avgTotalMonthly = totalAnnual / 12.0;
        
        result.setDescription(String.format(
            "Estimated electricity demand for %d residents: Ebasic=%.1f + Ehot water=%.1f + Espace heating=%.1f = %.1f kWh/month avg (%.0f kWh/year)", 
            residentsNumber, eBasicMonthly, avgHotWaterMonthly, avgSpaceHeatingMonthly, avgTotalMonthly, totalAnnual));
        
        // Find peak and low months
        double peakDemand = monthlyDemand.values().stream().mapToDouble(bd -> bd.doubleValue()).max().orElse(0.0);
        double lowDemand = monthlyDemand.values().stream().mapToDouble(bd -> bd.doubleValue()).min().orElse(0.0);
        
        int peakMonth = 1;
        int lowMonth = 1;
        for (Map.Entry<Integer, BigDecimal> entry : monthlyDemand.entrySet()) {
            if (entry.getValue().doubleValue() == peakDemand) {
                peakMonth = entry.getKey();
            }
            if (entry.getValue().doubleValue() == lowDemand) {
                lowMonth = entry.getKey();
            }
        }
        
        result.setPeakMonthDemand(BigDecimal.valueOf(peakDemand).setScale(2, RoundingMode.HALF_UP));
        result.setPeakMonth(peakMonth);
        result.setLowMonthDemand(BigDecimal.valueOf(lowDemand).setScale(2, RoundingMode.HALF_UP));
        result.setLowMonth(lowMonth);
        
        return result;
    }

    /**
     * Get the monthly proportion arrays for reference
     */
    public Map<String, double[]> getMonthlyProportions() {
        Map<String, double[]> proportions = new HashMap<>();
        proportions.put("standard", STANDARD_MONTHLY_PROPORTIONS.clone());
        proportions.put("heat_pump", HEAT_PUMP_MONTHLY_PROPORTIONS.clone());
        return proportions;
    }

    /**
     * Validate monthly electricity usage input
     */
    public boolean validateMonthlyInput(Map<Integer, Double> monthlyUsage) {
        if (monthlyUsage == null || monthlyUsage.isEmpty()) {
            return false;
        }
        
        // Check if all months 1-12 are present and have non-negative values
        for (int month = 1; month <= 12; month++) {
            Double usage = monthlyUsage.get(month);
            if (usage == null || usage < 0) {
                return false;
            }
        }
        
        return true;
    }
} 