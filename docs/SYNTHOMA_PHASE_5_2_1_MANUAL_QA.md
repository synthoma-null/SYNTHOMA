# Phase 5.2.1 Manual QA

## Environment

- Node 20+, pnpm
- `apps/web` workspace
- `npx tsc --noEmit` and `npx jest --no-coverage`
- Viewports: desktop 1920×1080, tablet 768×1024, mobile 390×844

## Global checks

- [ ] Application builds (`npx tsc --noEmit` 0 errors)
- [ ] Full test suite passes (`npx jest --no-coverage` 0 failures)
- [ ] No runtime `console.error` on startup
- [ ] One `SynthomaShell`, one `SynthomaPortalRoot`, one `SynthomaAudioPanel` in `app/layout.tsx`
- [ ] Single shared audio element and portal root

## Wordmark / Intro / Home

- [ ] Intro renders `SYNTHOMA` wordmark with glitch layers
- [ ] Intro sentence matches exactly: "Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu."
- [ ] Reduced motion suppresses wordmark animation and typewriter
- [ ] Home renders `SYNTHOMA` wordmark with `context="home"` size
- [ ] Wordmark is readable at all breakpoints and themes
- [ ] `sr-only` text is present for screen readers
- [ ] `SynthomaWordmark` tests pass

## Shell coverage

- [ ] `/` shows full header + mobile navigation
- [ ] `/books`, `/archive`, `/login`, `/register`, `/privacy`, `/terms` show full header
- [ ] `/reader` shows quiet header (no sectors)
- [ ] `/chapter/...` shows quiet header
- [ ] `/landing-intro` has no global header
- [ ] `/cyklus` and `/cyklus/void` have no duplicate global header
- [ ] `/admin` and `/game` show utility header (no mobile nav)
- [ ] `not-found` provides recovery navigation
- [ ] `SynthomaShell` route contract tests pass

## Library

- [ ] Library shows collection cards with covers
- [ ] Collection cards open `LibraryCoverDialog` on click
- [ ] Cover dialog has ambient cover background, title, chapter count, chapter list
- [ ] "VSTOUPIT DO SBÍRKY" transitions to chapter list
- [ ] Dialog closes on close button, overlay click, Escape
- [ ] Library detail view still shows chapters and lock modal
- [ ] Responsive layout works on mobile

## Archive

- [ ] Archive records render as cards
- [ ] Unlocked cards open `ArchiveDetailDialog` on click
- [ ] Locked cards show locked UI and cannot open
- [ ] Detail dialog shows title, category, quote, body, tags
- [ ] Related records are listed when `related` is defined
- [ ] Dialog closes on close button, overlay click, Escape
- [ ] Responsive layout works on mobile

## Regression

- [ ] No changes to Reader, Cyklus engine, or game logic
- [ ] No partial restoration of original wordmark text or sentence
- [ ] Phase 5.3 features not introduced

## Release blockers

- [ ] Any failing test or type error
- [ ] Shell missing on a non-intro/cyklus route
- [ ] Wordmark not visible or not accessible
- [ ] Dialog cannot be closed or traps focus
