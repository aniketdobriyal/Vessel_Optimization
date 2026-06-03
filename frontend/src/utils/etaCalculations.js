/**
 * ETA calculation functions
 */

// Calculate estimated voyage duration in hours
export function calculateDurationHours(distanceNM, speedKnots) {
  if (!distanceNM || !speedKnots || speedKnots <= 0) return 0;
  return distanceNM / speedKnots;
}

// Convert duration in hours to string representation (e.g. "12d 6h")
export function formatDuration(hours) {
  if (!hours || hours <= 0) return '0d';
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  if (days === 0) return `${remainingHours}h`;
  return `${days}d ${remainingHours}h`;
}

// Project arrival date based on departure and distance remaining
export function projectETA(departureDateStr, distanceRemainingNM, speedKnots) {
  if (!departureDateStr) return 'Pending';
  const hours = calculateDurationHours(distanceRemainingNM, speedKnots);
  if (hours <= 0) return 'Pending';
  
  const date = new Date(departureDateStr);
  date.setHours(date.getHours() + hours);
  
  return date.toISOString().slice(0, 16).replace('T', ' ');
}
