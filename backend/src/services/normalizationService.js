/**
 * Data Normalization Layer Service
 */

export function normalizeNoonReport(rawReport) {
  const normLat = typeof rawReport.latitude === 'string' && rawReport.latitude.includes('°')
    ? rawReport.latitude
    : `${Math.abs(parseFloat(rawReport.latitude)).toFixed(4)}°${parseFloat(rawReport.latitude) >= 0 ? 'N' : 'S'}`;
    
  const normLon = typeof rawReport.longitude === 'string' && rawReport.longitude.includes('°')
    ? rawReport.longitude
    : `${Math.abs(parseFloat(rawReport.longitude)).toFixed(4)}°${parseFloat(rawReport.longitude) >= 0 ? 'E' : 'W'}`;

  const meHsfo = parseFloat(rawReport.meHsfoConsumed) || 0;
  const meLsfo = parseFloat(rawReport.meLsfoConsumed) || 0;
  const meMgo = parseFloat(rawReport.meMgoConsumed) || 0;
  
  const aeHsfo = parseFloat(rawReport.aeHsfoConsumed) || 0;
  const aeLsfo = parseFloat(rawReport.aeLsfoConsumed) || 0;
  const aeMgo = parseFloat(rawReport.aeMgoConsumed) || 0;
  
  const boilerHsfo = parseFloat(rawReport.boilerHsfoConsumed) || 0;
  const boilerLsfo = parseFloat(rawReport.boilerLsfoConsumed) || 0;
  const boilerMgo = parseFloat(rawReport.boilerMgoConsumed) || 0;
  
  const calculatedFuelConsumed = meHsfo + meLsfo + meMgo + aeHsfo + aeLsfo + aeMgo + boilerHsfo + boilerLsfo + boilerMgo;
  const fuelConsumed = calculatedFuelConsumed > 0 ? parseFloat(calculatedFuelConsumed.toFixed(2)) : (parseFloat(rawReport.fuelConsumed) || 0);

  const robHsfo = parseFloat(rawReport.robHsfo) || 0;
  const robLsfo = parseFloat(rawReport.robLsfo) || 0;
  const robMgo = parseFloat(rawReport.robMgo) || 0;
  
  const calculatedRobFuel = robHsfo + robLsfo + robMgo;
  const robFuel = calculatedRobFuel > 0 ? parseFloat(calculatedRobFuel.toFixed(2)) : (parseFloat(rawReport.robFuel) || 0);

  return {
    ...rawReport,
    latitude: normLat,
    longitude: normLon,
    distanceSailed: parseFloat(rawReport.distanceSailed) || 0,
    speed: parseFloat(rawReport.speed) || 0,
    rpm: parseInt(rawReport.rpm, 10) || 0,
    slip: parseFloat(rawReport.slip) || 0,
    windSpeed: parseFloat(rawReport.windSpeed) || 0,
    currentSpeed: parseFloat(rawReport.currentSpeed) || 0,
    beaufortScale: parseInt(rawReport.beaufortScale, 10) || 0,
    waveHeight: parseFloat(rawReport.waveHeight) || (parseInt(rawReport.beaufortScale, 10) * 0.25),
    fuelConsumed,
    robFuel,
    // Ensure numeric types are maintained
    draftForward: parseFloat(rawReport.draftForward) || 0,
    draftMid: parseFloat(rawReport.draftMid) || 0,
    draftAft: parseFloat(rawReport.draftAft) || 0,
    displacement: parseFloat(rawReport.displacement) || 0,
    constant: parseFloat(rawReport.constant) || 0,
    meCylinderOilRob: parseFloat(rawReport.meCylinderOilRob) || 0,
    cylinderOilConsumption: parseFloat(rawReport.cylinderOilConsumption) || 0,
    meSystemOilRob: parseFloat(rawReport.meSystemOilRob) || 0,
    meSystemOilConsumption: parseFloat(rawReport.meSystemOilConsumption) || 0,
    aeLoRob: parseFloat(rawReport.aeLoRob) || 0,
    aeLoConsumption: parseFloat(rawReport.aeLoConsumption) || 0,
    fwGenerated: parseFloat(rawReport.fwGenerated) || 0,
    fwConsumed: parseFloat(rawReport.fwConsumed) || 0,
    fwReceived: parseFloat(rawReport.fwReceived) || 0,
    fwRob: parseFloat(rawReport.fwRob) || 0,
    ae1Hours: parseFloat(rawReport.ae1Hours) || 0,
    ae2Hours: parseFloat(rawReport.ae2Hours) || 0,
    ae3Hours: parseFloat(rawReport.ae3Hours) || 0,
    meHsfoConsumed: meHsfo,
    meLsfoConsumed: meLsfo,
    meMgoConsumed: meMgo,
    aeHsfoConsumed: aeHsfo,
    aeLsfoConsumed: aeLsfo,
    aeMgoConsumed: aeMgo,
    boilerHsfoConsumed: boilerHsfo,
    boilerLsfoConsumed: boilerLsfo,
    boilerMgoConsumed: boilerMgo,
    robHsfo,
    robLsfo,
    robMgo,
    // Noon Position Report Template Gaps
    utcTime: rawReport.utcTime || '',
    vesselCondition: rawReport.vesselCondition || 'Laden',
    lastPort: rawReport.lastPort || '',
    nextPort: rawReport.nextPort || '',
    distanceToNextPort: parseFloat(rawReport.distanceToNextPort) || 0,
    engineDistance: parseFloat(rawReport.engineDistance) || 0,
    distanceSailedFromCosp: parseFloat(rawReport.distanceSailedFromCosp) || 0,
    steamingTimeDaily: parseFloat(rawReport.steamingTimeDaily) || 0,
    steamingTimeAfterCosp: parseFloat(rawReport.steamingTimeAfterCosp) || 0,
    allowedCpSpeed: parseFloat(rawReport.allowedCpSpeed) || 0,
    averageSpeed: parseFloat(rawReport.averageSpeed) || 0,
    eta: rawReport.eta || '',
    fuelReceived: parseFloat(rawReport.fuelReceived) || 0,
    remarks: rawReport.remarks || ''
  };
}
