/*
  Warnings:

  - You are about to drop the `_UserTweetReplies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserTweetReplies" DROP CONSTRAINT "_UserTweetReplies_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTweetReplies" DROP CONSTRAINT "_UserTweetReplies_B_fkey";

-- DropTable
DROP TABLE "_UserTweetReplies";

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
