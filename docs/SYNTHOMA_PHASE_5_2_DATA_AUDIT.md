# SYNTHOMA Phase 5.2 Data Audit

Branch: `ui/synthoma-site-rebuild`
Baseline: `be5c9ff docs: update Phase 5.1 manual QA for final build`
Scope: Library and Archive reconstruction preparation

## Git baseline

- `git branch --show-current`: `ui/synthoma-site-rebuild`
- `git status --short`: clean
- `git log --oneline -12`: `be5c9ff` is HEAD
- `git diff --check`: no whitespace errors
- `.next` and `tsconfig.tsbuildinfo` are not tracked

## Route inventory

| Route | Page / layout | Boundary | Main component | Data source |
| --- | --- | --- | --- | --- |
| `/books` | `app/books/page.tsx` | Server (ISR 1h, JSON-LD) | `BooksClient` | `public/books/manifest.json` + `src/content/booksManifest.ts` |
| `/books` | `app/books/layout.tsx` | Server pass-through | — | — |
| `/archive` | `app/archive/page.tsx` | Server (ISR 1h) | `ArchiveClient` | `public/data/archiveCards.json` |
| `/reader` | `app/reader/page.tsx` | Client (`ssr: false`) | `ReaderContent` (dynamic) | `lastChapterPath` / `readerResume` localStorage, `searchParams`, `manifest.json` fetch |
| `/chapter/:id` | `app/chapter/[id]/page.tsx` | Server (SSG params) | redirect | `CHAPTERS` from `booksManifest.ts` |
| `/` | `app/page.tsx` | Server | `SynthomaHome` + `HomePrimaryAction` | `localStorage` resume + `cyklusStorage` active run |

## Library data audit

### Library canonical sources

1. `public/books/manifest.json`
   - `collections[]` with `slug`, `title`, `cover`, `chapters[]`
   - Each chapter has `title`, `path` (e.g. `/books/SYNTHOMA-NULL/0-∞ [RESTART].html`), `free`, `track`, `backgroundVideo`, `chapterOrder`, `summary`, `status`
   - `cover` value: `/books/SYNTHOMA-NULL/SYNTHOMA_cover.png`
   - 1 collection (`SYNTHOMA-NULL`) with 22 chapters (0-∞ to 0-20)

2. `src/content/booksManifest.ts`
   - `CHAPTERS` array with canonical `id`, `title`, `collection`, `filename`, `access` (`free` | `paid`), `mnemCost`, `order`, `packageIds`, `filename_en`, `teaser`, `teaser_en`, `unlocks`, `estimatedMinutes`
   - `PACKAGES` define `act-1` (chapters 0-4 to 0-8) and `archiv-1024` (chapters 0-4 to 0-11)
   - `FRAGMENTS` (paid lore fragments) and `ARTIFACTS` / `MISSIONS` are not part of the book catalogue but are linked to chapters

### Access logic

- `free` in `manifest.json` is overwritten by `BooksPage` using `CHAPTERS.find` by filename: `free = found.access === 'free'`
- `BooksClient` reads `readReadingProgress(col.slug)` per collection from `localStorage`
- For a locked chapter it uses `CHAPTERS.find(c => c.id === ch.id)?.mnemCost` to show a price badge
- Lock modal is triggered by `ChapterLockModal` for paid chapters

### Library storage keys (client)

- `readingProgress:<bookId>` → `ReadingProgressEntry { bookId, path, percent, updatedAt }`
- `lastChapterPath` → string used by Home and Reader
- `readerResume` → `ReaderResume { chapterPath, dataNext?, hash? }`
- `choicesState:<srcUrl>` → `ChoiceGroupState[]`

### Library API dependencies

- `POST /api/me/progress` writes `{ collection, chapterId, chapterTitle, lastBlockId, progressPercent, readMs, completed }`
- `GET /api/me/progress` returns `{ progress: [...] }` for signed-in users
- `GET /api/me/profile` returns `{ user, mnemBalance }` (used by Archive for mnem balance, not by Library)

### Auth / entitlement

- Client-side free/locked derived from `CHAPTERS` table
- No server-side entitlement check in `BooksPage` or `BooksClient`
- `ChapterLockModal` likely handles purchase/unlock flow (not audited in detail)

### Links into Reader

- `BooksPage` noscript uses `/chapter/${ch.id}` if `ch.id` exists, otherwise `/reader?u=${encodeURIComponent(ch.path)}`
- `BooksClient` uses `/chapter/${encodeURIComponent(matchedCh.id)}` or `/reader?u=${encodeURIComponent(p.path)}`
- `HomePrimaryAction` resolves `lastChapterPath` to `/chapter/<id>` (if `/api/chapter/...`) or `/reader?u=...` (if `/books/...`)

### Existing loading / error / empty states

- `BooksPage` server fallback: `manifest = { collections: [] }` on read/parse error
- `BooksClient` empty state: `panel glass` with `t('books.empty')`
- No explicit route-level error boundary
- No skeleton for client-side progress loading

