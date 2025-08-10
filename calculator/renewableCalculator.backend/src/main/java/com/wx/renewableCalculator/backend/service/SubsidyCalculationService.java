package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.SubsidyCheckRequest;
import com.wx.renewableCalculator.backend.dto.SubsidyCheckResult;
import com.wx.renewableCalculator.backend.entity.GovernmentSubsidy;
import com.wx.renewableCalculator.backend.entity.SubsidyCalculationRule;
import com.wx.renewableCalculator.backend.repository.GovernmentSubsidyRepository;
import com.wx.renewableCalculator.backend.repository.SubsidyCalculationRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubsidyCalculationService {
    
    @Autowired
    private GovernmentSubsidyRepository subsidyRepository;
    
    @Autowired
    private SubsidyCalculationRuleRepository ruleRepository;
    
    /**
     * Check available subsidies for the user's configuration
     */
    public SubsidyCheckResult checkAvailableSubsidies(SubsidyCheckRequest request) {
        List<GovernmentSubsidy> allActiveSubsidies = subsidyRepository.findActiveSubsidiesByRegion(
            request.getRegionCode()
        );
        
        List<SubsidyCheckResult.AvailableSubsidy> availableSubsidies = new ArrayList<>();
        BigDecimal totalPotentialSavings = BigDecimal.ZERO;
        
        for (GovernmentSubsidy subsidy : allActiveSubsidies) {
            SubsidyCheckResult.AvailableSubsidy availableSubsidy = evaluateSubsidy(subsidy, request);
            if (availableSubsidy != null) {
                availableSubsidies.add(availableSubsidy);
                if (availableSubsidy.getIsEligible() && availableSubsidy.getEstimatedAmount() != null) {
                    totalPotentialSavings = totalPotentialSavings.add(availableSubsidy.getEstimatedAmount());
                }
            }
        }
        
        // Sort by priority and eligibility
        availableSubsidies.sort((a, b) -> {
            if (!a.getIsEligible() && b.getIsEligible()) return 1;
            if (a.getIsEligible() && !b.getIsEligible()) return -1;
            return Integer.compare(a.getPriority(), b.getPriority());
        });
        
        String recommendationSummary = generateRecommendationSummary(availableSubsidies, totalPotentialSavings);
        
        SubsidyCheckResult result = new SubsidyCheckResult();
        result.setAvailableSubsidies(availableSubsidies);
        result.setTotalPotentialSavings(totalPotentialSavings);
        result.setRecommendationSummary(recommendationSummary);
        
        return result;
    }
    
    /**
     * Evaluate a specific subsidy for the user's request
     */
    private SubsidyCheckResult.AvailableSubsidy evaluateSubsidy(GovernmentSubsidy subsidy, SubsidyCheckRequest request) {
        List<SubsidyCalculationRule> applicableRules = ruleRepository.findBySubsidyIdAndIsActiveTrue(subsidy.getId());
        
        if (applicableRules.isEmpty()) {
            return null; // No rules configured for this subsidy
        }
        
        SubsidyCheckResult.AvailableSubsidy result = new SubsidyCheckResult.AvailableSubsidy();
        result.setSubsidyId(subsidy.getId());
        result.setName(subsidy.getSubsidyName());
        result.setType(subsidy.getSubsidyType().toString());
        result.setDescription(subsidy.getDescription());
        result.setApplicationUrl(subsidy.getApplicationUrl());
        result.setContactInfo(subsidy.getContactInfo());
        result.setDeadline(subsidy.getEndDate());
        
        // Check eligibility and calculate amount
        EligibilityResult eligibilityResult = checkEligibility(subsidy, applicableRules, request);
        result.setIsEligible(eligibilityResult.isEligible);
        result.setIneligibilityReason(eligibilityResult.reason);
        result.setEligibilitySummary(generateEligibilitySummary(applicableRules));
        
        if (eligibilityResult.isEligible) {
            BigDecimal estimatedAmount = calculateSubsidyAmount(subsidy, applicableRules, request);
            result.setEstimatedAmount(estimatedAmount);
            result.setCalculationBasis(eligibilityResult.calculationBasis);
        }
        
        result.setMaxAmount(subsidy.getMaxAmount());
        result.setPriority(determinePriority(subsidy, eligibilityResult.isEligible));
        result.setShortDescription(generateShortDescription(subsidy));
        result.setRequiredDocuments(getRequiredDocuments(subsidy.getSubsidyType()));
        
        return result;
    }
    
    /**
     * Check if user is eligible for a subsidy
     */
    private EligibilityResult checkEligibility(GovernmentSubsidy subsidy, List<SubsidyCalculationRule> rules, SubsidyCheckRequest request) {
        EligibilityResult result = new EligibilityResult();
        result.isEligible = true;
        result.calculationBasis = "";
        
        for (SubsidyCalculationRule rule : rules) {
            // Check equipment type
            if (!isEquipmentTypeMatch(rule.getEquipmentType(), request)) {
                result.isEligible = false;
                result.reason = "Equipment type not covered by this scheme";
                return result;
            }
            
            // Check house type requirement
            if (rule.getHouseTypeRequirement() != null && request.getHouseType() != null) {
                if (!rule.getHouseTypeRequirement().toString().equalsIgnoreCase(request.getHouseType())) {
                    result.isEligible = false;
                    result.reason = "House type not eligible for this scheme";
                    return result;
                }
            }
            
            // Check EPC rating requirement
            if (rule.getEpcRatingRequirement() != null && request.getEpcRating() != null) {
                if (isEpcRatingBetter(request.getEpcRating(), rule.getEpcRatingRequirement().toString())) {
                    result.isEligible = false;
                    result.reason = "EPC rating too high for this scheme (scheme requires rating " + 
                                  rule.getEpcRatingRequirement() + " or lower)";
                    return result;
                }
            }
            
            // Check income threshold
            if (rule.getIncomeThreshold() != null && request.getAnnualIncome() != null) {
                if (request.getAnnualIncome() > rule.getIncomeThreshold().doubleValue()) {
                    result.isEligible = false;
                    result.reason = "Annual income exceeds threshold for this scheme";
                    return result;
                }
            }
            
            // Check capacity ranges
            if (rule.getCapacityMin() != null || rule.getCapacityMax() != null) {
                Double systemCapacity = getRelevantCapacity(rule.getEquipmentType(), request);
                if (systemCapacity != null) {
                    if (rule.getCapacityMin() != null && systemCapacity < rule.getCapacityMin().doubleValue()) {
                        result.isEligible = false;
                        result.reason = "System capacity below minimum requirement";
                        return result;
                    }
                    if (rule.getCapacityMax() != null && systemCapacity > rule.getCapacityMax().doubleValue()) {
                        result.isEligible = false;
                        result.reason = "System capacity exceeds maximum limit";
                        return result;
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * Calculate the subsidy amount for eligible users
     */
    private BigDecimal calculateSubsidyAmount(GovernmentSubsidy subsidy, List<SubsidyCalculationRule> rules, SubsidyCheckRequest request) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        boolean heatPumpRuleProcessed = false; // Flag to prevent double counting heat pump rules
        
        for (SubsidyCalculationRule rule : rules) {
            // Only calculate amount for rules that match the user's equipment selection
            if (!isEquipmentTypeMatch(rule.getEquipmentType(), request)) {
                continue; // Skip this rule if equipment type doesn't match
            }
            
            // For heat pumps, only process the first matching rule to avoid double counting
            if ((rule.getEquipmentType() == SubsidyCalculationRule.EquipmentType.AIR_SOURCE_HEAT_PUMP ||
                 rule.getEquipmentType() == SubsidyCalculationRule.EquipmentType.GROUND_SOURCE_HEAT_PUMP) &&
                 heatPumpRuleProcessed) {
                continue; // Skip additional heat pump rules
            }
            
            BigDecimal ruleAmount = BigDecimal.ZERO;
            
            if (rule.getRatePerUnit() != null) {
                // Calculate based on rate per unit
                Double capacity = getRelevantCapacity(rule.getEquipmentType(), request);
                if (capacity != null) {
                    ruleAmount = rule.getRatePerUnit().multiply(BigDecimal.valueOf(capacity));
                }
            } else if (rule.getMinimumAmount() != null) {
                // Use minimum amount as base
                ruleAmount = rule.getMinimumAmount();
            }
            
            // Apply maximum limit if specified
            if (rule.getMaximumAmount() != null && ruleAmount.compareTo(rule.getMaximumAmount()) > 0) {
                ruleAmount = rule.getMaximumAmount();
            }
            
            totalAmount = totalAmount.add(ruleAmount);
            
            // Mark heat pump rule as processed
            if (rule.getEquipmentType() == SubsidyCalculationRule.EquipmentType.AIR_SOURCE_HEAT_PUMP ||
                rule.getEquipmentType() == SubsidyCalculationRule.EquipmentType.GROUND_SOURCE_HEAT_PUMP) {
                heatPumpRuleProcessed = true;
            }
        }
        
        // Apply percentage-based calculation if configured
        if (subsidy.getCalculationMethod() == GovernmentSubsidy.CalculationMethod.PERCENTAGE_BASED 
            && subsidy.getPercentage() != null && request.getTotalInstallationCost() != null) {
            BigDecimal percentageAmount = BigDecimal.valueOf(request.getTotalInstallationCost())
                .multiply(subsidy.getPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(percentageAmount);
        }
        
        // Apply fixed amount if configured
        if (subsidy.getCalculationMethod() == GovernmentSubsidy.CalculationMethod.FIXED_AMOUNT 
            && subsidy.getFixedAmount() != null) {
            totalAmount = totalAmount.add(subsidy.getFixedAmount());
        }
        
        // Apply overall maximum limit
        if (subsidy.getMaxAmount() != null && totalAmount.compareTo(subsidy.getMaxAmount()) > 0) {
            totalAmount = subsidy.getMaxAmount();
        }
        
        return totalAmount.setScale(2, RoundingMode.HALF_UP);
    }
    
    // Helper methods
    private boolean isEquipmentTypeMatch(SubsidyCalculationRule.EquipmentType ruleType, SubsidyCheckRequest request) {
        if (ruleType == null) return true;
        
        switch (ruleType) {
            case SOLAR_PANELS:
                return Boolean.TRUE.equals(request.getHasSolarPanels());
            case AIR_SOURCE_HEAT_PUMP:
            case GROUND_SOURCE_HEAT_PUMP:
                return Boolean.TRUE.equals(request.getHasHeatPump());
            case BATTERY_STORAGE:
                return Boolean.TRUE.equals(request.getHasBattery());
            default:
                return false;
        }
    }
    
    private Double getRelevantCapacity(SubsidyCalculationRule.EquipmentType equipmentType, SubsidyCheckRequest request) {
        if (equipmentType == null) return null;
        
        switch (equipmentType) {
            case SOLAR_PANELS:
                return request.getSolarCapacityKw();
            case AIR_SOURCE_HEAT_PUMP:
            case GROUND_SOURCE_HEAT_PUMP:
                return request.getHeatPumpCapacityKw();
            case BATTERY_STORAGE:
                return request.getBatteryCapacityKwh();
            default:
                return null;
        }
    }
    
    private boolean isEpcRatingBetter(String actualRating, String requiredRating) {
        String[] ratings = {"A", "B", "C", "D", "E", "F", "G"};
        int actualIndex = Arrays.asList(ratings).indexOf(actualRating);
        int requiredIndex = Arrays.asList(ratings).indexOf(requiredRating);
        return actualIndex < requiredIndex; // Lower index = better rating
    }
    
    private String generateEligibilitySummary(List<SubsidyCalculationRule> rules) {
        List<String> requirements = new ArrayList<>();
        
        for (SubsidyCalculationRule rule : rules) {
            if (rule.getHouseTypeRequirement() != null) {
                requirements.add("House type: " + rule.getHouseTypeRequirement());
            }
            if (rule.getEpcRatingRequirement() != null) {
                requirements.add("EPC rating " + rule.getEpcRatingRequirement() + " or lower");
            }
            if (rule.getIncomeThreshold() != null) {
                requirements.add("Annual income below £" + rule.getIncomeThreshold().intValue());
            }
            if (rule.getCapacityMin() != null || rule.getCapacityMax() != null) {
                String capacityReq = "System capacity: ";
                if (rule.getCapacityMin() != null && rule.getCapacityMax() != null) {
                    capacityReq += rule.getCapacityMin() + "-" + rule.getCapacityMax() + " " + rule.getUnitType();
                } else if (rule.getCapacityMin() != null) {
                    capacityReq += "min " + rule.getCapacityMin() + " " + rule.getUnitType();
                } else {
                    capacityReq += "max " + rule.getCapacityMax() + " " + rule.getUnitType();
                }
                requirements.add(capacityReq);
            }
        }
        
        return requirements.isEmpty() ? "No specific eligibility requirements" : String.join("; ", requirements);
    }
    
    private String generateShortDescription(GovernmentSubsidy subsidy) {
        switch (subsidy.getSubsidyType()) {
            case SOLAR_PANELS:
                return "Financial support for solar panel installation";
            case HEAT_PUMP:
                return "Grant for heat pump installation and upgrade";
            case BATTERY_STORAGE:
                return "Support for home battery storage systems";
            case BOILER_UPGRADE:
                return "Grant to replace old heating systems";
            case INSULATION:
                return "Support for home insulation improvements";
            default:
                return "Government support for renewable energy";
        }
    }
    
    private Integer determinePriority(GovernmentSubsidy subsidy, boolean isEligible) {
        if (!isEligible) return 999; // Low priority for ineligible subsidies
        
        // Higher priority for higher value subsidies
        if (subsidy.getMaxAmount() != null) {
            if (subsidy.getMaxAmount().compareTo(BigDecimal.valueOf(5000)) > 0) return 1;
            if (subsidy.getMaxAmount().compareTo(BigDecimal.valueOf(2000)) > 0) return 2;
            return 3;
        }
        
        return 5; // Default priority
    }
    
    private List<String> getRequiredDocuments(GovernmentSubsidy.SubsidyType subsidyType) {
        List<String> documents = new ArrayList<>();
        documents.add("Proof of identity");
        documents.add("Proof of address");
        documents.add("Property ownership documents");
        
        switch (subsidyType) {
            case SOLAR_PANELS:
                documents.add("Installation quotes");
                documents.add("MCS certified installer details");
                break;
            case HEAT_PUMP:
                documents.add("Heat loss survey");
                documents.add("Current heating system details");
                break;
            case BATTERY_STORAGE:
                documents.add("Existing solar system details");
                documents.add("Battery specification sheet");
                break;
        }
        
        return documents;
    }
    
    private String generateRecommendationSummary(List<SubsidyCheckResult.AvailableSubsidy> subsidies, BigDecimal totalSavings) {
        long eligibleCount = subsidies.stream().filter(s -> s.getIsEligible()).count();
        
        if (eligibleCount == 0) {
            return "No subsidies are currently available for your configuration. Check back periodically as new schemes may become available.";
        } else if (eligibleCount == 1) {
            return String.format("You're eligible for 1 subsidy with potential savings of £%.0f. Apply as soon as possible as funding may be limited.", 
                totalSavings.doubleValue());
        } else {
            return String.format("You're eligible for %d subsidies with total potential savings of £%.0f. Consider applying for multiple schemes to maximize your savings.", 
                eligibleCount, totalSavings.doubleValue());
        }
    }
    
    private static class EligibilityResult {
        boolean isEligible;
        String reason;
        String calculationBasis;
    }
} 