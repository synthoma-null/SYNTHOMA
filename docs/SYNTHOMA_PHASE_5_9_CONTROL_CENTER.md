# SYNTHOMA Phase 5.9 - Control Center, Preferences and Motion Contract

Phase 5.9 starts from production commit
`d0108dabee882d5182ad4af3b6f8ef0c782682fa` and the Phase 5.8 live QA report
commit `67faace`. This phase does not change chapter content, Cyklus rules, MNEM,
entitlements, prices, database schema, public AI APIs, or Reader SEO contracts.

## AUDIT

The requested `SYNTHOMA-NULL.txt` is not present in the repository. The available
world reference is `apps/web/public/data/SYNTHOMA-MANIFEST.txt`; it was reviewed
together with the Phase 5.8 report and the current runtime owners listed below.

### Original preference inventory

| Setting | Current owner and persistence | Readers / writers | Reload / route / pre-paint | Audit result |
| --- | --- | --- | --- | --- |
| Theme | `theme` in localStorage; account profile also stores `settings.theme` | `ThemeShopClient`, legacy `ControlPanelClient`, theme CSS; profile settings writes a separate DB value | Persists after hydration and routes; not applied before paint | Duplicated authority; theme change unconditionally restarts legacy videos |
| Animation toggle | `animationsDisabled` in localStorage and `body.no-animations` | `ControlPanelClient`, `useVideoVisibility`, `ChapterBackground`, debug panel | Persists after hydration; route owners can restart; not pre-paint | Partial kill switch, not a motion contract |
| Moving background | `synthoma_ui_preferences` v1, `movingBackground` | `ControlPanelClient` writes; only `ChapterBackground` reads | Persists; only chapter route obeys it; not pre-paint | Versioned but isolated Reader authority |
| System reduced motion | `prefers-reduced-motion` media query | Base CSS, selected effect CSS, videos, glitch/typewriter helpers | Native and pre-CSS; JS mostly samples only at mount | Broad CSS coverage, inconsistent live JS response |
| Font scale | `fontSizeMultiplier` localStorage; account profile also stores `fontScale` | Legacy panel writes `--font-size-multiplier`; profile settings writes DB only | Persists after hydration and routes; not pre-paint | Duplicate and visible layout flash risk |
| Reader opacity | `readerBgOpacity` plus coupled `panelAlpha` | Legacy panel writes `--app-bg-opacity`, `--bg-opacity`, `--panel-alpha` | Persists after hydration; route sync uses DOM mutation | Coupled to unrelated panel alpha |
| Glass mode | `glassMode` localStorage; account profile also stores `glass` | Legacy panel toggles body/Reader classes; MutationObserver re-applies | Persists after hydration; not pre-paint | Duplicate; DOM orchestration owns React output |
| Glass blur | `glassBlur` localStorage | Legacy panel and shared CSS variables | Persists after hydration | Shares one slider with opacity and changes its accessible meaning |
| Typewriter speed | Account profile `typewriterSpeed`; no active local UI preference | Profile settings writes it; runtime typewriters use fixed/content-derived timing | DB reload only; no runtime route effect | Visible but functionally dead setting |
| Reader focus | Component-local `focusMode` | `ReaderCommandUtilities` toggles `.chapter-reader--focus` | Lost on reload and remount | Valid route-local state, not coordinated with presets |
| TTS | `ttsOn` localStorage, local Reader `speaking`, account `ttsEnabled` | Legacy panel TTS observer and Reader command utility | Three authorities; route behavior differs | Duplicated, observers can outlive intended context |
| Audio master | No canonical preference; account has `audioEnabled` | Shared audio element and `SynthomaAudioPanel` | Account value is not a runtime authority | Missing effective setting |
| Audio state | `audioAutoplayBlocked`; legacy per-track `audioLoop:*` | Audio panel plus dead fallback block in `ControlPanelClient` | Pause intent persists; volume and active track do not | Split ownership; legacy fallback sets `preload=auto` |
| Glitch effects | No user preference | CSS, `attachGlitchHeading`, `useGlitching`; undeclared legacy start/stop globals | Media query sampled at creation; manual toggle does not stop timers directly | Missing canonical switch and live subscription |
| Noise effects | No user preference | CSS noise/scanline layers; legacy start/stop globals are only declared/called | CSS stops only through broad descendant rule | Missing owner; legacy global appears dead |
| Scanlines | No user preference | CSS pseudo-elements across core and Cyklus | Reduced-motion coverage is file-specific | Missing owner |
| Cyklus effects | System media queries and global descendant CSS side effect | Cyklus CSS; menu video has no motion hook | CSS mostly stops; menu video can continue | Not explicitly connected to global motion state |

