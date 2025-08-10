package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.CarbonSavingsRequest;
import com.wx.renewableCalculator.backend.dto.CarbonSavingsResult;
import org.springframework.stereotype.Service;

@Service
public class CarbonSavingsService {
    
    // UK 2025 emission factors (from the document)
    private static final double DEFAULT_GAS_EMISSION_FACTOR = 0.183;        // kgCO₂/kWh for gas
    private static final double DEFAULT_ELECTRICITY_EMISSION_FACTOR = 0.148; // kgCO₂/kWh for electricity
    
    /**
     * Calculate monthly carbon savings for renewable energy systems
     * 
     * Formulas from the document:
     * 1. Direct emissions savings: CSdirect,save = Egas × 0.183
     * 2. Indirect emissions before: CSbefore = Etotal × 0.148
     * 3. Indirect emissions after: CSindirect,after = (Etotal - Esolar,cm - Eheat_pump + Dhot_water + Dheating,m) × 0.148
     * 
     * @param request Contains equipment selection and energy consumption parameters
     * @return CarbonSavingsResult with detailed breakdown of carbon savings
     */
    public CarbonSavingsResult calculateCarbonSavings(CarbonSavingsRequest request) {
        
        CarbonSavingsResult result = new CarbonSavingsResult();
        
        // Set equipment status
        result.setHasSolarPanels(request.getHasSolarPanels());
        result.setHasHeatPump(request.getHasHeatPump());
        result.setHasBattery(request.getHasBattery());
        result.setMonth(request.getMonth());
        
        // Get emission factors (use defaults if not provided)
        double gasEmissionFactor = request.getGasEmissionFactor() != null ? 
            request.getGasEmissionFactor() : DEFAULT_GAS_EMISSION_FACTOR;
        double electricityEmissionFactor = request.getElectricityEmissionFactor() != null ? 
            request.getElectricityEmissionFactor() : DEFAULT_ELECTRICITY_EMISSION_FACTOR;
        
        result.setGasEmissionFactor(gasEmissionFactor);
        result.setElectricityEmissionFactor(electricityEmissionFactor);
        
        // Calculate direct emissions savings (Scope 1)
        double directEmissionsSavings = calculateDirectEmissionsSavings(request, gasEmissionFactor);
        result.setDirectEmissionsSavingsKgCO2(directEmissionsSavings);
        result.setGasConsumptionReplacedKwh(getGasConsumptionReplaced(request));
        
        // Calculate indirect emissions before upgrade (Scope 2)
        double indirectEmissionsBefore = calculateIndirectEmissionsBefore(request, electricityEmissionFactor);
        result.setIndirectEmissionsBeforeKgCO2(indirectEmissionsBefore);
        result.setTotalElectricityBeforeKwh(request.getTotalElectricityDemandKwh());
        
        // Calculate indirect emissions after upgrade (Scope 2)
        double indirectEmissionsAfter = calculateIndirectEmissionsAfter(request, electricityEmissionFactor, result);
        result.setIndirectEmissionsAfterKgCO2(indirectEmissionsAfter);
        
        // Calculate indirect emissions savings
        double indirectEmissionsSavings = indirectEmissionsBefore - indirectEmissionsAfter;
        result.setIndirectEmissionsSavingsKgCO2(indirectEmissionsSavings);
        
        // Calculate total carbon savings
        double totalCarbonSavings = directEmissionsSavings + indirectEmissionsSavings;
        result.setTotalCarbonSavingsKgCO2(totalCarbonSavings);
        
        // Calculate percentage reduction
        double totalEmissionsBefore = getDirectEmissions(request, gasEmissionFactor) + indirectEmissionsBefore;
        double carbonReductionPercentage = totalEmissionsBefore > 0 ? 
            (totalCarbonSavings / totalEmissionsBefore) * 100 : 0;
        result.setCarbonReductionPercentage(carbonReductionPercentage);
        
        // Set breakdown values
        setBreakdownValues(request, result);
        
        return result;
    }
    
    /**
     * Calculate direct emissions savings (Scope 1)
     * Formula: CSdirect,save = Egas × 0.183
     * If no heat pump installed, return 0
     */
    private double calculateDirectEmissionsSavings(CarbonSavingsRequest request, double gasEmissionFactor) {
        if (!Boolean.TRUE.equals(request.getHasHeatPump()) || 
            request.getGasConsumptionKwh() == null || request.getGasConsumptionKwh() <= 0) {
            return 0.0;
        }
        
        double gasConsumption = request.getGasConsumptionKwh();
        return gasConsumption * gasEmissionFactor;
    }
    
