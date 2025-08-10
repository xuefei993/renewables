package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "house_profile")
@Data
public class HouseProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private InsulationQuality insulationQuality;

    @Column(name = "estimated_heat_loss")
    private Double estimatedHeatLoss;

    @Column(name = "heating_system")
    private String heatingSystem;

    public enum InsulationQuality {
        poor, average, good
    }
}
