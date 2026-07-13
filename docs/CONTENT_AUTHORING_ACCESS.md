# SYNTHOMA — authoring obsahu a přístupu

## Přidání kapitoly

1. Zvol stabilní kebab-case ID. Po publikaci se ID nemění; staré hodnoty se zachovají jako alias.
2. Přidej metadata kapitoly do `apps/web/src/content/booksManifest.ts`.
3. Přidej stejné `id`, pořadí a prezentační metadata do `apps/web/public/books/manifest.json`.
4. Volná kapitola patří do `public/books/<collection>`. Placená kapitola patří do `src/content/protected/<collection>`.
5. Nastav `access`, nezápornou celočíselnou cenu a existující `packageIds`. Draft bez souboru musí být `unavailable`/`draft` a nesmí mít prodejnou cenu.
6. Přidej anglický soubor jen tehdy, když skutečně existuje; chybějící lokalizace se nesmí deklarovat.

## Další typy obsahu

- Fragmenty, artefakty, kosmetika a reporty musí mít unikátní ID a cenu v příslušném manifestu.
- Archive záznamy musí mít stejnou množinu ID v české i anglické lokalizaci. `related` odkazy musí existovat.
- Archive `chapter` předpoklad používá kanonické ID nebo podporovaný krátký alias. `mnems` znamená nákup entitlementu, nikoli kontrolu zůstatku.
- Balíček smí odkazovat jen na existující publikovaný obsah. Vazba kapitola ↔ balíček musí být obousměrná.

## Validace

Spusť:

```text
npm run content:validate
```

Validátor kontroluje duplicity typu/ID, kapitoly a pořadí veřejného manifestu, shodu free/final stavů, existenci publikovaných souborů, celočíselné ceny, balíčkové vazby, alias 0-11, předpoklady, related odkazy a shodu lokalizací. `npm run build` jej spouští před Prisma/Next buildem a při chybě skončí nenulovým kódem.

## Zakázané zkratky

- Nepoužívej MNEM balance jako `canAccess`.
- Nepřidávej lokální `unlocked` pravidlo do komponenty.
- Neposílej cenu z klienta jako autoritu.
- Nevytvářej nový ownership model; použij obecný `Entitlement`.
- Nevracej 404 pro známý zamčený obsah.
- Nevkládej chráněné HTML nebo celé Archive body do access snapshotu.
