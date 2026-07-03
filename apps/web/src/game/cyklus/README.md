# SYNTHOMA: CYKLUS

Cyklus je sólový roguelite-like zážitek v rámci světa SYNTHOMA. Hráč tah po tahu prochází „kartami“ — krátkými scénami, každá s volbou ano/ne. Cílem není dosáhnout maximálních hodnot, ale udržet subjekt v rovnováze a splnit podmínky stabilizovaného konce.

## Základní principy

- **Karty** jsou scény s volbou `yes` / `no`. Volby nejsou morální, ale diagnostické značky MBTI-style profilu.
- **Statistiky** se pohybují v rozsahu 0–100. Extrém v jakémkoliv směru (0 nebo 100) ukončí běh smrtí.
- **Cílem je rovnováha**, ne maximum. Ideální stav pro stabilizaci je všech 4 statů mezi 20–80.
- **Sektor** reprezentuje aktuální lokaci. Navštívené sektory se ukládají a ovlivňují dostupný obsah.
- **Cyklus** má 12 tahů. Po dosažení limitu se cyklus restartuje a obtížnost mírně stoupá.

## Statistiky

| Stat       | Český název | Popis                                            |
|------------|-------------|--------------------------------------------------|
| `energy`   | Energie     | Vnitřní napětí, jas, aktivita.                   |
| `memory`   | Paměť       | Množství uchovaných dat, vzpomínek, šumu.        |
| `bond`     | Vazba       | Spojení s ostatními, systémem, entitami.         |
| `control`  | Kontrola    | Schopnost udržet strukturu, rozhodovat se.       |

## Profil (MBTI)

Každá volba posouvá profilové osy (E/I, S/N, T/F, J/P a 8 funkcí). Z profilu se vypočítá dominantní typ, archetyp a stabilita. Výsledek se zobrazí po konci běhu.

## Entitní vztahy

Soustava `entityRelation` sleduje vztah k entitám světa (`glitchka`, `sarkasma`, `tai`, `archive`, `shadow`, `form`). Pozitivní/negativní vztah ovlivňuje dostupnost některých karet a unlocků.

## Itemy a vlajky

- **Itemy** jsou hmatatelné předměty v kapse. Můžou mít pasivní efekty (vlajky) nebo spouštět specifické karty.
- **Vlajky (flags)** jsou stav světa/subjektu, nikoli fyzické věci. Např. `cult_badge_active` versus `cult_badge`.
- Krizové itemy mají vlajky typu `_ready` a aktivují se při extrémních hodnotách.

## Krizové itemy

| Item           | Efekt                                                                                            |
|----------------|--------------------------------------------------------------------------------------------------|
| `rubber_seal`  | Zachrání před smrtí z Vazby 0/100. Při nízké hodnotě nastaví 15, při vysoké 85.                  |
| `acid_filter`  | Zachrání před smrtí z Energie 100. Srazí na 85 a spotřebuje filtr.                               |
| `archive_key`  | Zachrání před smrtí z Paměti 0/100. Přesune do Archivu a srazí/přidá paměť na 15/85.             |
| `rubber_stamp` | Jednou zruší negativní stat-efekty karty s tagem `form`/`office`/`trap`.                         |

## Restart sekvence

Každý běh začíná sekvencí 6 restartovacích karet (`restart_0` → `restart_5`). Jsou to nebranching diagnostické markery, které zároveň nastavují základní profil a otevírají hlavní herní smyčku. Přežití restart sekvence je podmínkou stabilizovaného konce.

## Konce

- **Smrt** při statu 0 nebo 100 — každý stat má svůj poetický titul a text (`Vypnutí`, `Přepálení`, `Formátování`, `Přesycení`, `Odpojení`, `Rozpustění`, `Rozpad`, `Krystalizace`).
- **Stabilizovaný subjekt** — pokud hráč přežije restart_5, má ≥ 3 imprinty, navštívil ≥ 4 sektory a všechny staty jsou 20–80. Stav běhu se nastaví na `completed`.

### Po smrti: pitva cyklu

Na obrazovce smrti se zobrazí detailní analýza: který stat zabila, které karty k tomu nejvíce přispěly a systemový komentář.

## Výběr další karty

Engine už nevybírá vždy kartu s nejvyšším skóre. Místo toho vezme **top 8 kandidátů** a provede **weighted random** výběr podle jejich skóre. Restart sekvence a scheduled karty si ale zachovávají absolutní prioritu.

## Tension director

Hra sleduje rytmus (klid, krize, item triggery, sektory, odměny) a mírně upravuje skóre karet, aby se příliš často neopakovaly stejné typy scén. Cílem je méně předvídatelný průběh a lepší pacing.

## Historie běhů (archiv cyklů)

Ukončené běhy (mrtvé i stabilizované) se ukládají do `localStorage` jako krátké `CyklusRunSummary`. Hráč si může v UI rozbalit archiv s typem konce, profilem, archetypem, počtem cyklů a navštívenými sektory.

## Imprinty

Imprinty jsou hluboké značky na subjektu. Většina z nich má vlastní kartu/scénu s plnohodnotnou volbou ano/ne a odemyká další obsah. Např. `unfinished_conversation`, `rubber_stamp`, `mirror_crack`, `sarkasma_debt`, `noise_resident`, `childhood_anchor`.

## Jak spustit

- Hra se nachází v aplikaci na `app/cyklus/page.tsx` (nebo ekvivalentní trase).
- Stav se automaticky ukládá do `localStorage` přes `cyklusStorage.ts`.
- Pro testy: `npm test -- --testPathPatterns="cyklusEngine"`
