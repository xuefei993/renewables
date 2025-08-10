package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.CityDto;
import com.wx.renewableCalculator.backend.dto.RegionDto;
import com.wx.renewableCalculator.backend.entity.City;
import com.wx.renewableCalculator.backend.entity.Region;
import com.wx.renewableCalculator.backend.repository.CityRepository;
import com.wx.renewableCalculator.backend.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private CityRepository cityRepository;

    /**
     * Get all regions with their cities
     */
    public List<RegionDto> getAllRegionsWithCities() {
        List<Region> regions = regionRepository.findAllWithCities();
        return regions.stream()
                .map(this::convertToRegionDto)
                .collect(Collectors.toList());
    }

    /**
     * Get regions by country
     */
    public List<RegionDto> getRegionsByCountry(String country) {
        List<Region> regions = regionRepository.findByCountry(country);
        return regions.stream()
                .map(this::convertToRegionDto)
                .collect(Collectors.toList());
    }

    /**
     * Search cities by name
     */
    public List<CityDto> searchCitiesByName(String name) {
        List<City> cities = cityRepository.findByNameContainingIgnoreCase(name);
        return cities.stream()
                .map(this::convertToCityDto)
                .collect(Collectors.toList());
    }

    /**
     * Search cities by postcode prefix
     */
    public List<CityDto> searchCitiesByPostcode(String postcode) {
        List<City> cities = cityRepository.findByPostcodeStartingWith(postcode);
        return cities.stream()
                .map(this::convertToCityDto)
                .collect(Collectors.toList());
    }

    /**
     * Get cities by country
     */
    public List<CityDto> getCitiesByCountry(String country) {
        List<City> cities = cityRepository.findByCountry(country);
        return cities.stream()
                .map(this::convertToCityDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert Region entity to RegionDto
     */
    private RegionDto convertToRegionDto(Region region) {
        List<CityDto> cityDtos = region.getCities().stream()
                .map(this::convertToCityDto)
                .collect(Collectors.toList());

        return new RegionDto(
                region.getId(),
                region.getName(),
                region.getCountry(),
                cityDtos
        );
    }

    /**
     * Convert City entity to CityDto
     */
    private CityDto convertToCityDto(City city) {
        return new CityDto(
                city.getId(),
                city.getName(),
                city.getPostcode(),
                city.getRegion().getName(),
                city.getRegion().getCountry(),
                city.getLatitude(),
                city.getLongitude(),
                city.getSolarIrradiance()
        );
    }
} 