package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.SolarInstallationCostRequest;
import com.wx.renewableCalculator.backend.dto.SolarInstallationCostResult;
import org.springframework.stereotype.Service;

@Service
public class SolarInstallationCostService {
    
    // Constants from the formula in the image
    private static final double MIN_COST_MULTIPLIER = 1.25;  // Cpanel = 1.25 × Sizesystem (min)
    private static final double MAX_COST_MULTIPLIER = 60.0;  // Cpanel = 60 × Sizesystem (max)
    
    /**
     * Calculate solar panel installation cost based on system size (rated power)
     * 
     * Formula from provided image:
     * - Minimum cost: Cpanel = 1.25 × Sizesystem
     * - Maximum cost: Cpanel = 60 × Sizesystem
     * 
     * @param request Contains the system size in kW
     * @return SolarInstallationCostResult with min, max, and average costs
     */
    public SolarInstallationCostResult calculateInstallationCost(SolarInstallationCostRequest request) {
        
        if (request.getSystemSizeKw() == null || request.getSystemSizeKw() <= 0) {
            throw new IllegalArgumentException("System size must be greater than 0");
        }
        
        double systemSizeKw = request.getSystemSizeKw();
        
        // Calculate costs using the formula from the image
        double minimumCost = MIN_COST_MULTIPLIER * systemSizeKw;
        double maximumCost = MAX_COST_MULTIPLIER * systemSizeKw;
        double averageCost = (minimumCost + maximumCost) / 2.0;
        
        return new SolarInstallationCostResult(
            systemSizeKw,
            minimumCost,
            maximumCost,
            averageCost
        );
    }
    
    /**
     * Get minimum installation cost for a given system size
     * 
     * @param systemSizeKw System size in kW
     * @return Minimum installation cost in £
     */
    public double getMinimumCost(double systemSizeKw) {
        return MIN_COST_MULTIPLIER * systemSizeKw;
    }
    
    /**
     * Get maximum installation cost for a given system size
     * 
     * @param systemSizeKw System size in kW
     * @return Maximum installation cost in £
     */
    public double getMaximumCost(double systemSizeKw) {
        return MAX_COST_MULTIPLIER * systemSizeKw;
    }
    
    /**
     * Get average installation cost for a given system size
     * 
     * @param systemSizeKw System size in kW
     * @return Average installation cost in £
     */
    public double getAverageCost(double systemSizeKw) {
        return (getMinimumCost(systemSizeKw) + getMaximumCost(systemSizeKw)) / 2.0;
    }
} 