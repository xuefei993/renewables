package com.wx.renewableCalculator.backend.dto;

import lombok.Data;

@Data
public class SolarPotentialRequest {
    private Double roofSize;           // Roof area in m²
    private String shadingLevel;       // Shading level code (no-shading, light, moderate, heavy, extreme)
    private String utilisationLevel;   // Utilisation level code (minimal-obstacles, slightly-complex, etc.)
    private Integer tiltAngle;         // Roof tilt angle in degrees
    private String orientation;        // Roof orientation code (n, ne, e, se, s, sw, w, nw, etc.)
} 