No UI preference cookie was found. No sessionStorage key currently owns Control
Center behavior. Reader progress, consent, language, access snapshots, Cyklus saves,
story state, and MBTI/choice data are separate domain persistence and are not
candidates for the UI preference store.

### Runtime state surfaces

- HTML/body attributes: `data-theme` is the only global visual contract. There is
  no `data-motion`, `data-background-motion`, `data-glitch`, `data-noise`,
  `data-scanlines`, or `data-text-effects` contract.
- Body classes: `no-animations`, `glass-mode`, dialog/scroll locks, and Cyklus
  selection locks. Motion and glass are applied after hydration.
- Portal copies: `SynthomaPortalRoot` copies theme, text scale, density, and a
  computed reduced-effects flag using a MutationObserver. It does not expose the
  requested effective motion dimensions.
- CSS variables: `--font-size-multiplier`, `--app-bg-opacity`, `--bg-opacity`,
  `--panel-alpha`, `--app-bg-blur`, `--glass-blur`, `--reader-glow-radius`, and
  `--reader-glow-alpha` are mutated imperatively by the legacy panel.
- Window globals: `animationManager`, shared audio helpers, and declarations for
  `start/stopGlitchBg`, `start/stopVideoRotation`, `start/stopNoise`, and
  `start/stopShinning`. The visual start/stop implementations are absent from the
  TypeScript application and therefore form a dead compatibility surface.
- Custom events: control-panel open/close, audio open/toggle/close, identity
  open/toggle/close, TTS toggle, animation change, and v1 UI-preference change.
  They coordinate overlays but do not carry one validated preference snapshot.

### Effect ownership

The stylesheet inventory contains 327 animation/keyframe declarations and 181
transition declarations. The largest owners are `components.css`, `effects.css`,
`cyklus/legacy.css`, `synth-gate.css`, `reader.css`, and `game.css`.

- `base.css` gives `prefers-reduced-motion` a global `animation:none` and
  `transition:none`, but manual `body.no-animations` only forces a 0.01 ms single
  iteration after hydration.
- The reported selector bug exists:
  `body:not(.force-shine) .no-animations .noising-char` searches for a descendant
  `.no-animations`, although the class is attached to body.
- `SynthomaMediaLayer` samples system reduced motion only once and does not read
  the manual toggle. It owns home and intro background video.
- Books, Archive, Autor, login/register, and chapter backgrounds use
  `useVideoVisibility`; Cyklus menu video does not.
- `ChapterBackground` separately combines system reduced motion,
  `animationsDisabled`, save-data, and v1 `movingBackground`.
- `RetroPixelCanvasClient` keeps a two-second wake timer even when inactive and
  does not read manual motion state.
- `attachGlitchHeading` and `useGlitching` create intervals/timeouts based on a
  one-time system media-query read. Manual motion changes do not cancel them.
- `renderReaderSegment` and `runTypewriter` do not subscribe to a global motion
  change, so an already running typewriter cannot be completed atomically by the
  current toggle.

### Legacy ControlPanel findings

- The panel markup lives in the root layout while a 2,232-line client attaches
  behavior through IDs, delegated document events, inline styles, global APIs,
  MutationObservers, and DOM-created audio controls.
- `boot()` returns cleanup, but the outer effect discards that return value in the
  normal ready-state path. Slider, hover, audio, interval, and observer ownership is
  therefore not reliably released on remount.
- Global one-time delegation flags can remain true after aborted listeners are
  removed, leaving later mounts without handlers.
- One slider changes from opacity to blur when glass is enabled and also writes
  panel alpha. Its visible and accessible name changes with the mode.
- The active React audio panel already uses the canonical playlist and real range
  progress control, but the legacy client still contains a second hardcoded player
  and sets audio preload to `auto` when that fallback mounts.
