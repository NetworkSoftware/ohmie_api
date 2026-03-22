import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as customSpareService from './service';
import { emitSpareRequested, emitSpareRequestUpdate } from '../../socket/socket.handler';

// --- Technician endpoints ---

export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const { name, category, reason, image, jobId } = req.body;
        const request = await customSpareService.createRequest(technicianId, {
            name, category, reason, image, jobId,
        });
        emitSpareRequested(technicianId, { type: 'custom', name, category, jobId });
        res.status(201).json({ message: 'Custom spare request submitted', request });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to create request' });
    }
};

export const getMyRequests = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) return res.status(400).json({ error: 'Technician ID is required' });

        const requests = await customSpareService.getMyRequests(technicianId);
        res.status(200).json({ requests });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch requests' });
    }
};

// --- Admin endpoints ---

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const requests = await customSpareService.getAllRequests(status as string | undefined);
        res.status(200).json({ requests });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch requests' });
    }
};

export const approveRequest = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const request = await customSpareService.approveRequest(id);
        emitSpareRequestUpdate(request.technicianId, { id, status: 'APPROVED', name: request.name });
        res.status(200).json({ message: 'Request approved and spare created', request });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to approve request' });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { adminNote } = req.body;
        const request = await customSpareService.rejectRequest(id, adminNote);
        emitSpareRequestUpdate(request.technicianId, { id, status: 'REJECTED', name: request.name, adminNote });
        res.status(200).json({ message: 'Request rejected', request });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to reject request' });
    }
};
