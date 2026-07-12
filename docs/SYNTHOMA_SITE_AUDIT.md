# SYNTHOMA Site Audit

Audit baseline: `b1146fd`
Branch: `ui/synthoma-site-rebuild`
Scope: Phase 5.0 audit and Phase 5.1 preparation

## Executive summary

The application has 19 page routes, 36 API routes, four App Router layouts, 77 client TSX components (85 client modules including hooks and libraries), 37 global CSS files and five CSS modules. The root layout imports every global stylesheet, including game, reader and all Cyklus CSS, on every route.

The strongest reusable foundation is the Cyklus theme, media, typography and control work. The largest obstacle is not missing styling but competing ownership: the root layout, `SubjectProfilePanelClient`, `ControlPanelClient`, the standalone intro and Cyklus each own parts of navigation, theme propagation or panel orchestration.

`SYNTHOMA-NULL.txt` is referenced by the Phase 5 brief but is not present in the repository. Canonical context was therefore read from `public/data/SYNTHOMA-MANIFEST.txt`, `styl.md`, `efekty.md`, `oblouk.md`, the repository README, Cyklus README/TECHNICAL and Phase 4 QA documents. Existing SYNTHOMA-NULL chapter HTML remains untouched.

## Inventory counts

| Measure | Baseline |
|---|---:|
| Page routes | 19 |
| API routes | 36 |
| Layouts | 4 |
| Client TSX components | 77 |
| Client modules including hooks | 85 |
| Global CSS files | 37 |
| CSS modules | 5 |
| CSS lines under `src/styles` and route modules | 27,365 |
| `!important` declarations | 276 |
| Hard-coded hex color occurrences | 1,156 |
| Media queries | 149 |
| Numeric z-index declarations | 149 |
| Fixed-position declarations | 58 |
| `100vh` occurrences | 27 |
| `100dvh` occurrences | 32 |
| Shared audio elements | 1 |
| Theme mechanisms | 2 families: global 8-theme contract and standalone intro 4-theme contract |

## Route inventory

All routes inherit `app/layout.tsx`, its providers, global panels and all 15 direct CSS imports. “Global CSS” below means that baseline bundle plus the listed route module.

| Route | Page / main component | Boundary and data | Media / CSS | States and auth | Mobile / principal issue |
|---|---|---|---|---|---|
| `/` | `app/page.tsx` -> `HomeClient.tsx` | Server wrapper, full client home; reader localStorage, manifest fetch, session | `SYNTHOMA32.webm`, `menu.module.css`, global CSS | No explicit error/empty state; unauthenticated allowed | Generic rounded card grid; first-visit redirect races indexable home; no active Cyklus CTA |
| `/admin` | `app/admin/page.tsx` -> `AdminDashboard` | Server auth/role gate, client API dashboard | Global `components.css` | Redirect if signed out; access denied state | Admin visual family; intentionally outside Phase 5.1 visual rewrite |
| `/archive` | `app/archive/page.tsx` -> `ArchiveClient` | Server reads `archiveCards.json`; client fetches progress/profile/whispers | `SYNTHOMA10.webm`, global CSS | Empty cards accepted; partial API failures tolerated | Archive mixes lore catalogue, subject progress and whispers without a clear memory hierarchy |
| `/autor` | `app/autor/page.tsx` -> `AutorClient` | Server reads author HTML for noscript; client presentation | `SYNTHOMA12.webm`, global CSS | File failure yields empty noscript fallback | Legacy presentation family and duplicate glitch heading |
| `/books` | `app/books/page.tsx` -> `BooksClient` | Server reads manifest and CHAPTERS; client reads progress | `SYNTHOMA7.webm`, `books.module.css` | Empty manifest fallback; no route error boundary | Catalogue is functional but hierarchy and mobile filtering need Phase 5.2 work |
| `/chapter/:id` | `app/chapter/[id]/page.tsx` | Server metadata and redirect into reader | No own media | Missing chapter handled through route response | SEO bridge, not a visual destination |
| `/reader` | `app/reader/page.tsx` -> dynamic `ReaderContent` | Entire route client; manifest fetch, chapter API, progress/run APIs, localStorage | Chapter manifest video, `ReaderContent.module.css`, reader globals | Route loading skeleton plus local Suspense loaders; content errors in reader hooks | Correct content priority but client-only boundary, duplicated loaders and global shell noise |
| `/cyklus` | `app/cyklus/page.tsx` -> `CyklusClient` | Server shell, client game state/storage/API sync | Cyklus-selected media, full Cyklus CSS | Full boot/run/outcome/error handling | Current design source of truth; keeps specialized 44px game header |
| `/cyklus/void` | `CyklusVoidHubClient` | Client progression/storage/API actions | Cyklus CSS | Empty/return/recommendation states | Stable checkpoint UI; may use shared non-game shell later |
| `/game` | `GameClient` | Client multiplayer/solo entry and APIs | `game.css`, `game-v1.css` | Room/loading/error flows | Separate legacy game family; audit only in this phase |
| `/game/room/:code` | `RoomClient` | Client room API polling/actions | Game globals | Invalid room and network errors | Separate gameplay shell |
| `/game/solo` | redirect to `/cyklus` | Server redirect | None | N/A | Legacy route retained for compatibility |
| `/landing-intro` | 1,600+ line client `page.tsx` | Client-local sequence and controls | `SYNTHOMA1.webm`, route globals and module | Manual playback fallbacks | Separate four-theme universe, oversized client component, long obstacle on revisit |
| `/login` | server page -> `LoginForm` | Client auth submission | `SYNTHOMA32.webm`, `auth.css` | Validation and API errors | Glass card family; global floating controls compete with auth task |
| `/register` | server page -> `RegisterForm` | Client registration API | `SYNTHOMA32.webm`, `auth.css` | Validation and API errors | Same issue as login |
| `/profile` | server auth redirect | Session only | None | Redirect to login or `/?login=1` | Profile is actually the global dialog, so route semantics are indirect |
| `/privacy` | `PrivacyClient` | Static client document | Global legal selectors in `components.css` | No error/empty state | Content is complete; typography and shell need shared tokens |
| `/terms` | `TermsClient` | Static client document | Global legal selectors | No error/empty state | Same as privacy |
| `/purchase/success` | client page | Language context | Auth/paywall globals | No verification state on page | Small utility route with old card styling |

