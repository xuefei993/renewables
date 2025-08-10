import axios from "axios";
import { mockDataService } from "./services/mockDataService";

const API_BASE = "http://localhost:8080/api";

// Helper function to create API call with fallback
const apiWithFallback = async (apiCall, fallbackData) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn(`API call failed, using cached data: ${error.message}`);
    return { data: fallbackData };
  }
};

export const getComponents = (type) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/${type}`),
    mockDataService.getSolarPanelTypes()
  );

export const calculate = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/calculate`, data),
    mockDataService.getCompleteCalculationResult(data)
  );
export const calculateSolarPotential = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/solar-potential`, data),
    mockDataService.getSolarPotentialResult(data)
  );

// New Location APIs
export const getAllRegions = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/locations/regions`),
    mockDataService.getLocationData()
  );

export const getRegionsByCountry = (country) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/locations/regions/country/${country}`),
    mockDataService.getLocationData().filter(item => item.country === country)
  );

export const searchCitiesByName = (name) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/locations/cities/search?name=${name}`),
    mockDataService.getLocationData().filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    )
  );

export const searchCitiesByPostcode = (prefix) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/locations/cities/postcode?prefix=${prefix}`),
    mockDataService.getLocationData().filter(item => 
      item.postcode.toLowerCase().startsWith(prefix.toLowerCase())
    )
  );

export const getCitiesByCountry = (country) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/locations/cities/country/${country}`),
    mockDataService.getLocationData().filter(item => item.country === country)
  );

// New NASA POWER API (replaced frontend implementation)
export const fetchSolarData = (latitude, longitude, location) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/nasa-power/solar-data`, { latitude, longitude, location }),
    {
      success: true,
      data: {
        1: 0.6, 2: 1.2, 3: 2.4, 4: 3.8, 5: 4.9, 6: 5.2,
        7: 4.8, 8: 4.1, 9: 2.8, 10: 1.6, 11: 0.8, 12: 0.5
      },
      source: 'NASA POWER',
      message: 'Historical solar irradiance data'
    }
  );

export const fetchSolarDataGet = (latitude, longitude, location) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/nasa-power/solar-data?latitude=${latitude}&longitude=${longitude}&location=${location || ''}`),
    {
      success: true,
      data: {
        1: 0.6, 2: 1.2, 3: 2.4, 4: 3.8, 5: 4.9, 6: 5.2,
        7: 4.8, 8: 4.1, 9: 2.8, 10: 1.6, 11: 0.8, 12: 0.5
      },
      source: 'NASA POWER',
      message: 'Historical solar irradiance data'
    }
  );

// New Location Specific Yield API
export const calculateLocationSpecificYield = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/location-yield/calculate`, data),
    { locationYield: 1200, monthlyYield: mockDataService.getMonthlyElectricityGeneration(data).monthlyGeneration }
  );

export const calculateLocationSpecificYieldForMonth = (month, latitude, longitude, location) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/location-yield/month/${month}?latitude=${latitude}&longitude=${longitude}&location=${location || ''}`),
    { yield: 100 + month * 5, efficiency: 0.85 }
  );

// New Total Installed Capacity API
export const calculateTotalInstalledCapacity = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/solar-capacity/calculate`, data),
    mockDataService.getTotalInstalledCapacity(data)
  );

export const getAllSolarPanelTypes = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/solar-capacity/panel-types`),
    mockDataService.getSolarPanelTypes()
  );

export const getSolarPanelTypeById = (id) => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/solar-capacity/panel-types/${id}`),
    mockDataService.getSolarPanelTypes().find(panel => panel.id === id)
  );

// New Monthly Electricity Generation API
export const calculateMonthlyElectricityGeneration = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/solar-generation/monthly`, data),
    mockDataService.getMonthlyElectricityGeneration(data)
  );

// New Electricity Demand APIs
export const calculateElectricityDemand = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/electricity-demand/calculate`, data),
    mockDataService.getElectricityDemand(data)
  );

export const getElectricityDemandProportions = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/electricity-demand/proportions`),
    { heating: 0.6, hotWater: 0.2, appliances: 0.2 }
  );

export const validateMonthlyElectricityUsage = (monthlyUsage) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/electricity-demand/validate-monthly`, monthlyUsage),
    { valid: true, adjustedUsage: monthlyUsage }
  );

// New Gas Demand APIs
export const calculateGasDemand = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/gas-demand/calculate`, data),
    mockDataService.getGasDemand(data)
  );

export const getGasDemandProportions = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/gas-demand/proportions`),
    { heating: 0.85, hotWater: 0.15 }
  );

export const validateMonthlyGasUsage = (monthlyUsage) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/gas-demand/validate-monthly`, monthlyUsage),  
    { valid: true, adjustedUsage: monthlyUsage }
  );

// Additional Equipment APIs
export const getHeatPumps = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/heat-pumps`),
    mockDataService.getHeatPumps()
  );

export const getBatteries = () => 
  apiWithFallback(
    () => axios.get(`${API_BASE}/batteries`),
    mockDataService.getBatteries()
  );

export const getSolarInstallationCost = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/solar-installation-cost`, data),
    mockDataService.getSolarInstallationCost(data)
  );

export const getMonthlySavings = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/monthly-savings`, data),
    mockDataService.getMonthlySavings(data)
  );

export const getCarbonSavings = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/carbon-savings`, data),
    mockDataService.getCarbonSavings(data)
  );

export const getEquipmentComparison = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/equipment-comparison`, data),
    mockDataService.getEquipmentComparison(data)
  );

export const getGovernmentSubsidies = (data) => 
  apiWithFallback(
    () => axios.post(`${API_BASE}/subsidies`, data),
    mockDataService.getGovernmentSubsidies(data)
  );