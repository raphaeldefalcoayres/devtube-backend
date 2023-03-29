-- CreateTable
CREATE TABLE `videos` (
    `id` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `channelTitle` VARCHAR(191) NOT NULL,
    `channelLogo` VARCHAR(191) NOT NULL,
    `publishTime` DATETIME(3) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `duration` DOUBLE NOT NULL,
    `viewCount` INTEGER NOT NULL,
    `likeCount` INTEGER NOT NULL,
    `commentCount` INTEGER NULL,
    `favoriteCount` INTEGER NULL,
    `positiveVotes` INTEGER NOT NULL,
    `negativeVotes` INTEGER NOT NULL,
    `relevance` INTEGER NOT NULL,
    `tags` TEXT NULL,
    `topics` TEXT NULL,
    `segment` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `videos_videoId_key`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channels` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `customUrl` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `defaultThumbnailUrl` VARCHAR(191) NOT NULL,
    `defaultThumbnailWidth` INTEGER NOT NULL,
    `defaultThumbnailHeight` INTEGER NOT NULL,
    `mediumThumbnailUrl` VARCHAR(191) NOT NULL,
    `mediumThumbnailWidth` INTEGER NOT NULL,
    `mediumThumbnailHeight` INTEGER NOT NULL,
    `highThumbnailUrl` VARCHAR(191) NOT NULL,
    `highThumbnailWidth` INTEGER NOT NULL,
    `highThumbnailHeight` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
