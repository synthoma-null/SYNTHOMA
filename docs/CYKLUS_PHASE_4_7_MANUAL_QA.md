# Cyklus Phase 4.7 Manual QA

Automaticke screenshot QA zustava v tomto prostredi blokovane systemovym `EPERM`. Nic se neinstaluje ani neobchazi; nasledujici body vyzaduji rucni vizualni kontrolu.

## Viewports

- 320 x 568
- 360 x 640
- 390 x 844
- 430 x 932
- 844 x 390 landscape
- 1440 x 900

## Card Surface

- Porovnej kratkou a dlouhou kartu; vnejsi vyska a pozice musi byt totozne.
- Kratky text zustava nahore, volny prostor uvnitr scene a volby dole.
- Dlouhy text scrolluje pouze uvnitr scene; volby zustavaji viditelne.
- Over Outcome, Predikci, Souhrn, sector intro a pre-run warning.
- Kazdy card overlay musi byt uprostred karty a dlouhy obsah musi scrollovat uvnitr panelu.
- Pred otevrenim a po otevreni overlaye porovnej polohu karty, headeru, statu a bottom navigation; nesmi se posunout ani o pixel.
- Over dostupnost CTA a navrat fokusu po zavreni.

## Command Header

- Bez tutorialu over poradi: Domu, status, Identita, Nastaveni, Hudba.
- S tutorialem over Skip jako posledni samostatny 44px slot.
- Vsechny ikony musi byt opticky na jedne ose a mit stejny 44 x 44 tap target.
- Dlouhy sektor se muze zkratit, ale cyklus a postup musi zustat viditelne.
- Focus a active marker se nesmi orezavat.

## Main Menu

- Bez save over Novou hru, Zopakovat tutorial a Prazdnotu; Pokracovat chybi.
- Se save over Pokracovat jako jedinou dominantni akci a viditelny stav ulozeneho behu.
- `SYNTHOMA` zustava na jednom radku pri 320 i 360 px.
- Menu obsah scrolluje uvnitr viewportu; pozadi a video se neposouvaji.
- Portal nesmi vytlacit ani prekryt CTA a video nesmi snizit kontrast textu.

## Themes

Projdi Synthoma, Green Matrix, Neon Hellfire, Cyber Dystopia, Acid Glitch, Retro Arcade, Mono BW a Mono Light.

V Mono Light over svetlou kartu i overlay panel, jemny backdrop, tmavy text a ikony, sede ramecky, kontrastni brand bez neonove zare a citelne focus ringy.

## Result

- Card geometry and overlays: PASS / HOLD
- Command header: PASS / HOLD
- Menu without save: PASS / HOLD
- Menu with save: PASS / HOLD
- Eight-theme pass: PASS / HOLD
- Release decision: PASS / HOLD
- Notes:
