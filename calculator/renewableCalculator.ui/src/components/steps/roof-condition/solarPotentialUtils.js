// Solar potential calculation constants - for reference and UI display purposes
// The actual calculations are now performed by the backend API

// Shading factors from the UI descriptions
export const SHADING_FACTORS = {
  'no-shading': 1.0,
  'light': 0.90,
  'moderate': 0.70,
  'heavy': 0.50,
  'extreme': 0.20
};

// Utilisation factors based on roof complexity
export const UTILISATION_FACTORS = {
  'minimal-obstacles': 0.95,     // Almost full roof utilization
  'slightly-complex': 0.85,     // Some obstacles, good utilization
  'moderately-complex': 0.70,   // Multiple obstacles, moderate utilization
  'highly-complex': 0.55,       // Many obstacles, limited utilization
  'extremely-complex': 0.30     // Very poor layout, minimal utilization
};

// Orientation mapping (degrees to array index) - for reference
export const ORIENTATION_MAPPING = {
  'n': 0,     // North (0°)
  'ne': 1,    // Northeast (30°)
  'ene': 2,   // East-Northeast (60°)
  'e': 3,     // East (90°)
  'ese': 4,   // East-Southeast (120°)
  'se': 5,    // Southeast (150°)
  's': 6,     // South (180°)
  'sw': 7,    // Southwest (210°)
  'wsw': 8,   // West-Southwest (240°)
  'w': 9,     // West (270°)
  'wnw': 10,  // West-Northwest (300°)
  'nw': 11,   // Northwest (330°)
};

// NOTE: Solar potential calculations are now performed by the backend API
// See: /api/solar-potential endpoint
// All calculation logic including tilt-orientation factors has been moved to CalculationService.java 