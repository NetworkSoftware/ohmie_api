import { log } from 'console';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
    user?: { id: number; role: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    //testing mode on or off - if on, skip auth
    if (process.env.TESTING_MODE === 'true') {
        log('Testing mode ON - skipping authentication');
        req.user = { id: 1, role: 'ADMIN' }; // mock admin user
        return next();
    }
    const authHeader = req.headers.authorization;
    log('Auth Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        log('Decoded JWT:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        log('JWT Error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authenticateTechnicianJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    //testing mode on or off - if on, skip auth
    if (process.env.TESTING_MODE === 'true') {
        log('Testing mode ON - skipping authentication');
        req.user = { id: 1, role: 'TECHNICIAN' }; // mock technician user
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        if (decoded.role !== 'TECHNICIAN') {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        log('JWT Error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
