import prisma from '../utils/prisma';

export const revenueReport = async () => {
    // Service revenue (sum of companyShare from jobs)
    const serviceAgg = await prisma.job.aggregate({ _sum: { companyShare: true } });
    const serviceRevenue = serviceAgg._sum.companyShare || 0;

    // Spare revenue (sum of totalPrice from SpareUsage)
    const spareAgg = await prisma.spareUsage.aggregate({ _sum: { totalPrice: true } });
    const spareRevenue = spareAgg._sum.totalPrice || 0;

    // Total revenue
    const totalRevenue = serviceRevenue + spareRevenue;

    // Platform commission (sum of companyShare from jobs)
    const platformCommission = serviceRevenue;

    // Technician payout (sum of technicianShare from jobs)
    const techAgg = await prisma.job.aggregate({ _sum: { technicianShare: true } });
    const technicianPayout = techAgg._sum.technicianShare || 0;

    return {
        serviceRevenue,
        spareRevenue,
        totalRevenue,
        platformCommission,
        technicianPayout,
    };
};
