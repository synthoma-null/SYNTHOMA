# SYNTHOMA: CYKLUS

Cyklus je sólový roguelite-like zážitek v rámci světa SYNTHOMA. Hráč tah po tahu prochází „kartami" — krátkými scénami, každá s volbou ano/ne. Cílem není dosáhnout maximálních hodnot, ale udržet subjekt v rovnováze a splnit podmínky stabilizovaného konce.

## Základní principy

- **Karty** jsou scény s volbou `yes` / `no`. Volby nejsou morální, ale diagnostické značky MBTI-style profilu.
- **Statistiky** se pohybují v rozsahu 0–100. Extrém v jakémkoliv směru (0 nebo 100) ukončí běh smrtí.
- **Cílem je rovnováha**, ne maximum. Ideální stav pro stabilizaci je všech 4 statů mezi 20–80.
- **Sektor** reprezentuje aktuální lokaci. Navštívené sektory se ukládají a ovlivňují dostupný obsah.
- **Cyklus** má 12 tahů. Po dosažení limitu se cyklus restartuje, obtížnost mírně stoupá a stav je shrnut v `cycleSummaries`.

## Statistiky

| Stat      | Český název | Popis                                       |
|-----------|-------------|---------------------------------------------|
| `energy`  | Energie     | Vnitřní napětí, jas, aktivita.              |
| `memory`  | Paměť       | Množství uchovaných dat, vzpomínek, šumu.   |
| `bond`    | Vazba       | Spojení s ostatními, systémem, entitami.    |
| `control` | Kontrola    | Schopnost udržet strukturu, rozhodovat se.  |

## Profil (MBTI)

Každá volba posouvá profilové osy (E/I, S/N, T/F, J/P a 8 funkcí Ni/Ne/Si/Se/Ti/Te/Fi/Fe). `computeProfile` vrací:

- `dominantLabel` — 4-písmenný typ (`INFJ` apod.), nebo `xxxx-like` pokud jsou osy remíza.
- `profileConfidence` (0–100) — jak rozhodné jsou všechny 4 osy; nízká hodnota = málo profilových dat.
- `stability` (0–100) — vzdálenost statů od extrémů; 4 staty mimo 15–85 = `stability: 0`.
- `uncertainAxis` — seznam os v remíze (např. `"E/I, J/P"`), nebo `undefined`.
- `archetype` — pojmenování typu v herním světě (např. `"Prorok v mlze"`).

## Entitní vztahy

Soustava `entityRelations` sleduje vztah k entitám světa (`glitchka`, `sarkasma`, `tai`, `archive`, `shadow`, `form`). Hodnota je clampnuta na `-10..10`. Ovlivňuje dostupnost karet a unlocků.

## Itemy a vlajky

- **Itemy** jsou hmatatelné předměty v kapse. Můžou mít pasivní efekty (vlajky) nebo spouštět specifické karty.
- **Vlajky (flags)** jsou stav světa/subjektu, nikoli fyzické věci. Např. `cult_badge_active` versus `cult_badge`.
- Krizové itemy mají vlajky typu `_ready` a aktivují se při extrémních hodnotách.

## Krizové itemy

| Item           | Efekt                                                                                |
|----------------|--------------------------------------------------------------------------------------|
| `rubber_seal`  | Zachrání před smrtí z Vazby 0/100. Nastaví 15 nebo 85 a spotřebuje se.              |
| `acid_filter`  | Zachrání před smrtí z Energie 100. Srazí na 85 a spotřebuje se.                     |
| `archive_key`  | Zachrání před smrtí z Paměti 0/100. Přesune do Archivu, nastaví paměť na 15 nebo 85.|
| `rubber_stamp` | Jednou zruší negativní stat-efekty karty s tagem `form`/`office`/`trap`.            |

## Scheduled karty

Kartu lze naplánovat přes efekt `schedule` (za N tahů) nebo `scheduleNextCycle` (začátek příštího cyklu). Mechaniky:

