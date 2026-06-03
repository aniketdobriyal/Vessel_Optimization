/**
 * Mock API calls for Weather forecasts
 */

export async function fetchWeatherForecast(lat, lon) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        forecast: {
          windSpeed: 14,
          waveHeight: 1.2,
          currentSpeed: 1.1,
          beaufort: 4
        }
      });
    }, 100);
  });
}
