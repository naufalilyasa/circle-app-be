-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_replyId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_tweetId_fkey";

-- DropIndex
DROP INDEX "likes_replyId_key";

-- DropIndex
DROP INDEX "likes_tweetId_key";

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "tweetId" DROP NOT NULL,
ALTER COLUMN "replyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "tweets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
