import { Router } from 'express';
import {
  getArrivalReports,
  createArrivalReport,
  getDepartureReports,
  createDepartureReport,
  getPortNoonReports,
  createPortNoonReport
} from '../controllers/reportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all reports endpoints using authMiddleware
router.use(authMiddleware);

router.route('/arrival-reports')
  .get(getArrivalReports)
  .post(createArrivalReport);

router.route('/departure-reports')
  .get(getDepartureReports)
  .post(createDepartureReport);

router.route('/port-noon-reports')
  .get(getPortNoonReports)
  .post(createPortNoonReport);

export default router;
