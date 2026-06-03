/**
 * Fuel calculation functions
 */

// Calculate allowed fuel consumption for a given sailing duration and CP limit
export function calculateAllowedFuel(sailingDays, cpDailyConsumption) {
  if (!sailingDays || !cpDailyConsumption) return 0;
  return parseFloat((sailingDays * cpDailyConsumption).toFixed(1));
}

// Calculate fuel consumption variance (positive means overconsumed, negative means saved)
export function calculateFuelVariance(actualFuel, allowedFuel) {
  if (actualFuel === undefined || allowedFuel === undefined) return 0;
  return parseFloat((actualFuel - allowedFuel).toFixed(1));
}

// Estimate carbon emissions (Metric Tons of CO2)
// Standard coefficient: 3.114 MT CO2 per MT of Heavy Fuel Oil (HFO)
export function calculateEmissions(fuelMT) {
  if (!fuelMT || fuelMT <= 0) return 0;
  return parseFloat((fuelMT * 3.114).toFixed(1));
}
