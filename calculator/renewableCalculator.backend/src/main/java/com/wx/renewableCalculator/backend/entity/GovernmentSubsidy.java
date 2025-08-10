package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "government_subsidy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentSubsidy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String subsidyName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubsidyType subsidyType;
    
    @Lob
    private String description;
    
    @Lob
    private String eligibilityCriteria;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Enumerated(EnumType.STRING)
    private CalculationMethod calculationMethod;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal fixedAmount;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal maxAmount;
    
    @Column(length = 50)
    private String regionCode;
    
    @Column(length = 500)
    private String applicationUrl;
    
    @Column(length = 500)
    private String contactInfo;
    
    @OneToMany(mappedBy = "subsidy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubsidyCalculationRule> calculationRules;
    
    public enum SubsidyType {
        SOLAR_PANELS,
        HEAT_PUMP,
        BATTERY_STORAGE,
        INSULATION,
        BOILER_UPGRADE,
        COMPREHENSIVE
    }
    
    public enum CalculationMethod {
        FIXED_AMOUNT,
        PERCENTAGE_BASED,
        CAPACITY_BASED,
        TIERED,
        MEANS_TESTED
    }
} 