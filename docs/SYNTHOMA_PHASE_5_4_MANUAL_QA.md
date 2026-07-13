# SYNTHOMA Phase 5.4 — manual QA

QA proběhlo 13. 7. 2026 výhradně proti lokální PostgreSQL 16.14 na
`127.0.0.1:55432` a lokální aplikaci na `127.0.0.1:3000`. Produkční `.env.local`,
reálné přístupové kódy, Stripe tajné hodnoty ani osobní data nebyly použity.

Povolené stavy jsou `PASS`, `FAIL`, `BLOCKED` a `NOT APPLICABLE`. `BLOCKED`
znamená, že chybí schválená testovací autorita nebo externí fixture; takový řádek
nesmí být považován za release PASS. `NOT APPLICABLE` označuje scénář, který nelze
věrohodně vyvolat ručním prohlížečem a má samostatný PostgreSQL integrační gate.

## Matice

| Scénář | Postup | Očekávaný výsledek | Výsledek | Důkaz / poznámka |
| --- | --- | --- | --- | --- |
| Nepřihlášený Reader | Otevři volnou a placenou `/chapter/:id`. | Volná přesměruje do Readeru. Placená zobrazí auth/nákupní bránu; žádná 404. | PASS | Anonymní `0-3-discontinuum` otevřel Reader; `0-4-defragmentation` zobrazil známou access gate s přihlášením/registrací. |
| Neznámá kapitola | Otevři náhodné ID na stránce i API. | Stránka a API vrátí 404. | PASS | Stránka zobrazila kanonickou 404; API vrátilo 404 JSON `CHAPTER_NOT_FOUND`. |
| Nevydaná kapitola | Otevři `0-12-conflict`. | Stav `unavailable`, žádné tlačítko nákupu, API 409 JSON. | PASS | Stránka zobrazila `CONTENT_UNAVAILABLE` bez nákupu; API vrátilo 409 JSON. |
| Zamčené API | Zavolej placenou kapitolu bez entitlementu. | 403 JSON `CONTENT_LOCKED` s `ContentAccess`; nikdy HTML. | PASS | API vrátilo 403 JSON `CONTENT_LOCKED` s access objektem. |
| Přímý MNEM nákup | Uživatel se 64+ MNEM koupí kapitolu. | Jeden Purchase, jeden debit, jeden entitlement; Library i Reader se změní bez reloadu. | PASS | Desktop i mobil koupily `0-4-defragmentation`; DB pro každý účet potvrdila 1 Purchase, 1 debit a 1 Entitlement. |
| Nedostatek MNEM | Uživatel s nižším zůstatkem zkusí nákup. | 409, žádný ledger/purchase/entitlement zápis, zůstatek nezáporný. | PASS | Mobil při 0/64 zobrazil deaktivované `NEDOSTATEK MNEM`; DB zůstala na 3 ledger řádcích, 2 nákupech a 2 entitlementech. Serverový 409/no-write invariant ověřuje reálný PostgreSQL test. |
| Double click | Odešli dva stejné požadavky se stejným klíčem. | Druhý je replay; pouze jeden debit. | PASS | Skutečný mobilní `dblclick()` na nákup `0-5-pause`; DB potvrdila přesně 1 debit, 1 Purchase a 1 Entitlement pro obsah. |
| Závod | Odešli dvě různá ID požadavku na stejný obsah souběžně. | Jeden úspěch, jeden `ALREADY_OWNED`, jeden debit. | NOT APPLICABLE | Ruční UI nevytvoří deterministicky dvě souběžná různá idempotency ID. Povinný PostgreSQL test B ověřil přesně 1 debit a 1 entitlement. |
| Další kapitola | Dočti poslední volnou kapitolu a zavři sync log. | Známá placená další kapitola nabídne nákup; nevstoupí do 404. | PASS | Desktop 1440×900 i mobil 390×844 prošly `0-3` → zamčená `0-4` → nákup → `POKRAČOVAT` → Reader → reload → Library. |
| Balíček Akt I | Grantuj/kup `act-1`. | Jeden package entitlement; kapitoly 0-4 až 0-8 jsou owned ve všech površích. | BLOCKED | Nebyl poskytnut schválený balíčkový grant, redeem fixture ani Stripe testovací autorita. |
| Archive zůstatek | Měj vysoký zůstatek bez entitlementu. | MNEM Archive záznam zůstane teaser/hidden. | BLOCKED | Archive v EN zobrazil chráněný Black Box bez otevření, ale nebyl k dispozici účet s požadovaným vysokým zůstatkem a bez archive entitlementu. |
| Archive nákup | Kup MNEM Archive záznam. | Otevře se full tělo bez reloadu; zůstatek se sníží jednou. | BLOCKED | Lokální QA účet neměl 1024 MNEM a nebyl použit neschválený přímý kredit. |
| Fragment/artefakt/téma | Kup každý typ. | Všechny používají `/api/me/purchases` nebo adaptér sdílené služby a okamžitý snapshot. | BLOCKED | Chyběly schválené lokální fixtures a dostatečný zůstatek pro všechny typy; rozsah nebyl rozšířen přímými DB zásahy. |
| Redeem replay | Použij kód dvakrát stejným účtem a potom jiným. | Stejný účet dostane bezpečný replay; jiný konflikt; grant je jen jeden. | BLOCKED | Nebyl poskytnut schválený plaintext QA kód; žádný kód nebyl vymyšlen ani zalogován. |
| Stripe jedna kapitola | Kup `single-fragment` s chapter ID. | Podepsaný webhook vytvoří chapter entitlement, ne prázdný package entitlement. | BLOCKED | Reálná Stripe testovací konfigurace a podepsaný ruční event nebyly v rozsahu k dispozici. |
| Stripe opakování | Přehraj event a jiný event pro stejnou session. | `ExternalGrantEvent` zabrání dvojímu grantu/kreditu. | NOT APPLICABLE | Externí replay nebyl ručně autorizován; podepsaný event a replay ověřil povinný PostgreSQL test C. |
| Stripe návrat | Otevři success URL před webhookem. | UI hlásí ověřování, ne úspěch; po webhooku přejde do potvrzeného stavu. | BLOCKED | Chyběla Stripe testovací session a autorizovaný webhook timing test. |
| Admin kredit | Odešli grant se stejným klíčem dvakrát. | Jeden ledger řádek a jeden audit; stejné `balanceAfter`. | BLOCKED | Nebyl poskytnut schválený lokální admin účet/credential. |
| Admin debit | Zkus korekci pod nulu. | 409 bez zápisu. | BLOCKED | Nebyl poskytnut schválený lokální admin účet/credential; negativní invariant je ověřen na reálném PostgreSQL. |
| Profil | Otevři Archive/MNEM sekci. | Vidíš aktuální balance, ledger, purchase receipts a ownership se zdrojem/datací. | PASS | Profil ukázal balance 0, 2 vlastnictví se zdrojem `mnem_purchase`, 3 ledger řádky s `balanceAfter` a 2 completed receipts. |
| Cross-tab | Otevři Library a Reader ve dvou panelech, kup obsah. | Druhý panel invaliduje snapshot přes BroadcastChannel/storage a po refetchi ukáže owned. | PASS | Po nákupu `0-5-pause` v Library se CTA v otevřeném Readeru změnilo ze zamčeného stavu na `POKRAČOVAT`. |
| Lokalizace | Přepni CS/EN v Library, Readeru a Archive. | ID a access stav zůstávají stejné; chybějící překlad neodemkne obsah. | PASS | EN přetrval po reloadu (`html[lang=en]`); owned `0-4` i `0-5` zůstaly owned, `0-6` zůstala locked a Archive použil anglická data bez zpřístupnění chráněného záznamu. |
| Fail-closed | Dočasně zneplatni access endpoint nebo katalogovou referenci. | UI nezobrazí chráněné tělo a nabídne bezpečnou chybu/retry. | BLOCKED | Záměrné poškození běžícího katalogu/endpointu nebylo provedeno v sdíleném workspace; automatické testy fail-closed zůstávají zelené, ale nenahrazují ruční gate. |

Souhrn ruční matice: **11 PASS, 0 FAIL, 10 BLOCKED, 2 NOT APPLICABLE**.
Produkční release proto zůstává `HOLD`, i když hlavní MNEM nákupní E2E průchod je
PASS. Blokované externí scénáře se musí provést ve schváleném stagingu.

## Regrese

Po ručním průchodu spusť `npm run content:validate`, TypeScript, celou Jest sadu,
PostgreSQL integrační sadu a produkční build. Zkontroluj, že `rg` nenajde přímé
zápisy `mnemLedger.create` ani `entitlement.create/upsert` mimo
`src/server/economy`.
