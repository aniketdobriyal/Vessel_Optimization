import ArrivalReport from '../models/ArrivalReport.js';
import DepartureReport from '../models/DepartureReport.js';
import PortNoonReport from '../models/PortNoonReport.js';
import Voyage from '../models/Voyage.js';
import Vessel from '../models/Vessel.js';

/**
 * Controller for dedicated Port Noon, Arrival, and Departure Reports
 */

// --- ARRIVAL REPORTS ---
export async function getArrivalReports(req, res, next) {
  try {
    const { voyageId } = req.query;
    const query = voyageId ? { voyageId } : {};
    const reports = await ArrivalReport.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
}

export async function createArrivalReport(req, res, next) {
  try {
    const data = req.body;
    if (!data.voyageId) {
      return res.status(400).json({ status: 400, message: 'voyageId is required' });
    }

    const voyage = await Voyage.findById(data.voyageId);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Standardize total ROB
    const robHsfo = parseFloat(data.robHsfo) || 0;
    const robLsfo = parseFloat(data.robLsfo) || 0;
    const robMgo = parseFloat(data.robMgo) || 0;
    const robFuel = (robHsfo + robLsfo + robMgo) || parseFloat(data.robFuel) || 0;

    const report = await ArrivalReport.create({
      ...data,
      robHsfo,
      robLsfo,
      robMgo,
      robFuel
    });

    // Complete the voyage and update vessel status
    voyage.status = 'Completed';
    await voyage.save();

    await Vessel.findByIdAndUpdate(voyage.vesselId, {
      status: 'In Port',
      fuelRob: robFuel
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

// --- DEPARTURE REPORTS ---
export async function getDepartureReports(req, res, next) {
  try {
    const { voyageId } = req.query;
    const query = voyageId ? { voyageId } : {};
    const reports = await DepartureReport.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
}

export async function createDepartureReport(req, res, next) {
  try {
    const data = req.body;
    if (!data.voyageId) {
      return res.status(400).json({ status: 400, message: 'voyageId is required' });
    }

    const voyage = await Voyage.findById(data.voyageId);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Standardize total ROB
    const robHsfo = parseFloat(data.robHsfo) || 0;
    const robLsfo = parseFloat(data.robLsfo) || 0;
    const robMgo = parseFloat(data.robMgo) || 0;
    const robFuel = (robHsfo + robLsfo + robMgo) || parseFloat(data.robFuel) || 0;

    const report = await DepartureReport.create({
      ...data,
      robHsfo,
      robLsfo,
      robMgo,
      robFuel
    });

    // Activate the voyage and update vessel status
    voyage.status = 'Active';
    await voyage.save();

    await Vessel.findByIdAndUpdate(voyage.vesselId, {
      status: 'At Sea',
      fuelRob: robFuel
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

// --- PORT NOON REPORTS ---
export async function getPortNoonReports(req, res, next) {
  try {
    const { voyageId } = req.query;
    const query = voyageId ? { voyageId } : {};
    const reports = await PortNoonReport.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
}

export async function createPortNoonReport(req, res, next) {
  try {
    const data = req.body;
    if (!data.voyageId) {
      return res.status(400).json({ status: 400, message: 'voyageId is required' });
    }

    const voyage = await Voyage.findById(data.voyageId);
    if (!voyage) {
      return res.status(404).json({ status: 404, message: 'Voyage not found' });
    }

    // Calculate consumption total
    const meHsfo = parseFloat(data.meHsfoConsumed) || 0;
    const meLsfo = parseFloat(data.meLsfoConsumed) || 0;
    const meMgo = parseFloat(data.meMgoConsumed) || 0;
    const aeHsfo = parseFloat(data.aeHsfoConsumed) || 0;
    const aeLsfo = parseFloat(data.aeLsfoConsumed) || 0;
    const aeMgo = parseFloat(data.aeMgoConsumed) || 0;
    const boilerHsfo = parseFloat(data.boilerHsfoConsumed) || 0;
    const boilerLsfo = parseFloat(data.boilerLsfoConsumed) || 0;
    const boilerMgo = parseFloat(data.boilerMgoConsumed) || 0;

    const fuelConsumed = meHsfo + meLsfo + meMgo + aeHsfo + aeLsfo + aeMgo + boilerHsfo + boilerLsfo + boilerMgo 
      || parseFloat(data.fuelConsumed) 
      || 0;

    // Calculate ROB total
    const robHsfo = parseFloat(data.robHsfo) || 0;
    const robLsfo = parseFloat(data.robLsfo) || 0;
    const robMgo = parseFloat(data.robMgo) || 0;
    const robFuel = (robHsfo + robLsfo + robMgo) || parseFloat(data.robFuel) || 0;

    const report = await PortNoonReport.create({
      ...data,
      fuelConsumed,
      robFuel,
      robHsfo,
      robLsfo,
      robMgo
    });

    // Update vessel status & Fuel ROB
    await Vessel.findByIdAndUpdate(voyage.vesselId, {
      status: 'In Port',
      fuelRob: robFuel
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}
