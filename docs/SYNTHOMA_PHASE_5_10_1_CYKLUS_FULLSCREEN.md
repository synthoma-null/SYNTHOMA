# SYNTHOMA Phase 5.10.1 - Cyklus fullscreen game shell

Date: 2026-07-18

## Regression and fix

The `/cyklus` route had been changed into a landing page around the game. A long
public introduction preceded `CyklusClient` and an AI/API discovery section
followed it. Both blocks extended the document beyond the game viewport.

The route now renders one main element only: `#cyklus-game`. The public intro
and the `CYKLUS // PUBLIC INTERFACE` block were removed from route markup and
from the accessibility tree. Their obsolete CSS was removed as well.

Public information remains available through homepage copy, route metadata,
`/ai/api`, `/api/public/v1/cyklus`, the OpenAPI documents, and `/llms.txt`.
The specialized public API contracts were not changed.

## Shell contract

- `#cyklus-game` is fixed to `inset: 0`, `width: 100%`, and `height: 100dvh`.
- The game shell and its parent wrappers use hidden overflow; card text, Pocket,
  and existing overlays retain their own controlled scrolling.
- `/cyklus` and all `/cyklus/*` routes do not render the public global command
  header or mobile navigation.
- The Cyklus status and Identity, Settings, Audio, and tutorial-skip controls now
  live in the route-owned `CyklusCommandRail` inside the game viewport.
- The skip link remains the first focusable page control, is fixed outside the
  viewport until focused, and targets `#cyklus-game` on the gameplay route.
- Metadata title, description, canonical, hreflang, Open Graph, Twitter, and the
  JSON public-rules alternate remain unchanged.

## Verification

Browser geometry passed at `320x568`, `390x844`, `844x390`, `1024x600`,
`1366x768`, `1920x1080`, and `2560x1440`. At every size the game root measured
from `y=0` to the viewport bottom, document width and height matched the
viewport exactly, and the removed copy, global header, and footer had zero DOM
matches. The compact command rail remained inside the viewport.

Automated state coverage includes the first tutorial, tutorial skip, menu,
saved-run continuation, normal cards, Pocket, current Trace, poster viewer,
choice and system modals, outcomes, end report, Void overlay, and authenticated
and anonymous component paths. CS/EN route metadata and skip-link labels remain
covered. Motion preference styling does not alter shell positioning or height.

- Content validation: PASS - 96 entries, 22 chapters.
- Prisma validation: PASS.
- TypeScript: PASS.
- Targeted fullscreen and shell tests: PASS - 96/96.
- Full Jest: PASS - 96 suites, 695 passed, 21 skipped.
- Production build: PASS - 261 static pages.
- Existing non-Cyklus hook warnings: unchanged in BooksClient, GameShell, and
  TypewriterReader.

## Live production QA

Runtime deployment commit: `56c439445edace1dbe90a2e8dc0e2e21c51d6d1e`.
Verified at `2026-07-18 22:53:16 +02:00` on
`https://www.synthoma.cz/cyklus`. The final release handoff records the
documentation-only amended SHA because a commit cannot contain its own hash.

- Both production Vercel checks completed successfully.
- Fresh server HTML returned HTTP 200, contained `#cyklus-game`, canonical,
  Open Graph, and Twitter metadata, and contained none of the removed public
  intro, public-interface, or AI-access copy.
- The existing browser profile loaded the new shell without clearing site data.
  Normal navigation after deployment retained the new shell, confirming that
  no stale service-worker document restored the removed layout.
- Hydrated CS and EN routes both filled the viewport and used the localized
  compact Cyklus command rail. The global header and all footers were absent.
- All seven required production viewport measurements matched document width
  and height exactly, with no horizontal scroll. Landscape `844x390` passed.
- The existing saved tutorial run loaded read-only at turn 1/12. Opening Pocket
  and current Trace did not alter the game-root or document dimensions.
- The existing profile had Motion OFF selected. With Control Center open, the
  game root remained `1366x768`, document height remained 768 px, and removed
  copy did not return.
- A separate stateless public run completed all 12 choices with 12 unique cards,
  a completed ending, no cookie, and a cleared terminal state token. It did not
  use the browser profile or modify user save data.
- `/llms.txt`, `/llms-full.txt`, both OpenAPI formats, and the public Cyklus API
  index remained available with HTTP 200 and their expected content types.

Live checks: **PASS**.

Overall Phase 5.10.1 decision: **PASS**.
