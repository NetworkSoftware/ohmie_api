-- DropIndex
DROP INDEX `Job_categoryId_fkey` ON `job`;

-- DropIndex
DROP INDEX `Job_technicianId_fkey` ON `job`;

-- DropIndex
DROP INDEX `TechnicianCategory_categoryId_fkey` ON `techniciancategory`;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `commission` DOUBLE NOT NULL,
    `platformEarnings` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
