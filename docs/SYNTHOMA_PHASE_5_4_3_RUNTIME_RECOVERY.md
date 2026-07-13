# SYNTHOMA Phase 5.4.3 - Runtime Database Recovery

- Datum auditu: 2026-07-13
- Vetev: `refactor/mnem-entitlement-core`
- Vychozi commit: `561dc19`
- Runtime recovery: **PASS**
- Database deployment: **HOLD**
- Release decision: **HOLD**, dokud nebude bezpecne potvrzeno DB prostredi, zaloha a migracni okno

## P0 diagnoza

Oprava vznikla az po samostatne reprodukci chyb. Zapisove databazove operace nebyly provedeny.

### Profile error

- Request: `GET /api/me/profile`
- Runtime dopad: serverova vyjimka misto citelneho profilu
- Prisma chyby:
  - `P2022`: chybi `MnemLedger.balanceAfter`
  - `P2021`: chybi tabulka `public.Purchase`
  - dalsi profilovy dotaz narazil na nove sloupce legacy tabulky `Entitlement`
- Puvodni pricina: aplikacni Prisma Client odpovida novejsimu schematu nez pripojena databaze.
- Bezpecnost logu: server loguje scope, correlation ID, Prisma code, model, column a call frames bez request dat, uzivatelskych dat a SQL hodnot.

### Chapter error

- Overene requesty: free, owned/locked, unavailable a unknown chapter API i `/chapter/[id]`
- Prisma chyba: `P2022`, chybi `Entitlement.contentType`
- Dalsi zjisteny mismatch: `CyklusRun.progressionJson` chybi v pripojene databazi
- Puvodni dopad: databazova chyba mohla rozbit pristup ke znamemu obsahu.
- Druhy nalez: App Router vykreslil 404 obsah pro nezname ID, ale streamovana page route vratila HTTP `200`.

## Databazovy cil

Bezpecne maskovany cil z lokalniho runtime prostredi:

```text
DB_HOST=aws-0-eu-west-3.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_ENV=unknown-remote
DB_CREDENTIALS=[REDACTED]
```

- PostgreSQL: `17.6`
- Prisma CLI: `7.8.0`
- Prisma Client: `7.8.0`
- `DIRECT_URL`: neni nastaveno
- `SYNTHOMA_POSTGRES_TEST_URL`: neni nastaveno

Hostname ani konfigurace bezpecne neurcuji staging nebo production. Proto nebyl spusten `prisma migrate deploy`, backfill apply ani jina zapisova operace.

## Schema audit

`prisma validate` prosel. `prisma migrate status` se pres pooler nedokoncil v casovem limitu; stejny stav byl proto overen read-only SQL dotazy do katalogu PostgreSQL a `_prisma_migrations`.

### Application expects

- `Entitlement`: `contentType`, `contentId`, `source`, `sourceReference`, `metadata`, `expiresAt`, `grantedAt`
- `MnemLedger`: `balanceAfter`, `transactionType`, `contentType`, `contentId`, `packageId`, `externalReference`, `idempotencyKey`, `actorUserId`
- tabulky `Purchase`, `ExternalGrantEvent`, `AdminAuditLog`
- constraint `MnemLedger_balanceAfter_nonnegative`
- `CyklusRun.progressionJson`

### Database contains

- legacy `Entitlement` s vazbami `packageId` a `chapterId`
- legacy `MnemLedger` bez noveho transakcniho a zustatkoveho kontraktu
- tri aplikovane migrace: `0_init`, `20250101000000_baseline`, `20260704133633_add_cyklus_run`

### Missing

- uvedene nove sloupce `Entitlement` a `MnemLedger`
- tabulky `Purchase`, `ExternalGrantEvent`, `AdminAuditLog`
- `CyklusRun.progressionJson`
- constraint `MnemLedger_balanceAfter_nonnegative`; `convalidated` tedy neni dostupne
- tri lokalni migrace cekaji na deployment:
  - `20260713120000_mnem_entitlement_core`
  - `20260713130000_external_grant_events`
  - `20260713140000_align_cyklus_progression_json`

### Extra

V auditovanem rozsahu nebyl nalezen neznamy extra objekt, ktery by vyzadoval odstraneni. Legacy sloupce zustavaji zamerne zachovane pro kompatibilitu a budou reseny migracnim planem, ne runtime patchem.

## Runtime opravy

### Text selection

Puvodni zakaz vyberu byl lokalni a portalove dialogy nebyly potomky card shellu. Sdilena trida `.cyklus-no-select` je nyni na gameplay rootu a explicitne take na oddelenych portal roots:

- karta, menu a tutorial/restart overlay
- consequence/system/outcome card overlay
- Kapsa a bottom sheets
- discovery, build a VoidHub overlay
- stat popup
- Profil subjektu a Identity panel na `/cyklus`
- Audio a Settings panel na `/cyklus`
- samostatna `/cyklus/void` prezentace

Formularove prvky `input`, `textarea`, `select` a `[contenteditable="true"]` zachovavaji vyber textu. Obrazek posteru ma `draggable={false}`, blokovany `dragstart` a CSS `-webkit-user-drag: none`.

