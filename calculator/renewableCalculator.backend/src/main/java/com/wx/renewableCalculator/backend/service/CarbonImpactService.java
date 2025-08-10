package com.wx.renewableCalculator.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class CarbonImpactService {

    // UK Carbon intensity factors (kg CO2 per kWh)
    private static final Map<String, BigDecimal> CARBON_INTENSITY_FACTORS = new HashMap<>();
    static {
        CARBON_INTENSITY_FACTORS.put("grid_electricity", BigDecimal.valueOf(0.233)); // UK grid average 2023
        CARBON_INTENSITY_FACTORS.put("natural_gas", BigDecimal.valueOf(0.185));      // Natural gas boiler
        CARBON_INTENSITY_FACTORS.put("oil", BigDecimal.valueOf(0.245));              // Oil heating
        CARBON_INTENSITY_FACTORS.put("lpg", BigDecimal.valueOf(0.214));              // LPG heating
        CARBON_INTENSITY_FACTORS.put("coal", BigDecimal.valueOf(0.354));             // Coal (rare but included)
    }

    /**
     * Calculate annual CO2 reduction from solar panels
     * @param annualSolarGeneration Annual solar generation in kWh
     * @param gridCarbonIntensity Grid carbon intensity (kg CO2 per kWh)
     * @return Annual CO2 reduction in kg
     */
    public BigDecimal calculateSolarCarbonReduction(BigDecimal annualSolarGeneration, BigDecimal gridCarbonIntensity) {
        if (gridCarbonIntensity == null) {
            gridCarbonIntensity = CARBON_INTENSITY_FACTORS.get("grid_electricity");
        }
        
        return annualSolarGeneration.multiply(gridCarbonIntensity).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate annual CO2 reduction from heat pump replacing gas boiler
     * @param annualHeatDemand Annual heating demand in kWh (thermal)
     * @param heatPumpCOP Heat pump coefficient of performance
     * @param replacedFuelType Type of fuel being replaced (gas, oil, lpg)
     * @param gridCarbonIntensity Grid carbon intensity for electricity
     * @return Annual CO2 reduction in kg
     */
    public BigDecimal calculateHeatPumpCarbonReduction(BigDecimal annualHeatDemand, BigDecimal heatPumpCOP,
                                                     String replacedFuelType, BigDecimal gridCarbonIntensity) {
        if (gridCarbonIntensity == null) {
            gridCarbonIntensity = CARBON_INTENSITY_FACTORS.get("grid_electricity");
        }

        BigDecimal replacedFuelIntensity = CARBON_INTENSITY_FACTORS.getOrDefault(replacedFuelType, 
            CARBON_INTENSITY_FACTORS.get("natural_gas"));

        // CO2 from replaced heating system
        BigDecimal oldSystemEmissions = annualHeatDemand.multiply(replacedFuelIntensity);

        // CO2 from heat pump electricity consumption
        BigDecimal heatPumpElectricityUsage = annualHeatDemand.divide(heatPumpCOP, 2, RoundingMode.HALF_UP);
        BigDecimal heatPumpEmissions = heatPumpElectricityUsage.multiply(gridCarbonIntensity);

        return oldSystemEmissions.subtract(heatPumpEmissions).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate lifetime CO2 reduction over system lifespan
     * @param annualCO2Reduction First year CO2 reduction in kg
     * @param systemLifespan System lifespan in years
     * @param annualDegradation Annual system degradation rate (for solar)
     * @param gridDecarbonisation Annual grid decarbonisation rate
     * @return Lifetime CO2 reduction in kg
     */
    public BigDecimal calculateLifetimeCarbonReduction(BigDecimal annualCO2Reduction, Integer systemLifespan,
                                                     BigDecimal annualDegradation, BigDecimal gridDecarbonisation) {
        BigDecimal totalReduction = BigDecimal.ZERO;
        BigDecimal currentReduction = annualCO2Reduction;

        for (int year = 1; year <= systemLifespan; year++) {
            totalReduction = totalReduction.add(currentReduction);

            // Apply system degradation (reduces generation)
            if (annualDegradation != null) {
                currentReduction = currentReduction.multiply(BigDecimal.ONE.subtract(annualDegradation));
            }

            // Apply grid decarbonisation (reduces benefit as grid gets cleaner)
            if (gridDecarbonisation != null) {
                currentReduction = currentReduction.multiply(BigDecimal.ONE.subtract(gridDecarbonisation));
            }
        }

        return totalReduction.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate equivalent environmental benefits
     * @param annualCO2ReductionKg Annual CO2 reduction in kg
     * @return Map of equivalent environmental benefits
     */
    public Map<String, BigDecimal> calculateEnvironmentalEquivalents(BigDecimal annualCO2ReductionKg) {
        Map<String, BigDecimal> equivalents = new HashMap<>();

        // Convert to tonnes
        BigDecimal co2Tonnes = annualCO2ReductionKg.divide(BigDecimal.valueOf(1000), 3, RoundingMode.HALF_UP);

        // Car miles equivalent (average car emits ~0.2 kg CO2 per mile)
        BigDecimal carMilesEquivalent = annualCO2ReductionKg.divide(BigDecimal.valueOf(0.2), 0, RoundingMode.HALF_UP);

        // Trees planted equivalent (one tree absorbs ~21 kg CO2 per year)
        BigDecimal treesEquivalent = annualCO2ReductionKg.divide(BigDecimal.valueOf(21), 0, RoundingMode.HALF_UP);

        // Flights avoided (London to Paris return flight ~0.3 tonnes CO2)
        BigDecimal flightsEquivalent = co2Tonnes.divide(BigDecimal.valueOf(0.3), 1, RoundingMode.HALF_UP);

        equivalents.put("co2_tonnes", co2Tonnes);
        equivalents.put("car_miles_equivalent", carMilesEquivalent);
        equivalents.put("trees_planted_equivalent", treesEquivalent);
        equivalents.put("flights_avoided_equivalent", flightsEquivalent);

        return equivalents;
    }

    /**
     * Get carbon intensity factor for a specific energy source
     * @param energySource Energy source type
     * @return Carbon intensity in kg CO2 per kWh
     */
    public BigDecimal getCarbonIntensityFactor(String energySource) {
        return CARBON_INTENSITY_FACTORS.getOrDefault(energySource, 
            CARBON_INTENSITY_FACTORS.get("grid_electricity"));
    }
} 