- Theme purchases correctly remain account/MNEM behavior, but applying or previewing
  a theme also calls legacy video start/play functions regardless of motion state.

### Production reproduction

Verified on `https://www.synthoma.cz` on 2026-07-17 using the Phase 5.8 deployment.
The original theme and animation preference were restored after the audit.

| Scenario | Result | Observation |
| --- | --- | --- |
| Disable animations on a chapter | PASS | Chapter video unmounted; sampled CSS animations became `none` |
| Change theme while disabled on the chapter | PASS by incidental guard | Chapter video stayed absent because `ChapterBackground` re-read the legacy keys |
| Navigate from chapter to home while disabled | FAIL | `body.no-animations` remained, but `SYNTHOMA32.webm` mounted and played |
| Reload home while disabled | FAIL | Global home video loaded and played after hydration |
| Root effective motion state | FAIL | `data-motion` remained absent in all tested states |
| CSS animation descendants after hydration | PASS/PARTIAL | Sampled animations stopped, but JS timers and media were not governed |

The primary defect is therefore reproduced: the stored label can say motion is off
while a newly mounted route starts a background video. Theme restart code is a
second confirmed code path for the same class of bug.

## MOTION

The effective motion state is now derived once from the versioned preference
snapshot, the live `prefers-reduced-motion` query, and the background-motion
setting. The bootstrap writes the contract to the root element before hydration:
`data-motion-preference`, `data-motion`, `data-background-motion`, `data-glitch`,
`data-noise`, `data-scanlines`, and `data-text-effects`.

`off` is a real stop state. Decorative video owners do not mount their video,
global CSS removes animations and transitions, typewriters finish immediately,
glitch timers are cancelled, and the retro canvas cancels its animation frame.
The contract survives route changes and reloads without a route component being
allowed to restart media. `reduced` keeps the information layer while suppressing
non-essential movement. Audio is intentionally independent.

The original production failure is fixed locally: with motion set to `off`, home,
Books, a free chapter, a locked chapter, Archive, Autor, Cyklus, and Profile all
reported `data-motion="off"`, zero decorative videos, and zero active CSS
animations. Books and the free chapter stayed in that state after a full reload.

## PREFERENCES

`synthoma_ui_preferences` v2 is the single local runtime authority. Reads validate
and clamp every field, migrate the v1 object and legacy keys, repair malformed
values, and write one normalized snapshot. Migration is idempotent. A shared
subscription API drives React and non-React consumers without polling.

The store owns theme, motion mode, background motion, glitch/noise/scanlines,
text effects, typewriter speed, font scale, Reader opacity, glass and blur, audio
master and volume, focus mode, and TTS. Root bootstrap prevents theme, motion,
font, opacity, and glass flashes. Reader progress, consent, language, account
entitlements, and Cyklus state remain separate domain data.

Four declarative presets are available: Canon, Focus, Saver, and Calm. A modified
snapshot is labelled Custom and applying a preset over Custom requires explicit
confirmation. Reset also requires confirmation and restores the full canonical
default snapshot.

## CONTROL CENTER

The legacy 2,146-line DOM controller was removed and replaced with a controlled
React dialog. It owns focus trapping, Escape/backdrop/close/Done behavior, focus
return, mutual overlay coordination, accessible tabs, and stable range labels.
The side rail becomes a bottom sheet on narrow viewports and only its content body
scrolls; header, presets, tabs, and footer remain reachable.

Tabs are contextual. Display, Motion, and Sound are global; Reading appears on
chapter routes and exposes typewriter, focus, and TTS settings. Theme purchasing
remains in the existing Theme Shop and is not duplicated by the preference store.

Manual QA found one layout defect after the automated suite: the five panel rows
were described by a four-row grid, so scroll content could cover the tab strip.
The grid now explicitly owns header, presets, tabs, scroll body, and footer. The
tab strip is pointer-reachable and the regression is covered by a CSS contract
test.

## AUDIO

The Sound tab controls the existing shared audio element; it does not create a
second player. It exposes master enablement, volume, track selection, previous,
play/pause, next, progress, elapsed/duration, and loading/error status. Audio uses
metadata preload and explicit user play. Disabling motion does not disable audio:
manual QA confirmed motion `off` while the audio master remained `ON` at 70%.

