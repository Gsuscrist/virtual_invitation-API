/*
  Warnings:

  - You are about to drop the column `honereeName` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `honoreeName` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invitation` DROP COLUMN `honereeName`,
    ADD COLUMN `honoreeName` VARCHAR(191) NOT NULL;
