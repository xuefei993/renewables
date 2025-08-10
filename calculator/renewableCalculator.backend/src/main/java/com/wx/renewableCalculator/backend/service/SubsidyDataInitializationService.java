package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.entity.GovernmentSubsidy;
import com.wx.renewableCalculator.backend.entity.SubsidyCalculationRule;
import com.wx.renewableCalculator.backend.repository.GovernmentSubsidyRepository;
import com.wx.renewableCalculator.backend.repository.SubsidyCalculationRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Service
public class SubsidyDataInitializationService implements CommandLineRunner {
    
    @Autowired
    private GovernmentSubsidyRepository subsidyRepository;
    
    @Autowired
    private SubsidyCalculationRuleRepository ruleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (subsidyRepository.count() == 0) {
            initializeSubsidyData();
        }
    }
    
    private void initializeSubsidyData() {
        // 1. Boiler Upgrade Scheme
        GovernmentSubsidy boilerUpgrade = new GovernmentSubsidy();
        boilerUpgrade.setSubsidyName("Boiler Upgrade Scheme");
        boilerUpgrade.setSubsidyType(GovernmentSubsidy.SubsidyType.HEAT_PUMP);
        boilerUpgrade.setDescription("The Boiler Upgrade Scheme provides grants to support the installation of heat pumps and biomass boilers in homes and small non-domestic buildings in England and Wales.");
        boilerUpgrade.setEligibilityCriteria("Property must be in England or Wales; existing heating system must be replaced; installer must be MCS certified");
        boilerUpgrade.setStartDate(LocalDate.of(2024, 1, 1));
        boilerUpgrade.setEndDate(LocalDate.of(2025, 12, 31));
        boilerUpgrade.setIsActive(true);
        boilerUpgrade.setCalculationMethod(GovernmentSubsidy.CalculationMethod.FIXED_AMOUNT);
        boilerUpgrade.setApplicationUrl("https://www.gov.uk/apply-boiler-upgrade-scheme");
        boilerUpgrade.setContactInfo("0300 003 0464");
        boilerUpgrade.setRegionCode("UK");
        boilerUpgrade = subsidyRepository.save(boilerUpgrade);
        
        // Rules for Boiler Upgrade Scheme
        SubsidyCalculationRule busRule1 = new SubsidyCalculationRule();
        busRule1.setSubsidy(boilerUpgrade);
        busRule1.setEquipmentType(SubsidyCalculationRule.EquipmentType.AIR_SOURCE_HEAT_PUMP);
        busRule1.setMinimumAmount(BigDecimal.valueOf(5000));
        busRule1.setMaximumAmount(BigDecimal.valueOf(5000));
        busRule1.setIsActive(true);
        busRule1.setConditions("Air source heat pump installation");
        ruleRepository.save(busRule1);
        
        SubsidyCalculationRule busRule2 = new SubsidyCalculationRule();
        busRule2.setSubsidy(boilerUpgrade);
        busRule2.setEquipmentType(SubsidyCalculationRule.EquipmentType.GROUND_SOURCE_HEAT_PUMP);
        busRule2.setMinimumAmount(BigDecimal.valueOf(6000));
        busRule2.setMaximumAmount(BigDecimal.valueOf(6000));
        busRule2.setIsActive(true);
        busRule2.setConditions("Ground source heat pump installation");
        ruleRepository.save(busRule2);
        

        
        System.out.println("Initialized " + subsidyRepository.count() + " subsidy schemes with calculation rules");
    }
} 