import { calculateDistance, calculateSlip } from '../utils/calculations.js';

/**
 * Vessel Performance Calculations Service
 */

export function calculateVoyageAverages(noonReports, cpSpeed, cpFuel) {
  if (!noonReports || noonReports.length === 0) {
    return {
      avgSpeed: 0,
      avgFuel: 0,
      speedVariance: 0,
      fuelVariance: 0,
      totalDistance: 0,
      totalFuel: 0
    };
  }

  let totalDist = 0;
  let totalFuel = 0;
  let totalHours = 0;

  noonReports.forEach(r => {
    const dist = parseFloat(r.distanceSailed) || 0;
    const speed = parseFloat(r.speed) || 0;
    const hours = speed > 0 ? dist / speed : 24;
    
    totalDist += dist;
    totalFuel += parseFloat(r.fuelConsumed) || 0;
    totalHours += hours;
  });

  const totalDays = totalHours / 24 || 1;
  const avgSpeed = totalHours > 0 ? totalDist / totalHours : 0;
  const avgFuel = totalFuel / totalDays;

  return {
    avgSpeed: parseFloat(avgSpeed.toFixed(2)),
    avgFuel: parseFloat(avgFuel.toFixed(2)),
    speedVariance: parseFloat((avgSpeed - cpSpeed).toFixed(2)),
    fuelVariance: parseFloat((avgFuel - cpFuel).toFixed(2)),
    totalDistance: parseFloat(totalDist.toFixed(1)),
    totalFuel: parseFloat(totalFuel.toFixed(1))
  };
}
