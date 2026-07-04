-- CreateTable
CREATE TABLE "CyklusRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stateJson" JSONB NOT NULL,
    "historyJson" JSONB NOT NULL DEFAULT '[]',
    "discoveryJson" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CyklusRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CyklusRun_userId_key" ON "CyklusRun"("userId");

-- CreateIndex
CREATE INDEX "CyklusRun_userId_idx" ON "CyklusRun"("userId");

-- AddForeignKey
ALTER TABLE "CyklusRun" ADD CONSTRAINT "CyklusRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
