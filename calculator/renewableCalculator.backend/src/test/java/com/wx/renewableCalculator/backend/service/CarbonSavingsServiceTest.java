package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.CarbonSavingsRequest;
import com.wx.renewableCalculator.backend.dto.CarbonSavingsResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CarbonSavingsServiceTest {
    
    private CarbonSavingsService service;
    
    @BeforeEach
    void setUp() {
        service = new CarbonSavingsService();
    }
    
    @Test
    void testCalculateCarbonSavings_NoEquipmentInstalled() {
        // Given: No equipment installed
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(false);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(300.0);
        request.setGasConsumptionKwh(200.0);
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: only indirect emissions before should be calculated, no savings
        assertEquals(0.0, result.getDirectEmissionsSavingsKgCO2()); // No heat pump = no direct savings
        assertEquals(44.4, result.getIndirectEmissionsBeforeKgCO2(), 0.01); // 300 × 0.148 = 44.4
        assertEquals(44.4, result.getIndirectEmissionsAfterKgCO2(), 0.01); // No changes = same as before
        assertEquals(0.0, result.getIndirectEmissionsSavingsKgCO2()); // No savings
        assertEquals(0.0, result.getTotalCarbonSavingsKgCO2()); // Total = 0 + 0 = 0
    }
    
    @Test
    void testCalculateCarbonSavings_OnlyHeatPump() {
        // Given: Only heat pump installed
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(true);
        request.setHasBattery(false);
        request.setMonth(1);
        request.setTotalElectricityDemandKwh(400.0);
        request.setGasConsumptionKwh(200.0); // Gas replaced by heat pump
        request.setHotWaterHeatPumpUsageKwh(30.0); // Additional electricity for hot water
        request.setHeatingHeatPumpUsageKwh(50.0); // Additional electricity for heating
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: verify calculations
        // Direct emissions savings: 200 × 0.183 = 36.6 kgCO₂
        assertEquals(36.6, result.getDirectEmissionsSavingsKgCO2(), 0.01);
        
        // Indirect emissions before: 400 × 0.148 = 59.2 kgCO₂
        assertEquals(59.2, result.getIndirectEmissionsBeforeKgCO2(), 0.01);
        
        // Indirect emissions after: (400 - 0 - 0 + 30 + 50) × 0.148 = 480 × 0.148 = 71.04 kgCO₂
        assertEquals(71.04, result.getIndirectEmissionsAfterKgCO2(), 0.01);
        
        // Indirect emissions increase (negative savings): 59.2 - 71.04 = -11.84 kgCO₂
        assertEquals(-11.84, result.getIndirectEmissionsSavingsKgCO2(), 0.01);
        
        // Total carbon savings: 36.6 + (-11.84) = 24.76 kgCO₂
        assertEquals(24.76, result.getTotalCarbonSavingsKgCO2(), 0.01);
    }
    
    @Test
    void testCalculateCarbonSavings_OnlySolarPanels() {
        // Given: Only solar panels installed
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(true);
        request.setHasHeatPump(false);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(300.0);
        request.setSolarSelfConsumedKwh(150.0); // Solar self-consumed
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: verify calculations
        // Direct emissions savings: 0 (no heat pump)
        assertEquals(0.0, result.getDirectEmissionsSavingsKgCO2());
        
        // Indirect emissions before: 300 × 0.148 = 44.4 kgCO₂
        assertEquals(44.4, result.getIndirectEmissionsBeforeKgCO2(), 0.01);
        
        // Indirect emissions after: (300 - 150 - 0 + 0 + 0) × 0.148 = 150 × 0.148 = 22.2 kgCO₂
        assertEquals(22.2, result.getIndirectEmissionsAfterKgCO2(), 0.01);
        
        // Indirect emissions savings: 44.4 - 22.2 = 22.2 kgCO₂
        assertEquals(22.2, result.getIndirectEmissionsSavingsKgCO2(), 0.01);
        
        // Total carbon savings: 0 + 22.2 = 22.2 kgCO₂
        assertEquals(22.2, result.getTotalCarbonSavingsKgCO2(), 0.01);
    }
    
    @Test
    void testCalculateCarbonSavings_AllEquipmentInstalled() {
        // Given: All equipment installed
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(true);
        request.setHasHeatPump(true);
        request.setHasBattery(true);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(400.0);
        request.setGasConsumptionKwh(150.0);
        request.setSolarSelfConsumedKwh(100.0);
        request.setHeatPumpElectricitySavedKwh(50.0); // Electricity saved by heat pump efficiency
        request.setHotWaterHeatPumpUsageKwh(25.0);
        request.setHeatingHeatPumpUsageKwh(40.0);
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: verify calculations
        // Direct emissions savings: 150 × 0.183 = 27.45 kgCO₂
        assertEquals(27.45, result.getDirectEmissionsSavingsKgCO2(), 0.01);
        
        // Indirect emissions before: 400 × 0.148 = 59.2 kgCO₂
        assertEquals(59.2, result.getIndirectEmissionsBeforeKgCO2(), 0.01);
        
        // Indirect emissions after: (400 - 100 - 50 + 25 + 40) × 0.148 = 315 × 0.148 = 46.62 kgCO₂
        assertEquals(46.62, result.getIndirectEmissionsAfterKgCO2(), 0.01);
        
        // Indirect emissions savings: 59.2 - 46.62 = 12.58 kgCO₂
        assertEquals(12.58, result.getIndirectEmissionsSavingsKgCO2(), 0.01);
        
        // Total carbon savings: 27.45 + 12.58 = 40.03 kgCO₂
        assertEquals(40.03, result.getTotalCarbonSavingsKgCO2(), 0.01);
        
        // Verify equipment status
        assertTrue(result.getHasSolarPanels());
        assertTrue(result.getHasHeatPump());
        assertTrue(result.getHasBattery());
    }
    
    @Test
    void testCalculateCarbonSavings_CustomEmissionFactors() {
        // Given: Custom emission factors
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(true);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(300.0);
        request.setGasConsumptionKwh(100.0);
        request.setGasEmissionFactor(0.2); // Custom gas factor
        request.setElectricityEmissionFactor(0.15); // Custom electricity factor
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: verify custom factors are used
        assertEquals(0.2, result.getGasEmissionFactor());
        assertEquals(0.15, result.getElectricityEmissionFactor());
        
        // Direct emissions savings: 100 × 0.2 = 20 kgCO₂
        assertEquals(20.0, result.getDirectEmissionsSavingsKgCO2(), 0.01);
        
        // Indirect emissions before: 300 × 0.15 = 45 kgCO₂
        assertEquals(45.0, result.getIndirectEmissionsBeforeKgCO2(), 0.01);
    }
    
    @Test
    void testCalculateCarbonSavings_PercentageReduction() {
        // Given: Scenario with known values for percentage calculation
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(true);
        request.setHasHeatPump(true);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(300.0);
        request.setGasConsumptionKwh(100.0);
        request.setSolarSelfConsumedKwh(50.0);
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: verify percentage calculation
        // Total emissions before = gas emissions + electricity emissions
        // = (100 × 0.183) + (300 × 0.148) = 18.3 + 44.4 = 62.7 kgCO₂
        
        // Total savings should be > 0
        assertTrue(result.getTotalCarbonSavingsKgCO2() > 0);
        
        // Percentage should be between 0 and 100
        assertTrue(result.getCarbonReductionPercentage() >= 0);
        assertTrue(result.getCarbonReductionPercentage() <= 100);
    }
    
    @Test
    void testCalculateCarbonSavings_ZeroValues() {
        // Given: Request with zero values
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(false);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(0.0);
        request.setGasConsumptionKwh(0.0);
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: all values should be zero
        assertEquals(0.0, result.getDirectEmissionsSavingsKgCO2());
        assertEquals(0.0, result.getIndirectEmissionsBeforeKgCO2());
        assertEquals(0.0, result.getIndirectEmissionsAfterKgCO2());
        assertEquals(0.0, result.getIndirectEmissionsSavingsKgCO2());
        assertEquals(0.0, result.getTotalCarbonSavingsKgCO2());
        assertEquals(0.0, result.getCarbonReductionPercentage());
    }
    
    @Test
    void testDefaultEmissionFactors() {
        // Given: Request without custom emission factors
        CarbonSavingsRequest request = new CarbonSavingsRequest();
        request.setHasSolarPanels(false);
        request.setHasHeatPump(true);
        request.setHasBattery(false);
        request.setMonth(6);
        request.setTotalElectricityDemandKwh(100.0);
        request.setGasConsumptionKwh(100.0);
        // No custom emission factors set
        
        // When: calculating carbon savings
        CarbonSavingsResult result = service.calculateCarbonSavings(request);
        
        // Then: default factors should be used
        assertEquals(0.183, result.getGasEmissionFactor());
        assertEquals(0.148, result.getElectricityEmissionFactor());
    }
} 