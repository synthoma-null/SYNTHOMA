# SYNTHOMA Phase 5.4 — závěrečný report

Datum uzavření: 13. 7. 2026
Výchozí HEAD: `5c30c38`
Větev: `refactor/mnem-entitlement-core`

## Výsledek

Phase 5.4 sjednocuje MNEM ekonomiku, vlastnictví obsahu a rozhodování o přístupu do jednoho serverového modelu. Zůstatek MNEM, entitlement a reading progress jsou samostatné domény. Library, Reader, Archive, balíčky, fragmenty, artefakty, témata, redeem, Stripe, administrace a profil používají společné služby a kanonický katalog.

Kapitola, která existuje, ale je zamčená, už není prezentována jako 404. Neznámé ID je 404, nevydaný obsah je `unavailable`, zamčené API vrací strukturované 403 a HTML kapitoly se vydává pouze po kladném serverovém rozhodnutí. Stránka `/chapter/[id]` je dynamická, takže entitlement není předrenderovaný z anonymního kontextu.

## Dodaná architektura

- Kanonický katalog obsahuje 96 záznamů a 22 kapitol se stabilními ID, cenami, dostupností, soubory, aliasy a vazbami balíčků.
- `getContentAccess` a dávkový `getAccessSnapshot` jsou jediná serverová autorita pro stavy `free`, `owned`, `locked` a `unavailable`.
- Nákup MNEM zamyká řádek uživatele, běží v serializovatelné transakci a atomicky vytváří debit, entitlement a receipt. Cena přichází pouze ze serverového katalogu.
- Idempotency chrání přímé nákupy, admin úpravy, redeem i externí Stripe granty. Současné nákupy nemohou stáhnout zůstatek pod nulu.
- Balíček se ukládá jedním entitlementem a rozbaluje pouze v resolveru; dětské entitlementy se nematerializují.
- `AccessProvider` po nákupu okamžitě aplikuje serverový snapshot a invaliduje další povrchy i panely přes událost, storage a `BroadcastChannel`.
- Mise vyhodnocují dokončení kapitoly pouze z `ReadingProgress`; samotné vlastnictví kapitoly není herní postup.
- Běžící aplikace zapisuje ledger a entitlementy jen přes `src/server/economy`. Samostatný backfill je záměrný jednorázový maintenance writer.

## Databáze a backfill

Přidány byly migrace:

- `20260713120000_mnem_entitlement_core`
- `20260713130000_external_grant_events`

Backfill je ve výchozím stavu dry-run a zapisuje pouze s `--apply`. Skutečný dry-run proti nakonfigurované databázi doběhl takto:

```text
mode dry-run
schemaMode legacy-pre-migration
scanned entitlements 31, fragmentUnlocks 0, artifacts 0, cosmetics 3, ledgerEntries 11
plannedEntitlements 6
insertedEntitlements 0
unknownReferences []
ledgerAudit balanceMismatches 0, missingBalanceAfter 11, negativeHistoricalBalances 0
```

Vzdálená databáze zůstala beze změny: migrace ani zapisující backfill nebyly v rámci implementační větve nasazeny. Bezpečné pořadí nasazení je `prisma migrate deploy`, dry-run `npm run entitlements:backfill` a teprve po kontrole `npm run entitlements:backfill -- --apply`.

## Ověření finálního stavu

| Kontrola | Výsledek |
| --- | --- |
| Jest | 49/49 sad prošlo; 503 prošlo, 15 přeskočeno, 518 celkem |
| TypeScript | `tsc --noEmit --incremental false` prošel |
| Prisma | schéma je validní |
| Katalog | 96 záznamů, 22 kapitol, validace prošla |
| Produkční build | Next.js 15.5.19 prošel; `/chapter/[id]` je dynamická trasa |
| Formát patche | `git diff --check` prošel |
| Přímé runtime zápisy | pouze sdílené ledger/entitlement služby |

Build ponechává čtyři dřívější neblokující upozornění `react-hooks/exhaustive-deps` v `BooksClient`, `GameShell` a `TypewriterReader`; nejde o regresi Phase 5.4. Ruční scénáře jsou připravené v QA matici, ale nebyly prohlašovány za provedené bez nasazených migrací a testovací platební konfigurace.

## Commitová sekvence

1. `docs: audit Synthoma MNEM and content access system`
2. `refactor: establish canonical Synthoma content catalog`
3. `feat: add transactional MNEM ledger and entitlement service`
4. `feat: unify content access and purchase APIs`
5. `refactor: migrate Library and Reader to entitlement access`
6. `fix: replace locked next chapter 404 with purchase flow`
7. `refactor: migrate Archive, packages and fragments to entitlements`
8. `refactor: migrate redeem, Stripe and admin grants to shared services`
9. `feat: add MNEM account and ownership history to profile`
10. `test: verify transactional purchases and cross-site unlock consistency`
11. `docs: add MNEM economy, access authoring and manual QA`

## Akceptace

Požadované implementační body Phase 5.4 jsou hotové: audit, katalog, schéma, transakční ekonomika, resolver, API, migrované UI povrchy, Stripe/redeem/admin integrace, profilová historie, backfill, automatické testy, autorská dokumentace i ruční QA matice. Další fáze nebyla zahájena.

Soubor `SYNTHOMA-NULL.txt` nebyl ve workspace ani historii dostupný. Tato mezera a použité náhradní lore zdroje jsou zaznamenány v auditním dokumentu.
