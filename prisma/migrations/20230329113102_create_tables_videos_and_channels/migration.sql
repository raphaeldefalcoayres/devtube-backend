-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channelId" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "channelLogo" TEXT NOT NULL,
    "publishTime" DATETIME NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "likeCount" INTEGER NOT NULL,
    "commentCount" INTEGER,
    "favoriteCount" INTEGER,
    "positiveVotes" INTEGER NOT NULL,
    "negativeVotes" INTEGER NOT NULL,
    "relevance" INTEGER NOT NULL,
    "tags" TEXT NOT NULL,
    "topics" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "videos_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "customUrl" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "defaultThumbnailUrl" TEXT NOT NULL,
    "defaultThumbnailWidth" INTEGER NOT NULL,
    "defaultThumbnailHeight" INTEGER NOT NULL,
    "mediumThumbnailUrl" TEXT NOT NULL,
    "mediumThumbnailWidth" INTEGER NOT NULL,
    "mediumThumbnailHeight" INTEGER NOT NULL,
    "highThumbnailUrl" TEXT NOT NULL,
    "highThumbnailWidth" INTEGER NOT NULL,
    "highThumbnailHeight" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_videoId_key" ON "videos"("videoId");
