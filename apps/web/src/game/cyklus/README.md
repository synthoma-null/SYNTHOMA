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

## Imprinty

Imprinty jsou hluboké značky na subjektu. Většina odemyká další obsah nebo pool karet. Příklady: `unfinished_conversation`, `rubber_stamp`, `mirror_crack`, `sarkasma_debt`, `noise_resident`, `childhood_anchor`.

## Historie běhů (archiv cyklů)

Ukončené běhy se ukládají do `localStorage` jako `CyklusRunSummary`. Aktivní běh obsahuje pole `cycleSummaries: string[]` — textový přehled každého uzavřeného cyklu (stat delta, získané itemy, sektory, profil).

## Jak spustit

```bash
# Hra
app/cyklus/page.tsx

# Testy
npx jest src/game/cyklus --no-coverage
```

Stav se automaticky ukládá do `localStorage` přes `cyklusStorage.ts`. Načítání obsahuje **migraci** — staré uložené stavy bez `seed`, `rngStep`, `unlockedCards`, `cycleSummaries` nebo starých polí `CyklusChoiceRecord` jsou doplněny výchozími hodnotami.
