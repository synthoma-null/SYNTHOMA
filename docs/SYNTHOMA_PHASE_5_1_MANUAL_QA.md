# SYNTHOMA Phase 5.1 Manual QA

Automated functional tests do not replace this visual pass. Record each row as `PASS`, `HOLD` or `N/A`, with route, viewport, theme and a concise note.

## Setup

- Test production build when available.
- Clear `synthoma:intro-version` for first-visit mode.
- Intro version is `5.1` and the storage key is `synthoma:intro-version`.
- Preserve separate fixtures for no saved state, reading resume and active Cyklus run.
- Test signed-out and signed-in subject states.
- Do not commit screenshots or temporary QA routes.
- Automated visual verification was blocked by browser preview; this checklist is the manual pass.

## Viewports

- 320x568
- 360x640
- 390x844
- 430x932
- 844x390 landscape
- 1024x768
- 1280x720
- 1366x768
- 1440x900
- 1920x1080
- 2560x1440

## Themes and preferences

Run the complete core flow in at least:

- SYNTHOMA
- Mono Light
- Nejtmavší
- Cyan/Magenta
- Acid

Repeat representative mobile and desktop checks with reduced motion and 140% text size.

## Global shell

- Exactly one visible site header exists outside active Cyklus gameplay and Intro.
- Home, Library, Archive and Cyklus are reachable and active route uses `aria-current`.
- Identity, Settings and Audio each have one trigger.
- Opening one global panel closes competing panels.
- Escape, backdrop and explicit close restore focus to the correct trigger.
- Reader uses a quiet shell without covering prose.
- Cyklus keeps its specialized game header and has no duplicate global header.
- Mobile bottom navigation does not cover final content and respects safe area.
- At 320px the command header stays one row with no horizontal overflow.
- Skip link reaches `#main-content`.

## Intro: first visit

- Clearing the version key makes Home redirect once to `/landing-intro`.
- Sequence communicates OS boot, therapeutic environment, failed memory integrity and NULL subject.
- Total automatic duration is roughly 4-7 seconds.
- `PŘESKOČIT` is immediately available.
- Enter and Space advance/complete the sequence.
- No audio starts.
- Video/media failure does not block entry to Home.
- Completion writes `synthoma:intro-version` and reaches `/`.

## Intro: repeat and reduced motion

- Returning from Home, Reader or Cyklus does not force Intro again for the same version.
- Direct `/landing-intro` remains usable.
- Repeat mode is shortened.
- Reduced-motion mode is static/brief, has no unsafe flashing and retains all information.
- Focus starts on the skip/continue control and remains visible.

## Home hierarchy

- `SYNTHOMA` is a first-viewport signal and never splits or clips.
- Background video remains visibly inspectable; scrim is localized behind text.
- Exactly one dominant CTA exists.
- Reading resume produces `POKRAČOVAT VE ČTENÍ` with a real destination.
- Active Cyklus without reading resume produces `POKRAČOVAT V CYKLU`.
- Empty state produces `VSTOUPIT DO SYNTHOMY`.
- Library, Archive and Cyklus sector links remain available.
- Identity/Settings/Info are tertiary shell actions, not duplicate cards.
- No fabricated subject metrics appear.
- Video is muted, decorative and does not block interaction if unavailable.

## Mobile Home

- Content scrolls internally while background remains stable.
- Brand, system state and primary action fit at 320x568.
- Sector entries use sharp rails and do not become nested rounded cards.
- There is no horizontal overflow at 140% text size.
- The bottom navigation and device gesture area do not cover the final sector.

## Home states

- No save: primary CTA is `VSTOUPIT DO SYNTHOMY`.
- Rozečtená kapitola: primary CTA is `POKRAČOVAT VE ČTENÍ`.
- Aktivní Cyklus without reading: primary CTA is `POKRAČOVAT V CYKLU`.
- Signed-in and signed-out subjects both see the shell.
- Text scale 140% does not break the dominant CTA or sector rail.
- Reduced effects disables non-essential motion.

## Theme contract

- The same selected theme affects Home, Intro, shell, settings, audio and profile.
- Portal roots expose theme and text-scale context without remounting open content.
- Media uses the shared theme filter; runtime brightness remains separate.
- Mono Light has light surfaces, dark text, visible focus and no residual black modal.
- Changing theme does not create a white flash.

## Regression checks

- Cyklus menu, active run, poster, outcome and Void remain behaviorally unchanged.
- One `#synthoma-shared-audio` exists after opening Audio and Reader controls.
- Reader deep link and reading resume still work.
- Library and Archive content/data remain unchanged in Phase 5.1.
- Login, Register, Privacy and Terms remain reachable and readable.
- Unknown route uses a themed not-found experience if implemented.

## Release blockers

- Duplicate navigation or global trigger.
- Intro cannot be skipped or repeatedly blocks navigation.
- Wrong Home CTA for saved state.
- Hidden/inaudible focus, keyboard trap or inaccessible dialog close.
- Horizontal overflow, clipped `SYNTHOMA`, covered primary action or unreadable Mono Light.
- Second audio element or interrupted playback on route change.
- Cyklus card/engine/registry regression.

## Known non-blockers

- Existing hook dependency warnings in `BooksClient`, `GameShell` and `TypewriterReader` are outside Phase 5.1 unless touched.
- Full Library, Archive and Reader visual migrations are Phase 5.2+; do not redesign them in Phase 5.1.
- Physical-device media smoothness and safe-area behavior require manual confirmation.
- Visual QA of Intro and Home was not automated in this phase; run this checklist manually.

## Decision

- Shell: PASS / HOLD
- Intro: PASS / HOLD
- Home: PASS / HOLD
- Eight themes: PASS / HOLD
- Mobile / landscape: PASS / HOLD
- Cyklus regression: PASS / HOLD
- Release decision: PASS / HOLD
- Notes:
