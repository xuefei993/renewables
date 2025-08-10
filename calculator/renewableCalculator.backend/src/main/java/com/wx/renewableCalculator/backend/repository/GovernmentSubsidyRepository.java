package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.GovernmentSubsidy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GovernmentSubsidyRepository extends JpaRepository<GovernmentSubsidy, Long> {
    
    // Find active subsidies by subsidy type
    List<GovernmentSubsidy> findBySubsidyTypeAndIsActiveTrue(GovernmentSubsidy.SubsidyType subsidyType);
    
    // Find all active subsidies
    List<GovernmentSubsidy> findByIsActiveTrue();
    
    // Find subsidies by region code (or null for national subsidies)
    @Query("SELECT s FROM GovernmentSubsidy s WHERE s.isActive = true AND (s.regionCode IS NULL OR s.regionCode = :regionCode)")
    List<GovernmentSubsidy> findActiveSubsidiesByRegion(@Param("regionCode") String regionCode);
    
    // Find subsidies applicable to specific equipment types
    @Query("SELECT DISTINCT s FROM GovernmentSubsidy s JOIN s.calculationRules r WHERE s.isActive = true AND r.isActive = true AND r.equipmentType IN :equipmentTypes")
    List<GovernmentSubsidy> findSubsidiesForEquipmentTypes(@Param("equipmentTypes") List<String> equipmentTypes);
} 