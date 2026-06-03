import Voyage from '../models/Voyage.js';
import Vessel from '../models/Vessel.js';
import COSPReport from '../models/COSPReport.js';
import NoonReport from '../models/NoonReport.js';
import EOSPReport from '../models/EOSPReport.js';
import Alert from '../models/Alert.js';
import RouteOptimization from '../models/RouteOptimization.js';

import { normalizeNoonReport } from '../services/normalizationService.js';
import { calculateVoyageAverages } from '../services/performanceService.js';
import { assessClaims } from '../services/claimsService.js';
import { getWeatherRisk } from '../services/weatherService.js';

/**
 * Controller for Voyage & Reports Management (Mongoose Integration)
 */

export async function getAllVoyages(req, res, next) {
  try {
    const voyages = await Voyage.find().sort({ createdAt: -1 });
    res.status(200).json(voyages);
  } catch (error) {
    next(error);
  }
}

export async function getVoyageById(req, res, next) {
  try {
    const { id } = req.params;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Load related operational reports
    const reports = await NoonReport.find({ voyageId: voyage._id }).sort({ date: 1 });
    const cosp = await COSPReport.findOne({ voyageId: voyage._id });
    const eosp = await EOSPReport.findOne({ voyageId: voyage._id });

    // Calculate performance stats dynamically using existing services
    const performance = processPerformanceRecords(reports, voyage);

    res.status(200).json({
      ...voyage.toJSON(),
      noonReports: reports,
      cospReport: cosp,
      eospReport: eosp,
      performance
    });
  } catch (error) {
    next(error);
  }
}

export async function createVoyage(req, res, next) {
  try {
    const voyageData = req.body;

    // Validate that the vessel exists
    const vessel = await Vessel.findById(voyageData.vesselId);
    if (!vessel) {
      return res.status(404).json({ status: 404, message: 'Associated Vessel not found' });
    }

    const totalVoyagesCount = await Voyage.countDocuments();
    const countSuffix = totalVoyagesCount + 15;

    const newVoyage = await Voyage.create({
      voyageNumber: `VYG-2024-0${countSuffix}`,
      vesselName: vessel.name,
      status: 'Active',
      distanceSailed: 0,
      fuelPrice: 650,
      charterRate: 18000,
      ...voyageData
    });

    res.status(201).json(newVoyage);
  } catch (error) {
    next(error);
  }
}

