package com.wx.renewableCalculator.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionDto {
    private Long id;
    private String name;
    private String country;
    private List<CityDto> cities;
} 