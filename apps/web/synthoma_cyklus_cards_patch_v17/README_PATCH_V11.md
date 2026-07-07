# SYNTHOMA CYKLUS — Patch v11

## Zaměření

Patch v11 navazuje na v10 a přidává druhou dramaturgickou vrstvu do `cyklusStory.ts`: **smrt podle extrémního statu teď ovlivňuje příběhový tah dalšího běhu**.

Už tedy nejde jen o to, že `cyklusFindings.ts` odemkne meta pool a `cyklusCards.ts` nabídne aftermath kartu. Story systém si nově pamatuje, **jakým typem kolapsu subjekt prošel**, nastaví aktivní aftermath fokus a přes scoring zvýhodní odpovídající aftermath karty, tagy a sektory.

Ano, systém si konečně začal pamatovat i to, jakým způsobem jsi selhal. Pokrok, jen trochu zlověstný.

## Upravené soubory

- `cyklusStory.ts`
- `cyklusEngine.ts`
- součástí balíku zůstávají aktuální soubory z v10:
  - `cyklusCards.ts`
  - `cyklusTypes.ts`
  - `CyklusCardScene.tsx`
  - `cyklus-card-scene.css`

## Nové story typy

Přidáno:

- `StoryAftermathId`
- `StoryDeathTrace`
- `StoryAftermathDirective`

`StoryProgression` nově obsahuje:

- `activeAftermath`
- `completedAftermaths`
- `lastDeathTrace`

Migrace je zpětně kompatibilní přes `loadStoryProgression()`. Staré save z localStorage dostanou výchozí hodnoty a nevybuchnou. Což je u localStorage něco jako malý zázrak v plastovém kelímku.

## Osm aftermath fokusů

Každý extrémní kolaps má vlastní příběhový dozvuk:

| Stat | Extrém | Aftermath |
|---|---:|---|
| Paměť | high | `memory_flood_aftermath` |
| Paměť | low | `empty_memory_aftermath` |
| Energie | high | `energy_overburn_aftermath` |
| Energie | low | `shutdown_aftermath` |
| Vazba | high | `bond_merge_aftermath` |
| Vazba | low | `bond_isolation_aftermath` |
| Kontrola | high | `control_crystal_aftermath` |
| Kontrola | low | `control_collapse_aftermath` |

Každý aftermath definuje:

- `poolIds`
- `preferredTags`
- `preferredSectors`
- `interludeText`

## Změna ve scoringu

`StoryDirective` nově umí volitelně nést:

```ts
preferredPoolIds?: string[];
```

`applyStoryScore()` teď přidává bonus, když karta:

- má `condition: unlockedPool` odpovídající aktivnímu aftermathu,
- nebo má tag shodný s aftermath poolem.

Výsledkem je, že po smrti na přepálenou Energii se častěji vrátí acid/overburn/overclock aftermathy; po smrti Vazby prázdné kontakty, nit pod dveřmi nebo sloučení hranic; po pádu Kontroly střepy protokolu nebo krystalová místnost.

## Změna v engine

`generatePreRunWarning()` nově přidává `storyDirective.interludeText`, pokud existuje.

Tím se hráči už na začátku dalšího běhu může ukázat krátký atmosferický komentář k tomu, co se stalo v předchozím kolapsu.

Smrt tedy konečně nevede jen k odemčení obsahu, ale i k tónové změně dalšího cyklu.

## Ověření

Lokálně ověřeno přes TypeScript s pomocným `content.ts` shimem:

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck cyklusTypes.ts cyklusCards.ts cyklusStory.ts cyklusEngine.ts
```

Výsledek: bez chyb.

## Stav po patchi

```txt
cards: 227
sceneHtml: 227
story lines: 852
aftermath pools checked: 20
missing aftermath pool references: 0
TypeScript: OK
```
