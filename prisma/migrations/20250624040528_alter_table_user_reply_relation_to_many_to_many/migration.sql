-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_authorId_fkey";

-- CreateTable
CREATE TABLE "_UserTweetReplies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserTweetReplies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserTweetReplies_B_index" ON "_UserTweetReplies"("B");

-- AddForeignKey
ALTER TABLE "_UserTweetReplies" ADD CONSTRAINT "_UserTweetReplies_A_fkey" FOREIGN KEY ("A") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTweetReplies" ADD CONSTRAINT "_UserTweetReplies_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
