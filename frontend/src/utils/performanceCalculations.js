import { isCalmWeather } from './weatherCalculations';

/**
 * Performance and claims calculations engine
 */

// Calculate variance in speed (actual vs warranted)
export function calculateSpeedVariance(actualSpeed, cpSpeed) {
  if (!actualSpeed || !cpSpeed) return 0;
  return parseFloat((actualSpeed - cpSpeed).toFixed(2));
}

// Calculate vessel performance scorecards
export function calculateVesselScore(speedScore, fuelScore, weatherScore) {
  const speedWeight = 0.4;
  const fuelWeight = 0.4;
  const weatherWeight = 0.2;
  
  const score = speedScore * speedWeight + fuelScore * fuelWeight + weatherScore * weatherWeight;
  return Math.round(score);
}

// Extract stats and assess claims based on a list of daily noon reports
export function processVoyagePerformance(noonReports, cpSpeed, cpFuelConsumption, charterRate = 18000, fuelCost = 650) {
  if (!noonReports || noonReports.length === 0) {
    return {
      goodWeatherDays: 0,
      avgSpeedGoodWeather: 0,
      avgFuelGoodWeather: 0,
      avgSpeedTotal: 0,
      avgFuelTotal: 0,
      speedClaimValue: 0,
      fuelClaimValue: 0,
      hasSpeedClaim: false,
      hasFuelClaim: false,
      speedVariance: 0,
      fuelVariance: 0
    };
  }

  let totalGoodWeatherDistance = 0;
  let totalGoodWeatherHours = 0;
  let totalGoodWeatherFuel = 0;
  let goodWeatherNoonCount = 0;

  let totalDistance = 0;
  let totalHours = 0;
  let totalFuel = 0;

  noonReports.forEach(report => {
    const lat = report.latitude;
    const lon = report.longitude;
    const dist = parseFloat(report.distanceSailed) || 0;
    const speed = parseFloat(report.speed) || 0;
    const hours = speed > 0 ? dist / speed : 24; // assume 24h if speed is 0
    const fuel = parseFloat(report.fuelConsumed) || 0;
    const isCalm = isCalmWeather(report.beaufortScale, report.waveHeight || (report.beaufortScale * 0.5)); // estimate wave height if not provided

    totalDistance += dist;
    totalHours += hours;
    totalFuel += fuel;

    if (isCalm) {
      totalGoodWeatherDistance += dist;
      totalGoodWeatherHours += hours;
      totalGoodWeatherFuel += fuel;
      goodWeatherNoonCount++;
    }
  });

  const goodWeatherDays = parseFloat((totalGoodWeatherHours / 24).toFixed(2));
  const avgSpeedGoodWeather = totalGoodWeatherHours > 0 ? parseFloat((totalGoodWeatherDistance / totalGoodWeatherHours).toFixed(2)) : 0;
  const avgFuelGoodWeather = goodWeatherDays > 0 ? parseFloat((totalGoodWeatherFuel / goodWeatherDays).toFixed(2)) : 0;

  const totalDays = parseFloat((totalHours / 24).toFixed(2));
  const avgSpeedTotal = totalHours > 0 ? parseFloat((totalDistance / totalHours).toFixed(2)) : 0;
  const avgFuelTotal = totalDays > 0 ? parseFloat((totalFuel / totalDays).toFixed(2)) : 0;

  // 1. SPEED CLAIM CALCULATION (Good Weather deficit check)
  // Deficit = CP Speed - Avg Speed in Good Weather
  // Threshold: Deficit must exceed 0.5 knots to claim (standard clause)
  const speedDeficit = cpSpeed - avgSpeedGoodWeather;
  const hasSpeedClaim = goodWeatherDays > 0 && speedDeficit > 0.5;
  
  // Speed Claim = (Deficit / CP Speed) * Charter Rate * Good Weather Days
  const speedClaimValue = hasSpeedClaim 
    ? Math.round((speedDeficit / cpSpeed) * charterRate * goodWeatherDays) 
    : 0;

  // 2. FUEL CLAIM CALCULATION (Good weather overconsumption check)
  // Allowed Fuel = Good Weather Days * CP Consumption
  const allowedFuelGoodWeather = goodWeatherDays * cpFuelConsumption;
  const fuelOverconsumption = totalGoodWeatherFuel - allowedFuelGoodWeather;
  // Standard tolerance: 5% or 0.5 MT/day (here we claim pure overconsumption above allowed)
  const hasFuelClaim = goodWeatherDays > 0 && fuelOverconsumption > 0.5;
  const fuelClaimValue = hasFuelClaim 
    ? Math.round(fuelOverconsumption * fuelCost) 
    : 0;

  return {
    goodWeatherDays,
    avgSpeedGoodWeather,
    avgFuelGoodWeather,
    avgSpeedTotal,
    avgFuelTotal,
    speedVariance: parseFloat((avgSpeedTotal - cpSpeed).toFixed(2)),
    fuelVariance: parseFloat((avgFuelTotal - cpFuelConsumption).toFixed(2)),
    speedClaimValue,
    fuelClaimValue,
    hasSpeedClaim,
    hasFuelClaim,
    speedDeficit: hasSpeedClaim ? parseFloat(speedDeficit.toFixed(2)) : 0,
    fuelOverconsumption: hasFuelClaim ? parseFloat(fuelOverconsumption.toFixed(2)) : 0
  };
}
