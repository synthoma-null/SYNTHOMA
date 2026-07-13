CREATE TABLE "ExternalGrantEvent" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "externalReference" TEXT NOT NULL,
  "userId" TEXT,
  "contentType" TEXT,
  "contentId" TEXT,
  "packageId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'processing',
  "errorCode" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "ExternalGrantEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExternalGrantEvent_provider_eventId_key"
  ON "ExternalGrantEvent"("provider", "eventId");
CREATE UNIQUE INDEX "ExternalGrantEvent_provider_externalReference_key"
  ON "ExternalGrantEvent"("provider", "externalReference");
CREATE INDEX "ExternalGrantEvent_userId_createdAt_idx"
  ON "ExternalGrantEvent"("userId", "createdAt");
CREATE INDEX "ExternalGrantEvent_status_createdAt_idx"
  ON "ExternalGrantEvent"("status", "createdAt");
