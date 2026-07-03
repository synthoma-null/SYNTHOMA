# SYNTHOMA: CYKLUS — Technická dokumentace

Tento dokument popisuje architekturu, datový model a herní smyčku modulu `cyklus`.

## Architektura

Modul je čistě klientský. Herní stav žije v React komponentě `CyklusClient`, engine je bezstavový (funkce přijímají stav a vracejí nový stav). Ukládání probíhá do `localStorage`.

| Vrstva   | Soubor                                       | Účel                                                              |
|----------|----------------------------------------------|-------------------------------------------------------------------|
| UI       | `src/components/cyklus/CyklusClient.tsx`     | React komponenta, ovládání, zobrazení karet, endingů, inventáře. |
| Styly | `src/styles/cyklus.css` | Vizuální styl karet, statů, outcome, tlačítek, menu, story logu. |
| Engine | `src/game/cyklus/cyklusEngine.ts` | Herní logika: výběr karet, aplikace efektů, krizové itemy, konce, příběhový dopad. |
| Typy | `src/game/cyklus/cyklusTypes.ts` | TypeScript definice stavu, efektů, karet, endingů. |
| Karty | `src/game/cyklus/cyklusCards.ts` | Databáze všech karet (scény, efekty, podmínky, tagy). |
| Itemy | `src/game/cyklus/cyklusItems.ts` | Itemy a jejich pasivní efekty. |
| Imprinty | `src/game/cyklus/cyklusImprints.ts` | Imprinty a odemykání poolů. |
| Unlocky | `src/game/cyklus/cyklusUnlocks.ts` | Podmínky pro odemčení karet/poolů. |
| Storage | `src/game/cyklus/cyklusStorage.ts` | Ukládání/načítání běhu z localStorage; migrace starých stavů (např. inicializace `tension`). |
| Testy | `src/game/cyklus/__tests__/cyklusEngine.test.ts` | Jest unit testy. |

## Herní stav (`CyklusRunState`)

| Pole            | Typ                                    | Popis                                                             |
|-----------------|----------------------------------------|-------------------------------------------------------------------|
| `status`        | `'playing' \| 'dead' \| 'completed'`    | Aktuální stav běhu.                                               |
| `cycle` | `number` | Číslo aktuálního cyklu. |
| `choiceInCycle` | `number` | Počet tahů v aktuálním cyklu (max 12). |
| `totalChoices` | `number` | Celkový počet voleb. |
| `difficulty` | `number` | Stoupá každý cyklus. |
| `sector` | `SectorId` | Aktuální sektor. |
| `visitedSectors` | `SectorId[]` | Unikátní historie sektorů. |
| `stats` | `Record<StatKey, number>` | `energy`, `memory`, `bond`, `control` (0–100). |
| `profile` | `Partial<Record<ProfileKey, number>>` | MBTI osy a funkce. |
| `inventory` | `string[]` | ID itemů. |
| `flags` | `string[]` | Stavové vlajky. |
| `imprints` | `string[]` | Získané imprinty. |
| `entityRelations` | `Record<EntityId, number>` | Vztahy k entitám. |
| `unlockedPools` | `string[]` | Odemčené karetní pooly. |
| `usedCardIds` | `string[]` | Historie použitých karet. |
| `scheduledCards` | `{ cardId, turnsRemaining, cycle }[]` | Naplánované karty. |
| `currentCardId` | `string` | ID karty aktuálně na stole. |
| `history` | `CyklusChoiceRecord[]` | Historie voleb pro analýzu a profil. |
| `lastOutcomeText` | `string` | Text posledního outcome, nyní kombinuje kartu a dynamický příběhový dopad. |
| `tension` | `CyklusTension` | Stav tension directoru. |

## Tension director (`CyklusTension`)

Sleduje herní rytmus a modifikuje skóre karet, aby se příliš často neopakovaly stejné typy situací.

| Pole | Popis |
| --- | --- |
| `calmStreak` | Počet po sobě jdoucích "klidných" karet bez rizika. |
| `crisisStreak` | Počet po sobě jdoucích krizových karet. |
| `itemTriggerStreak` | Počet item trigger karet za sebou. |
| `sameSectorStreak` | Počet karet ze stejného sektoru. |
| `rewardStreak` / `entityStreak` | Sledování odměn a entit. |
| `lastRewardAt` / `lastEntityAt` | Pozice poslední odměny/entity. |

`updateTension` se volá po každé volbě. `applyTensionScore` pak přidává nebo odečítá body podle aktuálních streaků (např. příliš klidný run snižuje skóre klidných karet a zvyšuje krizové karty). Kromě toho `scoreCard` obsahuje robustní anti-repetition logiku: okamžité zopakování předchozí karty je zakázáno, karty z posledních 2 tahů dostávají penalizaci -800, z posledních 4 tahů -400 a z posledních 8 tahů -150.

