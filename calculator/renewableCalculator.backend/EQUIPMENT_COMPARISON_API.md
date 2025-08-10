# Equipment Comparison API Documentation

## Overview
This API provides comprehensive equipment comparison functionality for renewable energy systems. Users can compare specific solar panels, heat pumps, and battery storage options with detailed financial and environmental analysis, including monthly performance charts.

## Key Features
- 🔍 **Equipment Selection**: Browse available equipment from database
- 📊 **Performance Analysis**: Annual and monthly data for each option
- 💰 **Financial Metrics**: Installation costs, savings, payback periods, ROI
- 🌱 **Carbon Impact**: Direct and indirect CO₂ savings
- ⭐ **Suitability Scoring**: Property-specific equipment recommendations
- 📈 **Monthly Charts**: Interactive charts for key performance metrics

## API Endpoints

### 1. Compare Equipment (POST)
**Endpoint**: `POST /api/equipment/compare`

**Description**: Comprehensive comparison of selected equipment options with detailed annual and monthly analysis.

**Request Body**:
```json
{
  "hasSolarPanels": true,
  "hasHeatPump": true,
  "hasBattery": false,
  "solarPanelTypeIds": [1, 2, 3],
  "heatPumpTypeIds": [1, 2],
  "batteryIds": [],
  "houseArea": 120.0,
  "occupants": 4,
  "roofArea": 35.0,
  "latitude": 51.5,
  "longitude": -0.1,
  "annualElectricityUsageKwh": 3500.0,
  "annualGasUsageKwh": 15000.0,
  "monthlyElectricityUsageKwh": 290.0,
  "homeOccupancyFactor": 0.6,
  "electricityRate": 30.0,
  "gasRate": 6.0,
  "exportRate": 5.0,
  "peakElectricityRate": 40.0,
  "offPeakElectricityRate": 15.0,
  "solarInstallationComplexity": 1.0,
  "heatPumpInstallationComplexity": 1.2,
  "batteryInstallationComplexity": 1.0
}
```

**Response**:
```json
{
  "solarPanelOptions": [
    {
      "equipmentId": 1,
      "equipmentName": "JA Solar JAM72S30 545W",
      "manufacturer": "JA Solar",
      "equipmentType": "solar",
      "specifications": {
        "panelSize": "2.3 m²",
        "ratedPower": "545 W",
        "efficiency": "21.2%"
      },
      "installationCost": 8500.0,
      "equipmentCost": 6200.0,
      "annualGeneration": 4250.0,
      "annualCostSavings": 1275.0,
      "annualExportRevenue": 285.0,
      "annualDirectCO2Savings": 0.0,
      "annualIndirectCO2Savings": 629.0,
      "annualTotalCO2Savings": 629.0,
      "monthlyGeneration": [180, 245, 320, 415, 480, 510, 525, 475, 385, 285, 200, 165],
      "monthlyCostSavings": [54, 74, 96, 125, 144, 153, 158, 143, 116, 86, 60, 50],
      "monthlyExportRevenue": [12, 16, 21, 27, 31, 33, 34, 31, 25, 18, 13, 11],
      "monthlyDirectCO2Savings": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "monthlyIndirectCO2Savings": [26.6, 36.3, 47.4, 61.4, 71.0, 75.5, 77.7, 70.3, 57.0, 42.2, 29.6, 24.4],
      "paybackPeriodYears": 5.4,
      "roi10Years": 84.5,
      "efficiency": 21.2,
      "recommendedQuantity": 15,
      "totalSystemCapacity": 8.175,
      "suitabilityScore": 87.5,
      "suitabilityReason": "High efficiency panels suitable for UK climate with good ROI potential."
    }
  ],
  "heatPumpOptions": [
    {
      "equipmentId": 1,
      "equipmentName": "Mitsubishi Ecodan 8kW ASHP",
      "manufacturer": "Mitsubishi",
      "equipmentType": "heatpump",
      "specifications": {
        "cop": "4.2",
        "type": "Air Source Heat Pump"
      },
      "installationCost": 12000.0,
      "equipmentCost": 8400.0,
      "annualGeneration": 0.0,
      "annualCostSavings": 735.0,
      "annualExportRevenue": 0.0,
      "annualDirectCO2Savings": 2745.0,
      "annualIndirectCO2Savings": -175.8,
      "annualTotalCO2Savings": 2569.2,
      "monthlyCostSavings": [125, 115, 95, 55, 25, 15, 20, 25, 45, 75, 95, 120],
      "paybackPeriodYears": 16.3,
      "roi10Years": -38.7,
      "suitabilityScore": 82.0,
      "suitabilityReason": "Efficient heat pump with good COP rating, suitable for replacing gas heating."
    }
  ],
  "batteryOptions": [],
  "recommendedCombinations": []
}
```

### 2. Get Available Equipment

#### Solar Panels
**Endpoint**: `GET /api/equipment/solar-panels/available`

