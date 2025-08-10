package com.wx.renewableCalculator.backend.dto;

import lombok.Data;

@Data
public class TotalInstalledCapacityRequest {
    private Double roofArea;  // Roof Area in square meters
    private String utilisationLevel;  // Area Utilisation Factor level (e.g., 'minimal-obstacles')
    private Long solarPanelTypeId;  // ID of the solar panel type to use
} 