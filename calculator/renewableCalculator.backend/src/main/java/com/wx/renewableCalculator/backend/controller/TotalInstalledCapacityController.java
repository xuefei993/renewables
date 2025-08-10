package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.TotalInstalledCapacityRequest;
import com.wx.renewableCalculator.backend.dto.TotalInstalledCapacityResult;
import com.wx.renewableCalculator.backend.entity.SolarPanelType;
import com.wx.renewableCalculator.backend.repository.SolarPanelTypeRepository;
import com.wx.renewableCalculator.backend.service.TotalInstalledCapacityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solar-capacity")
@CrossOrigin(origins = "http://localhost:3000")
public class TotalInstalledCapacityController {

    @Autowired
    private TotalInstalledCapacityService totalInstalledCapacityService;

    @Autowired
    private SolarPanelTypeRepository solarPanelTypeRepository;

    /**
     * Calculate total installed capacity
     * POST /api/solar-capacity/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<TotalInstalledCapacityResult> calculateTotalInstalledCapacity(
            @RequestBody TotalInstalledCapacityRequest request) {
        
        TotalInstalledCapacityResult result = totalInstalledCapacityService
                .calculateTotalInstalledCapacity(request);
        
        return ResponseEntity.ok(result);
    }

    /**
     * Get all available solar panel types
     * GET /api/solar-capacity/panel-types
     */
    @GetMapping("/panel-types")
    public ResponseEntity<List<SolarPanelType>> getAllSolarPanelTypes() {
        List<SolarPanelType> panelTypes = solarPanelTypeRepository.findByOrderByRatedPowerPerPanelDesc();
        return ResponseEntity.ok(panelTypes);
    }

    /**
     * Get solar panel type by ID
     * GET /api/solar-capacity/panel-types/{id}
     */
    @GetMapping("/panel-types/{id}")
    public ResponseEntity<SolarPanelType> getSolarPanelTypeById(@PathVariable Long id) {
        return solarPanelTypeRepository.findById(id)
                .map(panelType -> ResponseEntity.ok(panelType))
                .orElse(ResponseEntity.notFound().build());
    }
} 