# Library and Archive Redesign Preparation

This document defines Phase 5.2 without changing current Library or Archive content in Phase 5.1.

## Existing data

### Library

Real sources:

- `public/books/manifest.json`: collections, covers, chapters, paths, background media and optional track metadata.
- `src/content/booksManifest.ts`: canonical chapter IDs, filenames, access and metadata.
- `readerState.ts`: last chapter path and per-book reading percentage.
- `/api/me/progress`: authenticated completion/progress.
- Existing free/locked access data; no invented recommendation engine.

### Archive

Real sources:

- `public/data/archiveCards.json` and English variant: authored lore cards.
- `/api/me/progress`: reading completion.
- `/api/me/profile`: subject/profile progress.
- `/api/whispers`: public memory fragments.
- Cyklus local/server state: run history, discoveries, findings, imprints and unlocks, currently exposed through Cyklus/Profile surfaces.

These sources have different provenance. They may be cross-linked but must not be flattened into one unexplained card list.

## Library target hierarchy

1. `LIBRARY // AVAILABLE MEMORY` heading and collection count.
2. One dominant resume action when real reading state exists.
3. Collection rail with cover, title, availability and collection progress.
4. Chapter table/list with chapter index, title, access, completion and direct action.
5. Filters based only on real fields: available/locked/completed and collection.

### Collection presentation

- Cover remains inspectable and uses stable aspect ratio.
- State line shows real available/total chapters.
- Progress uses stored/server progress, never a fabricated percentage.
- Last-read chapter is marked and becomes the primary action.
- Locked chapters expose the existing access explanation rather than a disabled mystery button.

### Mobile form

- Cover and collection summary form an unframed header band.
- Chapter rows are full-width, minimum 44px and may wrap.
- Filters are a compact menu or segmented control, not a horizontal overflow rail.
- Fixed shell navigation reserves safe-area space.

## Archive target hierarchy

Archive answers “what has this subject left behind?”

1. `SUBJECT MEMORY` overview: real counts by source.
2. Reading history: completed/current chapters.
3. Recovered records: authored archive cards and fragments.
4. Cyklus records: run summaries and discovered findings.
5. Imprints/artifacts: only when the corresponding data exists.
6. Whispers: clearly marked public/external memory channel.

### What may combine

- A chapter completion may link to related authored archive records.
- A Cyklus finding may link to its known entity/sector record.
- Subject overview may aggregate counts while keeping source labels.

### What remains separate

- Book availability is not subject memory.
- Public whispers are not private reading history.
- Cyklus imprints are not authored lore cards.
- MNEM access/economy is account state, not an archive finding.

## Component proposal

```text
library/
  SynthomaLibrary.tsx
  LibraryResume.tsx
  CollectionHeader.tsx
  ChapterIndex.tsx
  LibraryFilters.tsx

archive/
  SynthomaArchive.tsx
  ArchiveSourceRail.tsx
  ReadingMemory.tsx
  RecoveredRecords.tsx
  CyklusMemory.tsx
  WhisperChannel.tsx
```

Server components load manifests/static cards. Client islands own filters, local resume and authenticated refreshes. Full manifests are not duplicated into unrelated client routes.

## Reader follow-up

Reader Phase 5.2/5.3 work should:

- move the route shell back to a server-visible content frame where possible;
- retain trusted chapter sanitizer contracts and `/styles.css` compatibility;
- converge three loading states into one reader skeleton;
- enforce 16px mobile and 17-19px desktop body text with readable line length;
- preserve chapter background selection, audio continuity, scroll restore and deep links;
- give previous/next chapter and chapter menu stable keyboard/focus behavior;
- verify reduced motion for typewriter and authored effect classes;
- retain safe-area and browser zoom.

No chapter prose, choice order or canonical character text is rewritten by this redesign.
