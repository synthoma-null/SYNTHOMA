# SYNTHOMA Phase 5.4 — audit MNEM ekonomiky a přístupu k obsahu

Datum auditu: 2026-07-13  
Výchozí HEAD: `5c30c38`  
Pracovní větev: `refactor/mnem-entitlement-core`

## Rozsah a zdroje

Audit pokrývá současné zdroje katalogu, databázový model, všechny známé cesty udělení a utracení MNEM, nákupní dialogy, Reader, Library, Archive, fragmenty, artefakty, témata, redeem kódy, Stripe, administraci a profil.

Povinný lore soubor `SYNTHOMA-NULL.txt` se v pracovním stromu ani v git historii nenachází. Rozhodnutí o tónu a terminologii proto vycházejí z `SYNTHOMA-MANIFEST.txt`, `styl.md`, `efekty.md`, `oblouk.md`, publikovaných knih a reportů fází 5.2–5.3.2. Chybějící soubor není nahrazen domnělým obsahem.

## Současný stav

### Zdroje pravdy

| Oblast | Aktuální zdroj | Problém |
| --- | --- | --- |
| Kapitoly a ceny | `apps/web/src/content/booksManifest.ts` | Obsahuje jen 13 kapitol; poslední záznam má ID a název souboru odlišný od skutečného souboru. |
| Veřejný seznam kapitol | `apps/web/public/books/manifest.json` | Má 22 položek, nemá stabilní `id` a kapitoly 0-4 až 0-10 nesprávně označuje jako bezplatné. |
| Balíčky | `booksManifest.ts` | `single-fragment` nemá kapitoly a Stripe ho přesto používá při nákupu jedné kapitoly. |
| Fragmenty, artefakty a kosmetika | `booksManifest.ts`, `themes.ts` | Několik oddělených modelů cen a vlastnictví bez společného resolveru. |
| Archive | lokalizované `archiveCards.json` | Přístup kombinuje průchod kapitolou, MNEM zůstatek a lokální resolver; anglická data nejsou validována proti českým. |
| Runtime oprávnění | `src/lib/access.ts` a jednotlivá API/UI | Pravidla jsou opakována a liší se podle povrchu. |

Nejkritičtější katalogová kolize je kapitola `0-11`: TypeScriptový manifest používá `0-11-orgie-1` a soubor `0-11 [ORGIE] 1.html`, zatímco veřejný manifest i disk používají `0-11 [ORGIE].html`. Reader proto může legitimní obsah vyhodnotit jako chybějící.

### Databázový model

Existující `Entitlement` je omezený na `packageId`/`chapterId`. Unikátnost chrání jen přímou kapitolu; opakované balíčkové entitlementy jsou možné. `MnemLedger` ukládá pouze delta částku a důvod, ale nemá `balanceAfter`, obecný idempotency klíč, vazbu na obsah ani transakční typ. `Purchase` a audit administrátorských grantů neexistují.

Oddělené tabulky `FragmentUnlock`, `UserArtifact` a `UserCosmeticUnlock` vytvářejí další paralelní model vlastnictví. Budou zachovány pouze pro kompatibilní migraci a čtení starých dat; nové udělení má zapisovat obecný entitlement.

### Cesty zápisu MNEM a vlastnictví

| Cesta | Současné chování | Riziko |
| --- | --- | --- |
| Registrace | Přímý kredit `+128` do ledgeru | Bez idempotence a `balanceAfter`. |
| Nákup kapitoly za MNEM | Entitlement upsert, potom debit | Není v transakci; opakování může znovu strhnout MNEM. |
| Nákup artefaktu | Vlastnictví, potom debit | Částečný zápis a souběžné přečerpání. |
| Nákup tématu / whisper boost | Kontrola zůstatku před transakcí | Dva souběžné požadavky mohou utratit stejný zůstatek. |
| Redeem kód | Označení kódu a balíčkový grant v transakci | Opakování vrací obecnou chybu a grant stále používá nejednotnou balíčkovou logiku. |
| Stripe webhook | Idempotence přes `stripeSessionId` ledgeru | Nepokrývá všechny granty; nákup jedné kapitoly může udělit pouze prázdný balíček. |
| Admin grant | Přímý libovolný ledger zápis | Může vytvořit záporný zůstatek; bez aktéra, idempotence a auditu. |
| Balíček | Balíčkový entitlement, kredit MNEM a materializované kapitoly | Směšuje produkt, měnu a vlastnictví; pravidla se duplikují. |

### Cesty čtení přístupu

| Povrch | Současné rozhodnutí | Dopad |
| --- | --- | --- |
| `/api/chapter/[chapterId]` | Vlastní kontrola přes `canReadChapter`; zamčení vrací 402 | Nestandardní stav, neúplná metadata; chybějící soubor po katalogové kolizi vrací 404. |
| `/chapter/[id]` | Vždy přesměruje do Readeru | Neznámé ID nemá skutečnou 404; zamčení nemá samostatnou serverovou bránu. |
| Reader | Kombinuje veřejný manifest, API 402 a dva různé modaly | Veřejný manifest nemá ID; zamčená další kapitola se nerozpozná a navigace skončí chybou/404. |
| Library | Odvozuje stav z `free` a spojení podle názvu souboru | Zakoupená kapitola zůstává vizuálně zamčená; kolizní soubor nemá ID. |
| Archive | Pro MNEM položky považuje dostatečný zůstatek za plný přístup | Kritické zaměnění peněženky za vlastnictví. |
| Fragmenty / artefakty / témata | Každý povrch má vlastní tabulku a endpoint | Nekonzistentní chování, chyby a synchronizace. |
| Profil | Vrací jen součet ledgeru a balíčky | Chybí historie účtu, původ grantů a přehled vlastnictví. |

