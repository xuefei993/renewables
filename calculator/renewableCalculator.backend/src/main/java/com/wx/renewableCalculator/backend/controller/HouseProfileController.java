package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.entity.HouseProfile;
import com.wx.renewableCalculator.backend.repository.HouseProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/house-profile")
public class HouseProfileController {

    private final HouseProfileRepository houseRepo;

    public HouseProfileController(HouseProfileRepository houseRepo) {
        this.houseRepo = houseRepo;
    }

    @GetMapping
    public List<HouseProfile> getAllProfiles() {
        return houseRepo.findAll();
    }

    @PostMapping
    public HouseProfile addProfile(@RequestBody HouseProfile profile) {
        return houseRepo.save(profile);
    }
}
