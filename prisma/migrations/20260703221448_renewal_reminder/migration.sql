-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "locale" TEXT,
ADD COLUMN     "renewalRemindedAt" TIMESTAMP(3);
