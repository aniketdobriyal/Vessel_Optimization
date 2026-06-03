import { isCalmWeather } from '../utils/calculations.js';

/**
 * Commercial Claims Analytics Engine Service
 */

export function assessClaims(noonReports, cpSpeed, cpFuel, charterRate = 18000, fuelPrice = 650) {
  if (!noonReports || noonReports.length === 0) {
    return {
      goodWeatherDays: 0,
      avgSpeedGoodWeather: 0,
      avgFuelGoodWeather: 0,
      speedClaimValue: 0,
      fuelClaimValue: 0,
      hasSpeedClaim: false,
      hasFuelClaim: false
    };
  }

  let totalGoodWeatherDistance = 0;
  let totalGoodWeatherHours = 0;
  let totalGoodWeatherFuel = 0;

  noonReports.forEach(report => {
    const dist = parseFloat(report.distanceSailed) || 0;
    const speed = parseFloat(report.speed) || 0;
    const hours = speed > 0 ? dist / speed : 24;
    const fuel = parseFloat(report.fuelConsumed) || 0;
    
    const isCalm = isCalmWeather(report.beaufortScale, report.waveHeight);

    if (isCalm) {
      totalGoodWeatherDistance += dist;
      totalGoodWeatherHours += hours;
      totalGoodWeatherFuel += fuel;
    }
  });

  const goodWeatherDays = parseFloat((totalGoodWeatherHours / 24).toFixed(2));
  const avgSpeedGoodWeather = totalGoodWeatherHours > 0 ? parseFloat((totalGoodWeatherDistance / totalGoodWeatherHours).toFixed(2)) : 0;
  const avgFuelGoodWeather = goodWeatherDays > 0 ? parseFloat((totalGoodWeatherFuel / goodWeatherDays).toFixed(2)) : 0;

  // 1. Speed Claim check
  const speedDeficit = cpSpeed - avgSpeedGoodWeather;
  const hasSpeedClaim = goodWeatherDays > 0 && speedDeficit > 0.5;
  const speedClaimValue = hasSpeedClaim 
    ? Math.round((speedDeficit / cpSpeed) * charterRate * goodWeatherDays) 
    : 0;

  // 2. Fuel Claim check
  const allowedFuelGoodWeather = goodWeatherDays * cpFuel;
  const fuelOverconsumption = totalGoodWeatherFuel - allowedFuelGoodWeather;
  const hasFuelClaim = goodWeatherDays > 0 && fuelOverconsumption > 0.5;
  const fuelClaimValue = hasFuelClaim 
    ? Math.round(fuelOverconsumption * fuelPrice) 
    : 0;

  return {
    goodWeatherDays,
    avgSpeedGoodWeather,
    avgFuelGoodWeather,
    speedClaimValue,
    fuelClaimValue,
    hasSpeedClaim,
    hasFuelClaim,
    speedDeficit: hasSpeedClaim ? parseFloat(speedDeficit.toFixed(2)) : 0,
    fuelOverconsumption: hasFuelClaim ? parseFloat(fuelOverconsumption.toFixed(2)) : 0
  };
}
