/*
  Warnings:

  - A unique constraint covering the columns `[email,verificationCode,username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_verificationCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_verificationCode_username_key" ON "users"("email", "verificationCode", "username");
