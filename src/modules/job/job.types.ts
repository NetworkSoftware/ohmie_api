export interface JobInput {
    jobCode: string;
    customerName: string;
    customerPhone: string;
    address: string;
    description: string;
    categoryId: number;
    scheduleTime: Date;
    totalAmount?: number;
    technicianShare?: number;
    companyShare?: number;
}

export interface JobUpdateInput {
    customerName?: string;
    customerPhone?: string;
    address?: string;
    description?: string;
    categoryId?: number;
    scheduleTime?: Date;
    status?: string;
    totalAmount?: number;
    technicianShare?: number;
    companyShare?: number;
    technicianId?: number;
}
