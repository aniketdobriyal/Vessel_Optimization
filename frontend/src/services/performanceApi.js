/**
 * Mock API calls for Performance Engine outputs
 */

export async function fetchVesselPerformanceStats(vesselId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        speedScore: 92,
        fuelScore: 88,
        weatherScore: 95
      });
    }, 100);
  });
}
