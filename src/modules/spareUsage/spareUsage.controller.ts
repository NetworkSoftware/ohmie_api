import { Request, Response } from 'express';
import * as spareUsageService from './spareUsage.service';

export const addSpareUsage = async (req: Request, res: Response) => {
    try {
        const jobId = Number(req.params.jobId);
        const { spareId, quantity } = req.body;
        const usage = await spareUsageService.addSpareUsage({ jobId, spareId, quantity });
        res.status(201).json(usage);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
};
