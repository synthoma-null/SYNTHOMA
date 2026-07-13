# SYNTHOMA Phase 5.4 — manual QA

Před QA aplikuj databázové migrace na testovací databázi, spusť dry-run backfill a vytvoř uživatele s přesně známým zůstatkem. Pro každý nákup uchovej idempotency klíč a před/po stav ledgeru.

## Matice

| Scénář | Postup | Očekávaný výsledek |
| --- | --- | --- |
| Nepřihlášený Reader | Otevři volnou a placenou `/chapter/:id`. | Volná přesměruje do Readeru. Placená zobrazí auth/nákupní bránu; žádná 404. |
| Neznámá kapitola | Otevři náhodné ID na stránce i API. | Stránka a API vrátí 404. |
| Nevydaná kapitola | Otevři `0-12-conflict`. | Stav `unavailable`, žádné tlačítko nákupu, API 409 JSON. |
| Zamčené API | Zavolej placenou kapitolu bez entitlementu. | 403 JSON `CONTENT_LOCKED` s `ContentAccess`; nikdy HTML. |
| Přímý MNEM nákup | Uživatel se 64+ MNEM koupí kapitolu. | Jeden Purchase, jeden debit, jeden entitlement; Library i Reader se změní bez reloadu. |
| Nedostatek MNEM | Uživatel s nižším zůstatkem zkusí nákup. | 409, žádný ledger/purchase/entitlement zápis, zůstatek nezáporný. |
| Double click | Odešli dva stejné požadavky se stejným klíčem. | Druhý je replay; pouze jeden debit. |
| Závod | Odešli dvě různá ID požadavku na stejný obsah souběžně. | Jeden úspěch, jeden `ALREADY_OWNED`, jeden debit. |
| Další kapitola | Dočti poslední volnou kapitolu a zavři sync log. | Známá placená další kapitola nabídne nákup; nevstoupí do 404. |
| Balíček Akt I | Grantuj/kup `act-1`. | Jeden package entitlement; kapitoly 0-4 až 0-8 jsou owned ve všech površích. |
| Archive zůstatek | Měj vysoký zůstatek bez entitlementu. | MNEM Archive záznam zůstane teaser/hidden. |
| Archive nákup | Kup MNEM Archive záznam. | Otevře se full tělo bez reloadu; zůstatek se sníží jednou. |
| Fragment/artefakt/téma | Kup každý typ. | Všechny používají `/api/me/purchases` nebo adaptér sdílené služby a okamžitý snapshot. |
| Redeem replay | Použij kód dvakrát stejným účtem a potom jiným. | Stejný účet dostane bezpečný replay; jiný konflikt; grant je jen jeden. |
| Stripe jedna kapitola | Kup `single-fragment` s chapter ID. | Podepsaný webhook vytvoří chapter entitlement, ne prázdný package entitlement. |
| Stripe opakování | Přehraj event a jiný event pro stejnou session. | `ExternalGrantEvent` zabrání dvojímu grantu/kreditu. |
| Stripe návrat | Otevři success URL před webhookem. | UI hlásí ověřování, ne úspěch; po webhooku přejde do potvrzeného stavu. |
| Admin kredit | Odešli grant se stejným klíčem dvakrát. | Jeden ledger řádek a jeden audit; stejné `balanceAfter`. |
| Admin debit | Zkus korekci pod nulu. | 409 bez zápisu. |
| Profil | Otevři Archive/MNEM sekci. | Vidíš aktuální balance, ledger, purchase receipts a ownership se zdrojem/datací. |
| Cross-tab | Otevři Library a Reader ve dvou panelech, kup obsah. | Druhý panel invaliduje snapshot přes BroadcastChannel/storage a po refetchi ukáže owned. |
| Lokalizace | Přepni CS/EN v Library, Readeru a Archive. | ID a access stav zůstávají stejné; chybějící překlad neodemkne obsah. |
| Fail-closed | Dočasně zneplatni access endpoint nebo katalogovou referenci. | UI nezobrazí chráněné tělo a nabídne bezpečnou chybu/retry. |

## Regrese

Po ručním průchodu spusť `npm run content:validate`, TypeScript, celou Jest sadu a produkční build. Zkontroluj, že `rg` nenajde přímé zápisy `mnemLedger.create` ani `entitlement.create/upsert` mimo `src/server/economy`.
