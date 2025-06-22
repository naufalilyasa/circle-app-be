-- AlterTable
ALTER TABLE "users" ALTER COLUMN "passwordResetAt" DROP NOT NULL,
ALTER COLUMN "passwordResetToken" DROP NOT NULL;
