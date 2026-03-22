export interface DashboardSummary {
    totalJobs: number;
    todayJobs: number;
    activeTechnicians: number;
    todayRevenue: number;
    weeklyRevenue: number[];
}

export interface RevenueReport {
    totalRevenue: number;
    monthlyRevenue: number;
    commission: number;
    platformEarnings: number;
}
