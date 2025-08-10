package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "tariff")
@Data
public class Tariff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Enumerated(EnumType.STRING)
    private EnergyType type;

    @Column(name = "price_per_kwh")
    private BigDecimal pricePerKwh;

    public enum EnergyType {
        electricity, gas
    }
}
