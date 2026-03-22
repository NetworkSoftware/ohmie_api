import { Router } from 'express';

import * as adminController from '../controllers/admin.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();


router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Admin dashboard summary
router.get('/dashboard-summary', authenticateJWT, requireAdmin, adminController.dashboardSummary);



export default router;
