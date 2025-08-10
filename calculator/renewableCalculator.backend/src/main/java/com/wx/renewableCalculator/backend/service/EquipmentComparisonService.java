package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.*;
import com.wx.renewableCalculator.backend.entity.*;
import com.wx.renewableCalculator.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EquipmentComparisonService {
    
    @Autowired
    private SolarPanelTypeRepository solarPanelTypeRepository;
    
    @Autowired
    private BatteryRepository batteryRepository;
    
    @Autowired
    private HeatPumpRepository heatPumpRepository;
    
    @Autowired
    private SolarInstallationCostService solarInstallationCostService;
    
    @Autowired
    private MonthlySavingsService monthlySavingsService;
    
    @Autowired
    private CarbonSavingsService carbonSavingsService;
    
    @Autowired
    private SolarElectricityGenerationService solarElectricityGenerationService;
    
    /**
     * Compare equipment options based on user requirements
     */
    public EquipmentComparisonResult compareEquipment(EquipmentComparisonRequest request) {
        
        EquipmentComparisonResult result = new EquipmentComparisonResult();
        
        // Compare solar panels if selected
        if (Boolean.TRUE.equals(request.getHasSolarPanels()) && 
            request.getSolarPanelTypeIds() != null && !request.getSolarPanelTypeIds().isEmpty()) {
            result.setSolarPanelOptions(compareSolarPanels(request));
        } else {
            result.setSolarPanelOptions(new ArrayList<>());
        }
        
        // Compare heat pumps if selected
        if (Boolean.TRUE.equals(request.getHasHeatPump()) && 
            request.getHeatPumpTypeIds() != null && !request.getHeatPumpTypeIds().isEmpty()) {
            result.setHeatPumpOptions(compareHeatPumps(request));
        } else {
            result.setHeatPumpOptions(new ArrayList<>());
        }
        
        // Compare batteries if selected
        if (Boolean.TRUE.equals(request.getHasBattery()) && 
            request.getBatteryIds() != null && !request.getBatteryIds().isEmpty()) {
            result.setBatteryOptions(compareBatteries(request));
        } else {
            result.setBatteryOptions(new ArrayList<>());
        }
        
        // Generate system combination recommendations
        result.setRecommendedCombinations(generateSystemCombinations(request, result));
        
        return result;
    }
    
    /**
     * Compare solar panel options
     */
    private List<EquipmentComparisonResult.EquipmentOption> compareSolarPanels(EquipmentComparisonRequest request) {
        List<EquipmentComparisonResult.EquipmentOption> options = new ArrayList<>();
        
        for (Long solarPanelId : request.getSolarPanelTypeIds()) {
            Optional<SolarPanelType> panelOpt = solarPanelTypeRepository.findById(solarPanelId);
            if (panelOpt.isPresent()) {
                SolarPanelType panel = panelOpt.get();
                EquipmentComparisonResult.EquipmentOption option = createSolarPanelOption(panel, request);
                options.add(option);
            }
        }
        
        return options;
    }
    
    /**
     * Create solar panel comparison option
     */
    private EquipmentComparisonResult.EquipmentOption createSolarPanelOption(SolarPanelType panel, EquipmentComparisonRequest request) {
        EquipmentComparisonResult.EquipmentOption option = new EquipmentComparisonResult.EquipmentOption();
        
        // Basic info
        option.setEquipmentId(panel.getId());
        option.setEquipmentName(panel.getName());
        option.setManufacturer(panel.getManufacturer());
        option.setEquipmentType("solar");
        
        // Technical specifications
        Map<String, Object> specs = new HashMap<>();
        specs.put("panelSize", panel.getPanelSize() + " m²");
        specs.put("ratedPower", panel.getRatedPowerPerPanel() + " W");
        specs.put("efficiency", panel.getEfficiency() + "%");
        option.setSpecifications(specs);
        
        // Calculate recommended quantity and system capacity
        double roofArea = request.getRoofArea() != null ? request.getRoofArea() : 30.0;
        int recommendedQuantity = (int) Math.floor(roofArea / panel.getPanelSize());
        double totalSystemCapacityKw = (recommendedQuantity * panel.getRatedPowerPerPanel()) / 1000.0;
        
        option.setRecommendedQuantity(recommendedQuantity);
        option.setTotalSystemCapacity(totalSystemCapacityKw);
        
        // Calculate installation cost
        double equipmentCost = recommendedQuantity * (panel.getPrice() != null ? panel.getPrice() : 300.0);
        double installationCost = solarInstallationCostService.getAverageCost(totalSystemCapacityKw);
        
        option.setEquipmentCost(equipmentCost);
        option.setInstallationCost(equipmentCost + installationCost);
        
        // Calculate annual and monthly performance
        calculateSolarPerformance(option, request, totalSystemCapacityKw);
        
        // Calculate suitability score
        option.setSuitabilityScore(calculateSolarSuitability(panel, request));
        option.setSuitabilityReason(generateSolarSuitabilityReason(panel, request));
        
        return option;
    }
    
    /**
     * Calculate solar panel performance (annual and monthly)
     */
    private void calculateSolarPerformance(EquipmentComparisonResult.EquipmentOption option, 
                                         EquipmentComparisonRequest request, 
                                         double systemCapacityKw) {
        
        List<Double> monthlyGeneration = new ArrayList<>();
        List<Double> monthlyCostSavings = new ArrayList<>();
        List<Double> monthlyExportRevenue = new ArrayList<>();
        List<Double> monthlyDirectCO2 = new ArrayList<>();
        List<Double> monthlyIndirectCO2 = new ArrayList<>();
        
        double annualGeneration = 0.0;
        double annualCostSavings = 0.0;
        double annualExportRevenue = 0.0;
        double annualDirectCO2 = 0.0;
        double annualIndirectCO2 = 0.0;
        
        for (int month = 1; month <= 12; month++) {
            // Calculate monthly solar generation using existing service
            double monthlyGen = calculateMonthlySolarGeneration(systemCapacityKw, month, request);
            monthlyGeneration.add(monthlyGen);
            annualGeneration += monthlyGen;
            
            // Calculate monthly savings using existing services
            MonthlySavingsRequest savingsRequest = createMonthlySavingsRequest(request, month, monthlyGen);
            MonthlySavingsResult savingsResult = monthlySavingsService.calculateMonthlySavings(savingsRequest);
            
            double monthlyCost = savingsResult.getSolarSavings() != null ? savingsResult.getSolarSavings() / 100.0 : 0.0; // Convert pence to pounds
            double monthlyExport = savingsResult.getSolarExportSavings() != null ? savingsResult.getSolarExportSavings() / 100.0 : 0.0;
            
            monthlyCostSavings.add(monthlyCost);
            monthlyExportRevenue.add(monthlyExport);
            annualCostSavings += monthlyCost;
            annualExportRevenue += monthlyExport;
            
            // Calculate monthly carbon savings
            CarbonSavingsRequest carbonRequest = createCarbonSavingsRequest(request, month, monthlyGen);
            CarbonSavingsResult carbonResult = carbonSavingsService.calculateCarbonSavings(carbonRequest);
            
            double monthlyDirect = carbonResult.getDirectEmissionsSavingsKgCO2() != null ? carbonResult.getDirectEmissionsSavingsKgCO2() : 0.0;
            double monthlyIndirect = carbonResult.getIndirectEmissionsSavingsKgCO2() != null ? carbonResult.getIndirectEmissionsSavingsKgCO2() : 0.0;
            
            monthlyDirectCO2.add(monthlyDirect);
            monthlyIndirectCO2.add(monthlyIndirect);
            annualDirectCO2 += monthlyDirect;
            annualIndirectCO2 += monthlyIndirect;
        }
        
        // Set annual data
        option.setAnnualGeneration(annualGeneration);
        option.setAnnualCostSavings(annualCostSavings);
        option.setAnnualExportRevenue(annualExportRevenue);
        option.setAnnualDirectCO2Savings(annualDirectCO2);
        option.setAnnualIndirectCO2Savings(annualIndirectCO2);
        option.setAnnualTotalCO2Savings(annualDirectCO2 + annualIndirectCO2);
        
        // Set monthly data
        option.setMonthlyGeneration(monthlyGeneration);
        option.setMonthlyCostSavings(monthlyCostSavings);
        option.setMonthlyExportRevenue(monthlyExportRevenue);
        option.setMonthlyDirectCO2Savings(monthlyDirectCO2);
        option.setMonthlyIndirectCO2Savings(monthlyIndirectCO2);
        
        // Calculate financial metrics
        double totalInstallationCost = option.getInstallationCost();
        double annualSavings = annualCostSavings + annualExportRevenue;
        
        option.setPaybackPeriodYears(annualSavings > 0 ? totalInstallationCost / annualSavings : 999.0);
        option.setRoi10Years(annualSavings > 0 ? ((annualSavings * 10) - totalInstallationCost) / totalInstallationCost * 100 : -100.0);
    }
    
    /**
     * Compare heat pump options
     */
    private List<EquipmentComparisonResult.EquipmentOption> compareHeatPumps(EquipmentComparisonRequest request) {
        List<EquipmentComparisonResult.EquipmentOption> options = new ArrayList<>();
        
        for (Long heatPumpId : request.getHeatPumpTypeIds()) {
            Optional<HeatPump> heatPumpOpt = heatPumpRepository.findById(heatPumpId.intValue());
            if (heatPumpOpt.isPresent()) {
                HeatPump heatPump = heatPumpOpt.get();
                EquipmentComparisonResult.EquipmentOption option = createHeatPumpOption(heatPump, request);
                options.add(option);
            }
        }
        
        return options;
    }
    
    /**
     * Create heat pump comparison option
     */
    private EquipmentComparisonResult.EquipmentOption createHeatPumpOption(HeatPump heatPump, EquipmentComparisonRequest request) {
        EquipmentComparisonResult.EquipmentOption option = new EquipmentComparisonResult.EquipmentOption();
        
        // Basic info
        option.setEquipmentId(heatPump.getId().longValue());
        option.setEquipmentName(heatPump.getName());
        option.setManufacturer("Various"); // Add manufacturer field to HeatPump entity if needed
        option.setEquipmentType("heatpump");
        
        // Technical specifications
        Map<String, Object> specs = new HashMap<>();
        specs.put("cop", heatPump.getCop().toString());
        specs.put("type", "Air Source Heat Pump"); // Add type field if needed
        option.setSpecifications(specs);
        
        // Installation cost (simplified calculation)
        double installationCost = heatPump.getCost() != null ? heatPump.getCost().doubleValue() : 8000.0;
        option.setEquipmentCost(installationCost * 0.7); // Assume 70% equipment, 30% installation
        option.setInstallationCost(installationCost);
        
        // Calculate performance metrics
        calculateHeatPumpPerformance(option, request, heatPump);
        
        // Suitability
        option.setSuitabilityScore(calculateHeatPumpSuitability(heatPump, request));
        option.setSuitabilityReason(generateHeatPumpSuitabilityReason(heatPump, request));
        
        return option;
    }
    
    /**
     * Compare battery options
     */
    private List<EquipmentComparisonResult.EquipmentOption> compareBatteries(EquipmentComparisonRequest request) {
        List<EquipmentComparisonResult.EquipmentOption> options = new ArrayList<>();
        
        for (Long batteryId : request.getBatteryIds()) {
            Optional<Battery> batteryOpt = batteryRepository.findById(batteryId.intValue());
            if (batteryOpt.isPresent()) {
                Battery battery = batteryOpt.get();
                EquipmentComparisonResult.EquipmentOption option = createBatteryOption(battery, request);
                options.add(option);
            }
        }
        
        return options;
    }
    
    /**
     * Create battery comparison option
     */
    private EquipmentComparisonResult.EquipmentOption createBatteryOption(Battery battery, EquipmentComparisonRequest request) {
        EquipmentComparisonResult.EquipmentOption option = new EquipmentComparisonResult.EquipmentOption();
        
        // Basic info
        option.setEquipmentId(battery.getId().longValue());
        option.setEquipmentName(battery.getName());
        option.setManufacturer("Various"); // Add manufacturer field to Battery entity if needed
        option.setEquipmentType("battery");
        
        // Technical specifications
        Map<String, Object> specs = new HashMap<>();
        specs.put("capacity", battery.getCapacityKwh().toString() + " kWh");
        specs.put("type", "Lithium-ion"); // Add type field if needed
        option.setSpecifications(specs);
        
        // Installation cost
        double installationCost = battery.getCost() != null ? battery.getCost().doubleValue() : 5000.0;
        option.setEquipmentCost(installationCost * 0.8); // Assume 80% equipment, 20% installation
        option.setInstallationCost(installationCost);
        
        // Calculate performance metrics
        calculateBatteryPerformance(option, request, battery);
        
        // Suitability
        option.setSuitabilityScore(calculateBatterySuitability(battery, request));
        option.setSuitabilityReason(generateBatterySuitabilityReason(battery, request));
        
        return option;
    }
    
    // Helper methods for calculations
    private double calculateMonthlySolarGeneration(double systemCapacityKw, int month, EquipmentComparisonRequest request) {
        // Simplified calculation - in real implementation, use SolarElectricityGenerationService
        double[] monthlyFactors = {0.6, 0.8, 1.2, 1.5, 1.8, 1.9, 2.0, 1.8, 1.4, 1.0, 0.7, 0.5}; // Seasonal factors
        return systemCapacityKw * monthlyFactors[month - 1] * 30 * 24 * 0.2; // Simplified calculation
    }
    
    private MonthlySavingsRequest createMonthlySavingsRequest(EquipmentComparisonRequest request, int month, double solarGeneration) {
        MonthlySavingsRequest savingsRequest = new MonthlySavingsRequest();
        savingsRequest.setHasSolarPanels(true);
        savingsRequest.setHasHeatPump(request.getHasHeatPump());
        savingsRequest.setHasBattery(request.getHasBattery());
        savingsRequest.setMonth(month);
        savingsRequest.setSolarGenerationKwh(solarGeneration);
        savingsRequest.setMonthlyElectricityUsageKwh(request.getMonthlyElectricityUsageKwh());
        savingsRequest.setElectricityRate(request.getElectricityRate());
        savingsRequest.setExportRate(request.getExportRate());
        savingsRequest.setHomeOccupancyFactor(request.getHomeOccupancyFactor());
        return savingsRequest;
    }
    
    private CarbonSavingsRequest createCarbonSavingsRequest(EquipmentComparisonRequest request, int month, double solarGeneration) {
        CarbonSavingsRequest carbonRequest = new CarbonSavingsRequest();
        carbonRequest.setHasSolarPanels(true);
        carbonRequest.setHasHeatPump(request.getHasHeatPump());
        carbonRequest.setHasBattery(request.getHasBattery());
        carbonRequest.setMonth(month);
        carbonRequest.setTotalElectricityDemandKwh(request.getMonthlyElectricityUsageKwh());
        carbonRequest.setSolarSelfConsumedKwh(solarGeneration * 0.4); // Assume 40% self-consumption
        return carbonRequest;
    }
    
    private void calculateHeatPumpPerformance(EquipmentComparisonResult.EquipmentOption option, EquipmentComparisonRequest request, HeatPump heatPump) {
        // Simplified heat pump performance calculation
        double annualGasSaved = request.getAnnualGasUsageKwh() != null ? request.getAnnualGasUsageKwh() : 15000.0;
        double annualCostSavings = annualGasSaved * (request.getGasRate() != null ? request.getGasRate() / 100.0 : 0.07); // Convert pence to pounds
        
        option.setAnnualGeneration(0.0); // Heat pumps don't generate electricity
        option.setAnnualCostSavings(annualCostSavings * 0.7); // Assume 70% efficiency gain
        option.setAnnualExportRevenue(0.0);
        
        // Set monthly data (simplified)
        List<Double> monthlyData = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthlyData.add(annualCostSavings / 12.0);
        }
        option.setMonthlyCostSavings(monthlyData);
    }
    
    private void calculateBatteryPerformance(EquipmentComparisonResult.EquipmentOption option, EquipmentComparisonRequest request, Battery battery) {
        // Simplified battery performance calculation
        double capacity = battery.getCapacityKwh().doubleValue();
        double peakRate = request.getPeakElectricityRate() != null ? request.getPeakElectricityRate() / 100.0 : 0.35;
        double offPeakRate = request.getOffPeakElectricityRate() != null ? request.getOffPeakElectricityRate() / 100.0 : 0.15;
        
        double annualCostSavings = capacity * (peakRate - offPeakRate) * 300; // Assume 300 cycles per year
        
        option.setAnnualGeneration(0.0); // Batteries don't generate
        option.setAnnualCostSavings(annualCostSavings);
        option.setAnnualExportRevenue(0.0);
        
        // Set monthly data (simplified)
        List<Double> monthlyData = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthlyData.add(annualCostSavings / 12.0);
        }
        option.setMonthlyCostSavings(monthlyData);
    }
    
    // Suitability calculation methods
    private Double calculateSolarSuitability(SolarPanelType panel, EquipmentComparisonRequest request) {
        double score = 70.0; // Base score
        
        // Adjust based on roof area
        double roofArea = request.getRoofArea() != null ? request.getRoofArea() : 30.0;
        if (roofArea > 50) score += 10;
        else if (roofArea < 20) score -= 20;
        
        // Adjust based on efficiency
        if (panel.getEfficiency() != null && panel.getEfficiency() > 20) score += 15;
        
        return Math.min(100.0, Math.max(0.0, score));
    }
    
    private Double calculateHeatPumpSuitability(HeatPump heatPump, EquipmentComparisonRequest request) {
        double score = 70.0; // Base score
        
        // Adjust based on COP
        if (heatPump.getCop() != null && heatPump.getCop().doubleValue() > 3.5) score += 15;
        
        // Adjust based on house area
        double houseArea = request.getHouseArea() != null ? request.getHouseArea() : 100.0;
        if (houseArea > 150) score += 10;
        
        return Math.min(100.0, Math.max(0.0, score));
    }
    
    private Double calculateBatterySuitability(Battery battery, EquipmentComparisonRequest request) {
        double score = 70.0; // Base score
        
        // Adjust based on capacity and usage
        double capacity = battery.getCapacityKwh().doubleValue();
        double dailyUsage = request.getMonthlyElectricityUsageKwh() != null ? request.getMonthlyElectricityUsageKwh() / 30.0 : 10.0;
        
        if (capacity >= dailyUsage * 0.5 && capacity <= dailyUsage * 1.5) score += 20;
        
        return Math.min(100.0, Math.max(0.0, score));
    }
    
    private String generateSolarSuitabilityReason(SolarPanelType panel, EquipmentComparisonRequest request) {
        return "High efficiency panels suitable for UK climate with good ROI potential.";
    }
    
    private String generateHeatPumpSuitabilityReason(HeatPump heatPump, EquipmentComparisonRequest request) {
        return "Efficient heat pump with good COP rating, suitable for replacing gas heating.";
    }
    
    private String generateBatterySuitabilityReason(Battery battery, EquipmentComparisonRequest request) {
        return "Battery capacity well-matched to household energy usage patterns.";
    }
    
    private List<EquipmentComparisonResult.SystemCombination> generateSystemCombinations(EquipmentComparisonRequest request, EquipmentComparisonResult result) {
        // Simplified combination generation
        return new ArrayList<>(); // TODO: Implement smart combination recommendations
    }
} 