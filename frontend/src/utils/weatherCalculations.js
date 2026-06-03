/**
 * Weather and sea state calculations
 */

// Beaufort Scale translation
export const BEAUFORT_SCALE = {
  0: { name: 'Calm', waveHeight: '0m', windSpeed: '<1 kt' },
  1: { name: 'Light Air', waveHeight: '0-0.1m', windSpeed: '1-3 kt' },
  2: { name: 'Light Breeze', waveHeight: '0.1-0.2m', windSpeed: '4-6 kt' },
  3: { name: 'Gentle Breeze', waveHeight: '0.2-0.6m', windSpeed: '7-10 kt' },
  4: { name: 'Moderate Breeze', waveHeight: '0.6-1.0m', windSpeed: '11-16 kt' }, // Max Calm Weather limit
  5: { name: 'Fresh Breeze', waveHeight: '1.0-2.0m', windSpeed: '17-21 kt' },
  6: { name: 'Strong Breeze', waveHeight: '2.0-3.0m', windSpeed: '22-27 kt' },
  7: { name: 'Near Gale', waveHeight: '3.0-4.0m', windSpeed: '28-33 kt' },
  8: { name: 'Gale', waveHeight: '4.0-5.5m', windSpeed: '34-40 kt' },
  9: { name: 'Strong Gale', waveHeight: '5.5-7.0m', windSpeed: '41-47 kt' },
  10: { name: 'Storm', waveHeight: '7.0-9.0m', windSpeed: '48-55 kt' },
  11: { name: 'Violent Storm', waveHeight: '9.0-14.0m', windSpeed: '56-63 kt' },
  12: { name: 'Hurricane', waveHeight: '>14.0m', windSpeed: '>=64 kt' }
};

// Check if weather is considered "Calm" (good weather condition) for charter claims
// Standard charter party clause: Beaufort <= 4 (or Wind <= 15/16 knots) and Wave Height <= 2.0m (Douglas Sea State <= 3)
export function isCalmWeather(beaufort, waveHeight) {
  const bScale = parseInt(beaufort, 10) || 0;
  const wHeight = parseFloat(waveHeight) || 0;
  return bScale <= 4 && wHeight <= 2.0;
}

// Estimate speed loss due to weather (rough seas create resistance)
export function estimateWeatherSpeedLoss(beaufort) {
  const b = parseInt(beaufort, 10) || 0;
  if (b <= 4) return 0; // No penalty in calm weather
  if (b === 5) return 0.5; // knots lost
  if (b === 6) return 1.2;
  if (b === 7) return 2.1;
  return 3.5; // Beaufort >= 8
}
