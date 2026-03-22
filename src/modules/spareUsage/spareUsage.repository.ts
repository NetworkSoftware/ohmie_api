import prisma from '../../utils/prisma';

export const createSpareUsage = async (data: any) => {
    return prisma.spareUsage.create({ data });
};
