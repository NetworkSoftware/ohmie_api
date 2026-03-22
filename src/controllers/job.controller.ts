import { Request, Response } from 'express';
import * as jobService from '../services/job.service';
import { emitJobAssigned, emitJobStatusUpdate } from '../socket/socket.handler';

export const createJob = async (req: Request, res: Response) => {
    try {
        console.log("createJob", req.body);

        const job = await jobService.createJob(req.body);

        // If technician was assigned at creation, emit socket event
        if (job.technicianId) {
            emitJobAssigned(job.technicianId, job);
        }

        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error: any) {
        console.error("createJob error", error);
        res.status(error.status || 400).json({ error: error.message || 'Job creation failed' });
    }
};

export const listJobs = async (_req: Request, res: Response) => {
    try {
        console.log("listJobs", _req.query);
        const jobs = await jobService.listJobs(_req.query);
        res.status(200).json({ jobs });
    } catch (error: any) {
        console.error("listJobs error", error);
        res.status(500).json({ error: error.message || 'Failed to list jobs' });
    }
};

export const assignTechnician = async (req: Request, res: Response) => {
    try {
        const jobId = Number(req.params.id);
        const { technicianId } = req.body;
        const job = await jobService.assignTechnician(jobId, technicianId);
        emitJobAssigned(technicianId, job);
        emitJobStatusUpdate(job);
        res.status(200).json({ message: 'Technician assigned successfully', job });
    } catch (error: any) {
        console.error("assignTechnician error", error);
        res.status(error.status || 400).json({ error: error.message || 'Failed to assign technician' });
    }
};

export const updateJob = async (req: Request, res: Response) => {
    try {
        const job = await jobService.updateJob(Number(req.params.id), req.body);
        emitJobStatusUpdate(job);
        res.status(200).json({ message: 'Job updated successfully', job });
    } catch (error: any) {
        console.error("updateJob error", error);
        res.status(error.status || 400).json({ error: error.message || 'Job update failed' });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        await jobService.deleteJob(Number(req.params.id));
        res.status(200).json({ message: 'Job deleted (soft) successfully' });
    } catch (error: any) {
        console.error("deleteJob error", error);
        res.status(error.status || 400).json({ error: error.message || 'Job delete failed' });
    }
};
