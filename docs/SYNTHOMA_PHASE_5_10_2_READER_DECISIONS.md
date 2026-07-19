# SYNTHOMA Phase 5.10.2 - Reader decision highlight and lock

Date: 2026-07-19

## Original behavior

Canonical `/chapter/[id]` pages rendered chapter choices as inert paragraphs or
ordinary links. The older TypewriterReader contained a visual lock, but stored
the selected group by source URL, DOM position, answer index, and answer text.
That state was locale-specific and did not protect canonical Reader choices.

The server-side `ChoiceEvent` route is an append-only progression and analytics
event stream. It is not currently an authoritative Reader decision document:
the Reader never loads it to restore UI state, and the schema has no unique
question key. This phase does not change that database contract.

## Stable decision contract

`readerDecisionCatalog.ts` defines 61 question contracts across all 13
published chapters. Every question has a chapter-scoped stable `questionId` and
every option has a stable `choiceId`. The catalog also freezes the expected
source tags so a changed or reordered chapter fails closed instead of silently
attaching a stored choice to different prose.

The same catalog is applied to Czech and English content. Runtime persistence
uses only `chapterId`, `questionId`, and `choiceId`; answer text, locale, source
URL, and DOM index are not persisted as identity.

## Persistence and idempotency

Guest and signed-in browsers use the versioned local key
`synthoma_reader_decisions:v1`, separate from `synthoma_ui_preferences`.
Synchronous storage commit is the first side effect. A read-back confirmation
must succeed before the existing MBTI/progression tracking callback runs.

The question enters `submitting` immediately. A second click, double click,
Enter plus click, or another option in the same question sees the committed
record and cannot replace it or replay its callback. Reload, Back/Forward,
chapter return, locale, Focus, Motion, and theme changes all resolve from the
same stable record.

Server-backed cross-device restoration remains **HOLD**. `ChoiceEvent` continues
to receive the existing one-time tracking event when available, but it is not
presented as a second decision authority. Making it authoritative requires a
separate idempotent server contract and database uniqueness guarantee.

## Presentation and accessibility

- Selected choices receive a cyan/themed edge, restrained inner glow, stable
  contrast, and a localized Czech / English recorded marker.
- Unselected locked choices remain readable at 58% opacity and lose all hover
  movement. No green/red correctness language or checkmark is used.
- Every group exposes `data-state="locked"` and
  `data-selected-choice="<choiceId>"`.
- Options expose `aria-pressed`, `aria-disabled`, and stable data IDs. The
  selected option remains focusable; no keyboard trap is introduced.
- A polite live region announces the localized choice-locked status only for a
  new commit. Restoration does not replay the announcement or animation.
- Before hydration, the chapter decision container is inert and busy. The
  controller removes this pending gate only after IDs and stored choices are
  restored, preventing a briefly clickable unlocked state.
- Storage failure returns the group to an unlocked error state and announces a
  localized retry message.
- Commit animation lasts 220 ms. Motion OFF disables animation and transition;
  reduced motion keeps only effectively immediate color and opacity changes.

## Automated verification

- Content catalog: 96 entries and 22 chapters.
- Prisma schema: valid.
- TypeScript: PASS.
- Reader decision and existing Reader targeted tests: 29/29 PASS in the final
  release rerun.
- Full Jest baseline: 99 suites and 707 tests PASS, with 1 suite and 21 tests
  intentionally skipped.
- Production build: PASS, 261 static pages.
- Existing hook dependency warnings outside this phase remain unchanged in
  BooksClient, GameShell, and TypewriterReader.

## Local browser QA

The mutating scenario used a localhost interaction store. The selected `e`
choice in `0-inf-restart` remained selected and locked after reload and EN to CS
switch; its marker changed from English to Czech. A keyboard attempt to
activate the other option was rejected, Focus kept the selected option visible,
and Motion OFF produced `animation: none` and a zero-second transition.

The selected and unselected options remained visible without horizontal scroll
at `320x568`, `390x844`, `844x390`, `1024x600`, `1366x768`, `1920x1080`, and
`2560x1440`. The final locked opacity measured 1.0 and 0.58 respectively.

The available localhost browser session was signed in, but its Prisma runtime
connection returned the known `EACCES` error for ChoiceEvent and entitlement
queries. The choice POST failed with HTTP 500, so no server-side test decision
was created. Owned chapter browser QA is therefore locally **HOLD**.

## Live production QA

Deployment SHA: `7ba3d93da427c371fb8c879a3bf44b7521db5d19`.

Both Vercel production checks completed successfully on 2026-07-19. The live
canonical `0-inf-restart` chapter initialized to `data-reader-decisions="ready"`
in both Czech and English, removed the pre-hydration `inert` gate, and exposed
five stable question groups with ten accessible choice controls. A canonical
reload without the deployment query parameter produced the same ready state,
so the live service-worker path did not retain stale markup.

The public chapter had no horizontal overflow at `320x568`, `390x844`,
`844x390`, `1024x600`, `1366x768`, `1920x1080`, and `2560x1440`. No production
choice was submitted. The available production browser session reached the
purchase gate for `0-4-defragmentation`, so owned-chapter restoration is
**HOLD** rather than inferred from a session without the required entitlement.

Mutating signed-in QA will not be performed against the existing production
account. It requires a separate anonymous browser profile or dedicated test
account. Cross-device server restoration remains the explicit architectural
HOLD described above.

Overall Phase 5.10.2 decision: **PASS** for the shipped local interaction,
stable identity, hydration, locale, reload, accessibility, motion, and
responsive contracts. **HOLD** remains limited to owned-chapter production
restoration, mutating production-account QA, and cross-device server-backed
restoration.
