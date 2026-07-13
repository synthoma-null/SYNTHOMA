# SYNTHOMA — autorství a přístup k obsahu

## Jediný zdroj katalogu kapitol

Kapitoly se definují pouze v `apps/web/src/content/catalog.ts`, v poli
`CANONICAL_CHAPTER_DEFINITIONS`. Tato definice vlastní stabilní ID, pořadí,
stav vydání, cenu, cesty k souborům, aliasy a prezentační metadata.

Po změně katalogu spusť:

```powershell
cd apps/web
npm run content:generate
npm run content:validate
```

Generátor deterministicky odvodí veřejný manifest, katalog Library, index
Readeru, validační index a kompatibilní blok `CHAPTERS` v `booksManifest.ts`.
Produkční build generování zopakuje a výsledek následně validuje.

Ručně neupravuj:

- `apps/web/public/books/manifest.json`,
- `apps/web/src/content/generated/*.json`,
- označený generovaný blok `CHAPTERS` v `apps/web/src/data/booksManifest.ts`.

Zastaralý nebo ručně pozměněný derivát musí `content:validate` odmítnout.

## Zdrojové soubory kapitol

Zdroj kapitoly přidej na cestu uvedenou v kanonickém katalogu a teprve potom
regeneruj deriváty. Nevytvářej náhradní soubor jen proto, aby validace prošla.
Texty a další kanonické podklady se řídí registrem `docs/CANON_SOURCES.md`.
Chybějící podklad označený HOLD se nesmí odhadovat, rekonstruovat z odvozených
dat ani nahrazovat podobným souborem.

## Přístupová pravidla

Stav `free`, `purchasable` nebo `unavailable` a katalogová cena patří do
kanonické definice. Klient je pouze zobrazuje; nesmí si cenu ani entitlement
odvozovat lokálně. Ochranu těla obsahu vždy vynucuje serverový access resolver.

Nový obsahový typ musí dostat stabilní ID, katalogový záznam, serverovou
validaci a test fail-closed chování. Přímé zápisy entitlementů, hardcodované
seznamy kapitol v UI a ručně udržované paralelní manifesty jsou zakázané.
