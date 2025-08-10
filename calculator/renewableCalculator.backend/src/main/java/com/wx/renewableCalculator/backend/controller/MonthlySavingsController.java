package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.MonthlySavingsRequest;
import com.wx.renewableCalculator.backend.dto.MonthlySavingsResult;
import com.wx.renewableCalculator.backend.service.MonthlySavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "http://localhost:3000")
public class MonthlySavingsController {
    
    @Autowired
    private MonthlySavingsService monthlySavingsService;
    
    /**
     * Calculate monthly savings for renewable energy systems
     * 
     * Formula: Stm = Ssolar,m + Sheat pump,m + Sbattery,m + Ssupport,m
     * - If equipment is not installed, its savings = 0
     * 
     * @param request Contains equipment selection and usage parameters
     * @return Monthly savings calculation result with detailed breakdown
     */
    @PostMapping("/monthly")
    public ResponseEntity<MonthlySavingsResult> calculateMonthlySavings(
            @RequestBody MonthlySavingsRequest request) {
        
        try {
            // Validate request
            if (request.getMonth() == null || request.getMonth() < 1 || request.getMonth() > 12) {
                return ResponseEntity.badRequest().build();
            }
            
            MonthlySavingsResult result = monthlySavingsService.calculateMonthlySavings(request);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get monthly savings breakdown for specific equipment configuration
     * 
     * @param hasSolar Whether solar panels are installed
     * @param hasHeatPump Whether heat pump is installed
     * @param hasBattery Whether battery is installed
     * @param hasSupport Whether support equipment is installed
     * @param month Month (1-12)
     * @param homeOccupancy Home occupancy factor (0-1)
     * @param solarGeneration Monthly solar generation (kWh)
     * @param electricityUsage Monthly electricity usage (kWh)
     * @param electricityRate Electricity rate (pence/kWh)
     * @return Monthly savings calculation result
     */
    @GetMapping("/monthly/quick")
    public ResponseEntity<MonthlySavingsResult> getQuickMonthlySavings(
            @RequestParam(defaultValue = "false") Boolean hasSolar,
            @RequestParam(defaultValue = "false") Boolean hasHeatPump,
            @RequestParam(defaultValue = "false") Boolean hasBattery,
            @RequestParam(defaultValue = "false") Boolean hasSupport,
            @RequestParam Integer month,
            @RequestParam(defaultValue = "0.5") Double homeOccupancy,
            @RequestParam(defaultValue = "0") Double solarGeneration,
            @RequestParam(defaultValue = "300") Double electricityUsage,
            @RequestParam(defaultValue = "30") Double electricityRate) {
        
        try {
            MonthlySavingsRequest request = new MonthlySavingsRequest();
            request.setHasSolarPanels(hasSolar);
            request.setHasHeatPump(hasHeatPump);
            request.setHasBattery(hasBattery);
            request.setHasSupportEquipment(hasSupport);
            request.setMonth(month);
            request.setHomeOccupancyFactor(homeOccupancy);
            request.setSolarGenerationKwh(solarGeneration);
            request.setMonthlyElectricityUsageKwh(electricityUsage);
            request.setElectricityRate(electricityRate);
            
            MonthlySavingsResult result = monthlySavingsService.calculateMonthlySavings(request);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 