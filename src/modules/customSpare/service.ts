import prisma from '../../utils/prisma';
import * as repo from './repository';
import crypto from 'crypto';

export const createRequest = async (technicianId: number, data: {
    name: string;
    category: string;
    reason: string;
    image?: string;
    jobId?: number;
}) => {
    if (!data.name || !data.category || !data.reason) {
        throw { status: 400, message: 'Name, category, and reason are required' };
    }
    return repo.create({ technicianId, ...data });
};

export const getMyRequests = async (technicianId: number) => {
    return repo.findByTechnician(technicianId);
};

export const getAllRequests = async (status?: string) => {
    return repo.findAll(status);
};

export const approveRequest = async (id: number) => {
    const request = await repo.findById(id);
    if (!request) throw { status: 404, message: 'Request not found' };
    if (request.status !== 'PENDING') throw { status: 400, message: 'Request is not pending' };

    // Check for duplicate spare name
    const existing = await prisma.spare.findFirst({
        where: { name: request.name },
    });
    if (existing) {
        // Just approve it — spare already exists
        return repo.updateStatus(id, 'APPROVED', 'Spare already exists in inventory');
    }

    // Use transaction: approve + create spare together
    const sku = `CSR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
        // Create spare
        await tx.spare.create({
            data: {
                name: request.name,
                sku,
                costPrice: 0,
                sellingPrice: 0,
                stockQty: 0,
                isActive: true,
            },
        });

        // Update request status
        return tx.customSpareRequest.update({
            where: { id },
            data: { status: 'APPROVED' },
            include: { technician: { select: { id: true, name: true, mobile: true } } },
        });
    });

    return result;
};

export const rejectRequest = async (id: number, adminNote?: string) => {
    const request = await repo.findById(id);
    if (!request) throw { status: 404, message: 'Request not found' };
    if (request.status !== 'PENDING') throw { status: 400, message: 'Request is not pending' };

    return repo.updateStatus(id, 'REJECTED', adminNote);
};