### CSS / styling used

- `app/books/books.module.css` (CSS module)
- Global classes used in `BooksClient`: `glitch-bg`, `library-page`, `lib-bg`, `themed-video`, `lib-bg-vignette`, `library-container`, `glitch-master`, `title`, `panel`, `glass`, `lib-grid`, `lib-section`, `lib-link`, `lib-cover`, `lib-note`, `btn`, `btn-lg`, `btn-sm`, `hero-cta`, `story-block`, `text`, `lib-list`, `lib-badge`, `lib-badge--locked`, `sr-only`

### Legacy selectors / duplicate ownership

- Duplicate `glitch-master` heading implementation (Home/Archive/Auth also use it)
- `panel glass` card pattern conflicts with `SYNTHOMA OS` surface contract
- `lib-bg` background video is separate from `SynthomaMediaLayer`
- `useVideoVisibility` hook used for background video

## Archive data audit

### Archive canonical sources

1. `public/data/archiveCards.json` (and `public/data/archiveCards_en.json` for English)
   - `cards[]` with `id`, `category`, `title`, `teaser`, `quote`, `body[]`, `tags[]`, `spoilerLevel`, `display { icon, accent, variant }`, `related[]`, `images[]`, `access { mode, visibility, requiredChapterId, requiredChapterTitle, mnemCost, label, lockedText, reason }`, `order`, `isLockedByDefault`, `lockKind`

2. `/api/me/progress`
   - Returns `progress` array with `chapterId`, `completed`
   - Used to resolve `requiredChapterId` lock conditions

3. `/api/me/profile`
   - Returns `mnemBalance` and `user` object
   - Used for `mnems` access mode resolution (logic currently incomplete in `resolveCardLock`)

4. `/api/whispers`
   - GET `?placement=archive&sort=<random|resonance|new>&limit=30&type=<...>`
   - Returns public approved whispers with `resonated` flag for signed-in users
   - Archive has a whisper filter/sort UI and a submit form

### Lock resolution

- `ArchiveClient` maps `ArchiveCardData.access.requiredChapterId` through `CHAPTER_ID_MAP` to canonical IDs (`0-inf-restart`, `0-0-null`, ...)
- Modes: `free`, `chapter`, `mnems`, `chapter_or_mnem`
- Visibility: `full`, `teaser`, `hidden`
- Current `mnems` branch logic is effectively a no-op; it returns `acc.visibility` regardless of balance

### Archive storage keys (client)

- Archive does not read localStorage directly except through `useLang`
- No archive-specific localStorage keys

### Data provenance summary

| Data group | Source | Auth required | Persistent |
| --- | --- | --- | --- |
| Authored archive cards | `public/data/archiveCards.json` | No | Build asset |
| English variant | `public/data/archiveCards_en.json` | No | Build asset |
| Reading completion | `GET /api/me/progress` | Yes | Server DB |
| Mnem balance | `GET /api/me/profile` | Yes | Server DB |
| Whispers | `GET /api/whispers` | No for read; yes for submit | Server DB |
| Cyklus findings | `src/game/cyklus/cyklusFindings.ts` | No (local only) | `localStorage` (`synthoma_cyklus_findings`, `synthoma_cyklus_meta_unlocks`) |
| Cyklus run state | `src/game/cyklus/cyklusStorage.ts` | No (local only) | `localStorage` (`synthoma_cyklus_state`) |
| Roguelite run state | `src/game/run/runStorage.ts` | No (local only) | `localStorage` (`synthoma_run_v1`) |

### Personal / sensitive data

- `GET /api/me/profile` returns `user` object including `nickname`, `email`, `role`, `createdAt`, `lastLoginAt`, `profile`, `settings`, `psyche`, and counts of `choices` and `reading`
- `email` and `psyche` should not be rendered in Archive without explicit purpose
- `mnemBalance` is account state, not a memory record

## Library × Archive boundary

### Library answers

- `Co lze číst?` → catalogue of `manifest.json` collections and chapters
- `Kde jsem skončil?` → `readingProgress:<bookId>` / `lastChapterPath`
- `Co je dostupné?` → `CHAPTER.access === 'free'` plus package/unlock entitlement
- `Jaké kapitoly existují?` → `CHAPTERS` + `manifest` chapter list
- `Kam mohu pokračovat?` → resume link to `/chapter/:id` or `/reader?u=...`

### Archive answers

- `Co už mnou prošlo?` → completed chapters from `/api/me/progress`
- `Co jsem dokončil?` → same + `ReadingProgressEntry.percent/completed`
- `Jakou stopu jsem zanechal?` → whispers authored by the user (not currently exposed in Archive UI)
- `Jaké fragmenty systém skutečně uchoval?` → `FRAGMENTS` / `ARTIFACTS` owned/unlocked per user
- `Co se změnilo v mém profilu nebo bězích?` → Cyklus findings, run state, entity relations, profile

### What Library must NOT contain

- Complete game log
- Cyklus imprints / findings
- List of Cyklus runs
- Psychological profile outputs

