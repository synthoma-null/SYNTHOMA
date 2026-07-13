# SYNTHOMA Phase 5.4 — deployment a rollback runbook

## Rozsah a bezpečnost prostředí

Runbook pokrývá migrace entitlementů a MNEM ledgeru, deterministický backfill,
kanonický obsahový katalog a ověření nákupní cesty. Příkazy zapisující do DB se
smějí spustit až po dvojí kontrole cílového hostu a databáze. Pro stagingové
ověření byla použita výhradně lokální PostgreSQL 16.14 na loopbacku; produkční
`.env.local`, přístupové kódy, tokeny ani osobní údaje nebyly použity.

## Ověřený stagingový základ

| Položka | Ověřená hodnota |
| --- | --- |
| PostgreSQL | 16.14, `127.0.0.1`, izolované dočasné databáze |
| Node.js | 24.12 |
| Prisma CLI / client | 7.8.0 / 7.8.0 |
| Čistá databáze | všech 6 migrací aplikováno; `prisma validate` PASS; schema diff „No difference detected“ |
| Čistý smoke zápis | User, MnemLedger a Entitlement vloženy uvnitř transakce a následně vráceny zpět |
| Legacy databáze před backfillem | 3 users, 11 ledger rows, 5 entitlements, 3 legacy package rows, 2 redeem claims, 1 Stripe reference |
| Legacy po migraci a apply | 3 users, 11 ledger rows, 9 entitlements, 0 záporných zůstatků, 0 chybějících `balanceAfter`, constraint validovaný |
| Zachování dat | 3 legacy package rows, 2 redeem claims, 1 Stripe reference a 2 ReadingProgress rows zachovány |
| Opakovaný dry-run | 0 plánovaných entitlementů, 0 ledger oprav, 0 neznámých referencí |

Deterministické pořadí historického ledgeru je `userId`, `createdAt ASC`,
`id ASC`, s počátečním zůstatkem 0. První dry-run legacy fixture naplánoval
4 entitlementy a 11 oprav ledgeru. Migrace ledger doplnila; apply vložil přesně
4 chybějící entitlementy a validoval check constraint. Druhý dry-run byl prázdný.
Negativní fixture byla odmítnuta před zápisem a v reportu použila pouze
anonymizovaný hash řádku.

## Pořadí nasazení

Ještě před bodem 1 zapiš cílový hostname, database name, verzi aplikace a
operátora. Ověř, že cíl není omylem jiné prostředí a že release neobsahuje dumpy
ani tajné hodnoty. Potom dodrž přesně toto pořadí:

1. **Záloha databáze.** Potvrď dokončenou zálohu a nacvičenou obnovu do odděleného prostředí.
2. **Maintenance nebo kompatibilní deploy režim.** Pozastav nákupy, granty, redeem a admin korekce, nebo nejprve nasaď kompatibilní build; přechodné staré zápisy chrání DB triggery.
3. **`prisma migrate deploy`.** Aplikuj všech 6 migrací bez ručních zásahů do tabulek.
4. **`prisma validate`.** Ověř Prisma model a navíc nulový schema drift příkazem migrate diff.
5. **Backfill dry-run.** Spusť bez `--apply` a ulož pouze agregované výsledky.
6. **Kontrola unknown references.** Při jediné neznámé referenci nebo záporném průběžném zůstatku zastav release.
7. **Backfill apply.** Spusť `--apply` právě jednou a porovnej zapsané počty s plánem.
8. **Druhý dry-run.** Požadovaný výsledek je 0 plánovaných změn.
9. **Validace constraintů.** Ověř `convalidated = true`, nezáporné zůstatky, úplné `balanceAfter` a nulové generic duplicity.
10. **Deploy aplikace.** Nasaď finální build odpovídající migrovanému schématu.
11. **Smoke test access endpointů.** Ověř free, locked, owned, unavailable i neznámé ID a JSON chybové odpovědi.
12. **Smoke test Library.** Ověř shodný ownership a cenu z kanonického katalogu.
13. **Smoke test Reader.** Ověř free/locked/owned obsah a fail-closed stav.
14. **Smoke test next chapter purchase.** Proveď desktopový i mobilní průchod od poslední free kapitoly po owned stav po reloadu.
15. **Smoke test Archive.** Ověř teaser bez entitlementu a full body po nákupu.
16. **Smoke test Stripe/redeem.** Ověř podepsaný event, replay, unresolved stav a bezpečný redeem replay bez logování plaintextu.
17. **Monitoring chyb.** Sleduj aplikační chyby, 4xx/5xx, DB konflikty a agregované počty; maintenance ukonči jen při PASS gates.
18. **Rollback plán.** Při FAIL/HOLD ponech zápisy uzavřené a postupuj podle sekce „Rollback a forward-fix“ níže.

