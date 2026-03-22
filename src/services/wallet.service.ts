import prisma from '../utils/prisma';

// --- Wallet ---

export const getOrCreateWallet = async (technicianId: number) => {
    let wallet = await prisma.wallet.findUnique({ where: { technicianId } });
    if (!wallet) {
        wallet = await prisma.wallet.create({ data: { technicianId, balance: 0 } });
    }
    return wallet;
};

export const creditWallet = async (technicianId: number, amount: number, source: string, referenceId?: number, description?: string) => {
    const wallet = await getOrCreateWallet(technicianId);

    const [updatedWallet, transaction] = await prisma.$transaction([
        prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: amount } },
        }),
        prisma.walletTransaction.create({
            data: { technicianId, amount, type: 'CREDIT', source, referenceId, description },
        }),
    ]);

    return { wallet: updatedWallet, transaction };
};

export const debitWallet = async (technicianId: number, amount: number, source: string, referenceId?: number, description?: string) => {
    const wallet = await getOrCreateWallet(technicianId);
    if (wallet.balance < amount) throw { status: 400, message: 'Insufficient wallet balance' };

    const [updatedWallet, transaction] = await prisma.$transaction([
        prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { decrement: amount } },
        }),
        prisma.walletTransaction.create({
            data: { technicianId, amount, type: 'DEBIT', source, referenceId, description },
        }),
    ]);

    return { wallet: updatedWallet, transaction };
};

export const getWalletBalance = async (technicianId: number) => {
    const wallet = await getOrCreateWallet(technicianId);
    return wallet;
};

export const getWalletTransactions = async (technicianId: number) => {
    return prisma.walletTransaction.findMany({
        where: { technicianId },
        orderBy: { createdAt: 'desc' },
    });
};

// --- Admin: All wallets overview ---

export const getAllWallets = async () => {
    return prisma.wallet.findMany({
        include: { technician: { select: { id: true, name: true, mobile: true } } },
        orderBy: { balance: 'desc' },
    });
};

// --- Payout ---

export const requestPayout = async (technicianId: number, amount: number) => {
    if (amount <= 0) throw { status: 400, message: 'Payout amount must be greater than 0' };

    const wallet = await getOrCreateWallet(technicianId);
    if (wallet.balance < amount) throw { status: 400, message: 'Insufficient wallet balance' };

    // Check for existing pending payout
    const existingPending = await prisma.payout.findFirst({
        where: { technicianId, status: 'PENDING' },
    });
    if (existingPending) throw { status: 400, message: 'You already have a pending payout request' };

    return prisma.payout.create({
        data: { technicianId, amount, status: 'PENDING' },
    });
};

export const listPayouts = async (query: { technicianId?: number; status?: string }) => {
    const where: any = {};
    if (query.technicianId) where.technicianId = query.technicianId;
    if (query.status) where.status = query.status;

    return prisma.payout.findMany({
        where,
        include: { technician: { select: { id: true, name: true, mobile: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const approvePayout = async (payoutId: number, adminNote?: string) => {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw { status: 404, message: 'Payout not found' };
    if (payout.status !== 'PENDING') throw { status: 400, message: 'Payout is not in pending state' };

    return prisma.payout.update({
        where: { id: payoutId },
        data: { status: 'APPROVED', adminNote },
        include: { technician: { select: { id: true, name: true, mobile: true } } },
    });
};

export const markPayoutPaid = async (payoutId: number) => {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw { status: 404, message: 'Payout not found' };
    if (payout.status !== 'APPROVED') throw { status: 400, message: 'Payout must be approved before marking as paid' };

    // Debit wallet
    const { wallet } = await debitWallet(
        payout.technicianId,
        payout.amount,
        'PAYOUT',
        payout.id,
        `Payout #${payout.id}`,
    );

    const updatedPayout = await prisma.payout.update({
        where: { id: payoutId },
        data: { status: 'PAID' },
        include: { technician: { select: { id: true, name: true, mobile: true } } },
    });

    return { payout: updatedPayout, walletBalance: wallet.balance };
};

export const getTechnicianPayouts = async (technicianId: number) => {
    return prisma.payout.findMany({
        where: { technicianId },
        orderBy: { createdAt: 'desc' },
    });
};
