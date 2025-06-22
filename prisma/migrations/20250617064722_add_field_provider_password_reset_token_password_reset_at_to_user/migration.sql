/*
  Warnings:

  - A unique constraint covering the columns `[email,verificationCode,username,passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordResetAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordResetToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_verificationCode_idx";

-- DropIndex
DROP INDEX "users_email_verificationCode_username_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordResetAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "passwordResetToken" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT;

-- CreateIndex
CREATE INDEX "users_email_verificationCode_username_passwordResetToken_idx" ON "users"("email", "verificationCode", "username", "passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_verificationCode_username_passwordResetToken_key" ON "users"("email", "verificationCode", "username", "passwordResetToken");
