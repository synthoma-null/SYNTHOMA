-- Align the deployed CyklusRun table with the existing Prisma model.
-- The default keeps this additive migration compatible with existing rows and old application builds.
ALTER TABLE "CyklusRun"
  ADD COLUMN IF NOT EXISTS "progressionJson" JSONB NOT NULL DEFAULT '{}'::JSONB;
