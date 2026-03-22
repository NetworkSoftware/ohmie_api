/*
  Warnings:

  - Added the required column `experience` to the `Technician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Job_categoryId_fkey` ON `job`;

-- DropIndex
DROP INDEX `Job_technicianId_fkey` ON `job`;

-- DropIndex
DROP INDEX `Payment_jobId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `SpareStockLog_spareId_fkey` ON `sparestocklog`;

-- DropIndex
DROP INDEX `SpareUsage_jobId_fkey` ON `spareusage`;

-- DropIndex
DROP INDEX `SpareUsage_spareId_fkey` ON `spareusage`;

-- DropIndex
DROP INDEX `TechnicianCategory_categoryId_fkey` ON `techniciancategory`;

-- AlterTable
ALTER TABLE `technician` ADD COLUMN `experience` INTEGER NOT NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicianCategory` ADD CONSTRAINT `TechnicianCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Technician`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpareUsage` ADD CONSTRAINT `SpareUsage_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpareUsage` ADD CONSTRAINT `SpareUsage_spareId_fkey` FOREIGN KEY (`spareId`) REFERENCES `Spare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpareStockLog` ADD CONSTRAINT `SpareStockLog_spareId_fkey` FOREIGN KEY (`spareId`) REFERENCES `Spare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
