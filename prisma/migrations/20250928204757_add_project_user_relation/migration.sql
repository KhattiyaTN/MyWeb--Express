/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Contract` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contract` DROP COLUMN `logoUrl`;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `contractId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Image_contractId_key` ON `Image`(`contractId`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