Generated routes `/robots.txt` and `/sitemap.xml` exist. There is no committed `not-found.tsx`, root `loading.tsx` or root `error.tsx`; only `app/reader/loading.tsx` exists.

## Layout ownership

| Layout | Current responsibility | Decision |
|---|---|---|
| `app/layout.tsx` | Metadata, 15 CSS imports, session/language/MBTI providers, global panels, consent, debug, audio | Keep as server composition root; delegate visible navigation and portal context to shared OS components |
| `app/books/layout.tsx` | Pass-through | Keep until library rebuild proves a route-specific shell is needed |
| `app/reader/layout.tsx` | Reader metadata | Keep; shared shell supplies quiet variant |
| `app/landing-intro/layout.tsx` | Imports an isolated global CSS universe | Remove isolation after intro rebuild; intro uses shared root contract |

## Component ownership audit

| Component / mechanism | Used by | Current ownership | Decision / target owner |
|---|---|---|---|
| `SubjectProfilePanelClient` | Root layout, Cyklus events | Profile dialog plus non-Cyklus Home, Settings and Identity triggers | Keep dialog; move triggers to `SynthomaCommandHeader` |
| `CyklusGameHeader` | Active Cyklus run | Specialized game status plus identity/settings/audio | Keep; share icons/tokens/events with OS shell |
| `ControlPanelClient` | Root layout | Theme, text scale, effects and legacy audio wiring | Keep behavior; shell owns its only trigger; later split legacy audio wiring mechanically |
| `SynthomaAudioPanel` | Root layout | Visible audio library and transport | Keep as sole audio surface |
| `getSharedAudio` | Audio panel, reader, control panel | Creates `#synthoma-shared-audio` and `window.__synthomaAudio` | Keep as sole audio owner |
| `ThemeShopClient` | Control panel | Eight themes, persistence and preview | Keep; extract document application into shared portal/theme context |
| `FirstVisitRedirectClient` | Home | `visited_once` redirect | Replace key with versioned intro contract |
| `HomeClient` | `/` | Video, session, progress, title effect and all navigation | Split into focused home components; client boundary only for real saved state |
| `landing-intro/page.tsx` | `/landing-intro` | Entire intro, playback and separate theme controls | Replace with short `SynthomaIntro` sequence |
| `BgVideo` / ad-hoc video markup | Auth and multiple pages | Multiple render patterns, same conceptual media layer | Consolidate new shell/home/intro usage into `SynthomaMediaLayer`; do not rewrite reader/library yet |
| `.id-panel-home`, `.id-panel-btn` | Every non-Cyklus route | Three floating legacy controls | Superseded by one route-aware command header |
| `CyklusPortalScope` | Fullscreen poster | Theme and text scale propagation | Rebase on shared `SynthomaPortalRoot` context helper |
| `RetroPixelCanvasClient` | Root | Theme-specific effect on all routes | Keep but document as global cost; reduced-effects contract must disable it |
| `MBTIHudClient`, `WhisperFloat` | Root | Always-mounted fixed surfaces | Keep behavior; shell z-index contract prevents collisions; reassess lazy mounting later |

## CSS import graph and findings

