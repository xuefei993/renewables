package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.SolarPotentialRequest;
import com.wx.renewableCalculator.backend.dto.SolarPotentialResult;
import com.wx.renewableCalculator.backend.service.SolarPotentialService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solar-potential")
public class SolarPotentialController {

    private final SolarPotentialService solarPotentialService;

    public SolarPotentialController(SolarPotentialService solarPotentialService) {
        this.solarPotentialService = solarPotentialService;
    }

    @PostMapping
    public SolarPotentialResult calculateSolarPotential(@RequestBody SolarPotentialRequest request) {
        return solarPotentialService.calculateSolarPotential(request);
    }
} 