import { Router } from 'express';
import { authenticateJWT, authenticateTechnicianJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import * as walletController from '../controllers/wallet.controller';

const router = Router();

// Technician endpoints
router.get('/my-wallet', authenticateTechnicianJWT, walletController.getMyWallet);
router.get('/my-transactions', authenticateTechnicianJWT, walletController.getMyTransactions);
router.post('/payout/request', authenticateTechnicianJWT, walletController.requestPayout);
router.get('/my-payouts', authenticateTechnicianJWT, walletController.getMyPayouts);

// Admin endpoints
router.get('/admin/wallets', authenticateJWT, requireAdmin, walletController.getAllWallets);
router.get('/admin/payouts', authenticateJWT, requireAdmin, walletController.listPayouts);
router.put('/admin/payout/:id/approve', authenticateJWT, requireAdmin, walletController.approvePayout);
router.put('/admin/payout/:id/pay', authenticateJWT, requireAdmin, walletController.markPayoutPaid);

export default router;
