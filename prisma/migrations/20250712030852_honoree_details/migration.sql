/*
  Warnings:

  - A unique constraint covering the columns `[honoreeCode]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `honoreeCode` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invitation` ADD COLUMN `honoreeCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` CHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_honoreeCode_key` ON `Invitation`(`honoreeCode`);
