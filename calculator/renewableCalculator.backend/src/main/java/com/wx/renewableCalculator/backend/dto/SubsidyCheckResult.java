package com.wx.renewableCalculator.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubsidyCheckResult {
    
    private List<AvailableSubsidy> availableSubsidies;
    private BigDecimal totalPotentialSavings;
    private String recommendationSummary;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvailableSubsidy {
        private Long subsidyId;
        private String name;
        private String type;
        private String description;
        private String shortDescription;       // Brief one-line description
        private BigDecimal estimatedAmount;    // Calculated subsidy amount
        private BigDecimal maxAmount;          // Maximum possible amount
        private String eligibilitySummary;     // Key eligibility requirements
        private String applicationUrl;         // Link to apply
        private String contactInfo;
        private LocalDate deadline;            // Application deadline if any
        private Boolean isEligible;            // Whether user meets basic criteria
        private String ineligibilityReason;   // Why not eligible (if applicable)
        private Integer priority;              // Display priority (1 = highest)
        private List<String> requiredDocuments; // What user needs to apply
        private String calculationBasis;       // How the amount was calculated
    }
} 