## Efekty (`CyklusEffect`)

| Typ                 | Parametry                | Popis                                                                 |
|---------------------|--------------------------|-----------------------------------------------------------------------|
| `stat`              | `key`, `amount`          | Změna statu o `amount`, clampnuto na 0–100.                           |
| `profile` | `key`, `amount` | Posun MBTI osy. |
| `flag` | `flag` | Přidá vlajku, pokud již není. |
| `removeFlag` | `flag` | Odebere vlajku. |
| `item` | `itemId` | Přidá item a aplikuje jeho pasivní efekty. |
| `removeItem` | `itemId` | Odebere item. |
| `imprint` | `imprintId` | Přidá imprint a odemkne případný pool. |
| `unlockPool` | `poolId` | Odemkne pool karet. |
| `unlockCard` | `cardId` | Odemkne konkrétní kartu. |
| `moveSector` | `sectorId` | Přesune subjekt do sektoru. |
| `schedule` | `cardId`, `inTurns` | Naplánuje kartu za N tahů. |
| `scheduleNextCycle` | `cardId` | Naplánuje kartu na začátek příštího cyklu. |
| `entityRelation` | `entity`, `delta` | Změní vztah k entitě. |
| `noImmediateEffect` | — | Technický, žádný efekt. |

## Tok herní smyčky (`resolveChoice`)

1. Zkontroluje, že stav je `playing`.
2. Načte aktuální kartu a zvolený outcome (`yes`/`no`).
3. Volá `maybeApplyRubberStamp` — pokud je aktivní `rubber_stamp_ready` a karta je form/office/trap, filtruje negativní stat efekty a spotřebuje vlajku.
4. Aplikuje efekty přes `applyEffects` (volá `applySingleEffect` pro každý efekt a pak `evaluateUnlocks`).
5. Volá `applyCrisisItems` — kontroluje a aplikuje krizové itemy (`rubber_seal_ready`, `acid_filter`, `archive_key`).
6. Zaznamená volbu do `history` včetně `statDelta`, `profileDelta`, `itemsGained` a změny sektoru.
7. Složí `lastOutcomeText` jako spojení původního textu karty (`resultText`) a dynamického příběhového dopadu generovaného `composeImpactNarrative` — ten reaguje na dominantní stat, změnu sektoru, získané itemy a posun profilu.
8. Zkontroluje ending přes `computeEnding`. Pokud je výsledek typu `stabilized`, nastaví `status` na `completed`, jinak `dead`.
9. Pokud není konec, zpracuje konec cyklu (`processCycleEnd`) a vybere další kartu (`pickNextCard`).

## Výběr karet (`pickNextCard`)

1. **Restart sekvence** má prioritu — dokud hráč neprojde `restart_0` až `restart_5`, vybírá se vždy další restart karta.
2. Po restart sekvenci se skórují karty z `getCardPool` pomocí `scoreCard`:
   - Připravené scheduled karty +1000.
   - Krize (`crisis`) +500.
   - Item trigger +400.
   - Follow-up s podmínkami +300.
   - Shoda sektoru +250.
   - Odemčený pool tag +200.
   - Rarita +20–60.
   - Profilová afinita +10.
   - Anti-repetition: okamžitá repetice = 0, posledních 2 tahů -800, 4 tahy -400, 8 tahů -150.
3. Karta nesmí porušit podmínky (`checkCardConditions`).
4. Karty se seřadí podle skóre a vezme se prvních `TOP_CANDIDATES` (max 8) karet s kladným skóre.
5. Z top kandidátů se provede **weighted random** výběr — pravděpodobnost úměrná skóre. Díky tomu není další karta deterministická, ale stále respektuje herní prioritu.
6. Scheduled karty a restart sekvence mají nadále absolutní prioritu a nejsou součástí weighted picku.

## Konce (`computeEnding`)

Funkce nejprve volá `computeCompletion`. Pokud nejsou splněny podmínky stabilizace, kontroluje staty na 0/100. Vrací union `RunEnding`:

- `EndingResult` s `type: 'death'` pro statní smrti.
- `CompletionResult` s `type: 'stabilized'` pro úspěšnou stabilizaci.

Podmínky stabilizace:

- `usedCardIds` obsahuje `restart_5`.
- `imprints.length >= 3`.
- `new Set(visitedSectors).size >= 4`.
- Všechny staty jsou mezi 20 a 80.

## Ukládání a historie běhů

`cyklusStorage.ts` ukládá aktivní běh do `localStorage` pod klíčem `STORAGE_KEY`. Dohromavy s ním ukládá i **historii ukončených běhů** (`HISTORY_KEY`) s limitem `MAX_HISTORY` (50).

Funkce:

