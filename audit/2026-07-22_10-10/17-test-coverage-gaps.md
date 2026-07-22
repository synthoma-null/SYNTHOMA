# Test coverage a mezery

## Výsledek

- Jest: 118/119 suites passed, 1 skipped; 790 passed, 21 skipped, 811 celkem.
- Coverage: statements 70.96 %, branches 61.71 %, functions 70.03 %, lines 74.68 %.
- Skipy: PostgreSQL transaction suite bez explicitního connection stringu a heavy Cyklus simulace bez RUN_SLOW_SIM=1.
- Není zavedený vlastní Playwright/Cypress screenshot runner. Playwright je pouze transitivně přítomen v lockfile, ne jako potvrzený projektový QA systém.

## Nejnižší line coverage

- src\components\access\ContentPurchaseDialog.tsx: lines 5.71 %, branches 0 %
- src\components\cyklus\CyklusVoidHubClient.tsx: lines 5.93 %, branches 0 %
- src\hooks\useChoiceTracking.ts: lines 7.36 %, branches 0 %
- src\components\archive\ArchivePublicFallback.tsx: lines 9.09 %, branches 0 %
- app\components\ControlCenterAudio.tsx: lines 10.14 %, branches 0 %
- src\server\economy\ledger.ts: lines 13.72 %, branches 3.84 %
- src\server\economy\transaction.ts: lines 16.66 %, branches 0 %
- src\components\profile\MnemHistoryPanel.tsx: lines 20 %, branches 12.5 %
- src\game\cyklus\cyklusImprints.ts: lines 33.33 %, branches 100 %
- src\game\cyklus\cyklusItems.ts: lines 33.33 %, branches 100 %
- src\lib\useVideoVisibility.ts: lines 33.33 %, branches 25 %
- src\server\runtimeDatabase.ts: lines 41.66 %, branches 23.07 %
- src\components\cyklus\CyklusPocketPanel.tsx: lines 42.1 %, branches 53.12 %
- src\content\booksManifest.ts: lines 42.85 %, branches 100 %
- src\lib\readerState.ts: lines 44 %, branches 100 %
- src\components\reader\ReaderDecisionController.tsx: lines 44.82 %, branches 16.66 %
- src\game\cyklus\cyklusItemMood.ts: lines 45.23 %, branches 38.58 %
- app\cards\[id]\page.tsx: lines 47.05 %, branches 0 %
- app\archive\page.tsx: lines 48.14 %, branches 37.5 %
- app\books\page.tsx: lines 50 %, branches 13.63 %
- src\lib\readerSegmentRenderer.ts: lines 50 %, branches 22.03 %
- src\lib\synthoma\library\getLibraryCatalog.ts: lines 50 %, branches 100 %
- src\components\cyklus\StatDock.tsx: lines 52.56 %, branches 44 %
- src\content\speakers.ts: lines 53.33 %, branches 30 %
- app\chapter\[id]\ChapterAccessGate.tsx: lines 53.84 %, branches 65.71 %

## Kritické mezery

1. Browser choice gate: čekání, skip, reload před/po volbě, poslední volba a nedostupnost budoucí větve.
2. PWA: skutečný install prompt, controller, update lifecycle, offline navštívené kapitoly a cache cleanup.
3. Accessibility/visual: computed typography, kontrast, keyboard flow, 200% zoom a screenshot diff.
4. Whispers: signed-out, signed-in, empty table, DB failure a konzistentní JSON error.
5. Ekonomika: ledger.ts 13.72 % a transaction.ts 16.66 % lines; PostgreSQL integrační suite je podmíněně skipnutá.
6. Owned chapter/profile runtime se skutečnou session; komponentové mocky nejsou důkaz databázového toku.
7. Public AI rate limit přes více instancí/cold start.
8. Produkční console/hydration/network monitoring.

## Co je dobře kryto

Content validation, katalog, chapter access kontrakty, Cyklus engine/content invariants, veřejné API visibility, reader utility logika, PWA build pravidla a řada komponentových stavů mají široký automatický baseline. Počet testů je užitečný; release jistotu však omezuje absence skutečné browser vrstvy.
