package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.MonthlySavingsRequest;
import com.wx.renewableCalculator.backend.dto.MonthlySavingsResult;
import org.springframework.stereotype.Service;

@Service
public class MonthlySavingsService {
    
    /**
     * Calculate monthly savings based on installed equipment and usage patterns
     * 
     * Main formula: Stm = Ssolar,m + Sheat pump,m + Sbattery,m + Ssupport,m
     * 
     * @param request Contains equipment selection and usage parameters
     * @return MonthlySavingsResult with detailed breakdown of savings
     */
    public MonthlySavingsResult calculateMonthlySavings(MonthlySavingsRequest request) {
        
        MonthlySavingsResult result = new MonthlySavingsResult();
        
        // Set equipment status
        result.setHasSolarPanels(request.getHasSolarPanels());
        result.setHasHeatPump(request.getHasHeatPump());
        result.setHasBattery(request.getHasBattery());
        result.setHasSupportEquipment(request.getHasSupportEquipment());
        result.setMonth(request.getMonth());
        result.setHomeOccupancyFactor(request.getHomeOccupancyFactor());
        
        // Calculate individual savings (0 if equipment not installed)
        double solarSavings = calculateSolarSavings(request, result);
        double heatPumpSavings = calculateHeatPumpSavings(request, result);
        double batterySavings = calculateBatterySavings(request, result);
        double supportSavings = calculateSupportEquipmentSavings(request, result);
        
        // Set individual savings
        result.setSolarSavings(solarSavings);
        result.setHeatPumpSavings(heatPumpSavings);
        result.setBatterySavings(batterySavings);
        result.setSupportEquipmentSavings(supportSavings);
        
        // Calculate total savings: Stm = Ssolar,m + Sheat pump,m + Sbattery,m + Ssupport,m
        double totalSavings = solarSavings + heatPumpSavings + batterySavings + supportSavings;
        result.setTotalMonthlySavings(totalSavings);
        
        return result;
    }
    
    /**
     * Calculate solar panel savings (Ssolar,m)
     * If no solar panels installed, return 0
     */
    private double calculateSolarSavings(MonthlySavingsRequest request, MonthlySavingsResult result) {
        if (!Boolean.TRUE.equals(request.getHasSolarPanels()) || 
            request.getSolarGenerationKwh() == null || request.getSolarGenerationKwh() <= 0) {
            result.setSelfConsumptionRate(0.0);
            result.setSolarSelfConsumedKwh(0.0);
            result.setSolarExportedKwh(0.0);
            result.setSolarSelfConsumptionSavings(0.0);
            result.setSolarExportSavings(0.0);
            return 0.0;
        }
        
        // Calculate Self-Consumption Rate (SCR) based on home occupancy
        double scr = calculateSelfConsumptionRate(request.getHomeOccupancyFactor());
        result.setSelfConsumptionRate(scr * 100); // Convert to percentage
        
        // Calculate self-consumed and exported energy
        double totalGeneration = request.getSolarGenerationKwh();
        double selfConsumedKwh = Math.min(totalGeneration, 
                                        request.getMonthlyElectricityUsageKwh() * scr);
        double exportedKwh = Math.max(0, totalGeneration - selfConsumedKwh);
        
        result.setSolarSelfConsumedKwh(selfConsumedKwh);
        result.setSolarExportedKwh(exportedKwh);
        
        // Calculate savings
        double electricityRate = request.getElectricityRate() != null ? request.getElectricityRate() : 0;
        double exportRate = request.getExportRate() != null ? request.getExportRate() : 0;
        
        double selfConsumptionSavings = selfConsumedKwh * electricityRate;
        double exportSavings = exportedKwh * exportRate;
        
        result.setSolarSelfConsumptionSavings(selfConsumptionSavings);
        result.setSolarExportSavings(exportSavings);
        
        return selfConsumptionSavings + exportSavings;
    }
    
