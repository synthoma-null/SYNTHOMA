# SYNTHOMA CYKLUS — PATCH V12

Dvanáctý patch navazuje na V11 a řeší unlock účetnictví: pooly, aliasy, findingy a slepé větve.

## Hlavní změny

- nový `cyklusPoolCatalog.ts`
- engine skóruje odemčené pooly přes aliasy z katalogu
- přidané záložní unlock cesty v `cyklusUnlocks.ts`
- přidáno 11 findingů v `cyklusFindings.ts`
- přidány 3 bridge karty:
  - `blackbox_aftermath_bridge`
  - `desire_orgie_threshold`
  - `detective_cold_case_folder`
- přidané CSS pro blackbox/desire/detective bridge scény
- odstraněna duplicitní deklarace `modifierScore` v `cyklusEngine.ts`

## Ověření

```txt
cards: 230
sceneHtml: 230
findings: 60
known pools in catalog: 60
all referenced pools covered by catalog: yes
pools without alias/card match: 0
missing scheduled card refs: 0
missing item refs: 0
missing imprint refs: 0
TypeScript: OK
```

## Instalace

Zkopíruj do projektu:

```txt
cyklusPoolCatalog.ts
cyklusEngine.ts
cyklusUnlocks.ts
cyklusFindings.ts
cyklusCards.ts
cyklus-card-scene.css
```

Pokud bereš celý patch jako navazující balík, ponech i ostatní soubory z předchozích verzí.
