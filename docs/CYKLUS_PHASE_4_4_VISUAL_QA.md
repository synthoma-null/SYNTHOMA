# Cyklus Phase 4.4 Visual QA

Automatický screenshot runner je v tomto prostředí zablokovaný systémovou chybou `EPERM`. Nic se neinstaluje ani neobchází. Tento checklist je následný ruční krok.

## Testovací matice

Ověř každý motiv: Synthoma, Green Matrix, Neon Hellfire, Cyber Dystopia, Acid Glitch, Retro Arcade, Mono BW a Mono Light.

Viewporty:

- 360 × 640
- 390 × 844
- 844 × 390
- 1440 × 900

Obrazovky:

- aktivní karta a volby
- stat rail včetně nízkého a vysokého rizika
- Predikce cyklu
- Souhrn cyklu
- krátký outcome po volbě
- závěrečný report běhu
- ovládací panel otevřený i zavřený
- Prázdnota a její mobilní navigace

## Kontrola motivů

Pro každý motiv zkontroluj pozadí stránky, povrchy panelů, text a sekundární text, rámy, tlačítka, focus ring, hover, active a disabled stav. Dále ověř dialogy, backdrop, stat marker, grid, scanlines, noise a intenzitu glow nebo stínu.

Motiv musí měnit celý systém povrchů a efektů, ne pouze akcent. Text se nesmí překrývat, ořezávat ani mizet v kartách, stat railu, spodní navigaci a bottom sheetu.

## Predikce a souhrn

- Predikce je diagnostický výhled s klimatem, pouze dostupnými tlaky a akcí `VSTOUPIT DO CYKLU`.
- Souhrn je uzavřený report s počtem rozhodnutí, sektory, deltami a akcí `POKRAČOVAT`.
- Oba panely jsou centrované, mají vlastní strukturu a scrollují jen při dlouhém obsahu.
- Primární akce získá fokus a `Escape` panel zavře.

## Stat rail

- Na 360 px zůstávají čtyři staty v jednom řádku bez horizontálního scrollu.
- Každý sloupec má celý název, hodnotu s deltou a diagnostickou osu.
- Výška je 52 px a každý stat zůstává alespoň 44 px vysoký.
- Stabilní stav se neopakuje; riziko má viditelný text `NÍZKÁ`, `PŘETLAK` nebo `KRITICKÁ`.

## Ovládací panel

- Desktop: pravý panel, vlastní scroll, dosažitelné zavření.
- Mobil: bottom sheet, sticky hlavička, safe-area a maximální výška viewportu.
- Sekce odpovídají skutečným funkcím: Rozhraní, Motiv, Vizuální efekty a Zvuk.
- Všech osm motivů má paletu, popis a nejméně 44px dotykovou plochu.
- Aktivní motiv má rám, boční marker, text `AKTIVNÍ` a `aria-pressed="true"`.
- Panel se otevře tlačítkem, zavře křížkem i klávesou `Escape`.

## Mono Light

- Pozadí stránky je `#f7f7f5`, panely `#ffffff`.
- Hlavní text je `#111111`, sekundární `#3f3f3f`, dim text `#666666`.
- Silné linky jsou `#333333`, běžné `#9a9a94`, jemné `#d6d6d0`.
- Focus ring je `#005fcc`; disabled text zůstává čitelný.
- Overlay i ovládací panel jsou světlé, backdrop je pouze jemně tmavý.
- Glow je vypnutý a nahrazen šedým stínem; scanlines a grid jsou velmi slabé.
- Nesmí zůstat černý panel z dark theme, bílé písmo na bílém ani destruktivní blend mode.

## Výsledek

- `PASS`: žádný blocker ve všech viewports a motivech.
- `HOLD`: nečitelný text, nedostupná akce, překryv, chybějící scroll, rozbitý Mono Light nebo motiv, který nezmění celý povrchový systém.

Poznámky a screenshoty z ruční kontroly patří do release QA záznamu, ne do repozitáře.
