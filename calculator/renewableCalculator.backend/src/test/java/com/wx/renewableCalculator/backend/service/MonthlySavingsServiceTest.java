package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.MonthlySavingsRequest;
import com.wx.renewableCalculator.backend.dto.MonthlySavingsResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MonthlySavingsServiceTest {
    
    private MonthlySavingsService service;
    
    @BeforeEach
    void setUp() {
        service = new MonthlySavingsService();
    }
    
    @Test
    void testCalculateMonthlySavings_NoEquipmentInstalled() {
        // Given: No equipment installed
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(false);
        request.setHasBattery(false);
        request.setHasSupportEquipment(false);
        request.setMonth(6);
        
        // When: calculating savings
        MonthlySavingsResult result = service.calculateMonthlySavings(request);
        
        // Then: all savings should be 0
        assertEquals(0.0, result.getTotalMonthlySavings());
        assertEquals(0.0, result.getSolarSavings());
        assertEquals(0.0, result.getHeatPumpSavings());
        assertEquals(0.0, result.getBatterySavings());
        assertEquals(0.0, result.getSupportEquipmentSavings());
    }
    
    @Test
    void testCalculateMonthlySavings_OnlySolarPanels() {
        // Given: Only solar panels installed, home most of day (s=1, SCR=50%)
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(true);
        request.setHasHeatPump(false);
        request.setHasBattery(false);
        request.setHasSupportEquipment(false);
        request.setMonth(6);
        request.setHomeOccupancyFactor(1.0); // Stay home most of day
        request.setSolarGenerationKwh(400.0); // 400 kWh generation
        request.setMonthlyElectricityUsageKwh(300.0); // 300 kWh usage
        request.setElectricityRate(30.0); // 30 pence/kWh
        request.setExportRate(5.0); // 5 pence/kWh export
        
        // When: calculating savings
        MonthlySavingsResult result = service.calculateMonthlySavings(request);
        
        // Then: verify solar savings calculation
        // SCR = 50% for s=1
        // Self-consumed = min(400, 300 * 0.5) = min(400, 150) = 150 kWh
        // Exported = 400 - 150 = 250 kWh
        // Self-consumption savings = 150 * 30 = 4500 pence
        // Export savings = 250 * 5 = 1250 pence
        // Total solar savings = 4500 + 1250 = 5750 pence
        
        assertEquals(50.0, result.getSelfConsumptionRate(), 0.1); // 50% SCR
        assertEquals(150.0, result.getSolarSelfConsumedKwh(), 0.1);
        assertEquals(250.0, result.getSolarExportedKwh(), 0.1);
        assertEquals(4500.0, result.getSolarSelfConsumptionSavings(), 0.1);
        assertEquals(1250.0, result.getSolarExportSavings(), 0.1);
        assertEquals(5750.0, result.getSolarSavings(), 0.1);
        assertEquals(5750.0, result.getTotalMonthlySavings(), 0.1);
    }
    
    @Test
    void testCalculateMonthlySavings_OnlyHeatPump() {
        // Given: Only heat pump installed
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(true);
        request.setHasBattery(false);
        request.setHasSupportEquipment(false);
        request.setMonth(1); // Winter month
        request.setGasConsumptionKwh(600.0); // 600 kWh gas replaced
        request.setGasRate(6.0); // 6 pence/kWh gas
        request.setElectricityRate(30.0); // 30 pence/kWh electricity
        request.setHeatPumpCop(3.5); // Heat pump COP = 3.5
        
        // When: calculating savings
        MonthlySavingsResult result = service.calculateMonthlySavings(request);
        
        // Then: verify heat pump savings calculation
        // Gas cost saved = 600 * 6 = 3600 pence
        // Heat pump electricity = 600 / 3.5 = 171.43 kWh
        // Electricity cost = 171.43 * 30 = 5142.9 pence
        // Net savings = 3600 - 5142.9 = -1542.9 (negative, so should be 0)
        
        assertEquals(600.0, result.getGasReplacedKwh(), 0.1);
        assertEquals(171.43, result.getHeatPumpElectricityUsedKwh(), 0.1);
        assertEquals(0.0, result.getHeatPumpSavings(), 0.1); // Negative savings = 0
        assertEquals(0.0, result.getTotalMonthlySavings(), 0.1);
    }
    
    @Test
    void testCalculateMonthlySavings_OnlyBattery() {
        // Given: Only battery installed
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(false);
        request.setHasBattery(true);
        request.setHasSupportEquipment(false);
        request.setMonth(6);
        request.setBatteryCapacityKwh(10.0); // 10 kWh battery
        request.setPeakElectricityRate(40.0); // 40 pence/kWh peak
        request.setOffPeakElectricityRate(15.0); // 15 pence/kWh off-peak
        
        // When: calculating savings
        MonthlySavingsResult result = service.calculateMonthlySavings(request);
        
        // Then: verify battery savings calculation
        // Monthly stored energy = 10 * 30 * 0.9 = 270 kWh
        // Peak shifting savings = (40 - 15) * 270 = 25 * 270 = 6750 pence
        
        assertEquals(270.0, result.getBatteryStoredEnergyKwh(), 0.1);
        assertEquals(6750.0, result.getPeakShiftingSavings(), 0.1);
        assertEquals(6750.0, result.getBatterySavings(), 0.1);
        assertEquals(6750.0, result.getTotalMonthlySavings(), 0.1);
    }
    
    @Test
    void testCalculateMonthlySavings_AllEquipmentInstalled() {
        // Given: All equipment installed
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(true);
        request.setHasHeatPump(true);
        request.setHasBattery(true);
        request.setHasSupportEquipment(true);
        request.setMonth(6);
        
        // Solar parameters
        request.setHomeOccupancyFactor(0.5); // Half day home (SCR=40%)
        request.setSolarGenerationKwh(300.0);
        request.setMonthlyElectricityUsageKwh(250.0);
        request.setElectricityRate(30.0);
        request.setExportRate(5.0);
        
        // Heat pump parameters (profitable scenario)
        request.setGasConsumptionKwh(200.0);
        request.setGasRate(8.0); // Higher gas rate
        request.setHeatPumpCop(4.0); // High efficiency
        
        // Battery parameters
        request.setBatteryCapacityKwh(5.0);
        request.setPeakElectricityRate(35.0);
        request.setOffPeakElectricityRate(20.0);
        
        // Support equipment
        request.setSupportEquipmentSavings(500.0);
        
        // When: calculating savings
        MonthlySavingsResult result = service.calculateMonthlySavings(request);
        
        // Then: verify total savings = sum of all components
        // (Exact calculations would be complex, just verify all components > 0)
        assertTrue(result.getSolarSavings() > 0);
        assertTrue(result.getHeatPumpSavings() > 0);
        assertTrue(result.getBatterySavings() > 0);
        assertEquals(500.0, result.getSupportEquipmentSavings());
        
        double expectedTotal = result.getSolarSavings() + result.getHeatPumpSavings() + 
                              result.getBatterySavings() + result.getSupportEquipmentSavings();
        assertEquals(expectedTotal, result.getTotalMonthlySavings(), 0.1);
    }
    
    @Test
    void testSelfConsumptionRateCalculation() {
        // Test different home occupancy factors
        MonthlySavingsRequest request = new MonthlySavingsRequest();
        request.setHasSolarPanels(true);
        request.setSolarGenerationKwh(100.0);
        request.setMonthlyElectricityUsageKwh(200.0);
        request.setElectricityRate(30.0);
        request.setMonth(6);
        
        // Test s=1 (home most of day) -> SCR=50%
        request.setHomeOccupancyFactor(1.0);
        MonthlySavingsResult result1 = service.calculateMonthlySavings(request);
        assertEquals(50.0, result1.getSelfConsumptionRate(), 0.1);
        
        // Test s=0.5 (home half day) -> SCR=40%
        request.setHomeOccupancyFactor(0.5);
        MonthlySavingsResult result2 = service.calculateMonthlySavings(request);
        assertEquals(40.0, result2.getSelfConsumptionRate(), 0.1);
        
        // Test s=0 (away most of day) -> SCR=30%
        request.setHomeOccupancyFactor(0.0);
        MonthlySavingsResult result3 = service.calculateMonthlySavings(request);
        assertEquals(30.0, result3.getSelfConsumptionRate(), 0.1);
    }
} 