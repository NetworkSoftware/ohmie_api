import { Router } from 'express';

import { authenticateJWT, authenticateTechnicianJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import * as technicianController from '../controllers/technician.controller';
import { uploadJobImage } from '../config/multer.config';

const router = Router();


router.get('/', authenticateJWT, requireAdmin, technicianController.listTechnicians);
router.post('/', authenticateJWT, requireAdmin, technicianController.createTechnician);
router.put('/:id', authenticateJWT, requireAdmin, technicianController.updateTechnician);
router.patch('/:id/block', authenticateJWT, requireAdmin, technicianController.blockTechnician);
router.patch('/:id/unblock', authenticateJWT, requireAdmin, technicianController.unblockTechnician);
router.post('/login', technicianController.loginTechnician);
router.get('/job/:id', authenticateTechnicianJWT, technicianController.getJobById);
router.get('/jobs', authenticateTechnicianJWT, technicianController.getAssignedJobs);
router.get('/my-jobs', authenticateTechnicianJWT, technicianController.getAllMyJobs);
router.get('/dashboard', authenticateTechnicianJWT, technicianController.getDashboard);
router.patch('/job/respond', authenticateTechnicianJWT, technicianController.respondToJob);
router.post('/job/:id/start', authenticateTechnicianJWT, uploadJobImage.single('beforeImage'), technicianController.startJob);
router.post('/job/:id/complete', authenticateTechnicianJWT, uploadJobImage.single('afterImage'), technicianController.completeJob);
router.post('/job/verify-otp', authenticateTechnicianJWT, technicianController.verifyOtp);
router.post('/job/:id/send-otp', authenticateJWT, requireAdmin, technicianController.sendOtp);
router.get('/spares', authenticateTechnicianJWT, technicianController.listSpares);
router.post('/job/:jobId/request-spare', authenticateTechnicianJWT, technicianController.requestSpare);
router.get('/job/:jobId/spares', authenticateTechnicianJWT, technicianController.getJobSpares);

export default router;
