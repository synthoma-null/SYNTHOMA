# SYNTHOMA Cyklus Cards Patch V2

Druhý průchod nad kartami. Navazuje na V1.

## Co je nové

- Vylepšeno 22 karet: základní object karty a jejich první item/follow-up následky.
- Přidáno `sceneHtml` a `sceneFx` pro karty od `rusty_token` po `sarkasma_returns`.
- Posílené sentientní předměty: žeton, kamínky, klíč, střep, černá složka, chomáč šumu.
- Glitchka drží pravidlo přesně dvou emoji v mluvených replikách. Ano, chaos dostal dress code, civilizace se řítí dál.
- Drobně rozšířené CSS akcenty pro object/followup scény.

## Upravené soubory

- `cyklusCards.ts`
- `cyklus-card-scene.css`

Soubory `cyklusTypes.ts` a `CyklusCardScene.tsx` zůstávají kompatibilní z V1.

## Integrace

1. Nahraď `cyklusCards.ts` verzí z tohoto balíku.
2. Přenes nebo slouč `cyklus-card-scene.css`.
3. Pokud už používáš komponentu `CyklusCardScene`, není potřeba další zásah.

## Poznámka

Fallback `scene` zůstává krátký čistý text. Bohatší atmosféra je v `sceneHtml`, aby se logika hry nemusela tvářit, že HTML je obyčejná věta.
