/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `GuestList` MODIFY `adultsNo` INTEGER NULL,
    MODIFY `kidsNo` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_username_key` ON `Invitation`(`username`);