`ReadingProgress` je samostatná doména průchodu. Současná aktivace misí skládá entitlementy a dokončení do jedné množiny „completedChapters“, což zaměňuje vlastnictví za progres. Tyto významy musí zůstat oddělené.

## Kořenová příčina zamčené další kapitoly jako 404

1. Reader hledá sousední kapitolu ve veřejném manifestu.
2. Zámek nastaví jen tehdy, když položka má `free === false` a současně `id`.
3. Veřejný manifest stabilní `id` neobsahuje a část placených kapitol navíc označuje jako `free: true`.
4. Reader proto nabídne běžný přechod nebo starou cestu místo nákupní akce.
5. U kapitoly 0-11 se navíc rozchází kanonický název souboru se skutečným souborem, takže server skončí na diskové 404.

Oprava musí vzniknout v katalogu a resolveru přístupu, nikoli jako výjimka v jedné komponentě.

## Cílová rozhodnutí

### Jeden katalog

Serverový katalog bude jediným místem, které mapuje stabilní ID, typ obsahu, lokalizovaný název, soubor/trasu, pořadí, dostupnost, cenu, balíčky a případnou podmínku průchodu. Veřejný manifest bude pouze odvozený/validovaný index a nesmí rozhodovat o ceně nebo přístupu.

Kanonické ID poslední dostupné kapitoly bude `0-11-orgie`; historické `0-11-orgie-1` zůstane aliasem. Záznamy bez publikovaného souboru budou `unavailable`, nikoli implicitně bezplatné nebo zakoupené.

### Entitlement je vlastnictví, ledger je účetnictví

Zůstatek MNEM nikdy neuděluje přístup. Přístup vzniká jen explicitním pravidlem katalogu (`free`), platným entitlementem, balíčkovým rozšířením, splněným progresovým předpokladem nebo administrátorským override. Cena je pouze nabídka k nákupu.

Existující `Entitlement` bude rozšířen o obecné `contentType`/`contentId`, zdroj a metadata. Balíčky budou ukládány jako jeden balíčkový entitlement a jejich obsah se rozbalí pouze v centrálním resolveru. Historické materializované kapitoly budou nadále uznány.

Ledger zůstane append-only a každý nový zápis ponese výsledný zůstatek, typ transakce, idempotency klíč a volitelnou vazbu na obsah či externí událost. Žádná podporovaná cesta nesmí vytvořit záporný zůstatek.

### Atomický nákup

Nákup za MNEM bude jediná databázová transakce:

1. načíst a zamknout účet uživatele,
2. ověřit idempotency klíč a existující přístup,
3. načíst cenu pouze ze serverového katalogu,
4. ověřit zůstatek,
5. vložit debit s `balanceAfter`,
6. vložit entitlement,
7. uzavřít záznam `Purchase`,
8. vrátit nový access snapshot.

Opakovaný stejný požadavek vrátí původní úspěch bez dalšího debitu. Souběžný jiný požadavek je serializován zámkem účtu. Konflikt vlastnictví vrací 409 bez stržení.

### Jednotné čtení a synchronizace

`getContentAccess`, batch `getAccessSnapshot` a jejich API budou jedinou odpovědí pro Library, Reader, Archive, profil i nákupní dialog. Klientský provider udrží cache snapshotu a po nákupu/grantu rozešle jednu událost změny; UI se aktualizuje bez reloadu.

Neznámý obsah vrací 404. Známý zamčený obsah vrací `locked` a API 403 se strukturovaným JSON, nikdy HTML. Známý, ale nevydaný obsah vrací `unavailable`. Reader má pro zamčenou další kapitolu nabídnout nákup, ne navigaci do 404.

## Migrační a kompatibilitní pravidla

- Migrace rozšíří stávající tabulky a zachová historická ID.
- Backfill bude implicitně dry-run, vypíše počty, neznámé reference a plánované změny; zápis vyžaduje explicitní `--apply`.
- Staré přímé chapter entitlementy a balíčkové entitlementy se budou číst po celou migraci.
- Staré specializované ownership tabulky se převedou na obecné entitlementy idempotentně.
- Stripe, redeem, registrace i admin budou volat sdílené grant/ledger služby.
- Selhání resolveru je fail-closed: žádná chyba, chybějící metadata ani zůstatek nesmí obsah odemknout.

## Ověřovací brány

Implementace musí prokázat:

- serverová cena nemůže být přepsána klientem,
- opakovaný a souběžný nákup nestrhne MNEM dvakrát,
- zůstatek nikdy neklesne pod nulu,
- entitlement se nevytvoří bez odpovídajícího ledger/purchase zápisu,
- Library, Reader a Archive po změně používají stejný stav,
- známá zamčená kapitola vrací 403/access metadata a její „next“ akce otevírá nákup,
- neznámé ID vrací skutečnou 404,
- validátor zastaví build při duplicitním ID, chybějícím souboru, neplatné ceně, rozbitém balíčku, aliasu nebo lokalizaci.

Tento audit je výchozí kontrakt fáze 5.4. Další implementace nesmí přidávat novou paralelní měnu ani lokální „rychlé“ odemykání mimo společné služby.
