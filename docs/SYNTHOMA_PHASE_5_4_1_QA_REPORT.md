# SYNTHOMA Phase 5.4.1 — E2E QA report

Datum ověření: 13. 7. 2026. Rozsah: Phase 5.4.1 hardening a nákupní cesta; žádný
redesign ani práce na další fázi.

## Prostředí

| Vrstva | Ověřená konfigurace |
| --- | --- |
| Aplikace | lokální Next.js na `127.0.0.1:3000`, explicitně izolované proměnné prostředí |
| Databáze | PostgreSQL 16.14 na `127.0.0.1:55432`, databáze `synthoma_541_e2e` |
| Desktop | in-app Chromium, viewport 1440×900 |
| Mobil | in-app Chromium, viewport 390×844 |
| Data | pouze syntetické QA účty; v reportu nejsou e-maily, hesla, tokeny ani idempotency klíče |

## Povinný nákupní průchod

| Krok | Desktop | Mobil | Důkaz |
| --- | --- | --- | --- |
| Poslední bezplatná kapitola `0-3-discontinuum` | PASS | PASS | Reader otevřel plný obsah a scroll dosáhl 100 %. |
| Dokončení a další známá kapitola | PASS | PASS | `0-3` zůstala po reloadu `dokončeno`; další byla kanonická `0-4-defragmentation`, nikoli 404. |
| Zamčená gate | PASS | PASS | Dialog ukázal cenu 64 MNEM a zůstatek 128 MNEM. |
| MNEM nákup | PASS | PASS | Po potvrzení klesl zůstatek na 64 a CTA se změnilo na pokračování. |
| Otevření Readeru | PASS | PASS | `0-4` zobrazila plný chráněný obsah. |
| Reload owned stavu | PASS | PASS | Přímá kanonická URL i Reader zůstaly přístupné po reloadu. |
| Library | PASS | PASS | `0-4` se změnila z locked tlačítka na odkaz; `0-3` zůstala dokončená. |

Mobilní účet navíc prošel skutečným dvojklikem při nákupu `0-5-pause`, kontrolou
cross-tab invalidace a stavem nedostatku prostředků pro `0-6-searching`.

## Databázové výsledky po čistém retestu

| Retest | Balance | Ledger | Completed purchases | Entitlements | Completed chapters | Negative balance rows |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | 64 | 2 | 1 | 1 | 1 | 0 |
| Mobil | 0 | 3 | 2 | 2 | 1 | 0 |

Pro mobilní `0-5-pause` bylo po dvojkliku přímo v DB ověřeno přesně
`1 debit / 1 Purchase / 1 Entitlement`. Následný disabled insufficient-funds stav
nevytvořil další řádek.

## Nalezené a opravené vady

1. Pozdější autosave s `completed=false` mohl přepsat již dokončenou kapitolu.
   Server nyní považuje completion za monotónní a Reader po potvrzení completion
   neposílá neúplný autosave. Regresní test ověřuje oba směry aktualizace.
2. Existující přepínač CS/EN nebyl připojen ke globální hlavičce. Po zapojení se
   volba vykresluje na Library, Readeru i Archive.
3. Uložená volba EN se po navigaci obnovila ve stavu Reactu, ale ne v atributu
   `html[lang]`. Synchronizace dokumentu nyní probíhá i při načtení uložené volby.

Po každé opravě proběhl čistý retest hlavního průchodu. Jednorázový vývojový
symptom Next redirectu po hot reloadu se na čistě restartovaném serveru
nezopakoval; kanonická owned URL přesměrovala do Readeru správně.

## API a bezpečnostní smoke

- neznámá kapitola: 404 JSON `CHAPTER_NOT_FOUND`;
- nevydaná kapitola: 409 JSON `CONTENT_UNAVAILABLE`, bez nákupního CTA;
- zamčená kapitola: 403 JSON `CONTENT_LOCKED` s access objektem;
- anonymní free/locked stránky rozlišily existenci obsahu od oprávnění;
- profil ukázal aktuální balance, append-only ledger, completed receipts a
  entitlement source/date;
- přepnutí CS/EN nezměnilo ID ani ownership a chybějící překlad nic neodemkl.

## Release stav

Hlavní desktopový i mobilní MNEM nákupní průchod je `PASS`. Celý produkční gate
zůstává `HOLD`, dokud nebudou ve schváleném stagingu dokončeny řádky označené
`BLOCKED` v manuální matici a vyřešen rights-approved zdroj `SYNTHOMA-NULL.txt`
podle `CANON_SOURCES.md`.
