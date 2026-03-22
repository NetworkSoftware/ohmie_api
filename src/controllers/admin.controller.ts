import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await adminService.register(req.body);
        res.status(201).json({ message: 'Admin registered successfully', admin });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Registration failed' });
    }
};


export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { token, admin } = await adminService.login(req.body);
        res.status(200).json({ token, admin });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Login failed' });
    }
};

export const dashboardSummary = async (_req: Request, res: Response) => {
    try {
        const summary = await adminService.dashboardSummary();
        console.log("summary", summary);

        res.status(200).json(summary);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch dashboard summary' });
    }
};
