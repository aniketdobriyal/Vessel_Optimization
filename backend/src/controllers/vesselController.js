import Vessel from '../models/Vessel.js';

/**
 * Controller for Vessel CRUD Endpoints (Mongoose Integration)
 */

export async function getAllVessels(req, res, next) {
  try {
    const vessels = await Vessel.find().sort({ createdAt: -1 });
    res.status(200).json(vessels);
  } catch (error) {
    next(error);
  }
}

export async function getVesselById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Support querying by mongo ID or IMO code
    let query = { imo: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const vessel = await Vessel.findOne(query);
    if (!vessel) {
      return res.status(404).json({ status: 404, message: 'Vessel not found' });
    }
    res.status(200).json(vessel);
  } catch (error) {
    next(error);
  }
}

export async function createVessel(req, res, next) {
  try {
    const vesselData = req.body;

    // Prevent duplicate IMOs
    const exists = await Vessel.findOne({ imo: vesselData.imo });
    if (exists) {
      return res.status(400).json({ status: 400, message: 'Vessel with this IMO already registered' });
    }

    const newVessel = await Vessel.create({
      lat: '00°00\'N',
      lon: '000°00\'E',
      fuelRob: 500,
      speedScore: 90,
      fuelScore: 90,
      weatherScore: 90,
      overallScore: 90,
      status: 'In Port',
      ...vesselData
    });

    res.status(201).json(newVessel);
  } catch (error) {
    next(error);
  }
}

export async function updateVessel(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let query = { imo: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const updatedVessel = await Vessel.findOneAndUpdate(query, updateData, { new: true });
    if (!updatedVessel) {
      return res.status(404).json({ status: 404, message: 'Vessel not found' });
    }

    res.status(200).json(updatedVessel);
  } catch (error) {
    next(error);
  }
}

export async function deleteVessel(req, res, next) {
  try {
    const { id } = req.params;

    let query = { imo: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    }

    const deleted = await Vessel.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ status: 404, message: 'Vessel not found' });
    }

    res.status(200).json({ status: 200, message: 'Vessel deleted successfully' });
  } catch (error) {
    next(error);
  }
}
