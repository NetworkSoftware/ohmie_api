import { Request, Response } from 'express';
import * as revenueService from '../services/revenue.service';

export const revenueReport = async (_req: Request, res: Response) => {
    try {
        const report = await revenueService.revenueReport();
        res.status(200).json(report);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch revenue report' });
    }
};