## TESTS

Automated verification on 2026-07-17:

- content validation: PASS, 96 entries and 22 chapters
- Prisma validation: PASS
- TypeScript: PASS
- targeted preference, bootstrap, motion, typewriter, Control Center, service
  worker, chapter background, and Cyklus audio tests: PASS, 8 suites and 27 tests
- full Jest: PASS, 89 passed suites, 1 skipped suite, 659 passed tests, 21 skipped
- targeted lint for changed Control Center/preference/Reader files: PASS, no
  warnings or errors
- production build: PASS, 261 static pages

The build retains four known pre-existing hook dependency warnings in
`BooksClient`, `GameShell`, and `TypewriterReader`. No new Phase 5.9 lint warning
was introduced.

### Manual browser QA

The local development build was checked in Chromium at 320x568, 390x844,
844x390, 1024x600, 1366x768, 1920x1080, and 2560x1440. At every size the panel
remained inside the viewport, exposed all contextual tabs, used internal vertical
scrolling, and caused no horizontal document overflow.

Route checks covered `/`, `/books`, `/chapter/0-inf-restart`,
`/chapter/0-4-defragmentation`, `/archive`, `/autor`, `/cyklus`, and `/profile`.
The Settings trigger remained singular on each route. The free Reader exposed the
Reading tab; the locked chapter kept its access gate. Motion `off` survived route
changes and reload, produced no decorative video or active CSS animation, and
suppressed typewriter state. Reset restored the Synthoma theme, system motion,
100% font scale, and background video.

Authenticated owned-chapter state was not required for the preference contract
and was not changed. Native Safari/iPhone rendering remains a manual release
sanity check; the responsive and motion contracts are covered by Chromium QA,
CSS contracts, and component tests.

## LIVE PRODUCTION QA - PHASE 5.9.1

The final Phase 5.9 checkpoint is
`cf3f3f1b5ae81f3f938a4e1f7abcedb70f4ba364`. Production verification was
completed on `https://www.synthoma.cz` on 2026-07-17 at 19:35 CEST against
service worker deployment
`3b698c0882a11662f5b1db32db8670bc6491eae6`.

### Production hotfix chain

1. `cc216c0` `fix: restore production Control Center visibility`
2. `29f4d67` `fix: keep Control Center interactive across routes`
3. `3703e04` `fix: restore Control Center descendant visibility`
4. `dfc547e` `fix: remove legacy Control Center visibility transition`
5. `df43afc` `fix: refresh deployed HTML through the service worker`
6. `3b698c0` `fix: keep private pages out of service worker cache`

The original production regression was caused by `synthoma-v1` serving a stale
cached HTML shell during navigation. The final deployed worker is
`synthoma-v3`. Its install cache contains only the neutral offline page, favicon,
and public OG image. Activation removes every cache whose name is not the current
version and claims existing clients.

All HTML navigations are now network-first and are never written to Cache
Storage. Network failure can return only `/offline.html` or a plain 503 response.
`/api/*`, Profile, admin, login, registration, and purchase requests explicitly
bypass caching; non-GET and external requests also bypass it. Asset caching
rejects partial responses and responses marked `private` or `no-store`.

### Live results

| Check | Result | Observation |
| --- | --- | --- |
| Existing browser profile without clearing site data | PASS | The profile retained Motion `off` and its original Cyber Dystopia theme while loading the current production shell. The original stale-home regression did not reproduce. |
| Worker deployment | PASS | The live `/sw.js` response is `synthoma-v3` and the application logged a successful worker registration. |
| Direct cache-name and controller inspection | HOLD | The browser QA surface does not expose Cache Storage or the service-worker controller object. The activation policy is verified in the live worker source, but a manual DevTools `caches.keys()` check remains. |
| Fresh isolated anonymous browser profile | HOLD | The available browser shares the existing site profile. Signed-out behavior was tested after logout, but a separate clean profile was not available. |
| Private navigation cache boundary | PASS | The deployed worker never stores HTML navigation responses. Profile/API/purchase traffic is excluded before asset caching. |
| Owned chapter after logout | PASS | `0-4-defragmentation` rendered its full Reader while owned. After logout and reload it rendered the 64 MNEM access gate, zero article elements, and no protected chapter text. |
| Locked chapter disclosure | PASS | The signed-out gate exposed title, price, and navigation only. |
| Offline fallback document | PASS | `/offline.html` is a neutral page with no form, account/profile fields, or personalized content and links only back to `/`. |
| True browser-offline navigation | HOLD | Network emulation is not exposed by the available browser. The deployed fetch handler and offline document are verified; physical offline behavior remains a short manual DevTools check. |

