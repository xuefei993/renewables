package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.CarbonSavingsRequest;
import com.wx.renewableCalculator.backend.dto.CarbonSavingsResult;
import com.wx.renewableCalculator.backend.service.CarbonSavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carbon")
@CrossOrigin(origins = "http://localhost:3000")
public class CarbonSavingsController {
    
    @Autowired
    private CarbonSavingsService carbonSavingsService;
    
    /**
     * Calculate monthly carbon savings for renewable energy systems
     * 
     * Formulas used:
     * 1. Direct emissions savings: CSdirect,save = Egas × 0.183
     * 2. Indirect emissions before: CSbefore = Etotal × 0.148
     * 3. Indirect emissions after: CSindirect,after = (Etotal - Esolar,cm - Eheat_pump + Dhot_water + Dheating,m) × 0.148
     * 
     * @param request Contains equipment selection and energy consumption parameters
     * @return Carbon savings calculation result with detailed breakdown
     */
    @PostMapping("/savings/monthly")
    public ResponseEntity<CarbonSavingsResult> calculateMonthlyCarbonSavings(
            @RequestBody CarbonSavingsRequest request) {
        
        try {
            // Validate request
            if (request.getMonth() == null || request.getMonth() < 1 || request.getMonth() > 12) {
                return ResponseEntity.badRequest().build();
            }
            
            CarbonSavingsResult result = carbonSavingsService.calculateCarbonSavings(request);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get monthly carbon savings for specific equipment configuration (simplified GET endpoint)
     * 
     * @param hasSolar Whether solar panels are installed
     * @param hasHeatPump Whether heat pump is installed
     * @param hasBattery Whether battery is installed
     * @param month Month (1-12)
     * @param electricityDemand Total electricity demand (kWh)
     * @param gasConsumption Gas consumption (kWh)
     * @param solarSelfConsumed Solar self-consumed energy (kWh)
     * @return Carbon savings calculation result
     */
    @GetMapping("/savings/monthly/quick")
    public ResponseEntity<CarbonSavingsResult> getQuickMonthlyCarbonSavings(
            @RequestParam(defaultValue = "false") Boolean hasSolar,
            @RequestParam(defaultValue = "false") Boolean hasHeatPump,
            @RequestParam(defaultValue = "false") Boolean hasBattery,
            @RequestParam Integer month,
            @RequestParam(defaultValue = "300") Double electricityDemand,
            @RequestParam(defaultValue = "0") Double gasConsumption,
            @RequestParam(defaultValue = "0") Double solarSelfConsumed,
            @RequestParam(defaultValue = "0") Double heatPumpElectricitySaved,
            @RequestParam(defaultValue = "0") Double hotWaterHeatPumpUsage,
            @RequestParam(defaultValue = "0") Double heatingHeatPumpUsage) {
        
        try {
            CarbonSavingsRequest request = new CarbonSavingsRequest();
            request.setHasSolarPanels(hasSolar);
            request.setHasHeatPump(hasHeatPump);
            request.setHasBattery(hasBattery);
            request.setMonth(month);
            request.setTotalElectricityDemandKwh(electricityDemand);
            request.setGasConsumptionKwh(gasConsumption);
            request.setSolarSelfConsumedKwh(solarSelfConsumed);
            request.setHeatPumpElectricitySavedKwh(heatPumpElectricitySaved);
            request.setHotWaterHeatPumpUsageKwh(hotWaterHeatPumpUsage);
            request.setHeatingHeatPumpUsageKwh(heatingHeatPumpUsage);
            
            CarbonSavingsResult result = carbonSavingsService.calculateCarbonSavings(request);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get carbon emission factors used in calculations
     * 
     * @return JSON object with current emission factors
     */
    @GetMapping("/emission-factors")
    public ResponseEntity<Object> getEmissionFactors() {
        return ResponseEntity.ok(new Object() {
            public final double gasEmissionFactor = 0.183;        // kgCO₂/kWh
            public final double electricityEmissionFactor = 0.148; // kgCO₂/kWh
            public final String gasSource = "UK 2025 gas emission factor";
            public final String electricitySource = "UK 2025 electricity grid emission factor";
            public final String scope1Description = "Direct emissions from gas combustion";
            public final String scope2Description = "Indirect emissions from electricity consumption";
        });
    }
} 