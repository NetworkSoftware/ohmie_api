import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.get('/', authenticateJWT, requireAdmin, paymentController.listPayments);
router.get('/:id', authenticateJWT, requireAdmin, paymentController.getPayment);
router.post('/create', authenticateJWT, requireAdmin, paymentController.createPayment);
router.put('/:id/mark-paid', authenticateJWT, requireAdmin, paymentController.markPaid);

export default router;
