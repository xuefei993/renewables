package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.ElectricityDemandRequest;
import com.wx.renewableCalculator.backend.entity.HeatPump;
import com.wx.renewableCalculator.backend.repository.HeatPumpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service for calculating hot water electricity demand (Ehot water)
 * Formula: hot water demand = (1250 + Residents number + 600) * monthly proportion
 * Ehot water = hot water demand / heat pump COP (if heat pump)
 * Ehot water = 0 (if gas boiler) 
 * Ehot water = hot water demand (if electricity)
 */
@Service
public class HotWaterElectricityDemandService {

    @Autowired
    private HeatPumpRepository heatPumpRepository;

    // Monthly hot water demand proportions (%)
    private static final double[] HOT_WATER_MONTHLY_PROPORTIONS = {
        9.4, 8.5, 9.1, 8.1, 8.2, 7.5,     // Jan-Jun
        6.8, 7.3, 7.8, 8.3, 8.4, 10.1     // Jul-Dec
    };

    /**
     * Calculate Ehot water for all 12 months using provided formulas
     * @param request Electricity demand request
     * @return Map of monthly hot water electricity demand in kWh (month -> kWh)
     */
    public Map<Integer, Double> calculateEHotWater(ElectricityDemandRequest request) {
        Map<Integer, Double> monthlyElectricityDemand = new HashMap<>();
        
        if (request.getOccupants() == null || request.getOccupants() <= 0) {
            // If no occupants info, return zero for all months
            for (int month = 1; month <= 12; month++) {
                monthlyElectricityDemand.put(month, 0.0);
            }
            return monthlyElectricityDemand;
        }
        
        int residentsNumber = request.getOccupants();
        String hotWaterType = request.getHotWaterType();
        
        // Calculate base hot water demand: (1250 + Residents number + 600)
        double baseHotWaterDemand = 1250 + residentsNumber + 600;
        
        System.out.println(String.format("Base hot water demand: (1250 + %d + 600) = %.1f", 
            residentsNumber, baseHotWaterDemand));
        
        // Get heat pump COP if using heat pump
        Double heatPumpCOP = getHeatPumpCOP(request);
        
        // Calculate monthly hot water electricity demand
        for (int month = 1; month <= 12; month++) {
            double monthlyProportion = HOT_WATER_MONTHLY_PROPORTIONS[month - 1] / 100.0;
            double monthlyHotWaterDemandKWh = baseHotWaterDemand * monthlyProportion;
            
            double monthlyElectricityDemandKWh = calculateMonthlyElectricityDemand(
                monthlyHotWaterDemandKWh, hotWaterType, heatPumpCOP);
            
            monthlyElectricityDemand.put(month, monthlyElectricityDemandKWh);
        }
        
        System.out.println(String.format("Hot water type: %s, Monthly electricity demand calculated", 
            hotWaterType != null ? hotWaterType : "not specified"));
        
        return monthlyElectricityDemand;
    }

    /**
     * Get heat pump COP if using heat pump for hot water
     */
    private Double getHeatPumpCOP(ElectricityDemandRequest request) {
        String hotWaterType = request.getHotWaterType();
        
        if ("heat-pump".equals(hotWaterType) && request.getHeatPumpId() != null) {
            Optional<HeatPump> heatPumpOpt = heatPumpRepository.findById(request.getHeatPumpId());
            if (heatPumpOpt.isPresent()) {
                Double cop = heatPumpOpt.get().getCop().doubleValue();
                System.out.println(String.format("Heat pump COP: %.2f", cop));
                return cop;
            } else {
                System.out.println("Heat pump not found, using default COP 3.0");
                return 3.0; // Default COP if heat pump not found
            }
        }
        return null;
    }

    /**
     * Calculate monthly electricity demand based on hot water type
     */
    private double calculateMonthlyElectricityDemand(double monthlyHotWaterDemandKWh, 
                                                    String hotWaterType, Double heatPumpCOP) {
        if ("heat-pump".equals(hotWaterType) && heatPumpCOP != null) {
            // Ehot water = hot water demand / heat pump COP
            return monthlyHotWaterDemandKWh / heatPumpCOP;
        } else if ("gas-boiler".equals(hotWaterType)) {
            // Ehot water = 0 (gas boiler doesn't use electricity for hot water)
            return 0.0;
        } else if ("electricity".equals(hotWaterType)) {
            // Ehot water = hot water demand (direct electric heating)
            return monthlyHotWaterDemandKWh;
        } else {
            // Default: assume no electricity demand for hot water
            return 0.0;
        }
    }

    /**
     * Get monthly proportions for reference
     */
    public double[] getHotWaterMonthlyProportions() {
        return HOT_WATER_MONTHLY_PROPORTIONS.clone();
    }
} 