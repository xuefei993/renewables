package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.LocationSpecificYieldRequest;
import com.wx.renewableCalculator.backend.dto.LocationSpecificYieldResult;
import com.wx.renewableCalculator.backend.entity.MonthlySolarIrradiance;
import com.wx.renewableCalculator.backend.repository.MonthlySolarIrradianceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LocationSpecificYieldService {

    @Autowired
    private MonthlySolarIrradianceRepository solarIrradianceRepository;

    @Autowired
    private NASAPowerService nasaPowerService;

    // Conversion factor as specified in the formula
    private static final Double CONVERSION_FACTOR = 0.8;

    /**
     * Calculate Location Specific Yield Per Month using the formula:
     * Location Specific Yield = Solar Irradiance Daily × Days in Month × 0.8
     * 
     * @param request Location specific yield calculation parameters
     * @return Location specific yield calculation results for all 12 months
     */
    public LocationSpecificYieldResult calculateLocationSpecificYield(LocationSpecificYieldRequest request) {
        LocationSpecificYieldResult result = new LocationSpecificYieldResult();
        result.setLatitude(request.getLatitude());
        result.setLongitude(request.getLongitude());
        result.setLocation(request.getLocation());
        
        // First, try to get or fetch solar irradiance data using NASA POWER API
        Map<String, Object> nasaResult = nasaPowerService.fetchAndStoreSolarData(
            request.getLatitude(), request.getLongitude(), request.getLocation());
        
        Map<Integer, BigDecimal> monthlyYield = new HashMap<>();
        Map<Integer, BigDecimal> monthlySolarIrradiance = new HashMap<>();
        Map<Integer, Integer> daysInMonth = new HashMap<>();
        
        double totalYearlyYield = 0.0;
        
        // Calculate for each month (1-12)
        for (int month = 1; month <= 12; month++) {
            // Get solar irradiance data for this month
            Double dailySolarIrradiance = getSolarIrradianceForMonth(nasaResult, month, 
                request.getLatitude(), request.getLongitude());
            
            // Get number of days in this month (using current year, could be made configurable)
            int daysInThisMonth = getDaysInMonth(month, Year.now().getValue());
            
            // Apply the formula: Solar Irradiance Daily × Days in Month × 0.8
            Double monthlyYieldValue = dailySolarIrradiance * daysInThisMonth * CONVERSION_FACTOR;
            
            // Store results
            monthlyYield.put(month, BigDecimal.valueOf(monthlyYieldValue).setScale(2, RoundingMode.HALF_UP));
            monthlySolarIrradiance.put(month, BigDecimal.valueOf(dailySolarIrradiance).setScale(4, RoundingMode.HALF_UP));
            daysInMonth.put(month, daysInThisMonth);
            
            totalYearlyYield += monthlyYieldValue;
        }
        
        result.setMonthlyYield(monthlyYield);
        result.setMonthlySolarIrradiance(monthlySolarIrradiance);
        result.setDaysInMonth(daysInMonth);
        result.setAverageYearlyYield(BigDecimal.valueOf(totalYearlyYield / 12.0).setScale(2, RoundingMode.HALF_UP));
        
        return result;
    }

    /**
     * Get solar irradiance data for a specific month
     * Uses NASA POWER API result, database cache, or default values as fallback
     */
    private Double getSolarIrradianceForMonth(Map<String, Object> nasaResult, Integer month, 
                                             Double latitude, Double longitude) {
        
        // First, try to get from NASA POWER API result
        if ((Boolean) nasaResult.get("success")) {
            @SuppressWarnings("unchecked")
            Map<Integer, Double> monthlyData = (Map<Integer, Double>) nasaResult.get("data");
            if (monthlyData.containsKey(month)) {
                return monthlyData.get(month);
            }
        }
        
        // Second, try to get from database
        Optional<MonthlySolarIrradiance> irradianceOpt = solarIrradianceRepository
                .findByLatitudeAndLongitudeAndMonth(latitude, longitude, month);
        
        if (irradianceOpt.isPresent()) {
            return irradianceOpt.get().getDailySolarIrradiance();
        }
        
        // Third, try to find nearby location
        List<MonthlySolarIrradiance> nearbyData = solarIrradianceRepository
                .findNearbyLocation(latitude, longitude);
        
        for (MonthlySolarIrradiance data : nearbyData) {
            if (data.getMonth().equals(month)) {
                return data.getDailySolarIrradiance();
            }
        }
        
        // If no data found, return default values based on UK averages
        return getDefaultSolarIrradiance(month);
    }

    /**
     * Get number of days in a specific month and year
     */
    private int getDaysInMonth(int month, int year) {
        return switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> 31;  // January, March, May, July, August, October, December
            case 4, 6, 9, 11 -> 30;             // April, June, September, November
            case 2 -> Year.of(year).isLeap() ? 29 : 28;  // February (leap year consideration)
            default -> throw new IllegalArgumentException("Invalid month: " + month);
        };
    }

    /**
     * Default solar irradiance values for UK (approximate values)
     * Used only as final fallback when NASA API and database are unavailable
     */
    private Double getDefaultSolarIrradiance(Integer month) {
        // Approximate UK solar irradiance values (kWh/m²/day)
        return switch (month) {
            case 1 -> 0.5;   // January
            case 2 -> 1.2;   // February
            case 3 -> 2.5;   // March
            case 4 -> 4.0;   // April
            case 5 -> 5.2;   // May
            case 6 -> 5.8;   // June
            case 7 -> 5.5;   // July
            case 8 -> 4.8;   // August
            case 9 -> 3.2;   // September
            case 10 -> 1.8;  // October
            case 11 -> 0.8;  // November
            case 12 -> 0.4;  // December
            default -> 3.0;  // Default fallback
        };
    }
} 