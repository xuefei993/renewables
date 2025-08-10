package com.wx.renewableCalculator.backend.service;

import com.wx.renewableCalculator.backend.entity.City;
import com.wx.renewableCalculator.backend.entity.Region;
import com.wx.renewableCalculator.backend.entity.SolarPanelType;
import com.wx.renewableCalculator.backend.entity.MonthlySolarIrradiance;
import com.wx.renewableCalculator.backend.entity.HeatPump;
import com.wx.renewableCalculator.backend.repository.CityRepository;
import com.wx.renewableCalculator.backend.repository.RegionRepository;
import com.wx.renewableCalculator.backend.repository.SolarPanelTypeRepository;
import com.wx.renewableCalculator.backend.repository.MonthlySolarIrradianceRepository;
import com.wx.renewableCalculator.backend.repository.HeatPumpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private SolarPanelTypeRepository solarPanelTypeRepository;

    @Autowired
    private MonthlySolarIrradianceRepository solarIrradianceRepository;

    @Autowired
    private HeatPumpRepository heatPumpRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (regionRepository.count() == 0) {
            initializeLocationData();
        }
        
        // Initialize solar panel types if they don't exist
        if (solarPanelTypeRepository.count() == 0) {
            initializeSolarPanelTypes();
        }

        // Initialize sample solar irradiance data if they don't exist
        if (solarIrradianceRepository.count() == 0) {
            initializeSampleSolarIrradianceData();
        }

        // Initialize heat pumps if they don't exist
        if (heatPumpRepository.count() == 0) {
            initializeHeatPumps();
        }
    }

    private void initializeSampleSolarIrradianceData() {
        // Sample solar irradiance data for major UK cities (approximate values from NASA POWER)
        // London coordinates: 51.5074, -0.1278
        initializeSolarIrradianceForLocation(51.5074, -0.1278, "London", 
            new double[]{0.52, 1.25, 2.48, 3.95, 5.18, 5.82, 5.45, 4.75, 3.18, 1.82, 0.83, 0.41});

        // Manchester coordinates: 53.4808, -2.2426
        initializeSolarIrradianceForLocation(53.4808, -2.2426, "Manchester",
            new double[]{0.48, 1.18, 2.35, 3.78, 4.95, 5.58, 5.22, 4.52, 3.02, 1.73, 0.78, 0.38});

        // Edinburgh coordinates: 55.9533, -3.1883
        initializeSolarIrradianceForLocation(55.9533, -3.1883, "Edinburgh",
            new double[]{0.45, 1.15, 2.28, 3.68, 4.82, 5.45, 5.08, 4.38, 2.95, 1.68, 0.75, 0.36});

        // Cardiff coordinates: 51.4816, -3.1791
        initializeSolarIrradianceForLocation(51.4816, -3.1791, "Cardiff",
            new double[]{0.50, 1.22, 2.42, 3.88, 5.08, 5.72, 5.35, 4.68, 3.12, 1.78, 0.81, 0.40});

        // Birmingham coordinates: 52.4862, -1.8904
        initializeSolarIrradianceForLocation(52.4862, -1.8904, "Birmingham",
            new double[]{0.51, 1.23, 2.45, 3.92, 5.12, 5.78, 5.38, 4.72, 3.15, 1.80, 0.82, 0.40});

        // Belfast coordinates: 54.5973, -5.9301
        initializeSolarIrradianceForLocation(54.5973, -5.9301, "Belfast",
            new double[]{0.47, 1.16, 2.32, 3.72, 4.88, 5.52, 5.15, 4.45, 2.98, 1.70, 0.76, 0.37});
    }

    private void initializeSolarIrradianceForLocation(double latitude, double longitude, String location, double[] monthlyValues) {
        for (int month = 1; month <= 12; month++) {
            MonthlySolarIrradiance irradiance = new MonthlySolarIrradiance(
                latitude, longitude, month, monthlyValues[month - 1]);
            irradiance.setLocation(location);
            solarIrradianceRepository.save(irradiance);
        }
    }

    private void initializeSolarPanelTypes() {
        List<SolarPanelType> solarPanels = Arrays.asList(
            // Standard residential panels (around 2m²)
            new SolarPanelType("Monocrystalline 400W", "Generic", 2.0, 400.0),
            new SolarPanelType("Polycrystalline 320W", "Generic", 2.0, 320.0),
            new SolarPanelType("Monocrystalline 450W", "Generic", 2.1, 450.0),
            
            // Premium panels
            new SolarPanelType("SunPower Maxeon 3", "SunPower", 1.69, 400.0),
            new SolarPanelType("LG NeON R", "LG", 2.0, 365.0),
            new SolarPanelType("Panasonic HIT+", "Panasonic", 1.85, 330.0),
            
            // High efficiency panels
            new SolarPanelType("Tesla Solar Panel", "Tesla", 1.85, 425.0),
            new SolarPanelType("REC Alpha Pure", "REC", 1.92, 405.0),
            new SolarPanelType("Q.PEAK DUO BLK ML-G10+", "Q CELLS", 2.11, 395.0)
        );

        solarPanelTypeRepository.saveAll(solarPanels);
    }

    private void initializeLocationData() {
        // England regions
        Region greaterLondon = new Region("Greater London", "England");
        regionRepository.save(greaterLondon);
        
        Region southEast = new Region("South East", "England");
        regionRepository.save(southEast);
        
        Region southWest = new Region("South West", "England");
        regionRepository.save(southWest);
        
        Region westMidlands = new Region("West Midlands", "England");
        regionRepository.save(westMidlands);
        
        Region eastMidlands = new Region("East Midlands", "England");
        regionRepository.save(eastMidlands);
        
        Region yorkshireHumber = new Region("Yorkshire and Humber", "England");
        regionRepository.save(yorkshireHumber);
        
        Region northWest = new Region("North West", "England");
        regionRepository.save(northWest);
        
        Region northEast = new Region("North East", "England");
        regionRepository.save(northEast);

        // Scotland regions
        Region centralBelt = new Region("Central Belt", "Scotland");
        regionRepository.save(centralBelt);
        
        Region highlandsIslands = new Region("Highlands and Islands", "Scotland");
        regionRepository.save(highlandsIslands);
        
        Region southScotland = new Region("South Scotland", "Scotland");
        regionRepository.save(southScotland);

        // Wales regions
        Region southWales = new Region("South Wales", "Wales");
        regionRepository.save(southWales);
        
        Region midWales = new Region("Mid Wales", "Wales");
        regionRepository.save(midWales);
        
        Region northWales = new Region("North Wales", "Wales");
        regionRepository.save(northWales);

        // Northern Ireland regions
        Region greaterBelfast = new Region("Greater Belfast", "Northern Ireland");
        regionRepository.save(greaterBelfast);
        
        Region otherAreas = new Region("Other Areas", "Northern Ireland");
        regionRepository.save(otherAreas);

        // Initialize cities
        initializeCities(greaterLondon, southEast, southWest, westMidlands, eastMidlands, 
                        yorkshireHumber, northWest, northEast, centralBelt, highlandsIslands, 
                        southScotland, southWales, midWales, northWales, greaterBelfast, otherAreas);
    }

    private void initializeCities(Region... regions) {
        Region greaterLondon = regions[0];
        Region southEast = regions[1];
        Region southWest = regions[2];
        Region westMidlands = regions[3];
        Region eastMidlands = regions[4];
        Region yorkshireHumber = regions[5];
        Region northWest = regions[6];
        Region northEast = regions[7];
        Region centralBelt = regions[8];
        Region highlandsIslands = regions[9];
        Region southScotland = regions[10];
        Region southWales = regions[11];
        Region midWales = regions[12];
        Region northWales = regions[13];
        Region greaterBelfast = regions[14];
        Region otherAreas = regions[15];

        List<City> cities = Arrays.asList(
            // Greater London
            new City("London", "SW1A 1AA", greaterLondon),
            new City("Westminster", "SW1A 0AA", greaterLondon),
            new City("Camden", "NW1 1AA", greaterLondon),
            new City("Greenwich", "SE10 8QY", greaterLondon),

            // South East
            new City("Brighton", "BN1 1AA", southEast),
            new City("Canterbury", "CT1 1AA", southEast),
            new City("Oxford", "OX1 1AA", southEast),
            new City("Reading", "RG1 1AA", southEast),

            // South West
            new City("Bristol", "BS1 1AA", southWest),
            new City("Bath", "BA1 1AA", southWest),
            new City("Plymouth", "PL1 1AA", southWest),
            new City("Exeter", "EX1 1AA", southWest),

            // West Midlands
            new City("Birmingham", "B1 1AA", westMidlands),
            new City("Coventry", "CV1 1AA", westMidlands),
            new City("Wolverhampton", "WV1 1AA", westMidlands),

            // East Midlands
            new City("Nottingham", "NG1 1AA", eastMidlands),
            new City("Leicester", "LE1 1AA", eastMidlands),
            new City("Derby", "DE1 1AA", eastMidlands),

            // Yorkshire and Humber
            new City("Leeds", "LS1 1AA", yorkshireHumber),
            new City("Sheffield", "S1 1AA", yorkshireHumber),
            new City("York", "YO1 7AA", yorkshireHumber),
            new City("Hull", "HU1 1AA", yorkshireHumber),

            // North West
            new City("Manchester", "M1 1AA", northWest),
            new City("Liverpool", "L1 1AA", northWest),
            new City("Preston", "PR1 1AA", northWest),
            new City("Chester", "CH1 1AA", northWest),

            // North East
            new City("Newcastle", "NE1 1AA", northEast),
            new City("Durham", "DH1 1AA", northEast),
            new City("Sunderland", "SR1 1AA", northEast),

            // Central Belt Scotland
            new City("Glasgow", "G1 1AA", centralBelt),
            new City("Edinburgh", "EH1 1AA", centralBelt),
            new City("Stirling", "FK8 1AA", centralBelt),

            // Highlands and Islands Scotland
            new City("Inverness", "IV1 1AA", highlandsIslands),
            new City("Fort William", "PH33 6AA", highlandsIslands),
            new City("Oban", "PA34 4AA", highlandsIslands),

            // South Scotland
            new City("Dumfries", "DG1 1AA", southScotland),
            new City("St Andrews", "KY16 8DE", southScotland),
            new City("Dundee", "DD1 1AA", southScotland),

            // South Wales
            new City("Cardiff", "CF10 1AA", southWales),
            new City("Swansea", "SA1 1AA", southWales),
            new City("Newport", "NP20 1AA", southWales),

            // Mid Wales
            new City("Aberystwyth", "SY23 1AA", midWales),
            new City("Machynlleth", "SY20 8AA", midWales),

            // North Wales
            new City("Bangor", "LL57 1AA", northWales),
            new City("Wrexham", "LL11 1AA", northWales),
            new City("Conwy", "LL32 8AA", northWales),

            // Greater Belfast
            new City("Belfast", "BT1 1AA", greaterBelfast),
            new City("Lisburn", "BT28 1AA", greaterBelfast),

            // Other Areas Northern Ireland
            new City("Derry/Londonderry", "BT48 6AA", otherAreas),
            new City("Armagh", "BT61 7AA", otherAreas),
            new City("Enniskillen", "BT74 6AA", otherAreas)
        );

        cityRepository.saveAll(cities);
    }

    /**
     * Initialize sample heat pump data
     */
    private void initializeHeatPumps() {
        List<HeatPump> heatPumps = Arrays.asList(
            // Air source heat pumps with different COP values
            createHeatPump("Air Source Heat Pump - Standard", 3.0, 8000),
            createHeatPump("Air Source Heat Pump - High Efficiency", 3.5, 9500),
            createHeatPump("Air Source Heat Pump - Premium", 4.0, 11000),
            
            // Ground source heat pumps (higher COP but more expensive)
            createHeatPump("Ground Source Heat Pump - Standard", 4.2, 15000),
            createHeatPump("Ground Source Heat Pump - High Efficiency", 4.8, 18000),
            
            // Hybrid systems
            createHeatPump("Hybrid Air Source Heat Pump", 3.2, 10000)
        );

        heatPumpRepository.saveAll(heatPumps);
        System.out.println("Initialized " + heatPumps.size() + " heat pump types");
    }

    /**
     * Helper method to create a heat pump
     */
    private HeatPump createHeatPump(String name, Double cop, Integer cost) {
        HeatPump heatPump = new HeatPump();
        heatPump.setName(name);
        heatPump.setCop(java.math.BigDecimal.valueOf(cop));
        heatPump.setCost(java.math.BigDecimal.valueOf(cost));
        return heatPump;
    }
} 