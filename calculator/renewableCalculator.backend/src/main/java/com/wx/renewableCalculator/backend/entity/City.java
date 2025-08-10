package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "cities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String postcode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;
    
    // Additional fields for future expansion
    @Column
    private Double latitude;
    
    @Column
    private Double longitude;
    
    @Column
    private Double solarIrradiance;  // Future: solar energy data
    
    public City(String name, String postcode, Region region) {
        this.name = name;
        this.postcode = postcode;
        this.region = region;
    }
} 