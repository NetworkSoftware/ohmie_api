import { Router } from 'express';
import { authenticateJWT, authenticateTechnicianJWT } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';
import * as customSpareController from './controller';

const router = Router();

// Technician endpoints
router.post('/technician/request', authenticateTechnicianJWT, customSpareController.createRequest);
router.get('/technician/requests', authenticateTechnicianJWT, customSpareController.getMyRequests);

// Admin endpoints
router.get('/admin/requests', authenticateJWT, requireAdmin, customSpareController.getAllRequests);
router.put('/admin/:id/approve', authenticateJWT, requireAdmin, customSpareController.approveRequest);
router.put('/admin/:id/reject', authenticateJWT, requireAdmin, customSpareController.rejectRequest);

export default router;
