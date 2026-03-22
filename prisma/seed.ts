import { PrismaClient, TechnicianStatus, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/en_IN';

const prisma = new PrismaClient();

const SERVICE_CHARGE_RANGE: [number, number] = [300, 1000];
const TECHNICIAN_EXPERIENCE_RANGE: [number, number] = [1, 10];
const TECHNICIAN_RATING_RANGE: [number, number] = [3.5, 5.0];
const SPARE_COST_RANGE: [number, number] = [100, 1000];
const SPARE_STOCK_RANGE: [number, number] = [5, 50];
const JOB_PHONE_PREFIX = '9';
const PAYMENT_METHODS = ['CASH', 'ONLINE'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDateWithin(days: number) {
    const now = new Date();
    const past = new Date(now.getTime() - randomInt(0, days) * 24 * 60 * 60 * 1000);
    return past;
}

function randomDateInLast30Days() {
    return randomDateWithin(30);
}

const CATEGORY_DEFS = [
    { name: 'AC Installation', icon: 'ac_installation.png' },
    { name: 'AC Repair', icon: 'ac_repair.png' },
    { name: 'AC Gas Refill', icon: 'ac_gas_refill.png' },
    { name: 'Washing Machine Repair', icon: 'washing_machine.png' },
    { name: 'Refrigerator Repair', icon: 'refrigerator.png' },
    { name: 'RO Installation', icon: 'ro_installation.png' },
    { name: 'RO Service', icon: 'ro_service.png' },
    { name: 'Microwave Repair', icon: 'microwave.png' },
    { name: 'TV Repair', icon: 'tv.png' },
    { name: 'Geyser Service', icon: 'geyser.png' },
    { name: 'Chimney Service', icon: 'chimney.png' },
    { name: 'Fan Repair', icon: 'fan.png' },
    { name: 'Inverter Service', icon: 'inverter.png' },
    { name: 'CCTV Installation', icon: 'cctv.png' },
    { name: 'Plumbing', icon: 'plumbing.png' },
    { name: 'Electrical Works', icon: 'electrical.png' },
    { name: 'Laptop Repair', icon: 'laptop.png' },
    { name: 'Mobile Repair', icon: 'mobile.png' },
    { name: 'Water Heater Repair', icon: 'water_heater.png' },
    { name: 'General Maintenance', icon: 'general_maintenance.png' },
];

const BASE_SPARE_CATEGORIES = ['AC', 'Washing Machine', 'Refrigerator', 'RO', 'General'];
const SPARE_SKUS = Array.from({ length: 20 }, (_, i) => `SP-${String(i + 1).padStart(3, '0')}`);

const SPARE_CATEGORY_MAP: Record<string, string> = {
    AC: 'AC Repair',
    'Washing Machine': 'Washing Machine Repair',
    Refrigerator: 'Refrigerator Repair',
    RO: 'RO Service',
    General: 'General Maintenance',
};

async function main() {
    // Upsert categories first (safe to re-run)
    const upsertOps = CATEGORY_DEFS.map(def =>
        prisma.category.upsert({
            where: { name: def.name },
            update: { icon: def.icon, isActive: true, updatedAt: new Date() },
            create: { name: def.name, icon: def.icon, isActive: true, createdAt: randomDateInLast30Days() },
        })
    );

    await prisma.$transaction(upsertOps);

    const categories = await prisma.category.findMany();
    const categoryIds = categories.map(c => c.id);
    const catByName = Object.fromEntries(categories.map(c => [c.name.toLowerCase(), c.id])) as Record<string, number>;
    const randomCategoryId = () => categoryIds[Math.floor(Math.random() * categoryIds.length)];

    // Remove old dependent data (keep categories)
    await prisma.spareUsage.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.job.deleteMany();
    await prisma.spare.deleteMany();
    await prisma.technician.deleteMany();

    // 1) Technicians
    const technicians = [];
    for (let i = 0; i < 20; i++) {
        const isActive = i < 15;
        const name = faker.person.fullName();
        const phone = JOB_PHONE_PREFIX + faker.string.numeric(9);
        const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '', provider: 'gmail.com' }).toLowerCase();
        const experience = randomInt(...TECHNICIAN_EXPERIENCE_RANGE);
        const rating = randomFloat(...TECHNICIAN_RATING_RANGE, 1);
        const createdAt = randomDateWithin(60);
        technicians.push({
            name,
            mobile: phone,
            email,
            password: faker.internet.password({ length: 10 }),
            isActive,
            status: isActive ? TechnicianStatus.ACTIVE : TechnicianStatus.BLOCKED,
            createdAt,
            updatedAt: createdAt,
            experience,
            rating,
        });
    }

    await prisma.technician.createMany({ data: technicians });
    const allTechnicians = await prisma.technician.findMany();

    // 2) Spares (assign categoryId based on appliance)
    const spares = [] as any[];
    for (let i = 0; i < 20; i++) {
        const costPrice = randomInt(...SPARE_COST_RANGE);
        const sellingPrice = Math.round(costPrice * 1.3);
        const stockQty = randomInt(...SPARE_STOCK_RANGE);
        const minStock = [5, 10][randomInt(0, 1)];
        const createdAt = randomDateWithin(30);
        const base = BASE_SPARE_CATEGORIES[randomInt(0, BASE_SPARE_CATEGORIES.length - 1)];
        const mapped = SPARE_CATEGORY_MAP[base] ?? null;
        const categoryId = mapped ? catByName[mapped.toLowerCase()] ?? randomCategoryId() : randomCategoryId();

        spares.push({
            name: faker.commerce.productName(),
            sku: SPARE_SKUS[i],
            categoryId,
            costPrice,
            sellingPrice,
            stockQty,
            minStock,
            isActive: true,
            createdAt,
            updatedAt: createdAt,
        });
    }
    await prisma.spare.createMany({ data: spares });
    const allSpares = await prisma.spare.findMany();

    // 3) Jobs (assign random categoryId)
    const jobs = [] as any[];
    for (let i = 0; i < 20; i++) {
        const customerName = faker.person.fullName();
        const phone = JOB_PHONE_PREFIX + faker.string.numeric(9);
        const address = faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.state();
        const scheduleAt = new Date(Date.now() + (randomInt(-10, 5) * 24 * 60 * 60 * 1000));
        const status = [JobStatus.ACCEPTED, JobStatus.ASSIGNED, JobStatus.COMPLETED][randomInt(0, 2)];
        const serviceCharge = randomInt(...SERVICE_CHARGE_RANGE);
        const technician = allTechnicians[randomInt(0, allTechnicians.length - 1)];
        const createdAt = randomDateWithin(15);
        const categoryId = randomCategoryId();

        jobs.push({
            jobCode: `JOB-${String(i + 1).padStart(4, '0')}`,
            customerName,
            customerPhone: phone,
            address,
            description: faker.lorem.sentence(),
            categoryId,
            technicianId: technician.id,
            status,
            scheduleTime: scheduleAt,
            totalAmount: serviceCharge,
            technicianShare: Math.round(serviceCharge * 0.7),
            companyShare: Math.round(serviceCharge * 0.3),
            isDeleted: false,
            createdAt,
            updatedAt: createdAt,
        });
    }
    await prisma.job.createMany({ data: jobs });
    const allJobs = await prisma.job.findMany();

    // 4) Spare Usage (for completed jobs)
    const completedJobs = allJobs.filter(j => j.status === JobStatus.COMPLETED);
    const spareUsages = [] as any[];
    for (const job of completedJobs) {
        const numSpares = randomInt(1, 3);
        const usedSpares = faker.helpers.arrayElements(allSpares, numSpares);
        for (const spare of usedSpares) {
            const quantity = randomInt(1, 3);
            if (spare.stockQty < quantity) continue;
            const totalPrice = spare.sellingPrice * quantity;
            spareUsages.push({
                jobId: job.id,
                spareId: spare.id,
                quantity,
                totalPrice,
                createdAt: new Date(),
            });
            // Deduct stock
            await prisma.spare.update({ where: { id: spare.id }, data: { stockQty: { decrement: quantity } } });
            // Update job amount
            await prisma.job.update({ where: { id: job.id }, data: { totalAmount: { increment: totalPrice } } });
        }
    }
    if (spareUsages.length) await prisma.spareUsage.createMany({ data: spareUsages });

    // 5) Payments (for completed jobs)
    for (const job of completedJobs) {
        await prisma.payment.create({
            data: {
                jobId: job.id,
                amount: job.totalAmount,
                paidAt: new Date(),
                method: PAYMENT_METHODS[randomInt(0, PAYMENT_METHODS.length - 1)],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    console.log(`Seed complete. Categories upserted: ${categories.length}. Jobs created: ${allJobs.length}. Spares created: ${allSpares.length}.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('Seed finished successfully');
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        // process.exit(1);
    });