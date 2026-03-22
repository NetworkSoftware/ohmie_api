import prisma from '../../utils/prisma';

export const create = async (data: {
    technicianId: number;
    jobId?: number;
    name: string;
    category: string;
    reason: string;
    image?: string;
}) => {
    return prisma.customSpareRequest.create({
        data,
        include: { technician: { select: { id: true, name: true, mobile: true } } },
    });
};

export const findByTechnician = async (technicianId: number) => {
    return prisma.customSpareRequest.findMany({
        where: { technicianId },
        orderBy: { createdAt: 'desc' },
    });
};

export const findAll = async (status?: string) => {
    return prisma.customSpareRequest.findMany({
        where: status ? { status } : {},
        include: { technician: { select: { id: true, name: true, mobile: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const findById = async (id: number) => {
    return prisma.customSpareRequest.findUnique({
        where: { id },
        include: { technician: { select: { id: true, name: true, mobile: true } } },
    });
};

export const updateStatus = async (id: number, status: string, adminNote?: string) => {
    return prisma.customSpareRequest.update({
        where: { id },
        data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
        include: { technician: { select: { id: true, name: true, mobile: true } } },
    });
};
