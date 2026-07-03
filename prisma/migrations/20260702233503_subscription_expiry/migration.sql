-- Add subscription expiry; backfill existing rows from createdAt + plan length
ALTER TABLE "Subscription" ADD COLUMN "currentPeriodEnd" TIMESTAMP(3);

UPDATE "Subscription"
SET "currentPeriodEnd" = "createdAt" + INTERVAL '1 year'
WHERE "plan" = 'yearly';

UPDATE "Subscription"
SET "currentPeriodEnd" = "createdAt" + INTERVAL '1 month'
WHERE "currentPeriodEnd" IS NULL;

ALTER TABLE "Subscription" ALTER COLUMN "currentPeriodEnd" SET NOT NULL;
