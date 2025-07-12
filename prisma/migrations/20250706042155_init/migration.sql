-- CreateTable
CREATE TABLE `Invitation` (
    `uuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `honereeName` VARCHAR(191) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `eventType` ENUM('BIRTHDAY', 'BAPTISM', 'WEDDING', 'COMMUNION', 'ANNIVERSARY', 'GRADUATION', 'ENGAGEMENT', 'BACHELOR', 'BABYSHOWER', 'CORPORATE', 'WORKSHOP', 'GENDERREVEAL', 'XV', 'OTHER') NOT NULL,
    `confirmationDeadline` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuestList` (
    `uuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `invitation_qty` INTEGER NOT NULL,
    `hasKids` BOOLEAN NOT NULL,
    `adultsNo` INTEGER NOT NULL,
    `kidsNo` INTEGER NOT NULL,
    `phoneNumber` CHAR(10) NOT NULL,
    `hasConfirmed` BOOLEAN NOT NULL,
    `invitationId` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuestList` ADD CONSTRAINT `GuestList_invitationId_fkey` FOREIGN KEY (`invitationId`) REFERENCES `Invitation`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
