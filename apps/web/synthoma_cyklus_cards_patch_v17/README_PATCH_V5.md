# SYNTHOMA Cyklus Cards Patch V5

Pátý průchod rozšiřuje `sceneHtml` pro karty 74 až 100, tedy blok od `pocket_breathes` po `foreign_bookmark`.

## Co je nové

- doplněné bohaté scény pro silent/scheduled karty,
- výraznější item-trigger následky,
- živější inventářové předměty,
- silnější návaznost u Sarkasmina dluhu, Paměťové šelmy, Tržiště, Glitchčiných kamínků, gumového tuleně, Zrcadla a Archivu,
- nové `sceneFx` tagy pro kapsu, klíč, mapu, šum, tuleň questline, stín, záložku a nedokončenou větu,
- rozšířený CSS blok pro silent/item-trigger/follow-up atmosféru.

## Rozsah

- V1: 1 až 21
- V2: 22 až 43
- V3: 44 až 61
- V4: 62 až 73
- V5: 74 až 100

Celkem má nyní `sceneHtml` 100 karet.

## Poznámka k integraci

Pokračuje stejný model jako ve V1:

- `scene` zůstává čistý fallback,
- `sceneHtml` je bohatá SYNTHOMA scéna,
- `sceneFx` dává wrapperu biomový a emoční tón,
- `CyklusCardScene.tsx` vykresluje bezpečně přes whitelist tagů a tříd.

## Doporučený další průchod

Další balík: karty 101 až 130, tedy `bookmark_knows_more` až přibližně `tai_notes_ignored`. Tam se už rozjíždí silné follow-upy, falešná jména, portálové platby, integrity návraty a první větší systémové následky.
