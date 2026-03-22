import { Router } from 'express';
import * as spareUsageController from './spareUsage.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

// Only TECHNICIAN can use this route (middleware should check role)
router.post('/job/:jobId/add-spare', authenticateJWT, spareUsageController.addSpareUsage);

export default router;