### What Archive must NOT contain

- Full book catalogue as primary content
- All available chapters (that is Library)
- Marketing copy for books
- Paywall / shop grid

## Shared data layer proposal

### Proposed structure

```text
src/lib/synthoma/library/
  libraryTypes.ts
  getLibraryCatalog.ts
  getReadingProgress.ts
  getResumeTarget.ts
  mapManifestChapter.ts

src/lib/synthoma/archive/
  archiveTypes.ts
  getArchiveSnapshot.ts
  normalizeArchiveEntries.ts
```

### Server/client boundary

- Server: `getLibraryCatalog` reads `manifest.json` and `CHAPTERS` and returns normalized collections with `free`/`paid`/`locked` state
- Server: `getResumeTarget` only reads `localStorage` on the client; server returns `null` fallback
- Client: `useReadingProgress` reads `readingProgress:<bookId>` and merges with server progress on auth
- Client: `useArchiveSnapshot` fetches `/api/me/progress`, `/api/me/profile`, and loads localStorage Cyklus findings

### Storage keys

| Key | Owner | Type | Usage |
| --- | --- | --- | --- |
| `readingProgress:<bookId>` | `src/lib/readerState.ts` | `ReadingProgressEntry` | Library progress, resume |
| `lastChapterPath` | `src/lib/readerState.ts` | `string` | Home resume, Reader redirect |
| `readerResume` | `src/lib/readerState.ts` | `ReaderResume` | Reader state |
| `choicesState:<srcUrl>` | `src/lib/readerState.ts` | `ChoiceGroupState[]` | Reader choice persistence |
| `synthoma_cyklus_findings` | `src/game/cyklus/cyklusFindings.ts` | `EarnedFinding[]` | Archive findings |
| `synthoma_cyklus_meta_unlocks` | `src/game/cyklus/cyklusFindings.ts` | `string[]` | Archive meta unlocks |
| `synthoma_cyklus_state` | `src/game/cyklus/cyklusStorage.ts` | `CyklusRunState` | Active run detection |
| `synthoma_run_v1` | `src/game/run/runStorage.ts` | `StoredRun` | Roguelite run state |

### Shared API dependencies

| Endpoint | Method | Used by | Data |
| --- | --- | --- | --- |
| `/api/me/progress` | GET | Library, Archive | `{ progress: [...] }` |
| `/api/me/progress` | POST | Reader | write progress |
| `/api/me/profile` | GET | Archive | `{ user, mnemBalance }` |
| `/api/whispers` | GET | Archive | public whispers |
| `/api/whispers` | POST | Archive | submit whisper |
| `/api/me/artifacts` | GET | Archive | owned artifacts |
| `/api/me/missions` | GET | Archive | mission statuses |
| `/api/me/run` | GET/PATCH | Run/Archive | active roguelite run |
| `/api/me/cyklus` | GET/PATCH | Cyklus/Archive | active Cyklus run |
| `/api/me/badges` | GET | Archive | subject badges |
| `/api/fragments` | GET | Archive | fragment list |

### Component ownership

| Component | New owner | Notes |
| --- | --- | --- |
| `app/books/page.tsx` | server data loader | `getLibraryCatalog` |
| `app/books/ BooksClient.tsx` | `components/library/SynthomaLibrary.tsx` | remove old CSS module |
| `app/archive/page.tsx` | server data loader | `getArchiveCards` |
| `app/archive/ArchiveClient.tsx` | `components/archive/SynthomaArchive.tsx` | remove old grid |
| `ChapterLockModal` | keep | invoked from Library chapter row |
| `WhisperCard`, `WhisperForm`, `WhisperSubmitPanel` | keep | embedded in Archive whisper channel |

## Performance constraints

- `manifest.json` is ~14 KB; `archiveCards.json` is much larger and contains full body text. Do not load it inside the Library route.
- `CHAPTERS` is a small TS module; it is already imported by `BooksPage`.
- `cyklusFindings.ts` imports `CYKLUS_CARDS` and `content` to evaluate findings. Archive must not import the entire card registry; it should read the lightweight `localStorage` snapshot of `EarnedFinding[]`.
- `runStorage.ts` is small; Archive can use `hasActiveRun()` and `loadRunLocal()` to detect an active roguelite run.
- `cyklusStorage.ts` should be the only owner of active Cyklus detection.

## Accessibility / privacy notes

- Archive must not expose raw `user.email` or `user.psyche` in the UI.
- `mnemBalance` should be shown only in the context of account state, not as an archive memory.
- Locked chapters must not present fake links.
- Resume state must be rendered with a stable placeholder to avoid hydration layout shift.
- LocalStorage values must be validated and ignored if malformed or from a future version.

## Recommended commit 1 scope

- Create this audit document
- Update `docs/SYNTHOMA_INFORMATION_ARCHITECTURE.md`
- Update `docs/SYNTHOMA_LIBRARY_ARCHIVE_REDESIGN.md`
- No production code changes
