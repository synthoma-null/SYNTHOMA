# Accessibility a čitelnost

## Co bylo možné ověřit staticky

- V kódu je přibližně 1 622 výskytů ARIA/role/tabIndex/onClick; projekt přístupnost aktivně řeší.
- HTML audit 39 knižních souborů našel 0 obrázků bez alt a 0 souborů s duplicitními id.
- Reader má skip link, command rail, focus a choice controllers; komponentové testy kryjí část chování.
- Nalezeny clickable divy v SoloClient help overlay, MBTIHudClient a ChapterSyncLog. Overlay backdrop může být legitimní doplňková click target, MBTI chip ale potřebuje keyboard/role nebo button.
- Statický CSS scan našel 17 font-size hodnot pod 13 px vyjádřených v px; rem hodnoty .62–.8rem se vyskytují v auth, reader a utility UI.

## Co nelze tvrdit bez browseru

Computed font-size, line-height, kontrast, reálná opacity, délka řádku, safe-area, zoom 200 %, focus order, screen-reader názvy, overflow a mobilní header jsou HOLD. Zdrojové CSS neprokazuje výsledný cascade.

| Route | Desktop | Tablet | Mobile | Typografie | Kontrast | Overflow | Header | Výsledek |
|---|---|---|---|---|---|---|---|---|
| / | HOLD | HOLD | HOLD | staticky bez verdiktu | HOLD | HOLD | shared | HOLD |
| /books | HOLD | HOLD | HOLD | některé 0.9rem | HOLD | HOLD | shared | HOLD |
| /archive | HOLD | HOLD | HOLD | card text ověřit | accent role ověřit | HOLD | shared | HOLD |
| /cyklus | HOLD | HOLD | HOLD | komplexní responsive CSS | color-only rizika ověřit | HOLD | vlastní integrace | HOLD |
| /autor | HOLD | HOLD | HOLD | fallback CSS | HOLD | HOLD | ověřit shared shell | HOLD |
| /install | HOLD | HOLD | HOLD | PWA copy | HOLD | HOLD | shared | HOLD |
| /profile/settings | HOLD | HOLD | HOLD | dense panels | HOLD | HOLD | shared | HOLD |
| oba readery | HOLD | HOLD | HOLD | body text a controls odděleně | speaker tones | HOLD | rail/command bar | HOLD |
| /offline a 404 | HOLD | HOLD | HOLD | error copy | HOLD | HOLD | shared | HOLD |

## Doporučený acceptance test

Spustit existující scripts/typography-readability-audit.js v reálném browseru na všech požadovaných viewports. Blokovat důležitý UI text pod 13 px, odstavce pod 16 px, dlouhý tracking, opacity pod 0.6 bez sekundární role, horizontální overflow a obsah zakrytý fixními prvky.
