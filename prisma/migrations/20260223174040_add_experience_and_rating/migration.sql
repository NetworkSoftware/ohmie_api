/*
  Warnings:

  - You are about to drop the column `commission` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `platformEarnings` on the `payment` table. All the data in the column will be lost.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Job_categoryId_fkey` ON `job`;

-- DropIndex
DROP INDEX `Job_technicianId_fkey` ON `job`;

-- DropIndex
DROP INDEX `Payment_jobId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `TechnicianCategory_categoryId_fkey` ON `techniciancategory`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `commission`,
    DROP COLUMN `platformEarnings`,
    ADD COLUMN `method` VARCHAR(191) NOT NULL,
    ADD COLUMN `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Spare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `costPrice` DOUBLE NOT NULL,
    `sellingPrice` DOUBLE NOT NULL,
    `stockQty` INTEGER NOT NULL DEFAULT 0,
    `minStock` INTEGER NOT NULL DEFAULT 5,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Spare_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpareUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` INTEGER NOT NULL,
    `spareId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpareStockLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `spareId` INTEGER NOT NULL,
    `changeQty` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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

-- AddForeignKey
ALTER TABLE `SpareUsage` ADD CONSTRAINT `SpareUsage_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpareUsage` ADD CONSTRAINT `SpareUsage_spareId_fkey` FOREIGN KEY (`spareId`) REFERENCES `Spare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpareStockLog` ADD CONSTRAINT `SpareStockLog_spareId_fkey` FOREIGN KEY (`spareId`) REFERENCES `Spare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
