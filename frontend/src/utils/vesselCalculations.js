/**
 * Vessel calculations utility functions
 */

// Parse coordinate string to decimal degrees
// Supports "02°15'N", "02.25N", "2.25", etc.
export function parseLatitude(latStr) {
  if (typeof latStr === 'number') return latStr;
  if (!latStr) return 0;
  
  const trimmed = latStr.trim().toUpperCase();
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
  
  const trimmed = lonStr.trim().toUpperCase();
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

// Haversine formula to calculate distance between two coordinates in Nautical Miles (NM)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = parseLatitude(lat1);
  const dLon = parseLongitude(lon1);
  const dLat2 = parseLatitude(lat2);
  const dLon2 = parseLongitude(lon2);

  const R = 3440.065; // Earth radius in Nautical Miles
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

// Engine Slip % = (Engine Distance - Distance Sailed) / Engine Distance * 100
// Engine Distance = RPM * Pitch * 60 * 24 / 72913.4 (converts inches/hour to NM/day)
// For mock calculations, we simplify or use direct inputs.
export function calculateSlip(rpm, pitch = 25, pitchSpeed = 12, distanceSailed = 0, timeHours = 24) {
  if (!rpm || rpm <= 0) return 0;
  // Standard Marine Pitch Speed = RPM * Pitch (feet) * 60 / 6080 (feet in NM)
  const engineSpeed = (rpm * pitch * 60) / 6080;
  const engineDistance = engineSpeed * timeHours;
  if (engineDistance <= 0) return 0;
  const slip = ((engineDistance - distanceSailed) / engineDistance) * 100;
  return parseFloat(slip.toFixed(2));
}
