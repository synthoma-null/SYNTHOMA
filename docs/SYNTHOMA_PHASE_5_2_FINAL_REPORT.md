# Phase 5.2 — Library & Archive Redesign Final Report

## Objective

Rebuild the **Library** (`/books`) and **Archive** (`/archive`) sectors of SYNTHOMA OS with a clear boundary, a shared data layer, and new presentation components, while preserving all existing content, choices, and visual effects.

## What was changed

### 1. Audit & boundary

- `docs/SYNTHOMA_PHASE_5_2_DATA_AUDIT.md` — route inventory, data provenance, storage keys, API dependencies, component ownership, boundary rules between Library and Archive, and a list of forbidden side-effects.
- Boundary rule: **Library owns readable chapters; Archive owns lore, Cyklus findings, and whispers**. Neither sector imports the other's data.

### 2. Shared data layer

New files under `src/lib/synthoma/`:

- `library/libraryTypes.ts` — `LibraryChapter`, `LibraryCollection`, `LibraryCatalog`, `LibraryReadingProgress`.
- `library/getLibraryCatalog.ts` — server-side loader for `public/books/manifest.json` + `booksManifest.ts`.
- `library/getResumeTarget.ts` — resolves the last-read chapter.
- `library/useLibraryProgress.ts` — client hook combining localStorage and `/api/me/progress`.
- `archive/archiveTypes.ts` — `ArchiveCard`, `ArchiveCardAccess`, `ArchiveSnapshot`, `ArchiveWhisper`.
- `archive/normalizeArchiveEntries.ts` — normalizes `archiveCards.json` into typed `ArchiveCard[]`.
- `archive/resolveArchiveLock.ts` — pure visibility resolver for chapter/mnem access.
- `archive/useArchiveSnapshot.ts` — client hook consolidating progress, profile, whispers, Cyklus, and run data.

### 3. Library rebuild

- `src/components/library/SynthomaLibrary.tsx` — new main component: collection grid, resume banner, collection detail, chapter list, lock modal.
- `src/components/library/LibraryResume.tsx` — resume banner.
- `src/components/library/LibraryCollectionHeader.tsx` — collection header with back action.
- `src/components/library/LibraryChapterList.tsx` — chapter rows with progress and lock states.
- `app/books/page.tsx` — now a server component that loads `LibraryCatalog` and renders `SynthomaLibrary` with JSON-LD.

### 4. Archive rebuild

- `src/components/archive/SynthomaArchive.tsx` — new main component: reading memory, recovered records grid, Cyklus memory, whisper channel with filters/sort.
- `app/archive/page.tsx` — now server-normalizes `archiveCards.json` and renders `SynthomaArchive`.

### 5. Styling

- `src/styles/library-archive.css` — shared global styles for both sectors using existing OS tokens (`--os-*`, `os-surface`, `os-command`, etc.).

### 6. Tests

- `src/lib/synthoma/library/__tests__/getLibraryCatalog.test.ts` — 4 tests.
- `src/lib/synthoma/archive/__tests__/resolveArchiveLock.test.ts` — 5 tests.
- `src/lib/synthoma/archive/__tests__/normalizeArchiveEntries.test.ts` — 2 tests.

Total: **11 new tests, all passing**.

## Verification

```bash
npx tsc --noEmit --pretty false
# exit code 0

npx jest --testPathPatterns='src/lib/synthoma' --no-coverage
# Test Suites: 3 passed, 3 total
# Tests:       11 passed, 11 total
```

## Notes

- `BooksClient.tsx` and `books.module.css` remain in the repository but are no longer used by `app/books/page.tsx`.
- `ArchiveClient.tsx` remains in the repository but is no longer used by `app/archive/page.tsx`.
- `tsconfig.tsbuildinfo` was reset and not committed.
- No narrative content was changed; chapter 0-∞ [RESTART] was not shortened.

## Commits

- `docs: add SYNTHOMA Phase 5.2 data audit and final report`
- `feat: shared data layer for Library and Archive`
- `feat: rebuild Library and Archive UI components and pages`
- `test: add Phase 5.2 unit tests`
