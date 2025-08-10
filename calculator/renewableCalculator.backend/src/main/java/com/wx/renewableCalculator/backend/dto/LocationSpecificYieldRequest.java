package com.wx.renewableCalculator.backend.dto;

import lombok.Data;

@Data
public class LocationSpecificYieldRequest {
    private Double latitude;
    private Double longitude;
    private String location;  // Optional location description
} 