import prisma from '../utils/prisma';

export const createPayment = async (jobId: number, amount: number, method: string) => {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw { status: 404, message: 'Job not found' };

    return prisma.payment.create({
        data: { jobId, amount, method, status: 'PENDING' },
        include: { job: true },
    });
};

export const markPaymentPaid = async (paymentId: number, transactionId?: string) => {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw { status: 404, message: 'Payment not found' };
    if (payment.status === 'PAID') throw { status: 400, message: 'Payment already marked as paid' };

    return prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', paidAt: new Date(), transactionId },
        include: { job: true },
    });
};

export const listPayments = async (query: { jobId?: number; status?: string }) => {
    const where: any = {};
    if (query.jobId) where.jobId = query.jobId;
    if (query.status) where.status = query.status;

    return prisma.payment.findMany({
        where,
        include: { job: { include: { technician: true, category: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const getPaymentById = async (id: number) => {
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: { job: { include: { technician: true, category: true } } },
    });
    if (!payment) throw { status: 404, message: 'Payment not found' };
    return payment;
};
