# SYNTHOMA Phase 5.10 - First Contact

## Scope

Phase 5.10 removes the first-contact barrier for public guests without changing book content, chapter IDs, Cyklus logic, MNEM, entitlements, prices, database schema, preference schema, service-worker strategy, or the public AI gameplay API.

Canonical descriptors:

- CS: **SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv uvnitř rozbitého terapeutického systému.**
- EN: **SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.**

Both variants are visible in initial HTML and used by homepage metadata and WebSite JSON-LD.

## Original Audit

Before this phase a new browser was intercepted by the full-screen `/landing-intro` route. The homepage itself already contained useful material, but the first visit delayed it and the generic primary action pointed to the Library rather than a free chapter.

| Signal | Before | After |
| --- | --- | --- |
| First heading | SYNTHOMA after intro | SYNTHOMA immediately |
| First explanation | poetic system hook | poetic hook followed by literal descriptor |
| First three content actions | obscured by intro/global utility hierarchy | Story, Cyklus, Archive |
| Auth impression | available without a clear benefit hierarchy | explicitly optional and secondary |
| Free chapter | 2 interactions for a new browser | 1 interaction |
| First Cyklus run | 2 interactions for a new browser | 1 interaction |
| World explanation | 2 interactions for a new browser | 1 interaction |
| Initial SSR | content plus utility-heavy shell/dialog markup | descriptor and public paths before lazy utility content |

Returning anonymous readers still receive a resume action when local progress exists. An active Cyklus still receives its continuation action. Signed-in behavior is unchanged.

## Guest Journey

The first-contact block is compact, non-modal and server-rendered. Its three crawlable paths are:

1. `ZAČÍT PŘÍBĚH / START THE STORY` -> `/chapter/0-inf-restart`
2. `SPUSTIT CYKLUS / START THE CYCLE` -> `/cyklus`
3. `POCHOPIT SVĚT / UNDERSTAND THE WORLD` -> `/archive`

English links preserve `?locale=en`. The guest notice explicitly says the first traces are public and that identity is needed only for synchronization, chapter ownership, MNEM, Subject Profile and persistent Cyklus progress. Login and registration follow the public paths visually and semantically.

## Focus Reading

The existing `focusMode` preference now drives `data-reader-focus` without changing the preference schema. One click hides the fixed global header, route utilities, identity, language switch and machine links. It keeps chapter text, reading progress, previous/next navigation and a visible exit control. Escape exits Focus. Audio playback and the global motion preference are not changed.

## Semantic HTML

- `SynthomaShell` places main content before the fixed command header in DOM order.
- Control Center dialog content is mounted only while open.
- Audio playlist content is mounted only while open and is labelled `DOPROVODNÝ ZVUK / AMBIENT AUDIO`.
- `/cyklus` exposes its public explanation before the game client.
- `/archive` exposes public records before the interactive archive client.
- `/books` exposes its no-JavaScript chapter list before the library client.
- Track names, themes, opacity controls and TTS controls are absent from closed utility markup.

## Public SSR

- `/`: descriptor, guest explanation and all three entry paths are present without JavaScript.
- `/books`: book heading, free-start guidance and chapter links with free/locked labels are present in the no-JavaScript fallback.
- `/archive`: localized public Archive records precede the interactive client.
- `/autor`: canonical CS/EN author HTML is loaded on the server; it includes WalliCzech, the project origin and the role of text, music, code and images.
- `/cyklus`: localized rules and free guest entry precede the game client.

## Search And Social

Homepage, Library, Archive, Author and Cyklus have unique titles and descriptions, canonical URLs, CS/EN/x-default alternates, locale-aware Open Graph fields, Twitter large-image cards and the 1200x630 SYNTHOMA preview asset. Published chapter previews remain chapter-specific. Sitemap `lastModified` is the real discovery-content date `2026-07-18`, not request time.

`llms.txt` uses the literal project descriptor and links directly to the free story, Cyklus and Archive. The public Markdown index uses the same definition.

Manual reindex list:

- `https://www.synthoma.cz/`
- `https://www.synthoma.cz/books`
- `https://www.synthoma.cz/chapter/0-inf-restart`
- `https://www.synthoma.cz/archive`
- `https://www.synthoma.cz/autor`
- `https://www.synthoma.cz/cyklus`

After deployment, submit the sitemap and inspect the URLs in Google Search Console, then submit the same sitemap and URLs in Bing Webmaster Tools. Search snippets may retain old text for several days. Social previews should be refreshed manually through Facebook Sharing Debugger and LinkedIn Post Inspector, then checked in Discord, WhatsApp and the available X card preview.

