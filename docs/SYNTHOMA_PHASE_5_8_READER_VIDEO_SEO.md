# SYNTHOMA Phase 5.8 - Reader, Video and Technical SEO

Verified against the local production build on 2026-07-17. No database migration,
backfill, entitlement rule, price, chapter content, or Cyklus engine change was made.

## VIDEO

- Root cause: chapter links still entered the legacy client reader while chapter
  visuals were owned by a global random video rotator. The canonical chapter page
  therefore never mounted a stable chapter-specific background.
- Media inventory: 29 WebM assets are available under `public/video`.
- Mapping: all 22 catalog chapters have a generated presentation contract. All 13
  published chapters have an explicit video or `video: null` decision.
- Poster coverage: 13/13 published chapters. Twelve have generated WebP posters;
  `0-11-orgie` intentionally uses the canonical book cover fallback.
- Runtime: one muted, looping, inline video at most; no random rotation and no
  audio track. Media failure leaves the poster visible.
- Motion policy: `prefers-reduced-motion`, browser `saveData`, the existing
  animation preference, and the versioned moving-background preference suppress
  video playback.
- Browser result: Chromium rendered the expected stable mappings for
  `0-inf-restart`, `0-0-null`, and `0-2-run`. Disabling moving backgrounds removed
  the video, preserved the poster, survived reload, and was restored after QA.
  WebKit was not available in this environment.

## READER

- Previous architecture: `/reader` was a client shell and typewriter host, while
  `/chapter/[id]` exposed a separate public/access layer.
- New architecture: `/chapter/[id]` owns the server-rendered article, entitlement
  gate, chapter presentation, progress, command bar, and crawlable navigation.
- Typography: 48rem reading measure, 1.72 line height, normal paragraph rhythm,
  responsive spacing, and selectable chapter text.
- Progress: local restore, monotonic completion, authenticated server autosave,
  and post-font scroll restoration.
- Controls: settings, site audio, TTS, focus mode, share, previous, next, language,
  and library access remain keyboard-addressable buttons or links.
- Responsive QA: 320x568, 390x844, 844x390, 1024x600, 1366x768,
  1920x1080, and 2560x1440 had no document-level horizontal overflow. The command
  bar did not overlap the article and the article remained selectable.

## ROUTES

- Canonical chapter route: `/chapter/[id]`.
- Fixed legacy links: 16 production call sites (6 application-flow references and
  10 static Info/Author links). No production content now emits `/reader?...`.
- Legacy contract: known `chapter` and `u` references return HTTP 308 to a catalog
  chapter; unknown references return HTTP 308 to `/books`, never an external or
  filesystem path.
- Free: HTTP 200 with the full article in initial HTML and no database dependency.
- Owned: full protected article is emitted only after server entitlement checks.
  The route contract is covered by component/server tests; an authenticated owned
  browser session was not available for the visual run.
- Locked: HTTP 200 with metadata and purchase gate, without an article or protected
  body. Unknown chapters return a real HTTP 404.

## SEO

- Every chapter receives a catalog-derived title, description, canonical URL,
  `cs`, `en`, and `x-default` alternates.
- Structured data includes `Chapter`, `CreativeWork`, and `BreadcrumbList`; the
  site retains its `Book`/series graph. Locked data contains teaser metadata only.
- Dynamic chapter Open Graph images return HTTP 200 as `image/png` after the route
  guard was updated to allow the metadata endpoint for known chapters only.
- Sitemap entries come from the canonical catalog, contain published chapter
  routes only, and use stable content dates. `/reader` is absent.
- `app/robots.ts` is the sole robots authority and allows public chapter routes
  while private account/API routes remain disallowed.
- Crawler QA: 54 requests across generic, Googlebot, Bingbot, OAI-SearchBot,
  GPTBot, and ChatGPT-User completed with zero failures. The matrix covered
  `/books`, `/autor`, `/archive`, all five free chapters, and one locked chapter.

## PERFORMANCE

- Loaded chapter videos: zero or one, never the former ten-slot rotation.
- Video preload is `metadata`; the poster and server article render independently
  of video readiness.
- The fixed background layer has stable geometry and does not move article layout,
  preventing video-driven CLS.
- The video is not the sole information carrier or the article LCP dependency.
- Production build result: chapter route 6 kB, 123 kB first-load JS; metadata image
  route remains independently split.

## TESTS

- Targeted presentation, background, progress, reader utilities, route, metadata,
  sitemap, robots, Open Graph, UI preference, and middleware tests: PASS.
- TypeScript: PASS.
- Content generation and validation: PASS (96 entries, 22 chapters).
- Prisma schema validation: PASS.
- Full Jest suite: PASS (84 suites passed, 641 tests passed; 1 suite and 21
  conditional/heavy tests skipped, 662 tests total).
- Production build: PASS. Existing hook dependency warnings remain in
  `BooksClient`, `GameShell`, and `TypewriterReader`; no new Reader warning exists.
- Browser QA: Chromium PASS for all requested viewport sizes, three free visual
  mappings, locked gate, preference persistence, navigation, selection, and
  overflow. WebKit and an authenticated owned visual replay remain manual coverage.
- Crawler QA: PASS, 54/54 requests.

## GIT

1. `f352fb8 fix: route library links through canonical chapter pages`
2. `83a5809 feat: add chapter-specific video and poster presentations`
3. `3d52a9e refactor: rebuild the Synthoma chapter reader shell`
4. `da6d067 feat: improve reader typography progress and accessibility`
5. `ede766a feat: add canonical chapter metadata and structured data`
6. `5c4e1ab feat: generate chapter social previews and sitemap entries`
7. `test: verify immersive reader and chapter SEO contracts` (this report commit)

The final commit uses explicit staging. `.next`, `tsconfig.tsbuildinfo`, runtime
logs, screenshots, environment files, and temporary media files are excluded.

## RELEASE

- Reader: PASS. Server/access contracts and Chromium responsive behavior are green.
- Video: PASS. Stable chapter mapping, fallback, preference, and media behavior are
  green.
- SEO: PASS. Canonical routes, SSR, metadata, social images, sitemap, robots, and
  crawler output are green.
- Remaining non-blocking manual coverage: WebKit rendering and an authenticated
  owned-chapter browser replay.
