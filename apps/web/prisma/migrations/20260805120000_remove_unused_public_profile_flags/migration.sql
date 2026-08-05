-- Veřejná profilová stránka nebyla implementována. Odstraňujeme proto
-- přepínače, které uživateli slibovaly neexistující funkci.
ALTER TABLE "UserProfile"
  DROP COLUMN IF EXISTS "publicProfile",
  DROP COLUMN IF EXISTS "showPsycheMap",
  DROP COLUMN IF EXISTS "showProgress",
  DROP COLUMN IF EXISTS "showChoices";
