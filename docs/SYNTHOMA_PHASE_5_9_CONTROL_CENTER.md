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

Pending implementation after the audit checkpoint.

## PREFERENCES

Pending implementation after the audit checkpoint.

## CONTROL CENTER

Pending implementation after the audit checkpoint.

## AUDIO

Pending implementation after the audit checkpoint.

## TESTS

Pending implementation after the audit checkpoint.

## GIT

The audit checkpoint is the first Phase 5.9 commit. Generated build output,
screenshots, local preference dumps, environment files, and database artifacts are
excluded.

## RELEASE

- Control Center: HOLD - legacy DOM client and duplicate settings remain.
- Motion: FAIL - route/reload reproduction starts background video under motion off.
- Audio: HOLD - active React player is sound, but legacy ownership remains.
