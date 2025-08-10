package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "subsidy_calculation_rule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubsidyCalculationRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsidy_id", nullable = false)
    private GovernmentSubsidy subsidy;
    
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal capacityMin;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal capacityMax;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal minimumAmount;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal maximumAmount;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal ratePerUnit;
    
    @Column(length = 50)
    private String unitType;
    
    @Enumerated(EnumType.STRING)
    private HouseTypeRequirement houseTypeRequirement;
    
    @Enumerated(EnumType.STRING)
    private EpcRatingRequirement epcRatingRequirement;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal incomeThreshold;
    
    private Integer priorityOrder;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Lob
    private String conditions;
    
    public enum EquipmentType {
        SOLAR_PANELS,
        AIR_SOURCE_HEAT_PUMP,
        GROUND_SOURCE_HEAT_PUMP,
        BATTERY_STORAGE,
        BIOMASS_BOILER,
        ELECTRIC_VEHICLE_CHARGER,
        INSULATION,
        SMART_HEATING_CONTROLS
    }
    
    public enum HouseTypeRequirement {
        DETACHED,
        SEMI_DETACHED,
        TERRACED,
        END_TERRACED,
        FLAT
    }
    
    public enum EpcRatingRequirement {
        A, B, C, D, E, F, G
    }
} 