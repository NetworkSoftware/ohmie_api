import { Category, Technician, TechnicianStatus } from '@prisma/client';

export interface CategoryInput {
    name: string;
}

export interface TechnicianInput {
    name: string;
    mobile: string;
    email?: string;
    password: string;
    categoryIds: number[];
}

export interface TechnicianStatusChangeInput {
    technicianId: number;
    status: TechnicianStatus;
}

export type TechnicianSafe = Omit<Technician, 'password'>;