The exact Motion regression sequence passed without clearing storage:

`free chapter -> Motion OFF -> home -> theme change -> Cyklus -> Books -> Back -> reload -> tab hidden -> tab visible`

At every checkpoint the root retained `data-motion="off"`, decorative video count
was zero, playing video count was zero, visible canvas count was zero, active
infinite CSS animation count was zero, and typewriter state was absent. One shared
audio element remained present and paused throughout, so motion changes did not
replace or remove the audio owner. Exact network-request counting and physical
audio playback remain browser-runner limitations; the DOM and worker strategy
ensure that no video element or cached HTML navigation was present.

The final Control Center passed at 1280x720 and 390x844. Desktop geometry was a
440px panel fully inside the right edge of the viewport. On mobile the panel had
no horizontal document overflow; only `.control-center__body` scrolled while the
header, presets, tabs, and footer kept their viewport positions. The active tab
was pointer-reachable, only one tabpanel was rendered, and no Control Center
descendant inherited `visibility:hidden`. Source inspection found no broad
`.control-center * { visibility: visible !important; }` override.

Close X, Escape, backdrop, and Done all closed the panel and returned focus to the
single Settings trigger. The single panel and trigger remained stable on Reader,
home, Books, and Cyklus routes. A one-off React hydration warning observed during
the long QA session did not reproduce in a fresh production tab and therefore did
not justify another runtime change.

Final verification after the service worker privacy fix:

- content validation: PASS, 96 entries and 22 chapters
- Prisma validation: PASS
- TypeScript: PASS
- targeted regression tests: PASS, 8 suites and 27 tests
- full Jest: PASS, 89 passed suites, 1 skipped suite, 659 passed tests, 21 skipped
- production build: PASS, 261 pages
- build warnings: the same four pre-existing hook dependency warnings in
  `BooksClient`, `GameShell`, and `TypewriterReader`

Native Safari/iPhone rendering, a fresh isolated anonymous profile, direct
Cache Storage/controller inspection, and physical offline emulation remain
explicit manual HOLD checks. They do not conceal a reproduced runtime failure;
they mark capabilities not available in this QA browser.

## GIT

Phase checkpoints:

1. `4e2f877` `audit: document Synthoma control panel and preference ownership`
2. `341256f` `refactor: unify Synthoma UI preferences and motion state`
3. `ebce916` `fix: stop all visual effects when motion is disabled`
4. `cdee5f6` `refactor: rebuild the Synthoma control center`
5. `01484f4` `feat: add contextual controls presets and accessible audio`
6. `cf3f3f1` `test: verify control center and motion contracts`
7. `cc216c0` `fix: restore production Control Center visibility`
8. `29f4d67` `fix: keep Control Center interactive across routes`
9. `3703e04` `fix: restore Control Center descendant visibility`
10. `dfc547e` `fix: remove legacy Control Center visibility transition`
11. `df43afc` `fix: refresh deployed HTML through the service worker`
12. `3b698c0` `fix: keep private pages out of service worker cache`

Generated build output, screenshots, local preference dumps, environment files,
database artifacts, and `tsconfig.tsbuildinfo` are excluded.

## RELEASE

- Control Center: PASS
- Preference migration and bootstrap: PASS
- Motion contract: PASS
- Audio ownership and motion independence: PASS
- Responsive Chromium matrix: PASS
- Live service worker strategy and private cache boundary: PASS
- Owned chapter logout boundary: PASS
- Direct cache/controller and physical offline inspection: HOLD for manual DevTools QA
- Safari/iPhone visual sanity: HOLD for human device QA, non-blocking for this phase