    /**
     * Calculate Self-Consumption Rate based on home occupancy pattern
     * From the document:
     * - s=1 (stay at home most of the day): SCR=50%
     * - s=0.5 (stay at home half of the day): SCR=40%
     * - s=0 (most away from home): SCR=30%
     */
    private double calculateSelfConsumptionRate(Double homeOccupancyFactor) {
        if (homeOccupancyFactor == null) return 0.3; // Default to lowest
        
        if (homeOccupancyFactor >= 1.0) {
            return 0.5; // 50% SCR
        } else if (homeOccupancyFactor >= 0.5) {
            return 0.4; // 40% SCR
        } else {
            return 0.3; // 30% SCR
        }
    }
    
    /**
     * Calculate heat pump savings (Sheat pump,m)
     * If no heat pump installed, return 0
     */
    private double calculateHeatPumpSavings(MonthlySavingsRequest request, MonthlySavingsResult result) {
        if (!Boolean.TRUE.equals(request.getHasHeatPump()) || 
            request.getGasConsumptionKwh() == null || request.getGasConsumptionKwh() <= 0) {
            result.setGasReplacedKwh(0.0);
            result.setHeatPumpElectricityUsedKwh(0.0);
            result.setNetHeatPumpSavings(0.0);
            return 0.0;
        }
        
        double gasReplacedKwh = request.getGasConsumptionKwh();
        double gasRate = request.getGasRate() != null ? request.getGasRate() : 0;
        double electricityRate = request.getElectricityRate() != null ? request.getElectricityRate() : 0;
        double cop = request.getHeatPumpCop() != null ? request.getHeatPumpCop() : 3.0; // Default COP
        
        // Heat pump electricity consumption = gas energy / COP
        double heatPumpElectricityKwh = gasReplacedKwh / cop;
        
        // Savings = gas cost saved - electricity cost incurred
        double gasCostSaved = gasReplacedKwh * gasRate;
        double electricityCostIncurred = heatPumpElectricityKwh * electricityRate;
        double netSavings = gasCostSaved - electricityCostIncurred;
        
        result.setGasReplacedKwh(gasReplacedKwh);
        result.setHeatPumpElectricityUsedKwh(heatPumpElectricityKwh);
        result.setNetHeatPumpSavings(netSavings);
        
        return Math.max(0, netSavings); // Ensure non-negative savings
    }
    
    /**
     * Calculate battery savings (Sbattery,m)
     * If no battery installed, return 0
     */
    private double calculateBatterySavings(MonthlySavingsRequest request, MonthlySavingsResult result) {
        if (!Boolean.TRUE.equals(request.getHasBattery()) || 
            request.getBatteryCapacityKwh() == null || request.getBatteryCapacityKwh() <= 0) {
            result.setBatteryStoredEnergyKwh(0.0);
            result.setPeakShiftingSavings(0.0);
            return 0.0;
        }
        
        double batteryCapacity = request.getBatteryCapacityKwh();
        double peakRate = request.getPeakElectricityRate() != null ? request.getPeakElectricityRate() : 0;
        double offPeakRate = request.getOffPeakElectricityRate() != null ? request.getOffPeakElectricityRate() : 0;
        
        // Simplified calculation: assume battery cycles once per day
        // Store energy at off-peak rate, use during peak rate
        double dailyCycles = 30; // Assume 30 days per month
        double monthlyStoredEnergy = batteryCapacity * dailyCycles * 0.9; // 90% efficiency
        
        // Peak shifting savings = (peak rate - off-peak rate) * stored energy
        double peakShiftingSavings = (peakRate - offPeakRate) * monthlyStoredEnergy;
        
        result.setBatteryStoredEnergyKwh(monthlyStoredEnergy);
        result.setPeakShiftingSavings(peakShiftingSavings);
        
        return Math.max(0, peakShiftingSavings);
    }
    
    /**
     * Calculate support equipment savings (Ssupport,m)
     * If no support equipment installed, return 0
     */
    private double calculateSupportEquipmentSavings(MonthlySavingsRequest request, MonthlySavingsResult result) {
        if (!Boolean.TRUE.equals(request.getHasSupportEquipment())) {
            return 0.0;
        }
        
        return request.getSupportEquipmentSavings() != null ? request.getSupportEquipmentSavings() : 0.0;
    }
} 