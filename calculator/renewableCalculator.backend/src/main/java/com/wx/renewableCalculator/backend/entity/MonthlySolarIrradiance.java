package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "monthly_solar_irradiance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySolarIrradiance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(nullable = false)
    private Integer month;  // 1-12
    
    @Column(nullable = false)
    private Double dailySolarIrradiance;  // kWh/m²/day from NASA POWER API
    
    @Column
    private String location;  // Optional location description
    
    @Column
    private java.time.LocalDateTime lastUpdated;  // When this data was last fetched
    
    public MonthlySolarIrradiance(Double latitude, Double longitude, Integer month, Double dailySolarIrradiance) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.month = month;
        this.dailySolarIrradiance = dailySolarIrradiance;
        this.lastUpdated = java.time.LocalDateTime.now();
    }
} 