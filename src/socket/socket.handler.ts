import { Server, Socket } from 'socket.io';
import { emitToTechnician, emitToAllAdmins } from './socket.server';

export const handleSocketEvents = (io: Server, socket: Socket, userId: number, role: string) => {

    // --- Technician events ---
    if (role === 'TECHNICIAN') {
        // Technician sends location update
        socket.on('location_update', (data: { lat: number; lng: number }) => {
            emitToAllAdmins('location_update', {
                technicianId: userId,
                ...data,
                timestamp: new Date().toISOString(),
            });
        });
    }

    // --- Common: ping/pong for connection health ---
    socket.on('ping_server', () => {
        socket.emit('pong_server', { timestamp: Date.now() });
    });
};

// --- Event emission functions used by controllers ---

export const emitJobAssigned = (technicianId: number, job: any) => {
    emitToTechnician(technicianId, 'job_assigned', {
        jobId: job.id,
        jobCode: job.jobCode,
        customerName: job.customerName,
        address: job.address,
        scheduleTime: job.scheduleTime,
        category: job.category?.name,
    });
};

export const emitJobStatusUpdate = (job: any) => {
    // Notify all admins about job status change
    emitToAllAdmins('job_status_update', {
        jobId: job.id,
        jobCode: job.jobCode,
        status: job.status,
        technicianId: job.technicianId,
    });

    // Also notify the technician
    if (job.technicianId) {
        emitToTechnician(job.technicianId, 'job_updated', {
            jobId: job.id,
            jobCode: job.jobCode,
            status: job.status,
        });
    }
};

export const emitSpareRequested = (technicianId: number, data: any) => {
    emitToAllAdmins('spare_requested', {
        technicianId,
        ...data,
    });
};

export const emitSpareRequestUpdate = (technicianId: number, data: any) => {
    emitToTechnician(technicianId, 'spare_request_update', data);
};

export const emitPaymentUpdate = (technicianId: number | null, data: any) => {
    emitToAllAdmins('payment_update', data);
    if (technicianId) {
        emitToTechnician(technicianId, 'payment_update', data);
    }
};

export const emitOtpSent = (technicianId: number, data: any) => {
    emitToTechnician(technicianId, 'otp_sent', data);
};