- Scheduled karty mají absolutní prioritu (skóre 10 000) a **obcházejí anti-repetition penalizaci**.
- `ifInvalid` na kartě nebo `ScheduledCardEntry` určuje, co se stane, pokud nejsou splněny podmínky: `'drop'` (výchozí, zahodí), `'delay'` (odloží o 3 tahy), `'force'` (přehraje přesto).
- `triggerMode: 'scheduledOnly'` — karta se může zobrazit **jen** jako naplánovaná (ne z běžného poolu).
- `triggerMode: 'both'` — karta se zobrazuje normálně i jako naplánovaná.

## Cooldown karet

| Pole           | Chování                                                                               |
|----------------|---------------------------------------------------------------------------------------|
| `once`         | Karta se zobrazí max jednou za celý běh.                                              |
| `maxUses`      | Max celkový počet použití za běh.                                                     |
| `cooldown`     | Starý alias pro `maxUses` (zachován pro zpětnou kompatibilitu).                       |
| `cooldownTurns`| Minimální počet tahů mezi dvěma zobrazeními téže karty.                               |

## Restart sekvence

Každý běh začíná sekvencí 6 restartovacích karet (`restart_0` → `restart_5`). Jsou to nebranching diagnostické markery, které nastavují základní profil a otevírají hlavní herní smyčku. Přežití restart sekvence je podmínkou stabilizovaného konce.

## Konce

- **Smrt** při statu 0 nebo 100 — každý stat má svůj poetický titul (`Vypnutí`, `Přepálení`, `Formátování`, `Přesycení`, `Odpojení`, `Rozpustění`, `Rozpad`, `Krystalizace`).
- **Stabilizovaný subjekt** — přežití `restart_5`, ≥ 3 imprinty, ≥ 4 unikátní sektory, všechny staty 20–80.

### Po smrti: pitva cyklu

Na obrazovce smrti se zobrazí detailní analýza: který stat zabila, které karty k tomu nejvíce přispěly a systemový komentář.

## Výběr další karty

Engine vezme **top 8 kandidátů** a provede **seeded weighted random** výběr (deterministický — výsledek závisí na `seed` a `rngStep`, nikoli na `Math.random()`). Restart sekvence a scheduled karty mají absolutní prioritu.

## Tension director

Sleduje rytmus (klid, krize, item triggery, sektory, odměny) a upravuje skóre karet. `sameSectorStreak` využívá `cardMatchesCurrentSector` — karta „sedí" v sektoru i přes tagy nebo podmínky `sector`, nejen přes přímou shodu `card.sector === state.sector`.

## Sektor matching

`cardMatchesCurrentSector(state, card)` vrátí `true` pokud:
1. `card.sector === state.sector`, nebo
2. karta má podmínku `{ type: 'sector', sector: state.sector }`, nebo
3. `card.tags.includes(state.sector)`, nebo
4. karta sdílí tag se `SECTOR_TAG_MAP[state.sector]` (např. archiv ↔ tag `archive`).

## Tracking voleb (`CyklusChoiceRecord`)

Každá volba uloží diff před/po aplikaci efektů:

| Pole             | Popis                                     |
|------------------|-------------------------------------------|
| `statDelta`      | Rozdíl statů.                             |
| `profileDelta`   | Posun profilových os.                     |
| `flagsGained`    | Nové vlajky.                              |
| `itemsGained`    | Získané itemy.                            |
| `itemsLost`      | Ztracené itemy.                           |
| `imprintsGained` | Nové imprinty.                            |
| `poolsUnlocked`  | Odemčené pooly.                           |
| `scheduledAdded` | Naplánované karty (cardId).               |
| `entityDelta`    | Změna vztahů k entitám.                   |
| `sectorBefore/After` | Pohyb mezi sektory.                  |

Diff zachytí i efekty z krizových itemů, rubber stampu a pasivních unlocků — ne jen efekty konkrétní karty.

## Tone karet

Každá karta může nést pole `tone` — emocionální zabarvení, které ovlivňuje, jak se karta zařazuje do příběhových sekvencí a interludí. Validní hodnoty: `tender`, `comic`, `romantic`, `tragic`. Karta může mít jeden nebo více tónů. Interlude karty a důležité scény musí mít `tone` explicitně definované.