    /**
     * Calculate indirect emissions before upgrade (Scope 2)
     * Formula: CSbefore = Etotal × 0.148
     */
    private double calculateIndirectEmissionsBefore(CarbonSavingsRequest request, double electricityEmissionFactor) {
        if (request.getTotalElectricityDemandKwh() == null || request.getTotalElectricityDemandKwh() <= 0) {
            return 0.0;
        }
        
        double totalElectricityDemand = request.getTotalElectricityDemandKwh();
        return totalElectricityDemand * electricityEmissionFactor;
    }
    
    /**
     * Calculate indirect emissions after upgrade (Scope 2)
     * Formula: CSindirect,after = (Etotal - Esolar,cm - Eheat_pump + Dhot_water + Dheating,m) × 0.148
     */
    private double calculateIndirectEmissionsAfter(CarbonSavingsRequest request, 
                                                  double electricityEmissionFactor, 
                                                  CarbonSavingsResult result) {
        
        double totalElectricityDemand = request.getTotalElectricityDemandKwh() != null ? 
            request.getTotalElectricityDemandKwh() : 0.0;
        
        // Esolar,cm - Solar self-consumed energy (reduces grid demand)
        double solarSelfConsumed = Boolean.TRUE.equals(request.getHasSolarPanels()) && 
            request.getSolarSelfConsumedKwh() != null ? request.getSolarSelfConsumedKwh() : 0.0;
        
        // Eheat_pump - Electricity saved by heat pump (reduces grid demand)
        double heatPumpElectricitySaved = Boolean.TRUE.equals(request.getHasHeatPump()) && 
            request.getHeatPumpElectricitySavedKwh() != null ? request.getHeatPumpElectricitySavedKwh() : 0.0;
        
        // Dhot_water - Hot water heat pump electricity usage (increases grid demand)
        double hotWaterHeatPumpUsage = Boolean.TRUE.equals(request.getHasHeatPump()) && 
            request.getHotWaterHeatPumpUsageKwh() != null ? request.getHotWaterHeatPumpUsageKwh() : 0.0;
        
        // Dheating,m - Heating heat pump electricity usage (increases grid demand)
        double heatingHeatPumpUsage = Boolean.TRUE.equals(request.getHasHeatPump()) && 
            request.getHeatingHeatPumpUsageKwh() != null ? request.getHeatingHeatPumpUsageKwh() : 0.0;
        
        // Apply the formula: (Etotal - Esolar,cm - Eheat_pump + Dhot_water + Dheating,m)
        double totalElectricityAfter = totalElectricityDemand 
                                     - solarSelfConsumed 
                                     - heatPumpElectricitySaved 
                                     + hotWaterHeatPumpUsage 
                                     + heatingHeatPumpUsage;
        
        // Ensure non-negative
        totalElectricityAfter = Math.max(0, totalElectricityAfter);
        
        result.setTotalElectricityAfterKwh(totalElectricityAfter);
        
        return totalElectricityAfter * electricityEmissionFactor;
    }
    
    /**
     * Get direct emissions before upgrade (for percentage calculation)
     */
    private double getDirectEmissions(CarbonSavingsRequest request, double gasEmissionFactor) {
        if (request.getGasConsumptionKwh() == null || request.getGasConsumptionKwh() <= 0) {
            return 0.0;
        }
        return request.getGasConsumptionKwh() * gasEmissionFactor;
    }
    
    /**
     * Get gas consumption replaced by heat pump
     */
    private double getGasConsumptionReplaced(CarbonSavingsRequest request) {
        if (!Boolean.TRUE.equals(request.getHasHeatPump())) {
            return 0.0;
        }
        return request.getGasConsumptionKwh() != null ? request.getGasConsumptionKwh() : 0.0;
    }
    
    /**
     * Set breakdown values in result
     */
    private void setBreakdownValues(CarbonSavingsRequest request, CarbonSavingsResult result) {
        result.setSolarSelfConsumedKwh(
            Boolean.TRUE.equals(request.getHasSolarPanels()) && request.getSolarSelfConsumedKwh() != null ? 
            request.getSolarSelfConsumedKwh() : 0.0
        );
        
        result.setHeatPumpElectricitySavedKwh(
            Boolean.TRUE.equals(request.getHasHeatPump()) && request.getHeatPumpElectricitySavedKwh() != null ? 
            request.getHeatPumpElectricitySavedKwh() : 0.0
        );
        
        result.setHotWaterHeatPumpUsageKwh(
            Boolean.TRUE.equals(request.getHasHeatPump()) && request.getHotWaterHeatPumpUsageKwh() != null ? 
            request.getHotWaterHeatPumpUsageKwh() : 0.0
        );
        
        result.setHeatingHeatPumpUsageKwh(
            Boolean.TRUE.equals(request.getHasHeatPump()) && request.getHeatingHeatPumpUsageKwh() != null ? 
            request.getHeatingHeatPumpUsageKwh() : 0.0
        );
    }
} 