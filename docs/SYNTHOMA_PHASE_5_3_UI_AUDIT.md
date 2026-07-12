# SYNTHOMA Phase 5.3 UI Audit

## Branch

- `ui/synthoma-site-rebuild`
- Baseline: Phase 5.2.1 final report

## Header ownership

| Component | Current owner | Current state | Target |
|---|---|---|---|
| `SynthomaShell` | `src/components/synthoma-os/SynthomaShell.tsx` | Wraps layout; bypasses `/cyklus` and `/landing-intro`; renders `SynthomaCommandHeader` and `SynthomaMobileNavigation` | One shell, no route bypass, one header geometry |
| `SynthomaCommandHeader` | `src/components/synthoma-os/SynthomaCommandHeader.tsx` | `quiet` prop only; shows brand, sector, commands | `mode` prop (`site` / `reader` / `cyklus`) plus `status` and `actions` slots |
| `CyklusGameHeader` | `src/components/cyklus/CyklusGameHeader.tsx` | Separate `<header>` with its own icons, geometry and status | Remove or convert to `status` slot used by `SynthomaCommandHeader` |
| `ReaderContent` | `app/reader/ReaderContent.tsx` | No separate header; content uses `ReaderContent.module.css` | Provide `status` slot (chapter title, progress) via shared header |
| `CyklusClient` | `src/components/cyklus/CyklusClient.tsx` | Own header, StatDock, pocket, bottom nav | Use shared header and new pocket dock |
| `CyklusBottomNav` | `src/components/cyklus/CyklusBottomNav.tsx` | Contains pocket trigger, build, archive, void | Remove pocket trigger; keep void/build/archive controls; pocket moved to `CyklusPocketDock` |
| `CyklusPocketPanel` | `src/components/cyklus/CyklusPocketPanel.tsx` | Pocket sheet content | Reused by new `CyklusPocketDock` |

## Route matrix

| Route | Layout | Shell | Header | Mobile nav | Notes |
|---|---|---|---|---|---|
| `/` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Home |
| `/landing-intro` | `app/layout.tsx` | `SynthomaShell` (bypass) | none | none | Intro; keep shell-less |
| `/books` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Library |
| `/archive` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Archive |
| `/reader` | `app/layout.tsx` + `app/reader/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` (quiet) | no | Reader status slot |
| `/chapter/*` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` (quiet) | no | Redirect to reader |
| `/cyklus` | `app/layout.tsx` | `SynthomaShell` (bypass today) | `CyklusGameHeader` | no | Must use `SynthomaCommandHeader` (cyklus) |
| `/cyklus/void` | `app/layout.tsx` | `SynthomaShell` (bypass today) | `CyklusGameHeader`? | no | Void hub |
| `/game` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` (utility) | no | Multiplayer game |
| `/game/room/*` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` (utility) | no | Game room |
| `/admin` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` (utility) | no | Admin |
| `/login` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Auth |
| `/register` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Auth |
| `/privacy` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Legal |
| `/terms` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | Legal |
| `not-found` | `app/layout.tsx` | `SynthomaShell` | `SynthomaCommandHeader` | yes | 404 |

## UI primitive gaps

| Primitive | Status | Location | Action |
|---|---|---|---|
| Button | legacy `cyklus-btn`, `os-command`, `btn`, `panel-button` | `synthoma-os/controls.css` | One `SynthomaButton` root |
| Surface | `os-surface` exists but not used by all | `synthoma-os/surfaces.css` | Audit usage |
| Dialog | `CyklusCardOverlay`, `CyklusBottomSheet`, `ChapterLockModal`, `ArchiveDetailDialog`, `LibraryCoverDialog` | multiple | Share `SynthomaDialog` |
| Tabs | none | — | `SynthomaTabs` |
| Status tag | `cyklus-status`, `os-status__code` | multiple | `SynthomaStatusTag` |
| Progress | `os-progress` | `synthoma-os/controls.css` | `SynthomaProgress` |
| Empty state | `cyklus-empty`, `synthoma-archive__empty` | multiple | `SynthomaEmptyState` |
| Notice | `CycleForecastNotice`, `CycleSummaryNotice` | `cyklus` | `SynthomaNotice` |
| Rail | `cyklus-nav-panel` | `cyklus` | `SynthomaRail` |

## Library issues

1. `SynthomaLibrary` opens `LibraryCoverDialog` on collection click. `onEnter` then sets `selectedSlug`. The collection detail and chapter list are rendered in a separate view. Mobile: there is no explicit mobile state, so the grid may become too narrow or content may overflow.
2. Chapter list uses `Link` for accessible chapters and `button` for locked chapters. `ChapterLockModal` uses `chapterId` and `chapterTitle`. The `chapterId` comes from `LibraryChapter.id`. The `booksManifest.ts` has `id` and `filename`. Need to ensure id vs slug mismatch does not break modal.
3. `LibraryChapterList` path construction: should use canonical `chapterId` when available, otherwise encoded `path`.

## Cyklus geometry issues

1. `CyklusClient` card uses inline `transform` and `clientWidth` threshold; no `ResizeObserver` for available stage height.
2. `cyklus-desktop-top` has `StatDock` and `cyklus-nav-panel` side-by-side on desktop; on small viewports it may collapse or overlap.
3. Pocket toggle is in `cyklus-pocket--standalone` inside `cyklus-root` and also in `CyklusBottomNav`. Two pocket triggers. Need one `CyklusPocketDock` below `StatDock`.

## Wordmark usage

- `SynthomaWordmark` exists in `src/components/synthoma/SynthomaWordmark.tsx`.
- Used in `app/landing-intro/page.tsx` and `src/components/home/SynthomaHome.tsx`.
- `CyklusClient` menu uses `cyklus-menu__brand` and manual `SYNTHOMA` text. Must switch to `SynthomaWordmark`.

## Next steps

1. Unify header contract with `HeaderContext` and `mode` prop.
2. Remove `/cyklus` bypass from `SynthomaShell`.
3. Convert `CyklusGameHeader` to `status` slot.
4. Reader `status` slot.
5. Rebuild Cyklus menu with `SynthomaWordmark` and shared surfaces.
6. Fix Library mobile navigation.
7. Responsive Cyklus card stage.
8. Move pocket to `CyklusPocketDock`.
9. Migrate remaining surfaces.
10. Tests and QA.
