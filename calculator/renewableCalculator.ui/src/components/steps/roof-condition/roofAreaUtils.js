// Utility functions for roof area calculations

/**
 * Calculate actual roof area based on projected area and roof angle
 * Formula: Roof Area = Horizontal projected area / cos(roof angle)
 */
export const calculateActualRoofArea = (projectedArea, angle) => {
  // Ensure projectedArea is a valid number
  const validProjectedArea = (typeof projectedArea === 'number' && !isNaN(projectedArea)) ? projectedArea : 0;
  
  // Return projected area if angle is not provided or invalid
  if (angle === '' || angle === null || angle === undefined) return validProjectedArea;
  
  const angleInRadians = (parseFloat(angle) * Math.PI) / 180;
  const cosAngle = Math.cos(angleInRadians);
  
  // Avoid division by zero for 90-degree angles
  if (Math.abs(cosAngle) < 0.001) return validProjectedArea * 100; // Very steep roof
  
  return validProjectedArea / cosAngle;
};

/**
 * Calculate estimated solar panel capacity based on roof area
 */
export const calculateSolarCapacity = (roofArea) => {
  return roofArea * 0.15; // 150W/m²
};

/**
 * Calculate approximate panel count based on roof area
 */
export const calculatePanelCount = (roofArea) => {
  return Math.floor(roofArea / 2); // 2m² per panel
};

/**
 * Calculate area adjustment factor
 */
export const calculateAdjustmentFactor = (actualArea, projectedArea) => {
  if (!projectedArea || projectedArea === 0) return 1;
  return actualArea / projectedArea;
}; 