## Imprinty

Imprinty jsou hluboké značky na subjektu. Většina odemyká další obsah nebo pool karet. Příklady: `unfinished_conversation`, `rubber_stamp`, `mirror_crack`, `sarkasma_debt`, `noise_resident`, `childhood_anchor`.

## Historie běhů (archiv cyklů)

Ukončené běhy se ukládají do `localStorage` jako `CyklusRunSummary`. Aktivní běh obsahuje pole `cycleSummaries: string[]` — textový přehled každého uzavřeného cyklu (stat delta, získané itemy, sektory, profil).

## Jak spustit

```bash
# Hra
app/cyklus/page.tsx

# Type check
npx tsc --noEmit

# Testy — všechny Cyklus testy kromě těžkých simulací
node node_modules/jest/bin/jest.js --config jest.config.js --testPathPatterns=cyklus --testPathIgnorePatterns=cyklusSimulation --runInBand --no-coverage --testTimeout=30000

# Samostatné engine/UI testy
npx jest src/game/cyklus --no-coverage
npx jest src/components/cyklus --no-coverage
```

**Test baseline** je aktuálně čistý: všechny cyklus testy kromě `cyklusSimulation.test.ts` procházejí (207+ testů). Simulační testy jsou vyřazeny z běžného CI kvůli délce trvání.

Stav se automaticky ukládá do `localStorage` přes `cyklusStorage.ts`. Přihlášený uživatel má navíc stav, historii i discovery synchronizované na server přes `/api/me/cyklus`, takže rozehraná hra přežije přechod na jiné zařízení nebo prohlížeč. Nepřihlášený uživatel zůstává na localStorage. Načítání obsahuje **migraci** — staré uložené stavy bez `seed`, `rngStep`, `unlockedCards`, `cycleSummaries` nebo starých polí `CyklusChoiceRecord` jsou doplněny výchozími hodnotami. Meta-progression se ukládá pod klíčem `synthoma_cyklus_progression_v1`, discovery pod `synthoma_cyklus_discovery`.

## Content overview

| Asset               | Count |
|---------------------|-------|
| Cards               | 328+  |
| Items               | 24+   |
| Imprints            | 11+   |
| Unlock conditions   | 21+   |
| Diagnostic findings | 12    |
| Profile protocols   | 8     |
| Void rooms          | 9     |
| Subject upgrades    | 8     |
| Crafted artifacts   | 8     |
| Craft recipes       | 8     |
| Subject scars       | 6     |
| Story acts          | 6     |
| Tutorial V2 cards   | 16    |

## Story Director (C5)

Příběh není lineární, ale řízený stavem. `cyklusStory.ts` udržuje `StoryProgression` (akt, seen story events, thread, restart prologue fatigue, pack progress) a vydává `StoryDirective`:

- **Restart prologue** — dokud hráč neviděl `restart_0`…`restart_5`, engine vynucuje tuto sekvenci před normální smyčkou.
- **Act progression** — akt se posouvá podle počtu sektorů, smrtí nebo použitých pack karet; preferované packy a tagy se mění.
- **Threads** — episodní linky (Glitchka, Sarkasma, T-AI, Desire, Toll, Archive) odemykají packy a epizody.
- **Interlude** — každý sudý cyklus se scheduleuje interlude karta podle aktu (`interlude_glitchka_sandbox`, `interlude_sarkasma_blackbox`, …).
- **Storage** — progress se ukládá do `localStorage` pod klíčem `synthoma_cyklus_story_v1` a po běhu se aktualizuje v `CyklusClient`.

## Tutorial V2

Starý 4-kartový tutorial byl nahrazen sekvencí 16 diegetických karet `tutorial_00_welcome` → `tutorial_15_ready`:

- Každá karta vysvětluje jeden mechanický koncept (staty, rovnováha, preview, profil, itemy, otisky, následky, sektory, cyklus, restart, Void Hub, progrese, packy, start).
- Všechny tutorial karty mají `category: 'tutorial'`, `rarity: 'unique'`, `triggerMode: 'scheduledOnly'`, `once: true`.
- Finální karta `tutorial_15_ready` nastaví `tutorial_v2_done` + `tutorial_done` a scheduleuje `restart_0`.
- Pro nové hráče začíná běh `tutorial_00_welcome`; pro hráče, kteří tutorial už viděli, začíná rovnou prologem.
- UI zobrazuje `TUTORIAL X / 16` + label mechaniky + Sarkasmin závěr. Tlačítko *Přeskočit* uloží `tutorial_v2_done` a skočí na `restart_0`.

## Meta-progression (C4 — operating table of one's own identity)

Po každém běhu subjekt neodejde s prázdnou. Reziduum a další měny se ukládají do persistentního `SubjectProgression` a otevírají tři propletené systémy:

- **Prázdnota (Void)** — devět upgradovatelných místností. Každá místnost není statický bonus, ale nový herní nástroj: skrytý startovní item, náhled profilového směru, detekce falešné entity, přesnější preview smluv, crafting stůl nebo rozšíření loadoutu.
- **Profilové protokoly** — osm protokolů odpovídajících osmi MBTI funkcím (Ni/Ne/Si/Se/Ti/Te/Fi/Fe). Každý se odemkne až po 20 bodech zkušenosti v dané funkci a přináší nové informace nebo volby, nikoliv stat boosty. Každý má explicitní drawback.
- **Crafting / Kapsa** — z běhů padají craft suroviny (`fox_warmth`, `mirror_sand`, `red_smoke`, `broken_log_splinter`...). Na Stolu nepravděpodobných kombinací se z předmětů, otisků a nálezů vyrábějí artefakty, které lze vybavit do slotu a které při startu přidají vlajky, itemy nebo imprinty — opět s drawbackem. Recepty se odemykají na základě `discovery.items`, `discovery.imprints` a `discovery.findings`.

### C4.1 — Loadout & Crafting Integrity

- `purchaseUpgrade` a `equipUpgrade` respektují dynamické limity z `getLoadoutLimits(progression)` místo pevné konstanty.
- `canCraftRecipe` kontroluje kromě surovin i úroveň `crafting_table`, discovery požadavky (`itemIds`, `imprintIds`, `findingIds`) a zda artefakt již nebyl vyroben.
- `computeRunRewards` a `awardRunRewards` rozšířeny o `deathStat`, `deathsByStat`, odemykání jizev, materiály, recepty, profilové mastery a hinty pro místnosti Prázdnoty.
- `applyMetaProgressionCardScoring` v enginu zvyšuje skóre karet podle vybavených protokolů (`scoringTags`), artefaktů a úrovně místností Prázdnoty.
- `applyMetaProgressionPreviewHint` doplňuje preview texty o meta-progression informace.

### C4.2 — UI Prázdnoty

- Komponenta `CyklusVoidHub` zobrazuje meziběhový hub s taby: **Přehled**, **Kapsa**, **Crafting**, **Místnosti**, **Loadout**, **Protokoly**.
- Akce (vylepšení místnosti, craft, equip/unequip loadoutu) se předávají přes `CyklusVoidHubActions` jako callbacks; komponenta sama neprovádí persistenci.
- Hub je dostupný z hlavního menu (`PRÁZDN0TA`) a z end screenu (`VRÁTIT SE DO PRÁZDNOTY`).
- CSS v `cyklus.css` přidává styly pro taby, karty, loadout sloty, craft stavy a zprávy.

Loadout má dynamické sloty: upgrady (3), artefakty (2), protokoly (1), jizva (1). Po vylepšení `stabilization_core` se sloty rozšiřují.

## C2 visibility pass (completed)

- **Build panel** shows top 3 stabilization variants with expand/collapse.
- **Goals** use thematic SYNTHOMA-style text, flash completion log, and apply reward pools only when completed.
- **Contracts** are visible in a dedicated panel (bonus, commitment, pending collect status).
- **Item combo hints** appear subtly in the pocket panel when one combo item is held.
- **Overload cards** display a clear high-risk warning in the card UI.
- **Pre-run warning** is shown as a separate overlay before the first card.
- **Simulation report** tracks goals, contracts, combos, and overload accept/refuse rates.