**Response**:
```json
[
  {
    "id": 1,
    "name": "JA Solar JAM72S30 545W",
    "manufacturer": "JA Solar",
    "panelSize": 2.3,
    "ratedPowerPerPanel": 545,
    "description": "High efficiency monocrystalline panel",
    "efficiency": 21.2,
    "price": 280.0
  }
]
```

#### Heat Pumps
**Endpoint**: `GET /api/equipment/heat-pumps/available`

**Response**:
```json
[
  {
    "id": 1,
    "name": "Mitsubishi Ecodan 8kW ASHP",
    "cop": 4.2,
    "cost": 12000.0
  }
]
```

#### Batteries
**Endpoint**: `GET /api/equipment/batteries/available`

**Response**:
```json
[
  {
    "id": 1,
    "name": "Tesla Powerwall 2",
    "capacityKwh": 13.5,
    "cost": 8500.0
  }
]
```

### 3. Get Equipment Recommendations
**Endpoint**: `GET /api/equipment/recommendations`

**Parameters**:
- `houseArea` (Double, default: 100): House area in m²
- `occupants` (Integer, default: 3): Number of occupants
- `annualElectricityUsage` (Double, default: 3000): Annual electricity usage in kWh
- `annualGasUsage` (Double, default: 15000): Annual gas usage in kWh
- `roofArea` (Double, default: 30): Available roof area in m²

**Example**: 
```
GET /api/equipment/recommendations?houseArea=120&occupants=4&annualElectricityUsage=3500&roofArea=35
```

**Response**:
```json
{
  "solar": {
    "recommended": true,
    "reason": "Sufficient roof area for solar installation",
    "suggestedIds": [1, 2, 3]
  },
  "heatPump": {
    "recommended": true,
    "reason": "High gas usage makes heat pump cost-effective",
    "suggestedIds": [1, 2]
  },
  "battery": {
    "recommended": true,
    "reason": "Good electricity usage for battery storage benefits",
    "suggestedIds": [1, 3]
  }
}
```

## Data Models

### Equipment Option Structure
Each equipment option in the comparison result contains:

#### Basic Information
- `equipmentId`: Unique identifier
- `equipmentName`: Full product name
- `manufacturer`: Equipment manufacturer
- `equipmentType`: "solar", "heatpump", or "battery"
- `specifications`: Key technical specs (varies by type)

#### Financial Data
- `installationCost`: Total cost including installation (£)
- `equipmentCost`: Equipment cost only (£)
- `paybackPeriodYears`: Simple payback period
- `roi10Years`: 10-year return on investment (%)

#### Performance Data
- `annualGeneration`: Annual energy generation/output (kWh)
- `annualCostSavings`: Annual cost savings (£)
- `annualExportRevenue`: Annual export revenue (£) - solar only
- `monthlyGeneration`: Array of 12 monthly values (kWh)
- `monthlyCostSavings`: Array of 12 monthly savings (£)
- `monthlyExportRevenue`: Array of 12 monthly export revenue (£)

#### Environmental Data
- `annualDirectCO2Savings`: Annual direct CO₂ savings (kg)
- `annualIndirectCO2Savings`: Annual indirect CO₂ savings (kg)
- `annualTotalCO2Savings`: Total annual CO₂ savings (kg)
- `monthlyDirectCO2Savings`: Array of 12 monthly direct CO₂ savings (kg)
- `monthlyIndirectCO2Savings`: Array of 12 monthly indirect CO₂ savings (kg)

#### Equipment-Specific Data
- `recommendedQuantity`: Number of units recommended
- `totalSystemCapacity`: Total system capacity (kW or kWh)
- `suitabilityScore`: Property suitability score (0-100)
- `suitabilityReason`: Explanation of suitability

## Calculation Logic

### Solar Panels
- **System Sizing**: Based on available roof area and panel dimensions
- **Generation**: Seasonal factors applied to system capacity
- **Self-Consumption**: Based on home occupancy factor (30-50%)
- **Export Revenue**: Excess generation × export rate
- **Installation Cost**: Equipment cost + size-based installation cost

### Heat Pumps
- **Gas Replacement**: Annual gas usage replaced by heat pump
- **Efficiency Gains**: COP factor applied for electricity vs gas comparison
- **Seasonal Variation**: Higher usage in winter months
- **Carbon Savings**: Direct from gas reduction, indirect from electricity change

### Battery Storage
- **Peak Shaving**: Difference between peak and off-peak rates
- **Cycle Estimation**: ~300 full cycles per year
- **Solar Integration**: Enhanced when combined with solar panels
- **Capacity Matching**: Sized based on daily electricity usage

### Suitability Scoring
Factors considered for each equipment type:

#### Solar Panels (0-100)
- Base score: 70
- Roof area adequacy: +/- 20 points
- Panel efficiency: +15 points (>20% efficiency)
- Location factors: +/- 10 points

#### Heat Pumps (0-100)
- Base score: 70
- COP rating: +15 points (>3.5 COP)
- House size matching: +10 points
- Existing heating system: +/- 15 points

