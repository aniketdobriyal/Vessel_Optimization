import { Router } from 'express';
import { getAllAlerts, updateAlert } from '../controllers/alertController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all alerts endpoints
router.use(authMiddleware);

router.get('/', getAllAlerts);
router.put('/:id', updateAlert);

export default router;
