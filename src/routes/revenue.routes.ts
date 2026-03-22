import { Router } from 'express';
import * as revenueController from '../controllers/revenue.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/report', authenticateJWT, requireAdmin, revenueController.revenueReport);

export default router;
