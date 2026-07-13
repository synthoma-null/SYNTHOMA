# SYNTHOMA — model přístupu k obsahu

## Základní pravidlo

Zůstatek MNEM je účetní hodnota. Entitlement je vlastnictví. Reading progress je průchod. Tyto tři skutečnosti jsou oddělené a žádná se nesmí odvozovat z jiné.

Kanonické typy obsahu jsou `chapter`, `package`, `fragment`, `artifact`, `archive_record`, `cosmetic` a `profile_report`. Každý záznam má stabilní ID v `apps/web/src/content/catalog.ts`.

## Stavy

- `free`: katalog obsah výslovně označil jako volný.
- `owned`: přímý entitlement, entitlement balíčku, splněný progresový předpoklad nebo admin override.
- `locked`: obsah existuje, ale aktuální subjekt nemá přístup.
- `unavailable`: obsah je v katalogu, ale nebyl publikován.

Neznámé ID není stav přístupu; je to 404. Známý zamčený obsah není 404. API vrací 403 a JSON s `ContentAccess`.

## Resolver

`getContentAccess` a batch `getAccessSnapshot` jsou jediná serverová autorita. Resolver načte uživatele, entitlementy, dokončené kapitoly, legacy ownership tabulky a ledger souhrn v dávkách. Balíčkové entitlementy rozbaluje pouze resolver podle katalogu; nové granty nematerializují dětské kapitoly.

Pořadí rozhodnutí:

1. chybějící katalogový záznam → chyba `CONTENT_NOT_FOUND`,
2. nevydaný záznam → `unavailable`,
3. explicitně volný záznam → `free`,
4. admin override → `owned`,
5. přímý nebo legacy entitlement → `owned`,
6. balíček obsahující záznam → `owned`,
7. splněný progresový předpoklad → `owned`,
8. jinak → `locked`.

Jakákoli chyba resolveru je fail-closed. Chybějící cena, metadata, soubor nebo databázová odpověď nesmí obsah odemknout.

## Klientská synchronizace

`AccessProvider` ukládá snapshot podle `contentType:contentId`. Úspěšný nákup aplikuje serverový snapshot přímo, vyšle `synthoma:access-changed`, zapíše invalidaci do `localStorage` a používá `BroadcastChannel` pro další panely. Library, Reader, Archive, profil a nákupní dialog proto neudržují vlastní pravidla vlastnictví.

## HTTP kontrakt

- `POST /api/me/access/resolve`: 1–200 položek, přihlášení není nutné, privátní no-store snapshot.
- `POST /api/me/purchases`: přihlášení a `Idempotency-Key` jsou povinné; klient posílá pouze typ a ID, nikdy cenu.
- `GET /api/chapter/:id`: 404 pouze pro neznámé ID, 409 pro nevydaný obsah, 403 JSON pro zámek, HTML pouze při povoleném přístupu.
- `/chapter/:id`: neznámé ID vyvolá skutečnou Next.js 404; zámek vykreslí nákupní bránu.

## Legacy kompatibilita

Resolver dočasně uznává `FragmentUnlock`, `UserArtifact`, `UserCosmeticUnlock`, staré `chapterId`/`packageId` a alias `0-11-orgie-1`. Backfill je převádí na obecné entitlementy. Nové zápisy do legacy ownership tabulek nejsou povoleny.