## Verification

Targeted contracts cover homepage CS/EN SSR, real guest hrefs, secondary auth, no-JavaScript meaning, utility ordering, closed playlist/dialog markup, Author SSR source, Focus behavior, unique public metadata, localized chapter metadata and sitemap entries.

Local verification after the runtime fixes:

- `npm run content:validate`: PASS, 96 entries and 22 chapters.
- `npx prisma validate`: PASS.
- `npm run typecheck`: PASS.
- Targeted first-contact, Focus, service-worker and SEO contracts: PASS.
- Full Jest baseline: 95 suites passed, 1 skipped; 692 tests passed, 21 skipped, 713 total.
- `npm run build`: PASS. The only lint output is the pre-existing hook dependency warnings in `BooksClient`, `GameShell` and `TypewriterReader`.
- `git diff --check`: PASS.

## Browser QA

Verified production viewports: `320x568`, `390x844`, `844x390`, `1024x600`, `1366x768`, `1920x1080`, `2560x1440`.

- All seven sizes had zero horizontal overflow.
- Story, Cyklus and Archive were visible in the first viewport at every size. Short-height rules were corrected after live QA exposed the original decorative stack at `320x568`, `844x390` and `1024x600`.
- EN guest journey opened `/chapter/0-inf-restart?locale=en`, `/cyklus?locale=en` and `/archive?locale=en` in one click. The free chapter exposed full text without an auth gate.
- CS exposed the exact localized descriptor, all three canonical paths and the explicit optional-account explanation.
- Focus hid the global header while preserving article, progress, chapter navigation and the exit control. It persisted from `0-inf-restart` to `0-0-null`, exited through the visible control and through Escape, and left the preference restored to OFF.
- Live mobile QA exposed that the generic small-screen utility selector also hid Focus. The selector now hides only Share; Focus is visible and operable at `390x844`.
- Motion OFF was already selected in the existing profile. The live root reported `data-motion="off"` and `data-background-motion="off"`; no preference was changed.
- The in-app browser could not reach the host-local server although terminal HTTP returned `200`, so interactive viewport QA was completed against the deployed production build instead of a local browser tab.

Status: **PASS on the live production browser matrix**.

## Live Production QA

Verified at `https://www.synthoma.cz` on `2026-07-18 21:49 +02:00`.

Runtime deployment commits:

- `d7c0633` first-contact and guest hierarchy.
- `5529990` direct Story, Cyklus and Archive paths.
- `bbd312b` one-click Reader Focus.
- `ba6f7ad` semantic public-content priority.
- `c4bc182` public discovery and social metadata.
- `8186981` short-viewport first-contact layout.
- `7f3ce91` reliable service-worker registration and update check.
- `8ed978c` mobile Reader Focus visibility.
- `803f056` English chapter metadata fallback.

Live results:

- Initial homepage HTML contains the localized descriptor and exactly three crawlable first-contact paths. Closed Control Center and playlist text are absent.
- `/`, `/books`, `/chapter/0-inf-restart`, `/archive`, `/autor` and `/cyklus` returned `200 text/html` with semantic main content for generic, Googlebot, OAI-SearchBot and ChatGPT-User user agents.
- Main content preceded utility markup in all 24 route/user-agent checks.
- Homepage, Library, free chapter, Archive, Author and Cyklus exposed unique title, description, canonical, Open Graph image and Twitter large-image metadata. Live QA found and corrected the Czech teaser fallback on the English free chapter.
- `robots.txt`, `sitemap.xml` and `llms.txt` returned `200`, contained no localhost URL, and sitemap contained no `/reader` route.
- The existing local Subject Profile opened without an error and retained its local trace. It reported MNEM as disconnected, which is correct for the unsigned local profile. No profile, progress or preference data was deleted.
- An existing browser session initially returned an old stylesheet. Live QA traced this to service-worker registration waiting for an already-fired `load` event. After `7f3ce91`, the same session advanced to the current shell without unregistering the worker or clearing storage.
- Both Vercel production checks passed for each runtime hotfix before the corresponding live assertion.

Status: **PASS for public, guest and local-profile production paths**.

## Hold Points

- Signed-in profile behavior was not re-exercised in the available browser session because it was an unsigned local profile. Automated profile contracts remain green; no account was created or modified.
- The post-first-chapter registration prompt was not triggered manually because completing the chapter would mutate the existing local reading record. Its guest/auth hierarchy is covered by component contracts.
- Search-engine reindexing and social cache refresh are manual external follow-ups; they do not block the application release when live metadata is correct.
