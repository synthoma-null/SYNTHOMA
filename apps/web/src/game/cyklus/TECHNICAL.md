# SYNTHOMA: CYKLUS — Technická dokumentace

Tento dokument popisuje architekturu, datový model a herní smyčku modulu `cyklus`.

## Architektura

Modul je čistě klientský. Herní stav žije v React komponentě `CyklusClient`, engine je bezstavový (funkce přijímají stav a vracejí nový stav). Ukládání probíhá do `localStorage`.

| Vrstva    | Soubor                                             | Účel                                                                               |
|-----------|----------------------------------------------------|------------------------------------------------------------------------------------|
| UI        | `src/components/cyklus/CyklusClient.tsx`           | React komponenta, ovládání, zobrazení karet, endingů, inventáře.                   |
| Styly     | `src/styles/cyklus.css`                            | Vizuální styl karet, statů, outcome, tlačítek, menu, story logu.                   |
| Engine    | `src/game/cyklus/cyklusEngine.ts`                  | Herní logika: výběr karet, efekty, krizové itemy, konce, příběhový dopad.          |
| Typy      | `src/game/cyklus/cyklusTypes.ts`                   | TypeScript definice stavu, efektů, karet, endingů.                                 |
| Karty     | `src/game/cyklus/cyklusCards.ts`                   | Databáze všech karet (scény, efekty, podmínky, tagy).                              |
| Itemy     | `src/game/cyklus/cyklusItems.ts`                   | Itemy a jejich pasivní efekty.                                                     |
| Imprinty  | `src/game/cyklus/cyklusImprints.ts`                | Imprinty a odemykání poolů.                                                        |
| Unlocky   | `src/game/cyklus/cyklusUnlocks.ts`                 | Podmínky pro odemčení karet/poolů.                                                 |
| Storage   | `src/game/cyklus/cyklusStorage.ts`                 | Ukládání/načítání běhu z localStorage; migrace starých stavů.                      |
| Testy     | `src/game/cyklus/__tests__/cyklusEngine.test.ts`   | Jest unit testy.                                                                   |

## Herní stav (`CyklusRunState`)

| Pole               | Typ                                        | Popis                                                              |
|--------------------|--------------------------------------------|--------------------------------------------------------------------|
| `status`           | `'playing' \| 'dead' \| 'completed'`       | Aktuální stav běhu.                                                |
| `cycle`            | `number`                                   | Číslo aktuálního cyklu.                                            |
| `choiceInCycle`    | `number`                                   | Počet tahů v cyklu (max 12).                                       |
| `totalChoices`     | `number`                                   | Celkový počet voleb.                                               |
| `difficulty`       | `number`                                   | Stoupá každý cyklus (max 5).                                       |
| `sector`           | `SectorId`                                 | Aktuální sektor.                                                   |
| `visitedSectors`   | `SectorId[]`                               | Unikátní historie sektorů.                                         |
| `stats`            | `Record<StatKey, number>`                  | `energy`, `memory`, `bond`, `control` (0–100).                     |
| `profile`          | `Partial<Record<ProfileKey, number>>`      | MBTI osy a funkce.                                                 |
| `inventory`        | `string[]`                                 | ID itemů.                                                          |
| `flags`            | `string[]`                                 | Stavové vlajky.                                                    |
| `imprints`         | `string[]`                                 | Získané imprinty.                                                  |
| `entityRelations`  | `Partial<Record<EntityId, number>>`        | Vztahy k entitám, clampnuto na −10..10.                            |
| `unlockedPools`    | `string[]`                                 | Odemčené karetní pooly.                                            |
| `unlockedCards`    | `string[]`                                 | Explicitně odemčené karty (efekt `unlockCard`).                    |
| `usedCardIds`      | `string[]`                                 | Celá historie použitých karet (full log, ne unikátní).             |
| `scheduledCards`   | `ScheduledCardEntry[]`                     | Naplánované karty s `turnsRemaining` a `ifInvalid`.                |
| `currentCardId`    | `string`                                   | ID karty aktuálně na stole.                                        |
| `history`          | `CyklusChoiceRecord[]`                     | Záznamy voleb pro analýzu a profil.                                |
| `lastOutcomeText`  | `string?`                                  | Text posledního outcome (resultText + impactNarrative + krize).    |
| `lastCycleSummary` | `string?`                                  | Shrnutí posledního ukončeného cyklu.                               |
| `cycleSummaries`   | `string[]`                                 | Archiv shrnutí všech cyklů.                                        |
| `tension`          | `CyklusTension`                            | Stav tension directoru.                                            |
| `seed`             | `string`                                   | Seed pro RNG (formát: `timestamp-random`).                         |
| `rngStep`          | `number`                                   | Čítač kroků RNG, inkrementuje se po každém weighted picku.         |

