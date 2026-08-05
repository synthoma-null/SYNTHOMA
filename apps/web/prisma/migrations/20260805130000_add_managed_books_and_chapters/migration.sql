-- Spravovaná vrstva obsahu umožňuje měnit viditelnost, přístup a metadata
-- verzovaných knih a zároveň přidávat nové knihy a kapitoly z administrace.
CREATE TABLE "ManagedBook" (
  "id" TEXT NOT NULL,
  "isCustom" BOOLEAN NOT NULL DEFAULT false,
  "title" TEXT,
  "shortTitle" TEXT,
  "description" TEXT,
  "cover" TEXT,
  "language" TEXT,
  "sortOrder" INTEGER,
  "status" TEXT,
  "visibility" TEXT NOT NULL DEFAULT 'published',
  "accessPolicy" TEXT NOT NULL DEFAULT 'inherit',
  "createdById" TEXT NOT NULL,
  "updatedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ManagedBook_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ManagedChapter" (
  "id" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "isCustom" BOOLEAN NOT NULL DEFAULT false,
  "title" TEXT,
  "titleEn" TEXT,
  "ordinal" TEXT,
  "summary" TEXT,
  "sortOrder" INTEGER,
  "visibility" TEXT NOT NULL DEFAULT 'published',
  "accessPolicy" TEXT NOT NULL DEFAULT 'inherit',
  "mnemCost" INTEGER,
  "bodyHtml" TEXT,
  "bodyHtmlEn" TEXT,
  "createdById" TEXT NOT NULL,
  "updatedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ManagedChapter_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ManagedBook_visibility_sortOrder_idx"
  ON "ManagedBook"("visibility", "sortOrder");

CREATE INDEX "ManagedChapter_bookId_visibility_sortOrder_idx"
  ON "ManagedChapter"("bookId", "visibility", "sortOrder");
