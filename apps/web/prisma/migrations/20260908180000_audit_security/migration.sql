BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;
CREATE TABLE "PasswordResetToken" (
  "tokenHash" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
CREATE TABLE "SecurityRateLimit" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 1,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "SecurityRateLimit_expiresAt_idx" ON "SecurityRateLimit"("expiresAt");
CREATE TABLE "CheckoutOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "packageId" TEXT,
  "chapterId" TEXT,
  "name" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'czk',
  "packageMnems" INTEGER,
  "stripeSessionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "CheckoutOrder_stripeSessionId_key" ON "CheckoutOrder"("stripeSessionId");
CREATE INDEX "CheckoutOrder_userId_idx" ON "CheckoutOrder"("userId");
COMMIT;
