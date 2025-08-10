package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.SolarInstallationCostRequest;
import com.wx.renewableCalculator.backend.dto.SolarInstallationCostResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SolarInstallationCostServiceTest {
    
    private SolarInstallationCostService service;
    
    @BeforeEach
    void setUp() {
        service = new SolarInstallationCostService();
    }
    
    @Test
    void testCalculateInstallationCost_ValidInput() {
        // Given: 4kW solar system
        SolarInstallationCostRequest request = new SolarInstallationCostRequest(4.0);
        
        // When: calculating installation cost
        SolarInstallationCostResult result = service.calculateInstallationCost(request);
        
        // Then: verify calculations based on formula
        // Min cost: 1.25 × 4 = 5.0
        // Max cost: 60 × 4 = 240.0
        // Average: (5.0 + 240.0) / 2 = 122.5
        assertEquals(4.0, result.getSystemSizeKw());
        assertEquals(5.0, result.getMinimumCost(), 0.001);
        assertEquals(240.0, result.getMaximumCost(), 0.001);
        assertEquals(122.5, result.getAverageCost(), 0.001);
    }
    
    @Test
    void testCalculateInstallationCost_LargerSystem() {
        // Given: 10kW solar system
        SolarInstallationCostRequest request = new SolarInstallationCostRequest(10.0);
        
        // When: calculating installation cost
        SolarInstallationCostResult result = service.calculateInstallationCost(request);
        
        // Then: verify calculations
        // Min cost: 1.25 × 10 = 12.5
        // Max cost: 60 × 10 = 600.0
        // Average: (12.5 + 600.0) / 2 = 306.25
        assertEquals(10.0, result.getSystemSizeKw());
        assertEquals(12.5, result.getMinimumCost(), 0.001);
        assertEquals(600.0, result.getMaximumCost(), 0.001);
        assertEquals(306.25, result.getAverageCost(), 0.001);
    }
    
    @Test
    void testCalculateInstallationCost_InvalidInput() {
        // Given: invalid system size
        SolarInstallationCostRequest request = new SolarInstallationCostRequest(0.0);
        
        // When & Then: should throw exception
        assertThrows(IllegalArgumentException.class, () -> {
            service.calculateInstallationCost(request);
        });
    }
    
    @Test
    void testGetMinimumCost() {
        // Test minimum cost calculation
        assertEquals(6.25, service.getMinimumCost(5.0), 0.001);  // 1.25 × 5
        assertEquals(12.5, service.getMinimumCost(10.0), 0.001); // 1.25 × 10
    }
    
    @Test
    void testGetMaximumCost() {
        // Test maximum cost calculation
        assertEquals(300.0, service.getMaximumCost(5.0), 0.001);  // 60 × 5
        assertEquals(600.0, service.getMaximumCost(10.0), 0.001); // 60 × 10
    }
    
    @Test
    void testGetAverageCost() {
        // Test average cost calculation
        double expectedAverage5kW = (6.25 + 300.0) / 2.0; // (1.25×5 + 60×5) / 2
        assertEquals(expectedAverage5kW, service.getAverageCost(5.0), 0.001);
        
        double expectedAverage10kW = (12.5 + 600.0) / 2.0; // (1.25×10 + 60×10) / 2
        assertEquals(expectedAverage10kW, service.getAverageCost(10.0), 0.001);
    }
} 