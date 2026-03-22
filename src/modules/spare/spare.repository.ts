import prisma from '../../utils/prisma';
import { SpareInput, SpareUpdateInput } from '../../types/spare.types';

export const findMany = async (query: any = {}) => {
    return prisma.spare.findMany(query);
};

export const findById = async (id: number) => {
    return prisma.spare.findUnique({ where: { id } });
};

export const findBySku = async (sku: string) => {
    return prisma.spare.findUnique({ where: { sku } });
};

export const create = async (data: SpareInput) => {
    const { category, categoryId, ...rest } = data as any;

    let finalData: any = { ...rest };

    if (categoryId) {
        finalData.categoryId = categoryId;
    } else if (category) {
        // ensure category exists (upsert) and use its id
        const cat = await prisma.category.upsert({
            where: { name: category },
            update: { updatedAt: new Date(), isActive: true },
            create: { name: category, isActive: true },
        });
        finalData.categoryId = cat.id;
    }

    return prisma.spare.create({ data: finalData });
};

export const update = async (id: number, data: SpareUpdateInput) => {
    const { category, categoryId, ...rest } = data as any;
    let finalData: any = { ...rest };

    if (categoryId) {
        finalData.categoryId = categoryId;
    } else if (category) {
        const cat = await prisma.category.upsert({
            where: { name: category },
            update: { updatedAt: new Date(), isActive: true },
            create: { name: category, isActive: true },
        });
        finalData.categoryId = cat.id;
    }

    return prisma.spare.update({ where: { id }, data: finalData });
};

export const softDelete = async (id: number) => {
    return prisma.spare.update({ where: { id }, data: { isActive: false } });
};

export const findLowStock = async () => {
    return prisma.spare.findMany({ where: { stockQty: { lte: prisma.spare.fields.minStock }, isActive: true } });
};