export async function updateVoyage(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const updated = await Voyage.findOneAndUpdate(query, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteVoyage(req, res, next) {
  try {
    const { id } = req.params;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const deleted = await Voyage.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Clean up associated reports & alerts
    await COSPReport.deleteMany({ voyageId: deleted._id });
    await NoonReport.deleteMany({ voyageId: deleted._id });
    await EOSPReport.deleteMany({ voyageId: deleted._id });

    res.status(200).json({ status: 200, message: 'Voyage deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// Operational Reports Pipeline
// ----------------------------------------------------

export async function uploadCospReport(req, res, next) {
  try {
    const { id } = req.params;
    const cospData = req.body;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Clear existing COSP report for this voyage if any
    await COSPReport.deleteMany({ voyageId: voyage._id });

    const newCosp = await COSPReport.create({
      voyageId: voyage._id,
      date: cospData.date || new Date().toISOString().slice(0, 16).replace('T', ' '),
      position: cospData.position || 'Pilot Station',
      draft: cospData.draft || '12.0m',
      robFuel: parseFloat(cospData.robFuel) || voyage.fuelPrice,
      eta: cospData.eta || voyage.eta
    });

    // Update vessel status & Fuel ROB
    await Vessel.findByIdAndUpdate(voyage.vesselId, {
      status: 'At Sea',
      fuelRob: newCosp.robFuel
    });

    res.status(201).json(newCosp);
  } catch (error) {
    next(error);
  }
}

export async function uploadNoonReport(req, res, next) {
  try {
    const { id } = req.params;
    const rawNoon = req.body;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Standardize via Normalization Service
    const normalized = normalizeNoonReport(rawNoon);
    
    const newNoon = await NoonReport.create({
      ...normalized,
      voyageId: voyage._id
    });

    // Recalculate sailed distance in voyage
    const voyageNoonReports = await NoonReport.find({ voyageId: voyage._id });
    const sailedDist = voyageNoonReports.reduce((sum, r) => sum + parseFloat(r.distanceSailed || 0), 0);

    voyage.distanceSailed = sailedDist;
    await voyage.save();

    // Trigger Notification Engine (gales, claims, speeds)
    const timeString = new Date().toLocaleString('en-GB', { hour12: false }).slice(0, 16).replace(',', '');
    const isCalm = newNoon.beaufortScale <= 4;
    const speedDeficit = voyage.cpSpeed - newNoon.speed;

    // Alert 1: Speed Deficit
    if (isCalm && speedDeficit > 0.5) {
      await Alert.create({
        type: 'Speed Performance Alerts',
        voyageNumber: voyage.voyageNumber,
        vessel: voyage.vesselName,
        voyageId: voyage._id,
        vesselId: voyage.vesselId,
        issue: `${speedDeficit.toFixed(1)} kt in calm weather`,
        estLoss: Math.round(speedDeficit * 625),
        status: 'Open',
        severity: 'Medium',
        time: timeString.substring(0, 12)
      });
    }

    // Alert 2: Severe Weather
    const risk = getWeatherRisk(
      newNoon.beaufortScale, 
      newNoon.waveHeight,
      newNoon.swellDirection,
      newNoon.currentSpeed,
      newNoon.currentDirection,
      newNoon.windDirection
    );
    if (risk.level === 'High') {
      await Alert.create({
        type: 'Weather Alerts',
        voyageNumber: voyage.voyageNumber,
        vessel: voyage.vesselName,
        voyageId: voyage._id,
        vesselId: voyage.vesselId,
        issue: `Encountered storm: Beaufort ${newNoon.beaufortScale}, waves ${newNoon.waveHeight}m.`,
        estLoss: 3000,
        status: 'Open',
        severity: 'High',
        time: timeString.substring(0, 12)
      });
    }

    // Alert 3: Overconsumption
    if (newNoon.fuelConsumed > voyage.cpConsumption + 2.0) {
      await Alert.create({
        type: 'Fuel Alerts',
        voyageNumber: voyage.voyageNumber,
        vessel: voyage.vesselName,
        voyageId: voyage._id,
        vesselId: voyage.vesselId,
        issue: `Daily burn ${newNoon.fuelConsumed} MT vs limit of ${voyage.cpConsumption} MT.`,
        estLoss: Math.round((newNoon.fuelConsumed - voyage.cpConsumption) * voyage.fuelPrice),
        status: 'Open',
        severity: 'Medium',
        time: timeString.substring(0, 12)
      });
    }

    // Update vessel registry coordinate/ROB positioning
    const vessel = await Vessel.findById(voyage.vesselId);
    if (vessel) {
      vessel.lat = newNoon.latitude;
      vessel.lon = newNoon.longitude;
      vessel.fuelRob = newNoon.robFuel;
      vessel.status = 'At Sea';
      
      // Update scorecards based on averages
      const stats = assessClaims(voyageNoonReports, voyage.cpSpeed, voyage.cpConsumption);
      
      // Trigger Alert 4: Claim Alerts if speed deficit or fuel overconsumption is triggered
      if (stats.hasSpeedClaim || stats.hasFuelClaim) {
        const existingClaimAlert = await Alert.findOne({
          voyageId: voyage._id,
          type: 'Claim Alerts'
        });
        if (!existingClaimAlert) {
          await Alert.create({
            type: 'Claim Alerts',
            voyageNumber: voyage.voyageNumber,
            vessel: voyage.vesselName,
            voyageId: voyage._id,
            vesselId: voyage.vesselId,
            issue: `Charter claims triggered. Speed Deficit: ${stats.speedDeficit} kt, Fuel Overconsumption: ${stats.fuelOverconsumption} MT.`,
            estLoss: stats.speedClaimValue + stats.fuelClaimValue,
            status: 'Open',
            severity: 'High',
            time: timeString.substring(0, 12)
          });
        }
      }

      const newSpeedScore = Math.max(60, Math.min(100, Math.round(100 - (stats.speedDeficit * 15))));
      const newFuelScore = Math.max(60, Math.min(100, Math.round(100 - (stats.fuelOverconsumption * 5))));
      const newWeatherScore = Math.max(70, Math.min(100, Math.round(100 - (voyageNoonReports.filter(r => r.beaufortScale >= 6).length * 4))));
      
      vessel.speedScore = newSpeedScore;
      vessel.fuelScore = newFuelScore;
      vessel.weatherScore = newWeatherScore;
      vessel.overallScore = Math.round(newSpeedScore * 0.4 + newFuelScore * 0.4 + newWeatherScore * 0.2);
      
      await vessel.save();
    }

    res.status(201).json(newNoon);
  } catch (error) {
    next(error);
  }
}

export async function uploadEospReport(req, res, next) {
  try {
    const { id } = req.params;
    const eospData = req.body;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Clear existing EOSP report for this voyage if any
    await EOSPReport.deleteMany({ voyageId: voyage._id });

    const newEosp = await EOSPReport.create({
      voyageId: voyage._id,
      date: eospData.date || new Date().toISOString().slice(0, 16).replace('T', ' '),
      arrivalPosition: eospData.arrivalPosition || 'Anchor Station',
      distanceSailedTotal: voyage.distanceTotal,
      robArrival: parseFloat(eospData.robArrival) || 200
    });

    // Complete voyage
    voyage.status = 'Completed';
    voyage.distanceSailed = voyage.distanceTotal;
    await voyage.save();

    // Update vessel status
    await Vessel.findByIdAndUpdate(voyage.vesselId, {
      status: 'In Port',
      fuelRob: newEosp.robArrival
    });

    res.status(201).json(newEosp);
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// Helper calculations triggers
// ----------------------------------------------------
function processPerformanceRecords(noonReports, voyage) {
  const perf = calculateVoyageAverages(noonReports, voyage.cpSpeed, voyage.cpConsumption);
  const claims = assessClaims(noonReports, voyage.cpSpeed, voyage.cpConsumption, voyage.charterRate, voyage.fuelPrice);

  return {
    ...perf,
    ...claims
  };
}

export async function getRouteOptimizations(req, res, next) {
  try {
    const { id } = req.params;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    const opts = await RouteOptimization.find({ voyageId: voyage._id }).sort({ createdAt: -1 });
    res.status(200).json(opts);
  } catch (error) {
    next(error);
  }
}

export async function createRouteOptimization(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    let query = { voyageNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const voyage = await Voyage.findOne(query);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    const newOpt = await RouteOptimization.create({
      ...data,
      voyageId: voyage._id
    });

    res.status(201).json(newOpt);
  } catch (error) {
    next(error);
  }
}
