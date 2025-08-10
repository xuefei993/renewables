package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.entity.HeatPump;
import com.wx.renewableCalculator.backend.repository.HeatPumpRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heat-pumps")
public class HeatPumpController {

    private final HeatPumpRepository heatPumpRepository;

    public HeatPumpController(HeatPumpRepository heatPumpRepository) {
        this.heatPumpRepository = heatPumpRepository;
    }

    @GetMapping
    public List<HeatPump> getAllHeatPumps() {
        return heatPumpRepository.findAll();
    }

    @PostMapping
    public HeatPump addHeatPump(@RequestBody HeatPump pump) {
        return heatPumpRepository.save(pump);
    }
}
