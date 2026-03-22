import { Router } from 'express';

import * as jobController from '../controllers/job.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();


router.get('/', authenticateJWT, requireAdmin, jobController.listJobs);
router.post('/', authenticateJWT, requireAdmin, jobController.createJob);
router.put('/:id/assign', authenticateJWT, requireAdmin, jobController.assignTechnician);
router.put('/:id', authenticateJWT, requireAdmin, jobController.updateJob);
router.delete('/:id', authenticateJWT, requireAdmin, jobController.deleteJob);

export default router;
