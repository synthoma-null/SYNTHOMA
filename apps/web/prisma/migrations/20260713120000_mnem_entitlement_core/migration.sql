-- Extend the existing access and ledger tables. Historical rows are normalized
-- before the new constraints become mandatory.
ALTER TABLE "Entitlement"
  ADD COLUMN "contentType" TEXT,
  ADD COLUMN "contentId" TEXT,
  ADD COLUMN "sourceReference" TEXT,
  ADD COLUMN "metadata" JSONB,
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Entitlement"
SET
  "contentType" = CASE
    WHEN "chapterId" IS NOT NULL THEN 'chapter'
    WHEN "packageId" IS NOT NULL THEN 'package'
    ELSE 'legacy_unknown'
  END,
  "contentId" = COALESCE("chapterId", "packageId", 'legacy:' || "id")
WHERE "contentType" IS NULL OR "contentId" IS NULL;

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (
    PARTITION BY "userId", "contentType", "contentId"
    ORDER BY "createdAt", "id"
  ) AS duplicate_rank
  FROM "Entitlement"
)
DELETE FROM "Entitlement"
WHERE "id" IN (SELECT "id" FROM ranked WHERE duplicate_rank > 1);

ALTER TABLE "Entitlement"
  ALTER COLUMN "contentType" SET NOT NULL,
  ALTER COLUMN "contentId" SET NOT NULL;

CREATE UNIQUE INDEX "Entitlement_userId_contentType_contentId_key"
  ON "Entitlement"("userId", "contentType", "contentId");
CREATE INDEX "Entitlement_userId_contentType_idx"
  ON "Entitlement"("userId", "contentType");

ALTER TABLE "MnemLedger"
  ADD COLUMN "balanceAfter" INTEGER,
  ADD COLUMN "transactionType" TEXT,
  ADD COLUMN "contentType" TEXT,
  ADD COLUMN "contentId" TEXT,
  ADD COLUMN "packageId" TEXT,
  ADD COLUMN "externalReference" TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "actorUserId" TEXT;

WITH running AS (
  SELECT
    "id",
    SUM("amount") OVER (
      PARTITION BY "userId"
      ORDER BY "createdAt", "id"
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )::INTEGER AS balance,
    CASE WHEN "amount" < 0 THEN 'spend' ELSE 'grant' END AS kind
  FROM "MnemLedger"
)
UPDATE "MnemLedger" ledger
SET "balanceAfter" = running.balance,
    "transactionType" = running.kind
FROM running
WHERE ledger."id" = running."id";

ALTER TABLE "MnemLedger"
  ALTER COLUMN "balanceAfter" SET NOT NULL,
  ALTER COLUMN "transactionType" SET NOT NULL;
ALTER TABLE "MnemLedger" ADD CONSTRAINT "MnemLedger_balanceAfter_nonnegative"
  CHECK ("balanceAfter" >= 0) NOT VALID;

CREATE UNIQUE INDEX "MnemLedger_idempotencyKey_key" ON "MnemLedger"("idempotencyKey");
CREATE INDEX "MnemLedger_userId_createdAt_idx" ON "MnemLedger"("userId", "createdAt");
CREATE INDEX "MnemLedger_externalReference_idx" ON "MnemLedger"("externalReference");

CREATE TABLE "Purchase" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "contentId" TEXT NOT NULL,
  "mnemCost" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "entitlementId" TEXT,
  "ledgerEntryId" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "failureCode" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Purchase_idempotencyKey_key" ON "Purchase"("idempotencyKey");
CREATE INDEX "Purchase_userId_createdAt_idx" ON "Purchase"("userId", "createdAt");
CREATE INDEX "Purchase_userId_contentType_contentId_idx"
  ON "Purchase"("userId", "contentType", "contentId");
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_mnemCost_positive" CHECK ("mnemCost" > 0);

ALTER TABLE "AccessCode"
  ALTER COLUMN "packageId" DROP NOT NULL,
  ADD COLUMN "grantType" TEXT NOT NULL DEFAULT 'package',
  ADD COLUMN "contentType" TEXT,
  ADD COLUMN "contentId" TEXT,
  ADD COLUMN "mnemAmount" INTEGER;
CREATE UNIQUE INDEX "AccessCode_stripeSessionId_key" ON "AccessCode"("stripeSessionId");

CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "actorUserId" TEXT NOT NULL,
  "targetUserId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reference" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminAuditLog_reference_key" ON "AdminAuditLog"("reference");
CREATE INDEX "AdminAuditLog_actorUserId_createdAt_idx"
  ON "AdminAuditLog"("actorUserId", "createdAt");
CREATE INDEX "AdminAuditLog_targetUserId_createdAt_idx"
  ON "AdminAuditLog"("targetUserId", "createdAt");

ALTER TABLE "WhisperPurchase" ADD COLUMN "idempotencyKey" TEXT;
UPDATE "WhisperPurchase" SET "idempotencyKey" = 'legacy:whisper:' || "id";
ALTER TABLE "WhisperPurchase" ALTER COLUMN "idempotencyKey" SET NOT NULL;
CREATE UNIQUE INDEX "WhisperPurchase_idempotencyKey_key"
  ON "WhisperPurchase"("idempotencyKey");
