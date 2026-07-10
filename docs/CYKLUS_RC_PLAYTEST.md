# Cyklus RC Playtest Checklist

Verze: first-hour release candidate
Commit: `e3ad01c`
Datum checklistu: 2026-07-10

Tento dokument je ruční QA scénář pro člověka, který projde Cyklus jako hráč. Cílem není hledat nové feature nápady, ale potvrdit, že release candidate drží první hodinu hry bez blockerů.

## Jak spustit lokálně

```powershell
cd C:\SYNTHOMA\apps\web
npm.cmd run dev
```

Otevři:

- `http://localhost:3000/cyklus`
- `http://localhost:3000/cyklus/void`

Pokud port 3000 běží jinde, použij adresu, kterou vypíše Next dev server.

## Reset před testem

Pro čistý nový profil smaž v DevTools konzoli:

```js
[
  'synthoma_cyklus_run_v1',
  'synthoma_cyklus_history_v1',
  'synthoma_cyklus_tutorial_seen',
  'synthoma_cyklus_tutorial_v2_seen',
  'synthoma_cyklus_progression_v1',
  'synthoma_cyklus_discovery',
  'synthoma_cyklus_story_v1',
  'synthoma_cyklus_findings',
  'synthoma_cyklus_meta_unlocks',
  'synthoma_cyklus_fresh_meta_pools'
].forEach((key) => localStorage.removeItem(key));
location.reload();
```

Pokud testuješ save/load kompatibilitu, nemaž localStorage mezi kroky daného scénáře.

## Jak zapisovat výsledky

U každého scénáře vyplň:

- Výsledek: `PASS` / `HOLD`
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

Blocker zastavuje release. Polish poznámka release nezastavuje, pokud hra zůstává srozumitelná a dokončitelná.

## Scénáře

### 1. Nový hráč, základní tutorial, `CHCI HRÁT`

Co udělat:

- Vyčisti localStorage.
- Otevři `/cyklus`.
- Projdi tutorial od `tutorial_00_welcome` po rozcestník.
- Na rozcestníku klikni `CHCI HRÁT`.
- Pokračuj do restart prologu a odehraj několik karet běhu.

Co má hráč vidět:

- Krátký tutorial bez dlouhého debug textu.
- Panel `AKTUÁLNÍ STOPA`.
- Hint ke statům: cíl není mít vše vysoko, ale nespadnout z obou stran.
- Po `CHCI HRÁT` se už nezobrazují rozšiřující tutorial karty.
- Hráč přejde na `0 [RESTART]` a následně do běhu.

Blocker:

- `CHCI HRÁT` nepustí do běhu.
- Tutorial se zasekne nebo začne cyklit.
- UI ukazuje interní debug názvy místo hráčského textu.
- Karta nejde zahrát.

Polish poznámka:

- Text je pochopitelný, ale mohl by být kratší nebo ostřejší.
- Některý microcopy tón působí méně SYNTHOMA.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 2. Nový hráč, rozšířený tutorial, `CHCI JEŠTĚ VYSVĚTLIT`

Co udělat:

- Vyčisti localStorage.
- Otevři `/cyklus`.
- Dojdi na rozcestník.
- Klikni `CHCI JEŠTĚ VYSVĚTLIT`.
- Projdi rozšíření až po konec tutorialu.

Co má hráč vidět:

- Po volbě pokračuje karta o profilu, ne restart.
- Rozšíření vysvětluje profil, itemy, otisky, sektory, Prázdnotu a progresi.
- Po finále tutorialu následuje `0 [RESTART]`.

Blocker:

- Volba nepokračuje do rozšíření.
- Story interlude nebo běžná karta přeruší tutorial.
- Rozšíření nejde dokončit.

Polish poznámka:

- Některá rozšiřující karta je moc dlouhá, ale stále srozumitelná.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 3. První smrt nebo stabilizace

Co udělat:

- Po tutorialu pokračuj v běhu, dokud nedojde ke smrti nebo stabilizaci.
- Pokud je běh dlouhý, záměrně tlač jeden stat k 0 nebo 100.