## Seeded RNG

`seededRandom(seed, step)` implementuje FNV-1a hash nad řetězcem `"seed:step"`. Výstup je číslo 0–1. `Math.random()` se v enginu **nepoužívá** — všechny náhodné volby jsou deterministické a reprodukovatelné ze stejného `seed` + sekvence akcí.

`rngStep` se inkrementuje:
- v `resolveChoice` po každé volbě (o +1),
- v `pickNextCardState` po výběru karty (o +1).

## Volby (`CyklusChoiceRecord`)

Každá volba zaznamenává diff stavu před a po aplikaci všech efektů (včetně krizových itemů):

| Pole              | Typ                                    | Popis                                  |
|-------------------|----------------------------------------|----------------------------------------|
| `statDelta`       | `Partial<Record<StatKey, number>>`     | Δ statů.                               |
| `profileDelta`    | `Partial<Record<ProfileKey, number>>`  | Δ profilových os.                      |
| `flagsGained`     | `string[]`                             | Nové vlajky.                           |
| `itemsGained`     | `string[]`                             | Získané itemy.                         |
| `itemsLost`       | `string[]`                             | Ztracené itemy.                        |
| `imprintsGained`  | `string[]`                             | Nové imprinty.                         |
| `poolsUnlocked`   | `string[]`                             | Nově odemčené pooly.                   |
| `scheduledAdded`  | `string[]`                             | Naplánované karty (cardId).            |
| `entityDelta`     | `Partial<Record<EntityId, number>>`    | Δ vztahů k entitám.                    |
| `sectorBefore`    | `SectorId`                             | Sektor před volbou.                    |
| `sectorAfter`     | `SectorId`                             | Sektor po volbě.                       |

## Tension director (`CyklusTension`)

| Pole                | Popis                                                          |
|---------------------|----------------------------------------------------------------|
| `calmStreak`        | Po sobě jdoucí klidné karty bez rizika.                        |
| `crisisStreak`      | Po sobě jdoucí krizové karty.                                  |
| `itemTriggerStreak` | Item trigger karty za sebou.                                   |
| `sameSectorStreak`  | Karty „sedící" v aktuálním sektoru (viz `cardMatchesCurrentSector`). |
| `rewardStreak`      | Tahy od poslední karty s odměnou (item/imprint).               |
| `entityStreak`      | Tahy od poslední entity karty.                                 |
| `lastRewardAt`      | `totalChoices` při poslední odměně.                            |
| `lastEntityAt`      | `totalChoices` při poslední entitě.                            |

`applyTensionScore` zvyšuje skóre karet, které průběh rozruší (např. krize po 3 klidných kartách, nebo karta mimo sektor po 4 sektorových). `sameSectorStreak >= 4` zvýhodní karty **mimo** aktuální sektor o +140.

## Sektor matching (`cardMatchesCurrentSector`)

Karta „sedí" v sektoru, pokud platí **alespoň jedna** z podmínek:

1. `card.sector === state.sector`
2. karta má podmínku `{ type: 'sector', sector: state.sector }`
3. `card.tags.includes(state.sector)`
4. karta sdílí tag s `SECTOR_TAG_MAP[state.sector]`

`SECTOR_TAG_MAP` mapuje každý sektor na sadu tagů (např. `glitchka_nest → ['glitchka', 'glitch', 'bug']`).

## Podmínky karet (`checkCondition`)

Podporované typy:

| Typ                      | Popis                                                          |
|--------------------------|----------------------------------------------------------------|
| `hasItem` / `missingItem`| Inventář obsahuje/neobsahuje itemId.                           |
| `hasFlag` / `missingFlag`| Flags obsahuje/neobsahuje flag.                                |
| `hasAnyFlag`             | Alespoň jedna z `flags[]` je aktivní.                          |
| `hasAllFlags`            | Všechny z `flags[]` jsou aktivní.                              |
| `statBelow` / `statAbove`| Stat pod/nad hodnotou.                                         |
| `sector`                 | Aktuální sektor.                                               |
| `visitedSector`          | Sektor byl navštíven.                                          |
| `visitedSectorCountAtLeast` | Počet unikátních sektorů ≥ count.                           |
| `cycleAtLeast`           | Číslo cyklu ≥ cycle.                                           |
| `difficultyAtLeast`      | Obtížnost ≥ difficulty.                                        |
| `unlockedPool`           | Pool je odemčen.                                               |
| `hasImprint` / `missingImprint` | Imprint je/není přítomen.                              |
| `imprintCountAtLeast`    | Počet imprintů ≥ count.                                        |
| `entityRelationAtLeast`  | Vztah k entitě ≥ value.                                        |
| `entityRelationAtMost`   | Vztah k entitě ≤ value.                                        |
| `usedCard` / `notUsedCard` | Karta byla/nebyla použita.                                   |
| `totalChoicesAtLeast`    | Celkový počet voleb ≥ count.                                   |

## Efekty (`CyklusEffect`)

| Typ                 | Parametry          | Popis                                                            |
|---------------------|--------------------|------------------------------------------------------------------|
| `stat`              | `key`, `amount`    | Δ statu, clamp 0–100.                                            |
| `profile`           | `key`, `amount`    | Δ MBTI osy.                                                      |
| `flag`              | `flag`             | Přidá vlajku.                                                    |
| `removeFlag`        | `flag`             | Odebere vlajku.                                                  |
| `item`              | `itemId`           | Přidá item + pasivní efekty.                                     |
| `removeItem`        | `itemId`           | Odebere item.                                                    |
| `imprint`           | `imprintId`        | Přidá imprint + odemkne pool.                                    |
| `unlockPool`        | `poolId`           | Odemkne pool karet (přidá do `unlockedPools`).                   |
| `unlockCard`        | `cardId`           | Odemkne kartu (přidá do `unlockedCards`).                        |
| `moveSector`        | `sectorId`         | Přesune subjekt do sektoru.                                      |
| `schedule`          | `cardId`, `inTurns`| Naplánuje kartu za N tahů.                                       |
| `scheduleNextCycle` | `cardId`           | Naplánuje na začátek příštího cyklu.                             |
| `entityRelation`    | `entity`, `delta`  | Δ vztahu, clamp −10..10.                                         |
| `noImmediateEffect` | —                  | Žádný efekt (technický placeholder).                             |

## Scheduled karty

`ScheduledCardEntry` má pole: `cardId`, `turnsRemaining`, `cycle?`, `ifInvalid?`.

Po každé volbě:

1. `tickScheduledCards` — sníží `turnsRemaining` o 1.
2. `cleanupScheduledCards` — pro karty s `turnsRemaining <= 0` zkontroluje podmínky. Pokud nesedí, aplikuje `ifInvalid`:
   - `'drop'` (výchozí) — odstraní záznam.
   - `'delay'` — nastaví `turnsRemaining = 3`.
   - `'force'` — zachová záznam, karta se přehraje i bez podmínek.
3. `pickNextCardState` — pokud je karta ready, vymaže `ScheduledCardEntry` přes `clearScheduledCard`.

Scheduled karty obcházejí anti-repetition penalizaci (dostávají fixní skóre 10 000).

## Tok herní smyčky (`resolveChoice`)

1. Zkontroluje `status === 'playing'`.
2. Načte kartu a outcome (`yes`/`no`).
3. `maybeApplyRubberStamp` — filtruje negativní stat-efekty pro form/office/trap karty.
4. `applyEffects` — aplikuje všechny efekty a `evaluateUnlocks`.
5. `applyCrisisItems` — vrací `{ state, interventionText? }`. **Intervention text se připojí k outcomeText — nikoliv nezávisle přepíše `lastOutcomeText`.**
6. Diff stavu před/po → `CyklusChoiceRecord` (statDelta, flagsGained, itemsLost, imprintsGained, poolsUnlocked, scheduledAdded, entityDelta…).
7. `composeImpactNarrative(record, card)` — generuje příběhový dopad (stat, sektor, itemy, ztráty, imprinty, pooly, entity, profil).
8. Složení `outcomeText = resultText + impactNarrative + interventionText`.
9. `computeEnding` — kontrola smrti/stabilizace.
10. Pokud cyklus skončil: `processCycleEnd` → `composeCycleSummary` → uloží do `cycleSummaries`.
11. `tickScheduledCards` → `cleanupScheduledCards` → `pickNextCardState`.

