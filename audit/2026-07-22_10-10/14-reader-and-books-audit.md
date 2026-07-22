# Knihy a čtečka

## Katalog

- Celkem 41 kapitol, žádný chybějící source soubor.
- SYNTHOMA-NULL: 22 kapitol, 13 published, 5 free.
- SYNTHOMA: KONEC PODPORY: 19 kapitol, 19 published a free.
- Obsahové validace: 131 položek / 41 kapitol PASS.
- 39 fyzických HTML content souborů, přibližně 168 231 slov, 443 voleb a 8 041 dialogových tříd.
- Dialog audit: 6 770 dialogů, 39 rozpoznaných speakerů, 2 210 explicitních tónů, 4 560 fallback tónů, 0 neznámých tříd.

## Nálezy

1. catalog.ts je skutečný manifest owner; public/books/manifest.json a generated indexy jsou odvozené. README tuto skutečnost popisuje chybně.
2. CS a EN 0-2 [RUN] jsou byte-identické. Může jít o záměrně nepřeložený obsah; vyžaduje obsahové rozhodnutí.
3. Orphan HTML seznam obsahuje pět EN NULL souborů, protože catalog eviduje český sourcePath a EN filename zvlášť; nejde automaticky o sirotky. Skutečně prověřit efekty.html a SYNTHOMA.html jako utility/legacy vstupy.
4. Chybějící lang na fragmentech není totéž co nevalidní HTML dokument, protože reader načítá fragmenty. Pokud mají být samostatně indexovatelné, doplnit formální contract.
5. Locked API nevydalo chráněný text a vrátilo 403. Free API vrátilo celý HTML obsah. Unavailable vrátilo 409.

## Choice gate

Reader decision controller, segment renderer a testy existují; coverage je slabší v ReaderDecisionController (44.82 % lines) a readerSegmentRenderer (50 %). Full Jest prošel, ale povinný desetisekundový browser scénář, reload před/po volbě, skip animace a závěrečná volba nebyly v tomto auditu interaktivně provedeny. Známý invariant „typewriter nepřejde přes nevyřešenou volbu“ je automaticky testovaný částečně, runtime verdikt zůstává HOLD.

## Progress

Server API a anonymní local state mají oddělené cesty. Testy kryjí monotonic completion, ale skutečný owned účet a merge po přihlášení nebyly použity. Žádný účet ani MNEM nebyl změněn.
