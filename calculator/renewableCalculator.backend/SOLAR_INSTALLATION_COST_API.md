# Solar Installation Cost API Documentation

## Overview
This API calculates the installation cost for solar panel systems based on the system's rated power (kW). The calculation follows the formula provided in the specification document.

## Formula
Based on the provided formula:
- **Minimum Cost**: `Cpanel = 1.25 × Sizesystem`
- **Maximum Cost**: `Cpanel = 60 × Sizesystem`

Where `Sizesystem` is the rated power of the solar panel system in kW.

## API Endpoints

### 1. Calculate Installation Cost (POST)
**Endpoint**: `POST /api/solar/installation-cost`

**Request Body**:
```json
{
  "systemSizeKw": 5.0
}
```

**Response**:
```json
{
  "systemSizeKw": 5.0,
  "minimumCost": 6.25,
  "maximumCost": 300.0,
  "averageCost": 153.125
}
```

### 2. Get Installation Cost (GET)
**Endpoint**: `GET /api/solar/installation-cost/{systemSizeKw}`

**Example**: `GET /api/solar/installation-cost/5.0`

**Response**:
```json
{
  "systemSizeKw": 5.0,
  "minimumCost": 6.25,
  "maximumCost": 300.0,
  "averageCost": 153.125
}
```

## Example Calculations

### Example 1: 4kW System
- **Input**: 4.0 kW
- **Minimum Cost**: 1.25 × 4 = £5.00
- **Maximum Cost**: 60 × 4 = £240.00
- **Average Cost**: (5.00 + 240.00) / 2 = £122.50

### Example 2: 10kW System
- **Input**: 10.0 kW
- **Minimum Cost**: 1.25 × 10 = £12.50
- **Maximum Cost**: 60 × 10 = £600.00
- **Average Cost**: (12.50 + 600.00) / 2 = £306.25

## Error Handling

### 400 Bad Request
- System size is null or <= 0

### 500 Internal Server Error
- Unexpected server error during calculation

## Usage in Frontend

### JavaScript Example
```javascript
// Calculate installation cost for a 6kW system
const calculateInstallationCost = async (systemSizeKw) => {
  try {
    const response = await fetch('http://localhost:8080/api/solar/installation-cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemSizeKw: systemSizeKw
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`Installation cost for ${systemSizeKw}kW system:`);
      console.log(`Minimum: £${result.minimumCost.toFixed(2)}`);
      console.log(`Maximum: £${result.maximumCost.toFixed(2)}`);
      console.log(`Average: £${result.averageCost.toFixed(2)}`);
      return result;
    } else {
      console.error('Failed to calculate installation cost');
    }
  } catch (error) {
    console.error('Error calculating installation cost:', error);
  }
};

// Usage
calculateInstallationCost(6.0);
```

### Using GET endpoint
```javascript
const getInstallationCost = async (systemSizeKw) => {
  try {
    const response = await fetch(`http://localhost:8080/api/solar/installation-cost/${systemSizeKw}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching installation cost:', error);
  }
};
```

## Integration with Existing System

This API can be integrated with the existing solar panel calculation system to provide cost estimates alongside technical specifications. The system size (rated power) can be calculated from:

1. Total solar panel count × rated power per panel
2. Or directly from user input for total system capacity

## Testing

Run the test suite to verify the implementation:
```bash
mvn test -Dtest=SolarInstallationCostServiceTest
```

All tests should pass, verifying the correct implementation of the cost calculation formula. 