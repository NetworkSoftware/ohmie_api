import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    // admin and superadmin can access admin routes
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};
