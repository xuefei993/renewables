package com.wx.renewableCalculator.backend.service;

import org.springframework.stereotype.Service;

/**
 * Service for calculating basic electricity demand (Ebasic)
 * Formula: Ebasic = (1600 + 700 * (Residents number - 1)) / 12
 */
@Service
public class BasicElectricityDemandService {

    /**
     * Calculate Ebasic using formula: Ebasic = (1600 + 700 * (Residents number - 1)) / 12
     * @param residentsNumber Number of residents/occupants
     * @return Monthly basic electricity demand in kWh
     */
    public double calculateEBasic(int residentsNumber) {
        double eBasicAnnual = 1600 + 700 * (residentsNumber - 1);
        double eBasicMonthly = eBasicAnnual / 12.0;
        
        System.out.println(String.format("Ebasic calculation: (1600 + 700 * (%d - 1)) / 12 = %.2f kWh/month", 
            residentsNumber, eBasicMonthly));
        
        return eBasicMonthly;
    }

    /**
     * Validate basic electricity demand input
     */
    public boolean validateBasicInput(Integer occupants) {
        return occupants != null && occupants > 0;
    }
} 