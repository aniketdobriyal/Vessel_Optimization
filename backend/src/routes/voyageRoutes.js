import { Router } from 'express';
import {
  getAllVoyages,
  getVoyageById,
  createVoyage,
  updateVoyage,
  deleteVoyage,
  uploadCospReport,
  uploadNoonReport,
  uploadEospReport,
  getRouteOptimizations,
  createRouteOptimization
} from '../controllers/voyageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all voyage & reports upload routes
router.use(authMiddleware);

router.get('/', getAllVoyages);
router.get('/:id', getVoyageById);
router.post('/', createVoyage);
router.put('/:id', updateVoyage);
router.delete('/:id', deleteVoyage);

router.post('/:id/cosp', uploadCospReport);
router.post('/:id/noon', uploadNoonReport);
router.post('/:id/eosp', uploadEospReport);

router.get('/:id/route-optimizations', getRouteOptimizations);
router.post('/:id/route-optimizations', createRouteOptimization);

export default router;
