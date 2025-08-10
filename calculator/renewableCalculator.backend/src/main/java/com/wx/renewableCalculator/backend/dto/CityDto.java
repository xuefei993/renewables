package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CityDto {
    private Long id;
    private String name;
    private String postcode;
    private String regionName;
    private String country;
    private Double latitude;
    private Double longitude;
    private Double solarIrradiance;
} 