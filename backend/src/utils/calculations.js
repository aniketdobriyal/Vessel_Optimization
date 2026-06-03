/**
 * Shared Maritime Calculations Engine
 */

export function parseLatitude(latStr) {
  if (typeof latStr === 'number') return latStr;
  if (!latStr) return 0;
  
  const trimmed = latStr.toString().trim().toUpperCase();
  const direction = trimmed.endsWith('S') ? -1 : 1;
  const cleanStr = trimmed.replace(/[NS\s]/g, '');
  
  if (cleanStr.includes('°')) {
    const parts = cleanStr.split('°');
    const degrees = parseFloat(parts[0]);
    let minutes = 0;
    if (parts[1]) {
      minutes = parseFloat(parts[1].replace("'", '')) || 0;
    }
    return (degrees + minutes / 60) * direction;
  }
  
  return parseFloat(cleanStr) * direction;
}

export function parseLongitude(lonStr) {
  if (typeof lonStr === 'number') return lonStr;
  if (!lonStr) return 0;
  
  const trimmed = lonStr.toString().trim().toUpperCase();
  const direction = trimmed.endsWith('W') ? -1 : 1;
  const cleanStr = trimmed.replace(/[EW\s]/g, '');
  
  if (cleanStr.includes('°')) {
    const parts = cleanStr.split('°');
    const degrees = parseFloat(parts[0]);
    let minutes = 0;
    if (parts[1]) {
      minutes = parseFloat(parts[1].replace("'", '')) || 0;
    }
    return (degrees + minutes / 60) * direction;
  }
  
  return parseFloat(cleanStr) * direction;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = parseLatitude(lat1);
  const dLon = parseLongitude(lon1);
  const dLat2 = parseLatitude(lat2);
  const dLon2 = parseLongitude(lon2);

  const R = 3440.065; // Earth radius in NM
  const rLat1 = (dLat * Math.PI) / 180;
  const rLat2 = (dLat2 * Math.PI) / 180;
  const diffLat = ((dLat2 - dLat) * Math.PI) / 180;
  const diffLon = ((dLon2 - dLon) * Math.PI) / 180;

  const a =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(1));
}

export function calculateSlip(rpm, pitch = 25, distanceSailed = 0, timeHours = 24) {
  if (!rpm || rpm <= 0) return 0;
  const engineSpeed = (rpm * pitch * 60) / 6080;
  const engineDistance = engineSpeed * timeHours;
  if (engineDistance <= 0) return 0;
  const slip = ((engineDistance - distanceSailed) / engineDistance) * 100;
  return parseFloat(slip.toFixed(2));
}

export function calculateAllowedFuel(sailingDays, cpDailyConsumption) {
  if (!sailingDays || !cpDailyConsumption) return 0;
  return parseFloat((sailingDays * cpDailyConsumption).toFixed(1));
}

export function calculateEmissions(fuelMT) {
  if (!fuelMT || fuelMT <= 0) return 0;
  return parseFloat((fuelMT * 3.114).toFixed(1));
}

export function isCalmWeather(beaufort, waveHeight) {
  const bScale = parseInt(beaufort, 10) || 0;
  const wHeight = parseFloat(waveHeight) || 0;
  return bScale <= 4 && wHeight <= 2.0;
}

export function estimateWeatherSpeedLoss(beaufort) {
  const b = parseInt(beaufort, 10) || 0;
  if (b <= 4) return 0;
  if (b === 5) return 0.5;
  if (b === 6) return 1.2;
  if (b === 7) return 2.1;
  return 3.5;
}

export function calculateEnhancedWeatherSpeedLoss(beaufort, waveHeight = 0, swellDirection = '', currentSpeed = 0, currentDirection = '', windDirection = '') {
  let loss = estimateWeatherSpeedLoss(beaufort);
  
  // Wave/Swell impact: waves over 2m add exponential drag
  if (waveHeight > 2.0) {
    loss += (waveHeight - 2.0) * 0.25;
  }
  
  // Swell direction impact: swells from ahead (opposing) add additional resistance
  if (swellDirection) {
    loss += 0.2; 
  }
  
  // Current impact: adverse currents degrade speed over ground directly
  if (currentSpeed > 0) {
    loss += currentSpeed * 0.5;
  }
  
  return parseFloat(loss.toFixed(2));
}

export function calculateDurationHours(distanceNM, speedKnots) {
  if (!distanceNM || !speedKnots || speedKnots <= 0) return 0;
  return distanceNM / speedKnots;
}

export function projectETA(departureDateStr, distanceRemainingNM, speedKnots) {
  if (!departureDateStr) return 'Pending';
  const hours = calculateDurationHours(distanceRemainingNM, speedKnots);
  if (hours <= 0) return 'Pending';
  
  const date = new Date(departureDateStr);
  date.setHours(date.getHours() + hours);
  
  return date.toISOString().slice(0, 16).replace('T', ' ');
}