- `saveCyklusRun(state)` — uloží aktivní běh.
- `loadCyklusRun()` — načte aktivní běh.
- `clearCyklusRun()` — smaže aktivní běh.
- `loadCyklusRunHistory()` / `saveCyklusRunHistory()` — práce s historií.
- `appendCyklusRunSummary(summary)` — přidá krátký `CyklusRunSummary` do archivu.
- `clearCyklusRunHistory()` — vymaže archiv.

`CyklusRunSummary` obsahuje: `id`, `endedAt`, `status`, `endingTitle`, `cyclesSurvived`, `totalChoices`, `dominantProfile`, `archetype`, `imprints`, `visitedSectors` a případně `deathStat`.

## Analýza smrti (`analyzeDeath`)

Pokud je běh mrtvý, funkce najde stat, který dosáhl 0 nebo 100, a vybere až 3 karty z historie, které k tomu nejvíce přispěly. Vrátí také systemový komentář podle extrému (např. "Příliš vysoká Energie = systém přetaktován").

## Stabilizační pokrok (`computeStabilizationProgress`)

UI panel zobrazuje splněné podmínky pro stabilizovaný konec:

- Přežití restart sekvence (`restart_5`).
- Minimálně 3 imprints.
- Minimálně 4 unikátní sektory.
- Všechny staty mezi 20 a 80.

Panel se zobrazí, jakmile hráč projde restart sekvencí, nebo pokud už má nějakou historii běhů.

## UI komponenty

`CyklusClient.tsx` zobrazuje:

- **Uvítací menu** — při vstupu do hry s uloženým během zobrazí tlačítka `Pokračovat` a `Nová hra`.
- **Kategorie karet** — každá kategorie má vlastní barevný horní pruh (např. `crisis`, `memory`, `entity`, `path`).
- **Trasu sektorů** — vizuální řetězec `void → archive → form_office …` nad hlavní kartou.
- **Stabilizační panel** — kontrolní seznam podmínek pro stabilizaci.
- **Death analysis** — na obrazovce smrti se zobrazí zabitý stat, top karty a komentář.
- **Archiv cyklů** — tlačítkem lze rozbalit seznam posledních běhů s typem konce, profilem, archetypem a počtem cyklů.
- **Outcome panel** — po každé volbě zobrazí příběhový dopad, statové změny, případný přesun sektoru a získané itemy. Zavírá se kliknutím.
- **Story log** — v patičce ukazuje řetěz posledních 3 karet pro lepší příběhovou kontinuitu.
- **Stat popisy** — kliknutí na stat otevře popup s popisem, co daný stat znamená a jaké extrémy hrozí.

## Testy

Spuštění:

```bash
npm test -- --testPathPatterns="cyklusEngine" --no-coverage
```

Testy pokrývají:

- Vytvoření běhu a restart sekvenci.
- Smrt při statu 0/100.
- Krizové itemy (`rubber_seal`, `acid_filter`, `archive_key`).
- Rubber stamp ochranu proti form/office kartám.
- Stabilizovaný konec včetně nastavení `status: 'completed'`.
- Aplikaci efektů (itemy, vlajky, imprinty, entity relation, clamp).
- Výpočet profilu.
- Tension director (update streaků).
- **Anti-repetition** — stejná karta se nezobrazí okamžitě po sobě.
- Shrnutí běhu, analýzu smrti a stabilizační pokrok.
- **Content reachability / consistency** — každý odkazovaný item, imprint, pool, karta, flag a sektor existuje.

## Rozšiřitelnost

- Nová karta se přidá jako záznam v `CYKLUS_CARDS` v `cyklusCards.ts`.
- Nový item do `CYKLUS_ITEMS` v `cyklusItems.ts`; pasivní efekty se aplikují automaticky při získání.
- Nový imprint do `CYKLUS_IMPRINTS` v `cyklusImprints.ts`; `unlockPool` odemkne pool při získání.
- Nový unlock poolu se přidá do `CYKLUS_UNLOCKS` v `cyklusUnlocks.ts`.
- Nová entita do `EntityId` v `cyklusTypes.ts` a případně `ENTITY_LABELS` v `CyklusClient.tsx`.
- Nový sektor do `SectorId` v `cyklusTypes.ts` a `SECTOR_LABELS` v `CyklusClient.tsx`.
- Pro doplnění tension logiky uprav `updateTension` a `applyTensionScore` v `cyklusEngine.ts`.
- Pro změnu příběhového dopadu uprav `composeImpactNarrative` a `statChangeNarrative` v `cyklusEngine.ts`.
- Pro nové ukončení běhu aktualizuj `summarizeRun` a `computeEnding` v `cyklusEngine.ts`.
- Pro nové statové popisy uprav `STAT_DESCRIPTIONS` v `cyklusTypes.ts`.
- Pro změnu vstupního menu uprav `CyklusClient.tsx` a `cyklus.css`.
