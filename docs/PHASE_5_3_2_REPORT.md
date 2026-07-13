# SYNTHOMA PHASE 5.3.2 — Final Report

## Branch
`ui/synthoma-site-rebuild`

## Objectives
- Refactor Archive UI for fully interactive, accessible, visually distinct cards.
- Rebuild Library as catalogue book cards with a clear detail flow.
- Fix chapter description typography and make chapters clickable.
- Enhance Home Cyklus sector with featured description and state CTA.

## Changes

### 1. Archive Cards
- **Created** `src/components/archive/ArchiveRecordCard.tsx`
  - Renders a single archive card.
  - `full` / `teaser` cards are `<button>` with `aria-haspopup="dialog"`, `aria-expanded`, `aria-label`.
  - `hidden` cards render as non-interactive `<article>` with `archive-record-card--locked`.
  - Supports card accent colour via CSS custom property `--card-accent`.
- **Updated** `src/components/archive/ArchiveDetailDialog.tsx`
  - Replaced `isLocked: boolean` with `mode: ArchiveCardVisibility`.
  - Derives `isLocked` and `isFull` from `mode`.
  - Returns `null` early for `hidden` mode after `useEffect` hooks.
- **Updated** `src/components/archive/SynthomaArchive.tsx`
  - Replaced inline card markup with `ArchiveRecordCard`.
  - Renamed `visibleCards` to `displayCards` so locked/hidden records are displayed as locked cards.
  - Uses `<ul>` / `<li>` for the record list and passes `mode` to `ArchiveDetailDialog`.
- **Updated** `src/styles/library-archive.css`
  - Added hover/focus/locked styles for `archive-record-card`.
  - Added reduced-motion support.

### 2. Library
- **Created** `src/components/library/LibraryBookCard.tsx`
  - Button-root catalogue card with cover, title, description, chapter count, progress status, and CTA (`OTEVŘÍT` / `POKRAČOVAT`).
- **Created** `src/components/library/LibraryCollectionGrid.tsx`
  - `role="list"` grid of `LibraryBookCard` components.
- **Updated** `src/components/library/SynthomaLibrary.tsx`
  - Uses `LibraryCollectionGrid` for the catalog.
  - Book cards click into a detail view with header + chapter list.
  - Cover preview dialog opens from the detail header.
  - `onEnter` is omitted from the cover dialog when already in detail.
- **Updated** `src/components/library/LibraryCollectionHeader.tsx`
  - Added optional `onCoverClick` so the cover can open the preview dialog.
- **Updated** `src/components/library/LibraryCoverDialog.tsx`
  - `onEnter` is now optional and the enter button only renders when the handler is provided.
- **Updated** `src/components/library/LibraryChapterList.tsx`
  - Free chapters are `<Link>` with `encodeURIComponent` ids.
  - Locked/paid chapters are `<button>` with `onLockedClick`.
  - Chapter summaries render inside every row and are clickable for free chapters.
- **Updated** `src/lib/synthoma/library/libraryTypes.ts` and `src/lib/synthoma/library/getLibraryCatalog.ts`
  - Added optional `description` to `LibraryCollection` and `RawCollection`.
- **Updated** `src/styles/library-archive.css`
  - Added `library-collection-grid`, `library-book-card`, and improved `library-chapter-list` layout and summary typography.

### 3. Home Cyklus Sector
- **Updated** `src/components/home/HomeSectorLinks.tsx`
  - Converted to client component; reads active Cyklus run state via `hasActiveCyklusRun`.
  - Cyklus sector is `home-sector-link--featured` and shows a description + CTA (`SPOUSTIT` / `POKRAČOVAT`).
- **Updated** `src/styles/synthoma-os/home.css`
  - Added `home-sector-link--featured` styles: accent border-left, tinted gradient, accent marker.

### 4. Tests
- **Archive:** `src/components/archive/__tests__/ArchiveRecordCard.test.tsx`, updated `ArchiveDetailDialog.test.tsx`.
- **Library:** `src/components/library/__tests__/LibraryBookCard.test.tsx`, `src/components/library/__tests__/LibraryChapterList.test.tsx`, existing `LibraryCoverDialog.test.tsx`.
- **Home:** `src/components/home/__tests__/HomeSectorLinks.test.tsx`.

## Verification
- `npx tsc -p tsconfig.json --noEmit` — 0 errors.
- `npx jest --no-coverage` — 46 test suites, **494 passed**, 15 skipped.
- `npm run build` — completed successfully, static and SSG routes generated.

## Commits
- `78e76c6` feat: make available Archive cards fully interactive
- `249ae49` feat: rebuild Library as catalogue book cards with detail flow
- `b773241` feat: feature Cyklus home sector with state CTA and styling

## Notes
- `apps/web/tsconfig.tsbuildinfo` was intentionally not staged or committed.
- No book/chapter content, access rules, Reader or engine logic were changed.
