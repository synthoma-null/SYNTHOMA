# Cyklus Phase 4.7.1 Manual Visual QA

Automaticky screenshot runner zustava zablokovany systemovym `EPERM`. Tato kontrola proto neni prohlasena za hotovou a musi byt provedena rucne.

## Final CSS Geometry

- Card overlay inset: 6 px mobile, `clamp(6px, 1.5vw, 12px)` desktop.
- Overlay surface: width 100 %, height 100 %, bez max-width a max-height.
- Overlay rows: fixed header, `minmax(0, 1fr)` scroll content, fixed footer.
- Command header: 44 px vcetne borderu.
- Header grid: `44px minmax(0, 1fr) auto`.
- Action grid: one row 44 px, columns 44 px, SVG 18 x 18 px.
- Desktop brand: `clamp(2.7rem, 5.6vw, 5.6rem)`, max-content, overflow visible.
- Mobile brand: `clamp(2.15rem, 11.5vw, 3.5rem)`.
- Desktop video: opacity 0.58; brightness 0.68; contrast 1.12; saturation 0.95.
- Mobile video: opacity 0.46; brightness 0.64; contrast 1.1; saturation 0.9.

## Required Viewports

- 320 x 568
- 360 x 640
- 390 x 844
- 430 x 932
- 844 x 390
- 1024 x 768
- 1366 x 768
- 1440 x 900
- 1920 x 1080

## Menu

- Cele `SYNTHOMA` je viditelne vcetne posledniho A a nema druhou kopii ani `<br>`.
- Video je jasne viditelne vpravo; lokalni textovy scrim zachova kontrast vlevo.
- Portal neprekryva CTA ani hlavni obraz videa.
- Bez save jsou dostupne Nova hra, tutorial a Prazdnota.
- Se save je Pokracovat jedinou dominantni akci.
- CTA zustavaji dosazitelna v nizkem landscape viewportu.

## Header

- Domu, status, Identita, Nastaveni a Hudba jsou v jednom 44px radku.
- Tutorial skip je posledni ctvrty action slot, nikoli druhy radek.
- Dlouhy sektor pouzije ellipsis; cyklus a postup zustanou viditelne.
- Audio marker neposouva ikonu a focus ring neni orezeny.

## Card Overlays

- Outcome, Forecast, Summary, Sector a Warning vyplnuji temer celou kartu.
- Karta se pri otevreni vrstvy neposune ani nezmeni rozmery.
- Header a CTA zustavaji na miste; scrolluje pouze prostredni obsah.
- Outcome staty jsou 4 sloupce na sirsi karte a 2 x 2 na mobilu.

## Pocket

- Trigger zobrazuje SVG, KAPSA a badge vcetne hodnoty 0 v jednom radku.
- Aktivni stav ma viditelnou spodni linku a `aria-pressed=true`.
- Otevre se jediny stavajici pocket panel.
- Mono Light ma svetly povrch, tmavy text a citelny badge bez glow.

## Result

- Menu: PASS / HOLD
- Header: PASS / HOLD
- Card overlays: PASS / HOLD
- Pocket trigger: PASS / HOLD
- Mono Light: PASS / HOLD
- Release decision: PASS / HOLD
- Notes:
