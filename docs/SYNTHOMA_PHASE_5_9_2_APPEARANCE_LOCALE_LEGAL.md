# SYNTHOMA Phase 5.9.2 - Appearance, Locale and Legal

Date: 2026-07-18
Branch: `refactor/mnem-entitlement-core`
Implementation base: `7629b94`

## APPEARANCE

- Root cause, opacity: the preference store still wrote legacy Reader variables while the active `ChapterReaderShell` surface used a fixed background alpha.
- Root cause, glass: the toggle did not target the active chapter article, so the stored value had no visible effect.
- Canonical contract: `html[data-reader-glass="on|off"]`, `--reader-surface-opacity`, and `--reader-glass-blur` control the active chapter article declaratively.
- Reader opacity is clamped to the safe range `40-100%`; the Control Center names the target explicitly as `PRŮHLEDNOST ČTECÍ PLOCHY` / `Reader surface opacity`.
- Glass OFF removes `backdrop-filter`. Glass ON applies the independent blur token, the WebKit equivalent, a themed edge, and a static background fallback.
- The blur control is disabled while glass is off and retains its value for the next activation.
- Free and owned chapters share the same Reader surface contract. A locked chapter renders its access gate, not a false prose preview.
- Theme and focus selectors no longer override opacity or glass. Contract tests cover all current theme selectors.
- Local and live production browser measurement: glass OFF produced `backdrop-filter: none`; glass ON produced `blur(12px)`; the article alpha was `0.85`; state survived reload and navigation to the next chapter.
- Persistence is covered by preference/bootstrap tests and local route-change QA.
- Browser automation limitation: the attached browser driver can alter a range element's native value but does not dispatch the React state transition. Exact visual measurements for opacity `100/80/40%` and blur `0/12/24px` remain a short manual visual QA step; their root/CSS contracts and clamping are automated.

## LOCALE

- Previous authorities were split between local storage, a client provider, query state, and chapter resolution.
- Canonical runtime contract: `?locale=en` selects English SSR data; `synthoma_locale` persists the choice; middleware supplies `x-synthoma-locale`; the root layout initializes `html lang` and `LangProvider` from the server value.
- The language switch updates the URL, refreshes server content, and preserves locale through chapter navigation and reload.
- Public shell, mobile navigation, homepage, Reader command bar, access gate, Theme Shop, Control Center, Audio, consent, and legal navigation now consume the active locale.
- All eight themes use one catalog with localized `name` and `description` fields plus localized state, action, error, and purchase labels.
- Approved English chapter coverage: `0-inf-restart`, `0-0-null`, `0-1-start`, `0-2-run`, and `0-3-discontinuum`.
- All five English free chapters returned HTTP 200, `<html lang="en">`, and the full article in initial local production HTML.
- Published chapters without an approved English source show `English translation is not available yet.` and a link to Czech; Czech prose is not silently emitted under `lang="en"`.
- Reader navigation, TTS language, metadata, structured data, Open Graph locale, and hreflang use the resolved chapter locale.
- Live QA found one remaining Czech accessibility label on the chapter progressbar. It was moved to the locale catalog as `reader.progress.aria` and covered in both languages before the final deployment.
- Translation coverage tests require every CS/EN catalog key and every theme description to be present and non-empty.

## LEGAL

- Approved documents already existed at `/terms` and `/privacy`.
- `/terms` truthfully combines terms of use and sale; the footer does not pretend that two separate documents exist.
- Homepage labels: `PODMÍNKY POUŽITÍ A PRODEJE` / `TERMS OF USE AND SALE`, and `OCHRANA OSOBNÍCH ÚDAJŮ` / `PRIVACY POLICY`.
- Exactly one semantic footer and one localized legal navigation are server-rendered at the end of the homepage document flow.
- The footer uses real canonical links, remains crawlable without JavaScript, is not fixed or sticky, and is no longer hidden by a global footer rule.
- Local production responses for `/terms?locale=en` and `/privacy?locale=en` returned HTTP 200 with `<html lang="en">`.

## HOMEPAGE

- The Czech Cyklus action is exactly `SPUSTIT`; the English action is `START`. `SPOUSTIT` is rejected by tests.
- Homepage copy, first-visit guidance, sectors, status labels, and legal navigation switch through the canonical locale.
- SSR and hydrated tests verify the CTA and footer. Existing-profile browser QA reached the new English homepage without clearing site data.
- Responsive browser matrix passed with no horizontal overflow and with the CTA/footer present at `320x568`, `390x844`, `844x390`, `1024x600`, `1366x768`, `1920x1080`, and `2560x1440`.
- Reader article visibility and horizontal-overflow checks passed at the same viewport range.

## TESTS

- Content generation: PASS, 0 files changed.
- Content validation: PASS, 96 entries and 22 chapters.
- Prisma schema validation: PASS. No migration or backfill was run.
- TypeScript: PASS.
- Targeted appearance, preferences, locale, chapter, Theme Shop, homepage, consent, shell, and legal contracts: PASS.
- Full Jest: PASS, 93 suites passed, 1 skipped; 676 tests passed, 21 skipped, 697 total.
- Production build: PASS, 261 pages generated. Only the four previously documented hook dependency warnings remain.
- Local production HTTP/browser QA: PASS except for the explicit manual range-slider visual measurements above.
- Live production QA on `10812a1`: CS/EN homepage SSR, CTA, footer, legal routes, five English free chapters, metadata, Theme Shop descriptions, glass measurement, reload, and route persistence passed. The progressbar localization patch is deployed from the follow-up commit recorded in the release handoff.

## GIT

- `6e9d427 fix: connect Reader opacity and glass preferences to the active surface`
- `ae44cd6 fix: switch chapters and public UI through the canonical locale`
- `81f48f2 fix: localize theme descriptions and remaining English UI`
- `7629b94 fix: expose homepage legal navigation and correct the Cyklus CTA`
- Final test commit: recorded in the release handoff because a commit cannot contain its own SHA.
- Main production QA deployment: `10812a1`.
- Final progressbar patch deployment: this document's follow-up commit; exact SHA is recorded in the release handoff because a commit cannot contain its own SHA.

## RELEASE

- Reader appearance: PASS for implementation, tests, glass measurement, persistence, and route change; manual opacity/blur endpoint comparison remains.
- English locale: PASS after the progressbar accessibility-label patch for the canonical server/client contract and the five approved English chapters.
- Theme localization: PASS for all eight themes.
- Legal footer: PASS in live SSR, hydration, routes, and responsive layout.
- Release status: HOLD only for the manual opacity `100/80/40%` and blur `0/12/24px` visual comparison that the available browser automation cannot drive through React. All automated and live HTTP contracts pass.
