import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as walletService from '../services/wallet.service';

// --- Technician endpoints ---

export const getMyWallet = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const wallet = await walletService.getWalletBalance(technicianId);
        res.status(200).json({ wallet });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to get wallet' });
    }
};

export const getMyTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const transactions = await walletService.getWalletTransactions(technicianId);
        res.status(200).json({ transactions });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to get transactions' });
    }
};

export const requestPayout = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const { amount } = req.body;
        const payout = await walletService.requestPayout(technicianId, amount);
        res.status(201).json({ message: 'Payout requested', payout });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to request payout' });
    }
};

export const getMyPayouts = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const payouts = await walletService.getTechnicianPayouts(technicianId);
        res.status(200).json({ payouts });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to get payouts' });
    }
};

// --- Admin endpoints ---

export const getAllWallets = async (_req: Request, res: Response) => {
    try {
        const wallets = await walletService.getAllWallets();
        res.status(200).json({ wallets });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to get wallets' });
    }
};

export const listPayouts = async (req: Request, res: Response) => {
    try {
        const { technicianId, status } = req.query;
        const payouts = await walletService.listPayouts({
            technicianId: technicianId ? Number(technicianId) : undefined,
            status: status as string | undefined,
        });
        res.status(200).json({ payouts });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to list payouts' });
    }
};

export const approvePayout = async (req: Request, res: Response) => {
    try {
        const payoutId = Number(req.params.id);
        const { adminNote } = req.body;
        const payout = await walletService.approvePayout(payoutId, adminNote);
        res.status(200).json({ message: 'Payout approved', payout });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to approve payout' });
    }
};

export const markPayoutPaid = async (req: Request, res: Response) => {
    try {
        const payoutId = Number(req.params.id);
        const result = await walletService.markPayoutPaid(payoutId);
        res.status(200).json({ message: 'Payout marked as paid', ...result });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to mark payout as paid' });
    }
};
