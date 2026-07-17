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
  The route contract is covered by component/server tests and was replayed in
  production with an existing authenticated entitlement.
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
  mappings, locked gate, preference persistence, navigation, and overflow. An
  authenticated owned chapter also passed progress restore and monotonic completion.
  WebKit and native text-drag selection remain manual coverage.
- Crawler QA: PASS, 54/54 requests.

## LIVE PRODUCTION QA

- Deployment commit: `d0108dabee882d5182ad4af3b6f8ef0c782682fa`.
- Phase 5.8 final test commit: `d0108dabee882d5182ad4af3b6f8ef0c782682fa`.
- Verified: 2026-07-17 13:27 CEST.
- Live domain: `https://www.synthoma.cz`.
- Deployment: the Phase 5.8 HEAD was fast-forwarded to `main`; both production
  Vercel checks completed successfully before the live matrix was run.

### Live routes

| Contract | Result |
| --- | --- |
| `/books` emits canonical `/chapter/[id]` links | PASS |
| Five free chapters return 200 with the full SSR article | PASS |
| Owned chapter returns 200 with the protected article | PASS |
| Locked chapter returns 200 with a gate and no protected article | PASS |
| Unknown chapter returns 404 | PASS |
| Three legacy `/reader?...` references return safe canonical 308 redirects | PASS |
| Unknown/external legacy input returns 308 to `/books`, never off-site | PASS |

### Live video assets

| Chapter | Presentation | Asset result |
| --- | --- | --- |
| `0-inf-restart` | `SYNTHOMA32.webm` plus WebP poster | 206 `video/webm`; poster 200 |
| `0-0-null` | `SYNTHOMA23.webm` plus WebP poster | 206 `video/webm`; poster 200 |
| `0-2-run` | `SYNTHOMA25.webm` plus WebP poster | 206 `video/webm`; poster 200 |
| `0-11-orgie` | intentional poster-only presentation | cover poster 200 `image/png` |

The three mapped WebM files contain one video stream and no audio stream. Live
Chromium mounted exactly one muted video, kept the poster available, and reported
the media ready. Disabling moving backgrounds removed the video, kept the poster,
survived reload, and re-enabling it restored the video.

### Reader and owned access

- Desktop Chromium and a 390x844 Android Chromium viewport simulation rendered
  without horizontal overflow or command-bar overlap; mobile scrolling worked.
- Free text, canonical navigation, TTS, site Audio, previous/next links, and the
  persistent moving-background preference passed live interaction.
- Existing owned chapter `0-4-defragmentation` opened with the full 15,877-character
  article, its chapter video, and poster. No purchase or MNEM mutation was made.
- A 42% reading position survived reload. Completion then reached 100%, persisted
  as `completed=true`, and remained complete after a later autosave attempt.
- The signed-in profile returned the real MNEM balance and chapter ownership used
  by the gate; no false zero balance or database fail-closed state appeared.

### Live SEO matrix

All five free chapters passed title, description, canonical, `cs`/`en`/`x-default`
alternates, `index,follow`, `Chapter` JSON-LD, `BreadcrumbList`, `wordCount`,
`isAccessibleForFree=true`, live PNG Open Graph image, Twitter image, and applicable
`prev`/`next` links. The locked chapter exposed no protected article, declared
`isAccessibleForFree=false`, and followed its configured index contract.

The live sitemap contains 13 published canonical chapter URLs, no `/reader` URL,
no draft chapter, and stable content dates. Live robots rules allow public chapter
routes and continue to block private account, purchase, Stripe, auth, and admin APIs.

### Live crawler matrix

Generic, Googlebot, Bingbot, OAI-SearchBot, GPTBot, and ChatGPT-User were each tested
against `/books`, all five free chapters, and one locked chapter: 42/42 requests
passed. Every free response contained the real article, metadata, breadcrumbs, and
chapter navigation without JavaScript. The locked response contained the gate and
no protected article.

### Remaining HOLD points

- Safari/iPhone decoding and rendering require a physical Safari or WebKit run.
  There is no MP4 fallback; unsupported WebM must therefore remain on the poster.
- Native 200% browser zoom, actual tab-background pausing, reduced-motion media
  emulation, and Data Saver media suppression were not available in this runner.
  Their implementation and automated contracts passed, but the live device checks
  remain manual.
- Computed Reader text selection is `user-select: text`, but the in-app Chromium
  runner did not produce a native selection range from simulated dragging. Manual
  mouse/touch selection remains HOLD; no code change was made without a reproducible
  browser defect.

## GIT

1. `f352fb8 fix: route library links through canonical chapter pages`
2. `83a5809 feat: add chapter-specific video and poster presentations`
3. `3d52a9e refactor: rebuild the Synthoma chapter reader shell`
4. `da6d067 feat: improve reader typography progress and accessibility`
5. `ede766a feat: add canonical chapter metadata and structured data`
6. `5c4e1ab feat: generate chapter social previews and sitemap entries`
7. `d0108da test: verify immersive reader and chapter SEO contracts`

The final commit uses explicit staging. `.next`, `tsconfig.tsbuildinfo`, runtime
logs, screenshots, environment files, and temporary media files are excluded.

## RELEASE

- Reader: PASS. Server/access contracts and Chromium responsive behavior are green.
- Video: PASS. Stable chapter mapping, fallback, preference, and media behavior are
  green.
- SEO: PASS. Canonical routes, SSR, metadata, social images, sitemap, robots, and
  crawler output are green.
- Remaining non-blocking manual coverage: Safari/iPhone media behavior, actual
  200% browser zoom, tab-background pausing, reduced-motion/Data Saver emulation,
  and native text-drag selection.
