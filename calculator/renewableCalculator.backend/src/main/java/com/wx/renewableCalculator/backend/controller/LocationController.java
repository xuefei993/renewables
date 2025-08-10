package com.wx.renewableCalculator.backend.controller;

import com.wx.renewableCalculator.backend.dto.CityDto;
import com.wx.renewableCalculator.backend.dto.RegionDto;
import com.wx.renewableCalculator.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {

    @Autowired
    private LocationService locationService;

    /**
     * Get all regions with their cities
     * GET /api/locations/regions
     */
    @GetMapping("/regions")
    public ResponseEntity<List<RegionDto>> getAllRegions() {
        List<RegionDto> regions = locationService.getAllRegionsWithCities();
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country
     * GET /api/locations/regions?country=England
     */
    @GetMapping("/regions/country/{country}")
    public ResponseEntity<List<RegionDto>> getRegionsByCountry(@PathVariable String country) {
        List<RegionDto> regions = locationService.getRegionsByCountry(country);
        return ResponseEntity.ok(regions);
    }

    /**
     * Search cities by name
     * GET /api/locations/cities/search?name=London
     */
    @GetMapping("/cities/search")
    public ResponseEntity<List<CityDto>> searchCities(@RequestParam String name) {
        List<CityDto> cities = locationService.searchCitiesByName(name);
        return ResponseEntity.ok(cities);
    }

    /**
     * Search cities by postcode prefix
     * GET /api/locations/cities/postcode?prefix=SW1
     */
    @GetMapping("/cities/postcode")
    public ResponseEntity<List<CityDto>> searchCitiesByPostcode(@RequestParam String prefix) {
        List<CityDto> cities = locationService.searchCitiesByPostcode(prefix);
        return ResponseEntity.ok(cities);
    }

    /**
     * Get cities by country
     * GET /api/locations/cities/country/England
     */
    @GetMapping("/cities/country/{country}")
    public ResponseEntity<List<CityDto>> getCitiesByCountry(@PathVariable String country) {
        List<CityDto> cities = locationService.getCitiesByCountry(country);
        return ResponseEntity.ok(cities);
    }
} 