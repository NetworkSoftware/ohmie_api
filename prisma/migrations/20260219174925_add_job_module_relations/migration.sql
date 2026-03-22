-- DropIndex
DROP INDEX `TechnicianCategory_categoryId_fkey` ON `techniciancategory`;

-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobCode` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `technicianId` INTEGER NULL,
    `status` ENUM('CREATED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_APPROVAL', 'COMPLETED', 'CLOSED') NOT NULL DEFAULT 'CREATED',
    `scheduleTime` DATETIME(3) NOT NULL,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `technicianShare` DOUBLE NOT NULL DEFAULT 0,
    `companyShare` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Job_jobCode_key`(`jobCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
