package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.LocationSpecificYieldRequest;
import com.wx.renewableCalculator.backend.dto.LocationSpecificYieldResult;
import com.wx.renewableCalculator.backend.service.LocationSpecificYieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location-yield")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationSpecificYieldController {

    @Autowired
    private LocationSpecificYieldService locationSpecificYieldService;

    /**
     * Calculate location specific yield per month for all 12 months
     * POST /api/location-yield/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<LocationSpecificYieldResult> calculateLocationSpecificYield(
            @RequestBody LocationSpecificYieldRequest request) {
        
        LocationSpecificYieldResult result = locationSpecificYieldService
                .calculateLocationSpecificYield(request);
        
        return ResponseEntity.ok(result);
    }

    /**
     * Calculate location specific yield for a specific month
     * GET /api/location-yield/month/{month}?latitude={lat}&longitude={lng}
     */
    @GetMapping("/month/{month}")
    public ResponseEntity<LocationSpecificYieldResult> calculateLocationSpecificYieldForMonth(
            @PathVariable Integer month,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) String location) {
        
        // Create a request for the full year calculation, then extract the specific month
        LocationSpecificYieldRequest request = new LocationSpecificYieldRequest();
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setLocation(location);
        
        LocationSpecificYieldResult fullResult = locationSpecificYieldService
                .calculateLocationSpecificYield(request);
        
        // Could create a separate method for single month if needed
        return ResponseEntity.ok(fullResult);
    }
} 