Příkazy z databázových a regresních bodů se spouštějí z `apps/web`:

```powershell
npx prisma migrate deploy
npx prisma validate
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code
npm run entitlements:backfill
npm run entitlements:backfill -- --apply
npm run entitlements:backfill
npm run test:postgres
npm run content:generate
npm run content:validate
npm run typecheck
npx jest --no-coverage
npm run build
```

## Bezpečné agregované SQL kontroly

Dotazy nevybírají e-mail, token, redeem plaintext ani externí tajné hodnoty.

```sql
SELECT 'users' AS metric, count(*) AS value FROM "User"
UNION ALL SELECT 'ledger', count(*) FROM "MnemLedger"
UNION ALL SELECT 'entitlements', count(*) FROM "Entitlement"
UNION ALL SELECT 'redeem_records', count(*) FROM "AccessCode" WHERE "used" = true
UNION ALL SELECT 'external_grants', count(*) FROM "ExternalGrantEvent"
UNION ALL SELECT 'reading_progress', count(*) FROM "ReadingProgress";

SELECT conname, convalidated
FROM pg_constraint
WHERE conrelid = '"MnemLedger"'::regclass
  AND conname = 'MnemLedger_balanceAfter_nonnegative';

SELECT count(*) AS negative_balance_rows
FROM "MnemLedger" WHERE "balanceAfter" < 0;

SELECT count(*) AS missing_balance_rows
FROM "MnemLedger" WHERE "balanceAfter" IS NULL;

SELECT "userId", "contentType", "contentId", count(*)
FROM "Entitlement"
WHERE "packageId" IS NULL
GROUP BY "userId", "contentType", "contentId"
HAVING count(*) > 1;
```

## Rollback a forward-fix

Migrace jsou aditivní a backfill je idempotentní. Po legitimním nákupu nikdy
„nevracej migraci“ mazáním ledgeru, purchase receipts nebo entitlementů. To by
porušilo auditní stopu i vlastnictví.

Při chybě nejprve znovu uzavři zápisy, vrať aplikační traffic na poslední
kompatibilní build a zachovej DB. Preferuj forward-fix migraci nebo auditovanou
reconciliation opravu. Obnova celé DB ze zálohy je dovolená jen tehdy, pokud od
okamžiku zálohy nevznikl žádný legitimní post-deploy zápis; jinak je nutná
reconciliation a explicitní rozhodnutí vlastníka provozu. Kompatibilní triggery
doplňují starým aplikačním zápisům nové povinné hodnoty, nejsou však náhradou za
co nejrychlejší nasazení aktuální aplikace.

## Release gates

PASS vyžaduje: všech 6 migrací, nulový schema drift, prázdný druhý dry-run,
validovaný constraint, nulové záporné/missing balance řádky, zachované agregované
počty, 6/6 PostgreSQL concurrency testů, deterministický katalog, zelený celý
Jest/typecheck/build a PASS desktopového i mobilního nákupního průchodu.

HOLD nastává při jediné neznámé katalogové referenci, negativním průběhu,
nevalidovaném constraintu, změně historických počtů mimo plán, duplicitním debitu,
nejasném cílovém prostředí nebo chybějícím rights-approved kanonickém zdroji.
Aktuální stagingová migrace je PASS; produkční release zůstává HOLD do dokončení
browser QA a vyřešení `SYNTHOMA-NULL.txt` podle `docs/CANON_SOURCES.md`.
