/**
 * Weather Forecast Analysis Service
 */

export function getWeatherRisk(beaufort, waveHeight, swellDirection = '', currentSpeed = 0, currentDirection = '', windDirection = '') {
  const bf = parseInt(beaufort, 10) || 0;
  const wh = parseFloat(waveHeight) || 0;
  const cs = parseFloat(currentSpeed) || 0;

  // High risk conditions include storms, high waves, or dangerous currents
  if (bf >= 7 || wh >= 4.0 || cs >= 2.5) {
    return { level: 'High', color: 'var(--color-status-alert)' };
  }
  
  // Moderate risk if winds/waves are rising, or there is significant current or swell opposition
  if (bf >= 5 || wh >= 2.0 || cs >= 1.5 || (swellDirection && swellDirection.length > 0)) {
    return { level: 'Moderate', color: 'var(--color-status-anchor)' };
  }
  
  return { level: 'Low', color: 'var(--color-status-sea)' };
}