Co má hráč vidět:

- Outcome screen začíná krátkým summary: `KONEC: ...`.
- Hráč vidí proč skončil.
- Zobrazí se max 3 hlavní příčiny.
- Odměny jsou krátce shrnuté.
- `Zobrazit plný log` je zavřené při prvním zobrazení.
- `Zobrazit plný log` a `Skrýt plný log` fungují.

Blocker:

- Outcome se nezobrazí.
- Hráč nevidí důvod smrti/stabilizace.
- Plný log je vidět hned.
- Z outcome nejde odejít do Prázdnoty nebo nového běhu.

Polish poznámka:

- Některé vysvětlení je správné, ale méně dramatické nebo málo jasné.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 4. Návrat do Prázdnoty

Co udělat:

- Z outcome klikni na návrat do Prázdnoty.
- Prohlédni přehled a dostupné taby.

Co má hráč vidět:

- Text `PRÁZDNOTA SE ZMĚNILA`, pokud jde o první návrat.
- Reziduum, materiály, jizva/jádro nebo doporučení, pokud byly získané.
- Jasné CTA pro další krok.
- Taby: Přehled, Kapsa, Crafting, Místnosti, Loadout, Protokoly.

Blocker:

- Prázdnota spadne nebo je prázdná.
- CTA pro další běh není dostupné.
- Taby nejdou ovládat.
- Získané odměny očividně zmizely.

Polish poznámka:

- Doporučení je funkční, ale mohlo by být výraznější.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 5. Mixed run

Co udělat:

- Z Prázdnoty spusť další běh bez focus volby.
- Odehraj několik karet.

Co má hráč vidět:

- Běh nepůsobí jako tutorial.
- Karty se míchají napříč dostupným obsahem.
- `AKTUÁLNÍ STOPA` neukazuje konkrétní focus oblast.

Blocker:

- Spuštění nového běhu selže.
- Picker skončí bez karty.
- Hra zůstane ve focus módu bez volby hráče.

Polish poznámka:

- Mix by mohl být tematicky sevřenější, ale je hratelný.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 6. Archiv focus run

Co udělat:

- V Prázdnotě vyber focus na Archiv.
- Spusť focused run a odehraj 5-10 karet.

Co má hráč vidět:

- UI lidsky oznámí, že běh drží oblast Archiv.
- Karty se drží Archivu nebo bezpečných výjimek.
- Focus label neukazuje interní výrazy jako `strictness`, `payload`, `matcher`.

Blocker:

- Focus nejde spustit.
- Běh začne mixed bez focusu.
- Picker skončí bez karty.
- UI ukazuje interní QA/debug termíny.

Polish poznámka:

- Archiv by snesl více ručně mířených karet.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 7. Glitchka appendix run

Co udělat:

- V Prázdnotě vyber Glitchka appendix / krátkou stopu.
- Odehraj celý krátký run segment.

Co má hráč vidět:

- Krátká stopa působí jako Glitchka obsah, ne jako běžný mixed run.
- Focus po vyčerpání sám skončí.
- Další karty mohou přejít zpět do běžného výběru.

Blocker:

- Appendix nejde spustit.
- Neobjeví se žádný Glitchka obsah.
- Focus se nikdy neukončí.

Polish poznámka:

- Glitchka stopa by mohla mít víc variant později.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 8. Sarkasma therapy run

Co udělat:

- V Prázdnotě vyber Sarkasma therapy focus.
- Odehraj několik karet.

Co má hráč vidět:

- Běh jasně komunikuje Sarkasma/therapy focus.
- Karty nebo bezpečné výjimky odpovídají zvolené stopě.
- UI zůstává hráčské, ne technické.

Blocker:

- Focus nejde spustit.
- Běh nedostane žádný odpovídající obsah.
- Zobrazí se interní názvy pravidel nebo scoringu.

Polish poznámka:

- Terapie může později dostat víc ručně psaných přechodů.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 9. T-AI focus run

Co udělat:

- V Prázdnotě vyber T-AI focus.
- Odehraj několik karet.

Co má hráč vidět:

- Běh jasně komunikuje T-AI focus.
- Karty nebo bezpečné výjimky odpovídají zvolené stopě.
- Focus panel se na mobilu nevejde mimo obraz.

Blocker:

- Focus nejde spustit.
- Picker skončí bez karty.
- Focus panel přeteče tak, že zakryje CTA.

Polish poznámka:

- T-AI label nebo microcopy lze později zostřit.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 10. Save/load během běhu

Co udělat:

- Začni libovolný běh.
- Odehraj několik karet.
- Refreshni stránku během aktivního běhu.
- Klikni `Pokračovat`.

Co má hráč vidět:

- Aktuální karta nebo běh se obnoví.
- Staty, inventory, flags a případný focus zůstanou.
- Po pokračování lze zahrát další volbu.

Blocker:

- Refresh smaže běh.
- `Pokračovat` nefunguje.
- `currentCardId` nebo `runFocus` se ztratí.
- Po loadu nejde zahrát karta.

Polish poznámka:

- Návratové menu by mohlo mít lepší wording, ale funguje.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 11. Refresh stránky během outcome

Co udělat:

- Dostaň se na outcome screen.
- Refreshni stránku.
- Ověř, co se stane s ukončeným během a historií.

Co má hráč vidět:

- Hra nespadne.
- Ukončený běh se neztratí z historie.
- Hráč se dostane k novému běhu nebo Prázdnotě.

Blocker:

- Refresh outcome způsobí crash.
- Hráč uvízne bez CTA.
- Historie nebo odměny se zjevně rozpadnou.

Polish poznámka:

- Po refreshi by mohlo být jasnější, že předchozí běh byl archivován.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

### 12. Návrat přes `/cyklus/void`

Co udělat:

- Otevři přímo `/cyklus/void`.
- Zkontroluj Prázdnotu.
- Spusť další běh nebo focused run.
- Vrať se na `/cyklus`.

Co má hráč vidět:

- Samostatná route Prázdnoty načte progression.
- CTA a focus volby fungují stejně jako z hlavního klienta.
- Přechod zpět do běhu funguje.

Blocker:

- `/cyklus/void` vrátí chybu nebo prázdnou stránku.
- Progression se nenačte.
- Nový/focused run z této route nejde spustit.

Polish poznámka:

- Přechod mezi routami by mohl být plynulejší.

Výsledek:

- PASS/HOLD:
- Poznámky:
- Screenshot/video:
- Console errors:
- Browser + viewport:

## Blocker checklist

Release držet na `HOLD`, pokud platí cokoliv z toho:

- Production build padá.
- `/cyklus` nebo `/cyklus/void` padá.
- Tutorial nejde dokončit.
- `CHCI HRÁT` nepustí do běhu.
- `CHCI JEŠTĚ VYSVĚTLIT` nepokračuje do rozšíření.
- Outcome nejde opustit.
- Full log je vidět hned.
- Focus run nejde spustit.
- Save/load ztratí `runFocus` nebo `currentCardId`.
- Picker skončí bez karty.
- Testy padají.
- V konzoli je runtime chyba, která rozbije hraní.

## Polish notes

Použij pro věci, které neblokují release:

- Text je funkční, ale mohl by být kratší.
- Label je jasný, ale ne dost poetický.
- Focus by mohl mít víc ručně mířených karet.
- Animace nebo přechod by mohly být plynulejší.
- Některý panel by mohl mít lepší vizuální prioritu, ale nebrání hraní.

## Known non-blockers

- Production build hlásí starší hook dependency warningy mimo Cyklus: `BooksClient`, `GameShell`, `TypewriterReader`.
- Projekt zatím nemá Playwright/Cypress screenshot runner.
- Mobile layout sanity je zatím ověřená staticky, komponentovými testy a buildem, ne vizuálním runnerem.
- Content gaps: některé focus oblasti potřebují později více ručně mířených karet.

## Release decision

Vyplnit po ručním průchodu:

- Decision: `PASS` / `HOLD`
- Tester:
- Datum:
- Commit:
- Shrnutí:
- Blockery:
- Polish poznámky:
