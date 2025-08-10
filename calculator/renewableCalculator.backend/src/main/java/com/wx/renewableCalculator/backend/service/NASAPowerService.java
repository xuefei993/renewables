package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.entity.MonthlySolarIrradiance;
import com.wx.renewableCalculator.backend.repository.MonthlySolarIrradianceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

@Service
public class NASAPowerService {

    @Autowired
    private MonthlySolarIrradianceRepository solarIrradianceRepository;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public NASAPowerService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Fetch solar irradiance data from NASA POWER API for past 5 years
     * and store in database for future use
     */
    public Map<String, Object> fetchAndStoreSolarData(Double latitude, Double longitude, String location) {
        try {
            // Check if we already have recent data for this location
            List<MonthlySolarIrradiance> existingData = solarIrradianceRepository
                    .findByLatitudeAndLongitudeOrderByMonth(latitude, longitude);
            
            if (existingData.size() == 12 && isDataRecent(existingData.get(0).getLastUpdated())) {
                return Map.of(
                    "success", true,
                    "source", "cache",
                    "message", "Using cached data from database",
                    "data", formatMonthlyData(existingData)
                );
            }

            // Fetch new data from NASA POWER API
            Map<String, Object> nasaResult = fetchFromNASAPowerAPI(latitude, longitude);
            
            if ((Boolean) nasaResult.get("success")) {
                // Store the data in database
                @SuppressWarnings("unchecked")
                Map<Integer, Double> monthlyData = (Map<Integer, Double>) nasaResult.get("monthlyData");
                storeSolarIrradianceData(latitude, longitude, location, monthlyData);
                
                return Map.of(
                    "success", true,
                    "source", "nasa_api",
                    "message", "Fetched fresh data from NASA POWER API",
                    "data", monthlyData
                );
            } else {
                // If NASA API fails, try to use nearby cached data
                List<MonthlySolarIrradiance> nearbyData = solarIrradianceRepository
                        .findNearbyLocation(latitude, longitude);
                
                if (!nearbyData.isEmpty()) {
                    return Map.of(
                        "success", true,
                        "source", "nearby_cache",
                        "message", "Using nearby cached data",
                        "data", formatNearbyData(nearbyData)
                    );
                }
                
                return nasaResult; // Return the error from NASA API
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Service error: " + e.getMessage()
            );
        }
    }

    /**
     * Fetch solar irradiance data from NASA POWER API
     */
    private Map<String, Object> fetchFromNASAPowerAPI(Double latitude, Double longitude) {
        try {
            // Calculate date range (past 5 years, ending last year)
            int currentYear = Year.now().getValue();
            int endYear = currentYear - 1;
            int startYear = Math.max(endYear - 4, 1981); // NASA data starts from 1981
            
            // Build NASA POWER API URL (same as frontend implementation)
            String url = String.format(
                "https://power.larc.nasa.gov/api/temporal/monthly/point?" +
                "parameters=ALLSKY_SFC_SW_DWN&" +
                "community=RE&" +
                "longitude=%.6f&" +
                "latitude=%.6f&" +
                "start=%d&" +
                "end=%d&" +
                "format=JSON",
                longitude, latitude, startYear, endYear
            );

            System.out.println("NASA POWER API URL: " + url);
            System.out.println(String.format("Date range: %d-%d (%d years)", startYear, endYear, endYear - startYear + 1));

            // Make API call with proper headers
            try {
                String response = restTemplate.getForObject(url, String.class);
                return parseNASAResponse(response);
                
            } catch (HttpClientErrorException e) {
                System.out.println("NASA API failed, trying simple climatology API...");
                return fetchFromNASAClimatologyAPI(latitude, longitude);
                
            } catch (ResourceAccessException e) {
                return Map.of(
                    "success", false,
                    "error", "Network error accessing NASA API: " + e.getMessage()
                );
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "NASA API error: " + e.getMessage()
            );
        }
    }