## Výběr karet (`pickNextCard`)

1. **Restart sekvence** — `restart_0` až `restart_5` mají absolutní prioritu.
2. `getCardPool` filtruje karty:
   - `once` karta již použita → out.
   - `maxUses` vyčerpán → out.
   - `cooldown` (alias pro maxUses) vyčerpán → out.
   - `cooldownTurns` — méně tahů od posledního použití než limit → out.
   - `triggerMode: 'scheduledOnly'` — karta není ready-scheduled → out.
3. `explainCardScore` (nebo `scoreCard`) ohodnotí každou kartu:
   - Ready-scheduled: **10 000** (bypass anti-repeat).
   - Crisis: +500, item trigger: +400, followup: +300.
   - `cardMatchesCurrentSector`: +250.
   - Unlocked pool tag: +200.
   - Rarita: +20–60.
   - Profilová afinita: +10.
   - Anti-repetition: okamžitá → 0, ≤3 tahy → 0, ≤6 → −900, ≤10 → −500, ≤15 → −200.
   - `applyTensionScore`: ±100–150 podle streaků.
4. Top 8 kandidátů → **seeded weighted random** (`weightedPick` s `seed` a `rngStep`).
5. Pokud jsou ready-scheduled karty, výběr proběhne jen z nich.

### Debug helper

```typescript
explainCardScore(state, card)  // CardScoreBreakdown { score, reasons[] }
getTopScoredCards(state, 5)    // top N karet s rozpisem skóre
```

## Profil (`computeProfile`)

- `pickAxis(a, b, av, bv)` — pokud `|av - bv| <= 1`, osa je remíza (`'x'`). `dominantLabel` pak obsahuje `x` a suffix `-like`.
- `profileConfidence` (0–100) — součet rozdílů os děleno celkový počet profilových bodů. Nízká hodnota = málo dat.
- `stability` (0–100) — počet statů mimo 15–85 × 25; 4 extremní staty = 0.
- `uncertainAxis` — string se jmény os v remíze, nebo `undefined` (exactOptionalPropertyTypes kompatibilní).

## Konce (`computeEnding`)

- **Smrt**: stat ≤ 0 nebo ≥ 100 → `RunEnding` s `type: 'death'`.
- **Stabilizace**: `restart_5` použit, ≥ 3 imprinty, ≥ 4 unikátní sektory, všechny staty 20–80 → `type: 'stabilized'`.

## Ukládání (`cyklusStorage`)

- **localStorage** — primární cache, funguje i bez přihlášení.
- **Server sync** — pro přihlášené uživatele se stav, historie i discovery ukládají na server přes `/api/me/cyklus`. Při načtení `CyklusClient` nejprve zkusí server, při selhání fallback na localStorage.
- `loadServerCyklusRun()` — async načtení z DB.
- `saveCyklusRun(state)` / `saveCyklusRunHistory(history)` — persistují localStorage a fire-and-forget server sync.
- `clearCyklusRun()` — smaže localStorage i serverový záznam.

`loadCyklusRun()` obsahuje **migraci** pro staré uložené stavy:

- Chybějící `seed` → `"migrated-{timestamp}"`.
- Chybějící `rngStep`, `unlockedCards`, `cycleSummaries` → výchozí hodnoty.
- Záznamy `history` bez nových polí (`itemsLost`, `imprintsGained`, `poolsUnlocked`, `scheduledAdded`, `entityDelta`) → doplní prázdné pole/objekty.

## Analýza smrti a stabilizace

- `analyzeDeath(state)` — najde stat na 0/100, top 3 přispívající karty z history, systemový komentář.
- `computeStabilizationProgress(state)` — boolean stav 4 podmínek stabilizace pro UI.

## C2 engine extensions

