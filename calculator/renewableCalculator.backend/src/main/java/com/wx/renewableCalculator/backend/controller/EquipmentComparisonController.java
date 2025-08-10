package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.EquipmentComparisonRequest;
import com.wx.renewableCalculator.backend.dto.EquipmentComparisonResult;
import com.wx.renewableCalculator.backend.service.EquipmentComparisonService;
import com.wx.renewableCalculator.backend.entity.*;
import com.wx.renewableCalculator.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipmentComparisonController {
    
    @Autowired
    private EquipmentComparisonService equipmentComparisonService;
    
    @Autowired
    private SolarPanelTypeRepository solarPanelTypeRepository;
    
    @Autowired
    private BatteryRepository batteryRepository;
    
    @Autowired
    private HeatPumpRepository heatPumpRepository;
    
    /**
     * Compare selected equipment options with detailed annual and monthly analysis
     * 
     * @param request Contains equipment selection and user property parameters
     * @return Detailed comparison with financial and environmental metrics
     */
    @PostMapping("/compare")
    public ResponseEntity<EquipmentComparisonResult> compareEquipment(
            @RequestBody EquipmentComparisonRequest request) {
        
        try {
            // Validate request
            if (!Boolean.TRUE.equals(request.getHasSolarPanels()) && 
                !Boolean.TRUE.equals(request.getHasHeatPump()) && 
                !Boolean.TRUE.equals(request.getHasBattery())) {
                return ResponseEntity.badRequest().build();
            }
            
            EquipmentComparisonResult result = equipmentComparisonService.compareEquipment(request);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get available solar panel types for selection
     * 
     * @return List of all solar panel types in database
     */
    @GetMapping("/solar-panels/available")
    public ResponseEntity<List<SolarPanelType>> getAvailableSolarPanels() {
        try {
            List<SolarPanelType> solarPanels = solarPanelTypeRepository.findAll();
            return ResponseEntity.ok(solarPanels);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get available heat pump types for selection
     * 
     * @return List of all heat pump types in database
     */
    @GetMapping("/heat-pumps/available")
    public ResponseEntity<List<HeatPump>> getAvailableHeatPumps() {
        try {
            List<HeatPump> heatPumps = heatPumpRepository.findAll();
            return ResponseEntity.ok(heatPumps);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get available battery types for selection
     * 
     * @return List of all battery types in database
     */
    @GetMapping("/batteries/available")
    public ResponseEntity<List<Battery>> getAvailableBatteries() {
        try {
            List<Battery> batteries = batteryRepository.findAll();
            return ResponseEntity.ok(batteries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get equipment recommendations based on user property characteristics
     * 
     * @param houseArea House area in m²
     * @param occupants Number of occupants
     * @param annualElectricityUsage Annual electricity usage in kWh
     * @param annualGasUsage Annual gas usage in kWh
     * @param roofArea Available roof area in m²
     * @return Recommended equipment IDs for each category
     */
    @GetMapping("/recommendations")
    public ResponseEntity<Object> getEquipmentRecommendations(
            @RequestParam(defaultValue = "100") Double houseArea,
            @RequestParam(defaultValue = "3") Integer occupants,
            @RequestParam(defaultValue = "3000") Double annualElectricityUsage,
            @RequestParam(defaultValue = "15000") Double annualGasUsage,
            @RequestParam(defaultValue = "30") Double roofArea) {
        
        try {
            // Simple recommendation logic - can be enhanced
            Object recommendations = new Object() {
                public final RecommendationCategory solar = new RecommendationCategory() {{
                    if (roofArea >= 20) {
                        recommended = true;
                        reason = "Sufficient roof area for solar installation";
                        suggestedIds = getSolarRecommendations(roofArea);
                    } else {
                        recommended = false;
                        reason = "Insufficient roof area for effective solar installation";
                        suggestedIds = new java.util.ArrayList<>();
                    }
                }};
                
                public final RecommendationCategory heatPump = new RecommendationCategory() {{
                    if (annualGasUsage > 10000) {
                        recommended = true;
                        reason = "High gas usage makes heat pump cost-effective";
                        suggestedIds = getHeatPumpRecommendations(houseArea);
                    } else {
                        recommended = false;
                        reason = "Low gas usage may not justify heat pump installation";
                        suggestedIds = new java.util.ArrayList<>();
                    }
                }};
                
                public final RecommendationCategory battery = new RecommendationCategory() {{
                    if (annualElectricityUsage > 2500) {
                        recommended = true;
                        reason = "Good electricity usage for battery storage benefits";
                        suggestedIds = getBatteryRecommendations(annualElectricityUsage);
                    } else {
                        recommended = false;
                        reason = "Low electricity usage may not justify battery storage";
                        suggestedIds = new java.util.ArrayList<>();
                    }
                }};
            };
            
            return ResponseEntity.ok(recommendations);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Helper classes for recommendations
    public static class RecommendationCategory {
        public boolean recommended;
        public String reason;
        public List<Long> suggestedIds;
    }
    
    // Helper methods for recommendations
    private List<Long> getSolarRecommendations(Double roofArea) {
        List<SolarPanelType> panels = solarPanelTypeRepository.findAll();
        return panels.stream()
                .filter(p -> p.getEfficiency() != null && p.getEfficiency() > 18) // High efficiency panels
                .limit(3)
                .map(SolarPanelType::getId)
                .collect(java.util.stream.Collectors.toList());
    }
    
    private List<Long> getHeatPumpRecommendations(Double houseArea) {
        List<HeatPump> heatPumps = heatPumpRepository.findAll();
        return heatPumps.stream()
                .filter(hp -> hp.getCop() != null && hp.getCop().doubleValue() > 3.0) // High COP
                .limit(3)
                .map(hp -> hp.getId().longValue())
                .collect(java.util.stream.Collectors.toList());
    }
    
    private List<Long> getBatteryRecommendations(Double annualElectricityUsage) {
        List<Battery> batteries = batteryRepository.findAll();
        double dailyUsage = annualElectricityUsage / 365.0;
        return batteries.stream()
                .filter(b -> b.getCapacityKwh() != null && 
                           b.getCapacityKwh().doubleValue() >= dailyUsage * 0.3 && 
                           b.getCapacityKwh().doubleValue() <= dailyUsage * 1.2)
                .limit(3)
                .map(b -> b.getId().longValue())
                .collect(java.util.stream.Collectors.toList());
    }
} 