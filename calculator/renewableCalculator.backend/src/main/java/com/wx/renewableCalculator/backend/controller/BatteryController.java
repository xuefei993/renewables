package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.entity.Battery;
import com.wx.renewableCalculator.backend.repository.BatteryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batteries")
public class BatteryController {

    private final BatteryRepository batteryRepository;

    public BatteryController(BatteryRepository batteryRepository) {
        this.batteryRepository = batteryRepository;
    }

    @GetMapping
    public List<Battery> getAllBatteries() {
        return batteryRepository.findAll();
    }

    @PostMapping
    public Battery addBattery(@RequestBody Battery battery) {
        return batteryRepository.save(battery);
    }
}
