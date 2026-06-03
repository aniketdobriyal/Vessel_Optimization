import { Router } from 'express';
import { 
  getAllVessels, getVesselById, createVessel, updateVessel, deleteVessel 
} from '../controllers/vesselController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all routes
router.use(authMiddleware);

router.get('/', getAllVessels);
router.get('/:id', getVesselById);
router.post('/', createVessel);
router.put('/:id', updateVessel);
router.delete('/:id', deleteVessel);

export default router;
