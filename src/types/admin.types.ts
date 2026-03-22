import { Admin, Role } from '@prisma/client';

export type AdminSafe = Omit<Admin, 'password'>;

export interface RegisterInput {
    name: string;
    email: string;
    mobile: string;
    password: string;
    role?: Role;
}

export interface LoginInput {
    email: string;
    password: string;
}
