package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "solar_panel_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolarPanelType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;  // Panel model name
    
    @Column(nullable = false)
    private String manufacturer;  // Manufacturer name
    
    @Column(nullable = false)
    private Double panelSize;  // Solar panel size in square meters
    
    @Column(nullable = false)
    private Double ratedPowerPerPanel;  // Rated power per panel in watts (W)
    
    @Column
    private String description;  // Additional description
    
    @Column
    private Double efficiency;  // Panel efficiency percentage
    
    @Column
    private Double price;  // Price per panel
    
    public SolarPanelType(String name, String manufacturer, Double panelSize, Double ratedPowerPerPanel) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.panelSize = panelSize;
        this.ratedPowerPerPanel = ratedPowerPerPanel;
    }
} 