Browser drag aserce nebyla spustena: projekt nema Playwright/Cypress runner a in-app browser odmitl lokalni automatizaci bezpecnostni politikou. Nebylo nic instalovano ani obchazeno. Tato cast zustava rucnim QA bodem na rozlisenich 1366x768, 1920x1080 a 390x844.

### Subject Profile

- UI rozlisuje `LOADING`, `SIGNED OUT`, `EMPTY`, `PARTIAL DATA`, `DATABASE ERROR` a `READY`.
- `P2021/P2022` nad novejsimi profile queries aktivuji omezeny legacy read fallback.
- Prazdny ledger, prazdne entitlementy, chybejici profile/psyche zaznam a chybejici `Purchase` tabulka nezpusobi React crash.
- Skutecna DB nedostupnost vraci retryable `503` s correlation ID.
- Chybovy panel nenabizi stack; obsahuje bezpecne `ZKUSIT ZNOVU` a `ZAVRIT`.

### Chapters

- Free a unavailable obsah se vyhodnoti z katalogu bez zavislosti na DB.
- Owned pristup podporuje nove i legacy entitlement schema.
- Necekana DB chyba zustava fail-closed: protected HTML se nevydava, response je retryable `503` nebo retry gate se correlation ID.
- Zname locked a unavailable kapitoly nejsou zamene za 404.
- `/chapter/[id]` zustava `force-dynamic`.
- Route guard pred streamovanim zachovava canonical IDs i aliasy a vraci skutecne HTTP `404` pro neznamy chapter path.
- Reader u free kapitoly zbytecne neopakuje databazovy access request.

Produkci podobny HTTP smoke:

| Request | Status |
| --- | ---: |
| `/chapter/0-0-null` | 200 |
| `/chapter/null` | 200 |
| `/chapter/unknown-chapter` | 404 |
| `/api/chapter/0-0-null` | 200 |
| `/api/chapter/0-4-defragmentation` (signed out) | 403 |
| `/api/chapter/0-12-conflict` | 409 |
| `/api/chapter/unknown-chapter` | 404 |
| `/api/me/profile` (signed out) | 401 |

## Backfill a DB testy

`npm run entitlements:backfill` byl spusten pouze jako dry run:

- scanned: entitlements 31, fragments 0, artifacts 0, cosmetics 3, ledger 11
- planned entitlements: 6; inserted: 0
- planned ledger updates: 11; updated: 0
- unknown references: 0
- balance mismatches: 0
- missing `balanceAfter`: 11
- negative historical balances: 0
- final balance mismatches: 0
- nonnegative constraint: absent / unvalidated

Apply a druhy dry run nebyly provedeny, protoze `DB_ENV` je `unknown-remote`.

`npm run test:postgres` skoncil pred jakymkoli zapisem: chybi `SYNTHOMA_POSTGRES_TEST_URL`. Integracni overeni proti migrovane disposable PostgreSQL proto zustava blockerem databazoveho deploymentu.

## Automaticke overeni

- TypeScript: PASS, 0 errors
- Cileny regression run: PASS, 10 suites / 74 tests
- Final Jest: PASS, 56 suites / 534 tests; 1 suite a 21 tests skipped
- Content generation: PASS, 0 souboru zmeneno
- Content validation: PASS, 96 entries / 22 chapters
- Prisma validate: PASS
- Production build: PASS
- Production chapter HTTP smoke: PASS
- `git diff --check`: PASS

Build stale hlasi ctyri zname hook dependency warningy mimo tento scope: `BooksClient`, `GameShell` a dva v `TypewriterReader`.

## Git

- `6d80c47 fix: apply Cyklus selection lock across all gameplay portals`
- `2b97124 fix: recover Subject Profile from access and database failures`
- `dfeb7f7 fix: restore chapter access against the deployed database schema`
- `5e286d3 test: verify profile chapter and Cyklus portal regressions`
- `docs: add runtime database recovery report` (tento dokument)

`tsconfig.tsbuildinfo`, `.next`, databazove dumpy, `.env`, screenshoty, logy ani osobni data nejsou soucasti commitu. Tri predem existujici uzivatelske testove zmeny zustaly mimo staging a nebyly upraveny ani revertovany.

## Release rozhodnuti

### Runtime recovery: PASS

Kompatibilni read fallbacky, fail-closed pristup, explicitni UI stavy, hard 404 a selection-lock kontrakt jsou pokryte Jestem, TypeScriptem, buildem a HTTP smoke testem.

### Database deployment: HOLD

Pred zapisem je nutne:

1. Potvrdit, zda maskovany Supabase cil je staging nebo production.
2. Dodat a overit primy `DIRECT_URL`, ne pouze transaction pooler.
3. Vytvorit a overit obnovitelnou zalohu nebo disposable kopii.
4. Na staging/disposable DB spustit `prisma migrate deploy`, `prisma validate`, backfill dry run, schvaleny apply a druhy idempotencni dry run.
5. Spustit `npm run test:postgres` s oddelenym `SYNTHOMA_POSTGRES_TEST_URL`.
6. Pro production vyzadat explicitni schvaleni migracniho okna a maintenance postupu.
7. Dokoncit rucni authenticated smoke pro owned chapter, profil s nakupy a drag selection ve vsech Cyklus portalech.

Do splneni techto bodu se migrace na pripojene vzdalene databazi nesmi automaticky spoustet.