    /**
     * Fallback to NASA climatology API (same as frontend implementation)
     */
    private Map<String, Object> fetchFromNASAClimatologyAPI(Double latitude, Double longitude) {
        try {
            String url = String.format(
                "https://power.larc.nasa.gov/api/temporal/climatology/point?" +
                "parameters=ALLSKY_SFC_SW_DWN&" +
                "community=RE&" +
                "longitude=%.6f&" +
                "latitude=%.6f&" +
                "format=JSON",
                longitude, latitude
            );

            System.out.println("NASA POWER Simple API URL: " + url);

            String response = restTemplate.getForObject(url, String.class);
            return parseNASAClimatologyResponse(response);
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Simple NASA API network error: " + e.getMessage()
            );
        }
    }

    /**
     * Parse NASA POWER API response (monthly temporal data)
     */
    private Map<String, Object> parseNASAResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            
            if (rootNode.has("properties") && 
                rootNode.get("properties").has("parameter") &&
                rootNode.get("properties").get("parameter").has("ALLSKY_SFC_SW_DWN")) {
                
                JsonNode solarData = rootNode.get("properties").get("parameter").get("ALLSKY_SFC_SW_DWN");
                Map<Integer, Double> monthlyData = processSolarData(solarData, false);
                
                return Map.of(
                    "success", true,
                    "monthlyData", monthlyData,
                    "source", "nasa_temporal"
                );
            } else {
                return Map.of(
                    "success", false,
                    "error", "Invalid NASA API response structure"
                );
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Error parsing NASA response: " + e.getMessage()
            );
        }
    }

    /**
     * Parse NASA climatology API response
     */
    private Map<String, Object> parseNASAClimatologyResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            
            if (rootNode.has("properties") && 
                rootNode.get("properties").has("parameter") &&
                rootNode.get("properties").get("parameter").has("ALLSKY_SFC_SW_DWN")) {
                
                JsonNode solarData = rootNode.get("properties").get("parameter").get("ALLSKY_SFC_SW_DWN");
                Map<Integer, Double> monthlyData = processSolarData(solarData, true);
                
                return Map.of(
                    "success", true,
                    "monthlyData", monthlyData,
                    "source", "nasa_climatology"
                );
            } else {
                return Map.of(
                    "success", false,
                    "error", "Invalid NASA climatology response structure"
                );
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Error parsing NASA climatology response: " + e.getMessage()
            );
        }
    }

    /**
     * Process NASA solar data (same logic as frontend)
     */
    private Map<Integer, Double> processSolarData(JsonNode nasaData, boolean isClimatology) {
        Map<Integer, Double> monthlyData = new HashMap<>();
        
        if (isClimatology) {
            // Process climatology data (monthly averages)
            Iterator<String> fieldNames = nasaData.fieldNames();
            while (fieldNames.hasNext()) {
                String month = fieldNames.next();
                double value = nasaData.get(month).asDouble();
                monthlyData.put(Integer.parseInt(month), Math.round(value * 100.0) / 100.0);
            }
        } else {
            // Process time series data and calculate monthly averages
            for (int month = 1; month <= 12; month++) {
                String monthStr = String.format("%02d", month);
                
                List<Double> monthValues = new ArrayList<>();
                Iterator<String> fieldNames = nasaData.fieldNames();
                
                while (fieldNames.hasNext()) {
                    String key = fieldNames.next();
                    if (key.endsWith(monthStr)) {
                        double value = nasaData.get(key).asDouble();
                        if (!Double.isNaN(value) && value >= 0) {
                            monthValues.add(value);
                        }
                    }
                }
                
                double avgValue = monthValues.isEmpty() ? 0.0 : 
                    monthValues.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
                
                monthlyData.put(month, Math.round(avgValue * 100.0) / 100.0);
            }
        }
        
        System.out.println("Processed solar data: " + monthlyData);
        return monthlyData;
    }

    /**
     * Store solar irradiance data in database
     */
    private void storeSolarIrradianceData(Double latitude, Double longitude, String location, Map<Integer, Double> monthlyData) {
        // Delete existing data for this location
        List<MonthlySolarIrradiance> existingData = solarIrradianceRepository
                .findByLatitudeAndLongitudeOrderByMonth(latitude, longitude);
        if (!existingData.isEmpty()) {
            solarIrradianceRepository.deleteAll(existingData);
        }

        // Store new data
        for (Map.Entry<Integer, Double> entry : monthlyData.entrySet()) {
            MonthlySolarIrradiance irradiance = new MonthlySolarIrradiance(
                latitude, longitude, entry.getKey(), entry.getValue());
            irradiance.setLocation(location);
            irradiance.setLastUpdated(LocalDateTime.now());
            solarIrradianceRepository.save(irradiance);
        }
    }

    /**
     * Check if cached data is recent (less than 30 days old)
     */
    private boolean isDataRecent(LocalDateTime lastUpdated) {
        return lastUpdated != null && 
               lastUpdated.isAfter(LocalDateTime.now().minusDays(30));
    }

    /**
     * Format existing monthly data for response
     */
    private Map<Integer, Double> formatMonthlyData(List<MonthlySolarIrradiance> data) {
        Map<Integer, Double> monthlyData = new HashMap<>();
        for (MonthlySolarIrradiance irradiance : data) {
            monthlyData.put(irradiance.getMonth(), irradiance.getDailySolarIrradiance());
        }
        return monthlyData;
    }

    /**
     * Format nearby data for response
     */
    private Map<Integer, Double> formatNearbyData(List<MonthlySolarIrradiance> nearbyData) {
        Map<Integer, Double> monthlyData = new HashMap<>();
        
        // Group by month and take first available value
        for (int month = 1; month <= 12; month++) {
            final int currentMonth = month;
            nearbyData.stream()
                .filter(data -> data.getMonth().equals(currentMonth))
                .findFirst()
                .ifPresent(data -> monthlyData.put(currentMonth, data.getDailySolarIrradiance()));
        }
        
        return monthlyData;
    }
} 