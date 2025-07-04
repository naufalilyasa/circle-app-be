/*
  Warnings:

  - A unique constraint covering the columns `[userId,tweetId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,replyId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "likes_tweetId_replyId_key";

-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ALTER COLUMN "photoProfile" SET DEFAULT 'https://github.com/shadcn.png';

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_tweetId_key" ON "likes"("userId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_replyId_key" ON "likes"("userId", "replyId");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
