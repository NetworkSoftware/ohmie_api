import { Request, Response } from 'express';
import * as technicianService from '../services/technician.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { log } from 'console';
import { emitJobStatusUpdate, emitSpareRequested, emitOtpSent, emitPaymentUpdate } from '../socket/socket.handler';

export const createTechnician = async (req: Request, res: Response) => {
    try {
        log('createTechnician called with body:', req.body);
        const technician = await technicianService.createTechnician(req.body);
        res.status(201).json({ message: 'Technician created', technician });
    } catch (error: any) {
        log(`Error creating technician: ${error}`);
        res.status(error.status || 400).json({ error: error.message || 'Create technician failed' });
    }
};

export const listTechnicians = async (_req: Request, res: Response) => {
    try {
        log('Fetching technicians...');
        const technicians = await technicianService.listTechnicians();
        log(`Technicians fetched: ${technicians.length}`);
        res.status(200).json({ technicians });
    } catch (error: any) {
        log(`Error fetching technicians: ${error.message}`);
        res.status(500).json({ error: error.message || 'List technicians failed' });
    }
};

export const changeTechnicianStatus = async (req: Request, res: Response) => {
    try {
        const { technicianId, status } = req.body;
        const technician = await technicianService.changeTechnicianStatus(technicianId, status);
        res.status(200).json({ message: 'Status updated', technician });
    } catch (error: any) {
        log(`Error changing technician status: ${error.message}`);
        res.status(error.status || 400).json({ error: error.message || 'Change status failed' });
    }
};

export const loginTechnician = async (req: Request, res: Response) => {
    try {
        const { mobile, password } = req.body;
        const { token, technician } = await technicianService.loginTechnician(mobile, password);
        res.status(200).json({ token, technician });
    } catch (error: any) {
        log(`Error logging in technician: ${error.message}`);
        res.status(error.status || 400).json({ error: error.message || 'Login failed' });
    }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobId = Number(req.params.id);
        const job = await technicianService.getJobById(technicianId, jobId);
        res.status(200).json({ job });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch job' });
    }
};

export const getAssignedJobs = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        console.log("getAssignedJobs called for technicianId:", technicianId);

        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobs = await technicianService.getAssignedJobs(technicianId);
        res.status(200).json({ jobs });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch jobs' });
    }
};

export const respondToJob = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const { jobId, response } = req.body;
        const job = await technicianService.respondToJob(technicianId, jobId, response);
        emitJobStatusUpdate(job);
        res.status(200).json({ message: 'Response recorded', job });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to respond to job' });
    }
};

export const getAllMyJobs = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const { status } = req.query;
        const jobs = await technicianService.getAllMyJobs(technicianId, status as string | undefined);
        res.status(200).json({ jobs });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch jobs' });
    }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const dashboard = await technicianService.getTechnicianDashboard(technicianId);
        res.status(200).json(dashboard);
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch dashboard' });
    }
};

export const startJob = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobId = Number(req.params.id);
        if (!req.file) {
            return res.status(400).json({ error: 'Before image is required' });
        }
        const beforeImage = req.file.filename;
        const job = await technicianService.startJob(technicianId, jobId, beforeImage);
        emitJobStatusUpdate(job);
        res.status(200).json({ message: 'Job started', job });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to start job' });
    }
};

export const completeJob = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobId = Number(req.params.id);
        if (!req.file) {
            return res.status(400).json({ error: 'After image is required' });
        }
        const afterImage = req.file.filename;
        const job = await technicianService.completeJob(technicianId, jobId, afterImage);
        emitJobStatusUpdate(job);
        res.status(200).json({ message: 'Job moved to OTP verification', job });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to complete job' });
    }
};

// --- OTP ---

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const jobId = Number(req.params.id);
        const result = await technicianService.generateOtp(jobId);
        emitOtpSent(result.technicianId ?? 0, { jobId, jobCode: result.jobCode });
        res.status(200).json({ message: 'OTP sent', ...result });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const { jobId, otp } = req.body;
        const job = await technicianService.verifyOtp(technicianId, jobId, otp);
        emitJobStatusUpdate(job);
        emitPaymentUpdate(technicianId, { jobId: job.id, jobCode: job.jobCode, status: 'COMPLETED' });
        res.status(200).json({ message: 'OTP verified, job completed', job });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'OTP verification failed' });
    }
};

// --- Spare management ---

export const listSpares = async (req: AuthRequest, res: Response) => {
    try {
        const { search } = req.query;
        const spares = await technicianService.listSparesForTechnician(search as string | undefined);
        res.status(200).json({ spares });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch spares' });
    }
};

export const requestSpare = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobId = Number(req.params.jobId);
        const { spareId, quantity, reason } = req.body;
        const usage = await technicianService.requestSpareForJob(technicianId, jobId, spareId, quantity, reason);
        emitSpareRequested(technicianId, { jobId, spareId, quantity, spareName: usage?.spare?.name });
        res.status(201).json({ message: 'Spare added', usage });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to request spare' });
    }
};

export const getJobSpares = async (req: AuthRequest, res: Response) => {
    try {
        const technicianId = req.user?.id;
        if (!technicianId) {
            return res.status(400).json({ error: 'Technician ID is required' });
        }
        const jobId = Number(req.params.jobId);
        const usages = await technicianService.getJobSpareUsages(technicianId, jobId);
        res.status(200).json({ usages });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to fetch spare usages' });
    }
};

// Admin: update technician
export const updateTechnician = async (req: Request, res: Response) => {
    try {
        log('updateTechnician called with params:', req.params, 'and body:', req.body);
        const technician = await technicianService.updateTechnician(Number(req.params.id), req.body);
        res.status(200).json({ message: 'Technician updated', technician });
    } catch (error: any) {
        log(`Error updating technician: ${error.message}`);
        res.status(error.status || 400).json({ error: error.message || 'Update technician failed' });
    }
};

// Admin: block technician
export const blockTechnician = async (req: Request, res: Response) => {
    try {
        const technician = await technicianService.changeTechnicianStatus(Number(req.params.id), 'BLOCKED');
        res.status(200).json({ message: 'Technician blocked', technician });
    } catch (error: any) {
        log(`Error blocking technician: ${error.message}`);
        res.status(error.status || 400).json({ error: error.message || 'Block technician failed' });
    }
};

// Admin: unblock technician
export const unblockTechnician = async (req: Request, res: Response) => {
    try {
        const technician = await technicianService.changeTechnicianStatus(Number(req.params.id), 'ACTIVE');
        res.status(200).json({ message: 'Technician unblocked', technician });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Unblock technician failed' });
    }
};
