package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TotalInstalledCapacityResult {
    private BigDecimal totalInstalledCapacity;  // Total Installed Capacity in kW
    private BigDecimal roofArea;  // Roof Area used in calculation
    private BigDecimal areaUtilisationFactor;  // Area Utilisation Factor used
    private BigDecimal solarPanelSize;  // Solar panel size used
    private BigDecimal ratedPowerPerPanel;  // Rated power per panel used (in kW)
    private String solarPanelName;  // Name of the solar panel type used
    private String solarPanelManufacturer;  // Manufacturer of the solar panel
} 