#### Battery Storage (0-100)
- Base score: 70
- Capacity matching: +20 points (50-150% of daily usage)
- Solar integration: +15 points (with solar panels)
- Usage patterns: +/- 10 points

## Frontend Integration

### Equipment Selection Interface
```javascript
const EquipmentComparison = ({ selectedEquipment, userData, onBack }) => {
  // Component renders:
  // 1. Equipment selection checkboxes
  // 2. Comparison tables with clickable cells
  // 3. Monthly chart modals
  // 4. Suitability badges
};
```

### Monthly Chart Display
Users can click on data cells in the comparison table to view monthly charts:
- **Generation**: Monthly electricity generation (kWh)
- **Cost Savings**: Monthly cost savings (£)
- **Export Revenue**: Monthly export income (£)
- **CO₂ Savings**: Monthly carbon emissions reduction (kg)

### Chart Configuration
```javascript
const chartConfig = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', ...],
    datasets: [{
      label: 'Monthly Generation (kWh)',
      data: monthlyGenerationData,
      borderColor: '#3498db',
      backgroundColor: '#3498db20',
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
};
```

## Usage Examples

### 1. Complete Equipment Comparison Flow
```javascript
// 1. Load available equipment
const solarPanels = await fetch('/api/equipment/solar-panels/available');
const heatPumps = await fetch('/api/equipment/heat-pumps/available');
const batteries = await fetch('/api/equipment/batteries/available');

// 2. Get recommendations
const recommendations = await fetch(
  '/api/equipment/recommendations?houseArea=120&occupants=4'
);

// 3. Compare selected equipment
const comparisonRequest = {
  hasSolarPanels: true,
  hasHeatPump: true,
  hasBattery: false,
  solarPanelTypeIds: [1, 2, 3],
  heatPumpTypeIds: [1],
  batteryIds: [],
  // ... user property data
};

const comparison = await fetch('/api/equipment/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(comparisonRequest)
});

// 4. Display results and charts
displayComparisonTable(comparison.solarPanelOptions);
displayMonthlyChart(option.monthlyGeneration, 'Generation');
```

### 2. Property-Specific Recommendations
```javascript
const getEquipmentRecommendations = async (propertyData) => {
  const { houseArea, occupants, electricityUsage, gasUsage, roofArea } = propertyData;
  
  const response = await fetch(
    `/api/equipment/recommendations?` +
    `houseArea=${houseArea}&` +
    `occupants=${occupants}&` +
    `annualElectricityUsage=${electricityUsage}&` +
    `annualGasUsage=${gasUsage}&` +
    `roofArea=${roofArea}`
  );
  
  const recommendations = await response.json();
  
  // Use recommendations to pre-select suitable equipment
  if (recommendations.solar.recommended) {
    setSelectedEquipment(prev => ({ ...prev, solarPanels: true }));
    setRecommendedSolarIds(recommendations.solar.suggestedIds);
  }
};
```

### 3. Suitability Analysis
```javascript
const analyzeSuitability = (equipmentOption) => {
  const score = equipmentOption.suitabilityScore;
  const reason = equipmentOption.suitabilityReason;
  
  const badge = getSuitabilityBadge(score);
  // Returns: { text: 'Excellent', class: 'excellent' } for score >= 80
  
  return {
    recommended: score >= 70,
    badgeText: badge.text,
    badgeClass: badge.class,
    explanation: reason
  };
};
```

## Error Handling

### 400 Bad Request
- No equipment selected for comparison
- Invalid equipment IDs
- Missing required property parameters

### 404 Not Found
- Equipment ID doesn't exist in database
- Invalid endpoint

### 500 Internal Server Error
- Calculation service errors
- Database connection issues
- External API failures

## Performance Considerations

- **Caching**: Equipment data cached for 1 hour
- **Batch Processing**: Multiple equipment comparisons processed efficiently
- **Database Optimization**: Indexed queries for equipment lookup
- **Response Size**: Large monthly arrays - consider pagination for mobile

## Testing

### Unit Tests
```bash
mvn test -Dtest=EquipmentComparisonServiceTest
```

### Integration Tests
```bash
# Test complete comparison flow
curl -X POST http://localhost:8080/api/equipment/compare \
  -H "Content-Type: application/json" \
  -d @test-comparison-request.json
```

### Frontend Testing
```bash
npm test -- --testNamePattern="EquipmentComparison"
```

## Future Enhancements

1. **Smart Combinations**: Automated system combination recommendations
2. **Regional Pricing**: Location-based installation cost adjustments
3. **Financing Options**: Loan and lease payment calculations
4. **Maintenance Costs**: Long-term maintenance and replacement costs
5. **Weather Integration**: Real-time weather data for performance predictions
6. **Performance Monitoring**: Actual vs predicted performance tracking

This API provides comprehensive equipment comparison functionality that helps users make informed decisions about renewable energy investments based on their specific property characteristics and energy usage patterns. 