- `updateRunGoals(state, cardId, direction)` — returns `{ state, log, newlyCompleted }`. Goal rewards are applied via `rewardPool` unlocks only when `newlyCompleted` is non-empty.
- `checkItemCombos(state, cardId, direction)` — returns `{ state, log, activatedCombo }`. Logs when an item combo becomes active.
- `getComboHint(state, itemId)` — returns a localized hint for the missing combo piece when one item of a known combo is held.
- `getActiveContracts(state)` — returns active contract records with `bonus`, `commitment`, and `collectCardId` status.
- `generatePreRunWarning(state)` — returns the localized pre-run warning text shown before the first card/forecast.
- `resolveChoice` order: card outcome → goal update + reward → impact narrative → crisis items → `lastOutcomeText`.
- Overload cards are tagged with `overload` and rendered with a high-risk warning in `CyklusClient`.

## C2.1 — Mechanic Integrity Patch

- `applyModifierScore(state, score, card)` — run modifiers now influence card selection scoring. Bonus/penalty values are small enough to keep determinism and balance intact.
- `CyklusChoiceRecord` carries `statsAfter` so goal evaluation can measure actual post-choice stat values (used by `memory_high_5`).
- `no_crisis_item` goal only completes when `state.status === 'completed'` and no crisis item was used.
- `updateDiscoveryFromRun(state, { variantId, findingIds })` persists stabilization variants and diagnostic findings into the discovery archive.
- `generatePreRunWarning` uses the real `last.deathStat` from run history; the seed only varies the wording.
- `cyklusStorage.migrateState` fills missing `modifier`, `goals`, `lastItemActivationCycle`, `itemActivationCount`, `activeContracts`, `preRunWarning`, `preRunChoice` and `statsAfter` on old saves.
- Goal `rewardPool` reachability is verified by a dedicated content test.

## UI / CSS vylepšení

- `StatDock` highlights chips whose values changed after a choice (`cyklus-stat-chip--changed`) and accepts `highlight` for tutorial focus (`cyklus-stat-chip--highlight`).
- Tutorial cards (`tutorial_stats`, `tutorial_balance`, `tutorial_choice`, `tutorial_consequences`) pulse the corresponding UI element (stats, action buttons, pocket).
- Pocket shows mood-based ambient glow via `cyklus-pocket--mood-{mood}`; `unstable` and `angry` items pulse subtly.
- Mobile-first responsive tweaks keep the stat dock sticky and readable down to 360 px.
- `focus-visible` rings and `prefers-reduced-motion` guards improve accessibility.

## Testy

```bash
npx jest src/game/cyklus --no-coverage
```

Pokrytí (82+ testů):

- Vytvoření běhu, restart sekvence.
- Smrt při statu 0/100, krizové itemy, rubber stamp.
- Stabilizovaný konec.
- Efekty (itemy, vlajky, imprinty, entity, clamp).
- `computeProfile` — prázdný profil, rozhodný profil, `uncertainAxis`.
- Tension director.
- Anti-repetition.
- Shrnutí běhu, analýza smrti, stabilizační pokrok.
- **Content reachability** — každý odkazovaný item, imprint, pool, karta a flag existuje.
- C2 helpers: `updateRunGoals`, `checkItemCombos`, `getComboHint`, `getActiveContracts`, `generatePreRunWarning`, goal reward application, overload risk tags.
- Simulace: balance assertions (death 40–70%, completion ≤ 65%) a campaign progression.

## Rozšiřitelnost

- **Nová karta** → `CYKLUS_CARDS` v `cyklusCards.ts`.
- **Nový item** → `CYKLUS_ITEMS` v `cyklusItems.ts`; pasivní efekty se aplikují automaticky.
- **Nový imprint** → `CYKLUS_IMPRINTS` v `cyklusImprints.ts`.
- **Nový pool** → `CYKLUS_UNLOCKS` v `cyklusUnlocks.ts`.
- **Nová entita** → `EntityId` v `cyklusTypes.ts`.
- **Nový sektor** → `SectorId` v `cyklusTypes.ts` + řádek v `SECTOR_TAG_MAP` v `cyklusEngine.ts`.
- **Nová podmínka** → přidat typ do `CardCondition` v `cyklusTypes.ts` + case do `checkCondition`.
- **Nový efekt** → přidat do `CyklusEffect` union v `cyklusTypes.ts` + case do `applySingleEffect`.
- **Tension** → `updateTension` a `applyTensionScore`.
- **Příběhový dopad** → `composeImpactNarrative` a `statChangeNarrative`.
- **Nový konec** → `computeEnding` a `summarizeRun`.
