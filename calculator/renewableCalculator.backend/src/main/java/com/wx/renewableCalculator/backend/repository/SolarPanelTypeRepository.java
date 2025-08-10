package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.SolarPanelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolarPanelTypeRepository extends JpaRepository<SolarPanelType, Long> {
    
    // Find solar panels by efficiency range
    List<SolarPanelType> findByEfficiencyGreaterThanEqual(Double efficiency);
    
    // Find solar panels by manufacturer
    List<SolarPanelType> findByManufacturerContainingIgnoreCase(String manufacturer);
    
    // Find solar panels by power range
    List<SolarPanelType> findByRatedPowerPerPanelBetween(Double minPower, Double maxPower);
    
    // Find solar panels by size range
    List<SolarPanelType> findByPanelSizeBetween(Double minSize, Double maxSize);
    
    // Find top performing panels (high efficiency)
    List<SolarPanelType> findTop5ByOrderByEfficiencyDesc();
    
    // Find budget-friendly options (sorted by price)
    List<SolarPanelType> findTop10ByOrderByPriceAsc();
    
    // Order by rated power (used by existing controllers)
    List<SolarPanelType> findByOrderByRatedPowerPerPanelDesc();
} 