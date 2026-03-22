export interface TechnicianInput {
    name: string;
    mobile: string;
    email?: string;
    password: string;
    categoryIds: number[];
}

export interface TechnicianUpdateInput {
    name?: string;
    mobile?: string;
    email?: string;
    isActive?: boolean;
    status?: string;
}
