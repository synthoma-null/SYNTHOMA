# Archiv

## Data

- public/data/archiveCards.json: 41 položek.
- public/data/archiveCards_en.json: 41 položek.
- Obě locale varianty mají stejnou množinu ID a kategorií.
- Chybějící title/description: 0; invalid related references: 0.
- KONEC PODPORY položky jsou přítomny (ID s prefixem kp-).

## Riziko zdroje pravdy

Archivní obsah existuje v locale JSON, catalog.ts jako archive_record metadata, reader unlock logice a speaker/CSS barvách. Není doložen jediný generátor všech těchto vrstev. Největší riziko je divergence ID, unlock podmínky a accent barvy, nikoli aktuální chybějící záznam.

## Doporučení

Vytvořit jeden typovaný archivní registr s locale texty, source book, unlock trigger, category, related IDs a speaker/color role. Z něj generovat public JSON i catalog entries. Barvu postavy neukládat jako volný hex u každé karty, ale odkazovat na speaker role; výjimky explicitně pojmenovat.

## Runtime

/archive lokálně vrací 200. Ve build reportu má přibližně 380 KB first-load JS a page coverage 48.14 %. Filtrování, dlouhé karty, zámky a vizuální barvy nebyly kvůli browser blokaci ručně potvrzeny. Verdict: datová konzistence PASS, UX/runtime HOLD.
