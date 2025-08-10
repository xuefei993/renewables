// Roof label conversion utilities

export const getOrientationLabel = (orientation) => {
  const labels = {
    'n': 'North', 'ne': 'Northeast', 'ene': 'East-Northeast',
    'e': 'East', 'ese': 'East-Southeast', 'se': 'Southeast',
    's': 'South', 'sw': 'Southwest', 'wsw': 'West-Southwest',
    'w': 'West', 'wnw': 'West-Northwest', 'nw': 'Northwest'
  };
  return labels[orientation] || orientation;
};

export const getShadingLabel = (shading) => {
  const labels = {
    'no-shading': 'No Shading', 'light': 'Light', 'moderate': 'Moderate',
    'heavy': 'Heavy', 'extreme': 'Extreme'
  };
  return labels[shading] || shading;
};

export const getUtilisationLabel = (utilisation) => {
  const labels = {
    'minimal-obstacles': 'Minimal Obstacles', 'slightly-complex': 'Slightly Complex',
    'moderately-complex': 'Moderately Complex', 'highly-complex': 'Highly Complex',
    'extremely-complex': 'Extremely Complex'
  };
  return labels[utilisation] || utilisation;
};

// Generate roof angle options from 0 to 90 in increments of 10
export const getRoofAngleOptions = () => Array.from({ length: 10 }, (_, i) => i * 10);

// Get next roof number (highest existing ID + 1)
export const getNextRoofNumber = (addedRoofs) => {
  if (addedRoofs.length === 0) return 1;
  return Math.max(...addedRoofs.map(roof => roof.id)) + 1;
}; 