package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.SubsidyCalculationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubsidyCalculationRuleRepository extends JpaRepository<SubsidyCalculationRule, Long> {
    
    // Find active rules for a specific subsidy
    List<SubsidyCalculationRule> findBySubsidyIdAndIsActiveTrue(Long subsidyId);
    
    // Find rules by equipment type
    List<SubsidyCalculationRule> findByEquipmentTypeAndIsActiveTrue(SubsidyCalculationRule.EquipmentType equipmentType);
    
    // Find rules that match capacity range
    @Query("SELECT r FROM SubsidyCalculationRule r WHERE r.isActive = true AND " +
           "(r.capacityMin IS NULL OR r.capacityMin <= :capacity) AND " +
           "(r.capacityMax IS NULL OR r.capacityMax >= :capacity)")
    List<SubsidyCalculationRule> findRulesForCapacity(@Param("capacity") Double capacity);
} 