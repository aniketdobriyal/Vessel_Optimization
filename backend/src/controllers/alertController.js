import Alert from '../models/Alert.js';

/**
 * Controller for Alerts (Mongoose Integration)
 */

export async function getAllAlerts(req, res, next) {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
}

export async function updateAlert(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Alert.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ status: 404, message: 'Alert not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}
