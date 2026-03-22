import prisma from '../../utils/prisma';
import { SpareUsageInput } from './spareUsage.types';

export const addSpareUsage = async (input: SpareUsageInput) => {
    const spare = await prisma.spare.findUnique({ where: { id: input.spareId } });
    if (!spare || !spare.isActive) throw new Error('Spare not found or inactive');
    if (spare.stockQty < input.quantity) throw new Error('Insufficient stock');

    // Deduct stock
    await prisma.spare.update({
        where: { id: input.spareId },
        data: { stockQty: { decrement: input.quantity } },
    });

    // Log stock deduction
    await prisma.spareStockLog.create({
        data: {
            spareId: input.spareId,
            changeQty: -input.quantity,
            type: 'DEDUCT',
            note: `Used for job ${input.jobId}`,
        },
    });

    // Create usage record
    const totalPrice = spare.sellingPrice * input.quantity;
    const usage = await prisma.spareUsage.create({
        data: {
            jobId: input.jobId,
            spareId: input.spareId,
            quantity: input.quantity,
            totalPrice,
        },
    });

    // Add to job totalAmount
    await prisma.job.update({
        where: { id: input.jobId },
        data: { totalAmount: { increment: totalPrice } },
    });

    return usage;
};
