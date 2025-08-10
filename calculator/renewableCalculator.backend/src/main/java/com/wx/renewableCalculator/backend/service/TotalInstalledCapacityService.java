package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.dto.TotalInstalledCapacityRequest;
import com.wx.renewableCalculator.backend.dto.TotalInstalledCapacityResult;
import com.wx.renewableCalculator.backend.entity.SolarPanelType;
import com.wx.renewableCalculator.backend.repository.SolarPanelTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class TotalInstalledCapacityService {

    @Autowired
    private SolarPanelTypeRepository solarPanelTypeRepository;

    // Area utilisation factors (same as in SolarPotentialService)
    private static final Map<String, Double> AREA_UTILISATION_FACTORS = new HashMap<>();
    static {
        AREA_UTILISATION_FACTORS.put("minimal-obstacles", 0.92);     // Almost full roof utilization
        AREA_UTILISATION_FACTORS.put("some-obstacles", 0.85);       // Some obstacles, good utilization
        AREA_UTILISATION_FACTORS.put("many-obstacles", 0.70);       // Multiple obstacles, moderate utilization
    }

    /**
     * Calculate Total Installed Capacity using the formula:
     * Total Installed Capacity = (Roof Area × Area Utilisation Factor) / Solar Panel's Size × Rated Power Per Panel
     * 
     * @param request Total installed capacity calculation parameters
     * @return Total installed capacity calculation results
     */
    public TotalInstalledCapacityResult calculateTotalInstalledCapacity(TotalInstalledCapacityRequest request) {
        // Get solar panel specifications from database
        Optional<SolarPanelType> solarPanelOpt = solarPanelTypeRepository.findById(request.getSolarPanelTypeId());
        if (solarPanelOpt.isEmpty()) {
            throw new RuntimeException("Solar panel type not found with ID: " + request.getSolarPanelTypeId());
        }
        
        SolarPanelType solarPanel = solarPanelOpt.get();
        
        // Get area utilisation factor
        Double areaUtilisationFactor = AREA_UTILISATION_FACTORS.getOrDefault(request.getUtilisationLevel(), 0.85);
        
        // Apply the formula: (Roof Area × Area Utilisation Factor) / Solar Panel's Size × Rated Power Per Panel
        Double usableRoofArea = request.getRoofArea() * areaUtilisationFactor;
        Double numberOfPanels = usableRoofArea / solarPanel.getPanelSize();
        Double totalInstalledCapacityWatts = numberOfPanels * solarPanel.getRatedPowerPerPanel();
        
        // Convert watts to kilowatts
        Double totalInstalledCapacityKW = totalInstalledCapacityWatts / 1000.0;
        
        TotalInstalledCapacityResult result = new TotalInstalledCapacityResult();
        result.setTotalInstalledCapacity(BigDecimal.valueOf(totalInstalledCapacityKW).setScale(2, RoundingMode.HALF_UP));
        result.setRoofArea(BigDecimal.valueOf(request.getRoofArea()).setScale(2, RoundingMode.HALF_UP));
        result.setAreaUtilisationFactor(BigDecimal.valueOf(areaUtilisationFactor).setScale(2, RoundingMode.HALF_UP));
        result.setSolarPanelSize(BigDecimal.valueOf(solarPanel.getPanelSize()).setScale(2, RoundingMode.HALF_UP));
        result.setRatedPowerPerPanel(BigDecimal.valueOf(solarPanel.getRatedPowerPerPanel() / 1000.0).setScale(3, RoundingMode.HALF_UP)); // Convert to kW
        result.setSolarPanelName(solarPanel.getName());
        result.setSolarPanelManufacturer(solarPanel.getManufacturer());
        
        return result;
    }
} 