`app/layout.tsx` imports base, components, dialogs, choices, effects, themes, reader, auth, profile, paywall, two game sheets, all Cyklus CSS, control panel and audio. `cyklus.css` then imports 20 Cyklus files. Route modules add home, books, reader, autor and intro CSS.

### P0

- No root error boundary or 404 experience is committed. A runtime rendering failure falls back to framework defaults and does not preserve the SYNTHOMA navigation contract.
- The first-visit client redirect replaces `/` after hydration. It can interrupt focus and produces a route-level layout change after indexable content appears.

### P1

- Two incompatible theme systems: global eight-theme `[data-theme]` tokens in `src/styles/themes.css` and four local intro themes in `landing-intro/styles.module.css`.
- Three global controls are owned by `SubjectProfilePanelClient`, while Cyklus owns equivalent controls. Route CSS hides one set on `/cyklus`; ownership is visual rather than architectural.
- Every route receives reader, game and 20-file Cyklus CSS. This increases transfer/parse cost and makes selector order a hidden API.
- `components.css` is 166 KB and Cyklus `legacy.css` is 121 KB. Both mix unrelated route surfaces and override later foundation files.
- Home is a rounded card dashboard with a broad glass panel; this conflicts with the established SYNTHOMA OS composition.
- Intro is a 49 KB client page with a separate theme and control system; it is too large for a 4-7 second boot sequence.
- Reader is client-only (`ssr: false`) and has three loading representations, increasing hydration and perceived-start complexity.

### P2

- 1,156 hard-coded hex occurrences, 276 `!important` declarations, 149 media queries and 149 numeric z-index declarations make cross-route changes risky.
- 27 uses of `100vh` remain beside 32 uses of `100dvh`.
- 58 fixed-position rules and 94 backdrop-filter occurrences create stacking, containing-block and low-end mobile risks.
- Theme application is duplicated between `ThemeShopClient` and `ControlPanelClient`.
- Audio behavior is shared at the element level, but playlist/control wiring exists in both `SynthomaAudioPanel` and the 55 KB `ControlPanelClient`.
- Static legal pages are client components although their content is primarily static.
- No general route smoke suite currently asserts all public page shells.

### P3

- Glitch heading markup is duplicated across Home, Autor, Archive and auth pages.
- Mixed Czech and English system labels reduce consistency.
- Several content pages retain 10-12px labels and rounded cards that can be migrated after shell adoption.

## Performance baseline

Production build at `b1146fd`:

| Route | Route JS | First load JS |
|---|---:|---:|
| `/` | 3.77 kB | 125 kB |
| `/landing-intro` | 5.44 kB | 133 kB |
| `/books` | 8.25 kB | 133 kB |
| `/archive` | 5.63 kB | 124 kB |
| `/reader` | 2.77 kB | 121 kB |
| `/cyklus` | 23.4 kB | 373 kB |
| `/cyklus/void` | 0.16 kB | 343 kB |

Largest shared chunks were 54.2 kB and 46.2 kB. No synthetic Lighthouse score was produced.

There are 29 non-empty background WebM files totalling roughly 42 MB. The largest are `SYNTHOMA13.webm` (5.10 MB), `SYNTHOMA5.webm` (4.00 MB) and `SYNTHOMA12.webm` (2.35 MB). Home loads only `SYNTHOMA32.webm` (1.28 MB), with metadata preload. Fonts include 17 TTF files; theme-specific font selection can cause more font resources than a single route needs.

## Accessibility audit

Strengths: root skip link, semantic Cyklus controls, one shared audio dialog, modal focus work in profile, reduced-motion rules and 44px Cyklus targets.

Gaps:

- Legacy global trigger labels depend on floating controls rather than route navigation landmarks.
- The intro lacks the requested concise keyboard/skip contract and uses a separate controls surface.
- Root has no accessible site-wide active route (`aria-current`).
- Global panel markup is rendered closed on every route; profile content is conditionally mounted, but control and audio surfaces remain present.
- Home has a main landmark nested under `#main-content` but no persistent site navigation landmark.
- Some reader and legacy UI labels are below the 12px target.
- No static fallback route is styled for not-found or root errors.

## Baseline decisions

1. Preserve Cyklus engine, registry, cards, content and specialized run header.
2. Make `src/styles/themes.css` the existing eight-theme value owner and expose shared `--os-*` aliases.
3. Keep `--font-size-multiplier` as the single persisted text-scale value.
4. Keep `getSharedAudio()` as the single audio element owner.
5. Introduce one route-aware shell for non-game navigation and one portal context wrapper.
6. Replace, rather than restyle, the standalone intro implementation.
7. Split Home into server composition plus a small client state resolver.
8. Audit Library, Archive and Reader now; defer their full visual rewrite to Phase 5.2.
