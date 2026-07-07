# SYNTHOMA CYKLUS — PATCH V14

## Fokus

Patch v14 navazuje na v13 a řeší meta-progression kolem kapsy, nálad předmětů a craftingu. Inventář už není jen seznam itemů, ale dlouhodobě rostoucí ekosystém, který se propisuje do Prázdnoty, odměn, craft receptů a výběru dalších karet.

Ano, kapsa dostala vývojový strom. Civilizace patrně neměla dost starostí.

## Upravené soubory

- `cyklusProgression.ts`
- `cyklusEngine.ts`

Ostatní soubory jsou přiložené kvůli návaznosti celého patch balíku.

## Nové craft materiály

- `pocket_lint` — Kapesní chuchvalec významu
- `sealed_breath` — Zapečetěný nádech
- `named_resonance` — Pojmenovaná rezonance
- `inventory_murmur` — Inventární šelest

Tyto materiály padají podle toho, co hráč nosí v kapse, jak často aktivuje item-trigger karty a jakou náladu mají předměty na konci běhu.

## Nové upgrady kapsy

- `pocket_listener` — Kapesní naslouchání
- `pocket_resonance_tuner` — Ladička rezonance
- `pocket_mediator` — Mediátor kapesních hádek

Tyto upgrady přidávají startovní flagy, které engine používá při skórování karet a preview hintech.

## Nová místnost v Prázdnotě

### `pocket_shrine` — Kapesní oltář

Tři úrovně:

1. `pocket_shrine_mood_reader_active`
2. `pocket_shrine_resonance_tuning_active`
3. `pocket_shrine_argument_mediator_active`

Místnost se doporučuje jako void-room hint, pokud hráč často používá item-trigger karty, má více předmětů nebo končí běh s výraznou náladou kapsy.

## Nové craft artefakty

- `seal_stamp_charm` — Tuleňovo krizové razítko
- `pocket_weather_vane` — Kapesní větrná korouhev
- `named_resonance_thread` — Pojmenované vlákno kapsy
- `boundary_clip` — Spona vráceného ne
- `archive_pocket_index` — Archivní index kapsy

Všechny používají existující itemy a imprinty. Starší recepty byly zároveň přepsány tak, aby neodkazovaly na neexistující itemy/imprinty.

## Nové recipe unlock logiky

Recipe unlock už není vázaný jen na `crafting_table`. Pokud je aktivní `pocket_shrine`, může odemykat kapesní recepty podle objevených itemů/imprintů.

## Engine napojení

`cyklusEngine.ts` nově:

- importuje `getPocketMoodProfile`,
- přidává scoring pro kapesní upgrady,
- přidává scoring pro `pocket_shrine` flagy,
- přidává scoring pro nové artefakty,
- doplňuje preview hinty podle ambientního textu kapsy,
- opravuje duplicitní `const active` v artifact scoring loopu.

## Ověřený stav

```txt
cards: 230
sceneHtml: 230
items: 24
upgrades: 16
void rooms: 10
craft materials: 13
crafted artifacts: 10
craft recipes: 10
missing recipe item refs: 0
missing recipe imprint refs: 0
missing artifact refs: 0
missing room refs: 0
TypeScript: OK
```

## Poznámka

Tento patch nedělá nové karty. Posiluje dlouhodobou vrstvu hry. Kapsa teď odměňuje, varuje, rezonuje a občas manipuluje pravděpodobnostmi. Tedy přesně to, co by člověk čekal od inventáře v terapeutickém systému, který už dávno potřebuje vlastního terapeuta.
