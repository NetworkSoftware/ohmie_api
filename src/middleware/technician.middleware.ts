import { AuthRequest } from './auth.middleware';
import { Response, NextFunction } from 'express';

export const requireTechnician = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'TECHNICIAN') {
        return res.status(403).json({ error: 'Technician access required' });
    }
    next();
};
