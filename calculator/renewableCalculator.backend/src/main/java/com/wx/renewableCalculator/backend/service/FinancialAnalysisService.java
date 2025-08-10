package com.wx.renewableCalculator.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class FinancialAnalysisService {

    /**
     * Calculate annual savings from renewable energy systems
     * @param annualGeneration Annual energy generation in kWh
     * @param electricityRate Current electricity rate in pence per kWh
     * @param exportRate Export rate for excess energy
     * @param selfConsumptionRate Percentage of generated energy self-consumed
     * @return Annual savings in pounds
     */
    public BigDecimal calculateAnnualSavings(BigDecimal annualGeneration, BigDecimal electricityRate, 
                                           BigDecimal exportRate, BigDecimal selfConsumptionRate) {
        // Self-consumed energy savings
        BigDecimal selfConsumed = annualGeneration.multiply(selfConsumptionRate);
        BigDecimal selfConsumptionSavings = selfConsumed.multiply(electricityRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        // Exported energy income
        BigDecimal exported = annualGeneration.multiply(BigDecimal.ONE.subtract(selfConsumptionRate));
        BigDecimal exportIncome = exported.multiply(exportRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        return selfConsumptionSavings.add(exportIncome);
    }

    /**
     * Calculate payback period in years
     * @param totalInstallationCost Total system cost
     * @param annualSavings Annual financial savings
     * @param annualMaintenanceCost Annual maintenance costs
     * @return Payback period in years
     */
    public BigDecimal calculatePaybackPeriod(BigDecimal totalInstallationCost, BigDecimal annualSavings, 
                                           BigDecimal annualMaintenanceCost) {
        BigDecimal netAnnualSavings = annualSavings.subtract(annualMaintenanceCost);
        
        if (netAnnualSavings.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.valueOf(999); // Indicates no payback
        }
        
        return totalInstallationCost.divide(netAnnualSavings, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate return on investment (ROI) percentage
     * @param totalSavingsOverPeriod Total savings over analysis period
     * @param totalInstallationCost Total system cost
     * @param analysisPeriodYears Analysis period in years
     * @return ROI as percentage
     */
    public BigDecimal calculateROI(BigDecimal totalSavingsOverPeriod, BigDecimal totalInstallationCost, 
                                 Integer analysisPeriodYears) {
        BigDecimal profit = totalSavingsOverPeriod.subtract(totalInstallationCost);
        BigDecimal roi = profit.divide(totalInstallationCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        
        return roi;
    }

    /**
     * Calculate net present value (NPV)
     * @param annualCashFlows Map of annual cash flows over the system lifetime
     * @param discountRate Discount rate for NPV calculation
     * @param initialInvestment Initial investment cost
     * @return NPV in pounds
     */
    public BigDecimal calculateNPV(Map<Integer, BigDecimal> annualCashFlows, BigDecimal discountRate, 
                                 BigDecimal initialInvestment) {
        // TODO: Implement comprehensive NPV calculation
        // This will include:
        // - Discounted cash flows
        // - Inflation adjustments
        // - Energy price escalation
        // - System degradation over time
        
        // Placeholder implementation
        BigDecimal npv = initialInvestment.negate();
        
        for (Map.Entry<Integer, BigDecimal> entry : annualCashFlows.entrySet()) {
            Integer year = entry.getKey();
            BigDecimal cashFlow = entry.getValue();
            
            BigDecimal discountFactor = BigDecimal.ONE.divide(
                BigDecimal.ONE.add(discountRate).pow(year), 4, RoundingMode.HALF_UP);
            
            npv = npv.add(cashFlow.multiply(discountFactor));
        }
        
        return npv;
    }

    /**
     * Calculate lifetime savings over system lifespan
     * @param annualSavings First year savings
     * @param systemLifespan System lifespan in years
     * @param annualDegradation Annual system degradation rate
     * @param energyPriceEscalation Annual energy price increase rate
     * @return Total lifetime savings
     */
    public BigDecimal calculateLifetimeSavings(BigDecimal annualSavings, Integer systemLifespan, 
                                             BigDecimal annualDegradation, BigDecimal energyPriceEscalation) {
        BigDecimal totalSavings = BigDecimal.ZERO;
        BigDecimal currentSavings = annualSavings;
        
        for (int year = 1; year <= systemLifespan; year++) {
            totalSavings = totalSavings.add(currentSavings);
            
            // Apply degradation and price escalation
            currentSavings = currentSavings
                .multiply(BigDecimal.ONE.subtract(annualDegradation))  // System degradation
                .multiply(BigDecimal.ONE.add(energyPriceEscalation));  // Energy price increase
        }
        
        return totalSavings;
    }
} 