package com.wx.renewableCalculator.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "heat_pump")
@Data
public class HeatPump {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private BigDecimal cop;

    private BigDecimal cost;
}
