package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.MonthlyElectricityGenerationRequest;
import com.wx.renewableCalculator.backend.dto.MonthlyElectricityGenerationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class SolarElectricityGenerationService {

    // Shading correction factors (same as in SolarPotentialService)
    private static final Map<String, Double> SHADING_CORRECTION_FACTORS = new HashMap<>();
    static {
        SHADING_CORRECTION_FACTORS.put("no-shading", 1.0);
        SHADING_CORRECTION_FACTORS.put("light", 0.90);
        SHADING_CORRECTION_FACTORS.put("moderate", 0.70);
        SHADING_CORRECTION_FACTORS.put("heavy", 0.50);
        SHADING_CORRECTION_FACTORS.put("extreme", 0.20);
    }

    // Tilt and Orientation Correction Factor table (same as in SolarPotentialService)
    private static final int[][] TILT_ORIENTATION_FACTORS = {
        // 0° tilt (flat roof)
        {82, 82, 82, 82, 82, 82, 82, 82, 82, 82, 82, 82, 82},
        // 10° tilt
        {80, 84, 85, 87, 88, 89, 91, 89, 88, 87, 85, 84, 80},
        // 20° tilt
        {73, 82, 85, 88, 91, 94, 97, 94, 91, 88, 85, 82, 73},
        // 30° tilt
        {60, 75, 80, 85, 90, 95, 100, 95, 90, 85, 80, 75, 60},
        // 40° tilt
        {60, 75, 80, 85, 90, 95, 100, 95, 90, 85, 80, 75, 60},
        // 50° tilt
        {62, 75, 79, 84, 88, 92, 97, 92, 88, 84, 79, 75, 62},
        // 60° tilt
        {62, 73, 76, 80, 83, 87, 91, 87, 83, 80, 76, 73, 62},
        // 70° tilt
        {59, 68, 70, 73, 76, 79, 82, 79, 76, 73, 70, 68, 59},
        // 80° tilt
        {54, 60, 62, 64, 66, 69, 71, 69, 66, 64, 62, 60, 54},
        // 90° tilt (vertical)
        {48, 52, 54, 56, 57, 58, 60, 58, 57, 56, 54, 52, 48}
    };

    // Orientation mapping (same as in SolarPotentialService)
    private static final Map<String, Integer> ORIENTATION_MAPPING = new HashMap<>();
    static {
        ORIENTATION_MAPPING.put("n", 0);     // North (0°)
        ORIENTATION_MAPPING.put("ne", 1);    // Northeast (30°)
        ORIENTATION_MAPPING.put("ene", 2);   // East-Northeast (60°)
        ORIENTATION_MAPPING.put("e", 3);     // East (90°)
        ORIENTATION_MAPPING.put("ese", 4);   // East-Southeast (120°)
        ORIENTATION_MAPPING.put("se", 5);    // Southeast (150°)
        ORIENTATION_MAPPING.put("s", 6);     // South (180°)
        ORIENTATION_MAPPING.put("sw", 7);    // Southwest (210°)
        ORIENTATION_MAPPING.put("wsw", 8);   // West-Southwest (240°)
        ORIENTATION_MAPPING.put("w", 9);     // West (270°)
        ORIENTATION_MAPPING.put("wnw", 10);  // West-Northwest (300°)
        ORIENTATION_MAPPING.put("nw", 11);   // Northwest (330°)
    };

    // Tilt angle mapping (same as in SolarPotentialService)
    private static final Map<Integer, Integer> TILT_MAPPING = new HashMap<>();
    static {
        TILT_MAPPING.put(0, 0); TILT_MAPPING.put(10, 1); TILT_MAPPING.put(20, 2); 
        TILT_MAPPING.put(30, 3); TILT_MAPPING.put(40, 4); TILT_MAPPING.put(50, 5); 
        TILT_MAPPING.put(60, 6); TILT_MAPPING.put(70, 7); TILT_MAPPING.put(80, 8); 
        TILT_MAPPING.put(90, 9);
    }

    /**
     * Calculate monthly electricity generation using the formula:
     * Monthly Generation = Total Installed Capacity × Location Specific Yield Per Month × 
     *                     Tilt and Orientation Correction Factor × Shading Correction Factor
     * 
     * @param request Monthly electricity generation calculation parameters
     * @return Monthly electricity generation calculation results
     */
    public MonthlyElectricityGenerationResult calculateMonthlyElectricityGeneration(MonthlyElectricityGenerationRequest request) {
        // Get individual factors
        Double shadingCorrectionFactor = SHADING_CORRECTION_FACTORS.getOrDefault(request.getShadingLevel(), 1.0);
        Double tiltOrientationCorrectionFactor = getTiltOrientationCorrectionFactor(request.getTiltAngle(), request.getOrientation());
        
        // Apply the formula: Total Installed Capacity × Location Specific Yield Per Month × 
        //                    Tilt and Orientation Correction Factor × Shading Correction Factor
        Double monthlyGeneration = request.getTotalInstalledCapacity() * 
                                  request.getLocationSpecificYieldPerMonth() * 
                                  tiltOrientationCorrectionFactor * 
                                  shadingCorrectionFactor;
        
        MonthlyElectricityGenerationResult result = new MonthlyElectricityGenerationResult();
        result.setMonthlyElectricityGeneration(BigDecimal.valueOf(monthlyGeneration).setScale(2, RoundingMode.HALF_UP));
        result.setTotalInstalledCapacity(BigDecimal.valueOf(request.getTotalInstalledCapacity()).setScale(2, RoundingMode.HALF_UP));
        result.setLocationSpecificYieldPerMonth(BigDecimal.valueOf(request.getLocationSpecificYieldPerMonth()).setScale(2, RoundingMode.HALF_UP));
        result.setTiltOrientationCorrectionFactor(BigDecimal.valueOf(tiltOrientationCorrectionFactor).setScale(4, RoundingMode.HALF_UP));
        result.setShadingCorrectionFactor(BigDecimal.valueOf(shadingCorrectionFactor).setScale(2, RoundingMode.HALF_UP));
        
        return result;
    }

    /**
     * Get tilt and orientation correction factor
     * @param tiltAngle Roof tilt angle in degrees
     * @param orientation Roof orientation code (e.g., 's', 'sw', 'n')
     * @return Correction factor as decimal (e.g., 0.95 for 95%)
     */
    private Double getTiltOrientationCorrectionFactor(Integer tiltAngle, String orientation) {
        Integer tiltIndex = TILT_MAPPING.get(tiltAngle);
        Integer orientationIndex = ORIENTATION_MAPPING.get(orientation != null ? orientation.toLowerCase() : "");
        
        if (tiltIndex == null || orientationIndex == null) {
            return 0.82; // Default fallback factor
        }
        
        int percentage = TILT_ORIENTATION_FACTORS[tiltIndex][orientationIndex];
        return percentage / 100.0; // Convert percentage to decimal
    }
} 