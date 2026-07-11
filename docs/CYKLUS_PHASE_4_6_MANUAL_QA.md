# Cyklus Phase 4.6 Manual QA

Automaticke screenshot QA zustava v tomto prostredi blokovane systemovym `EPERM`. Tento checklist je navazujici rucni kontrola, nikoli nahrada funkcionalnich testu.

## Viewports

Proved kontrolu na `/cyklus` i mimo Cyklus (napr. `/books`) v rozmerech:

- 360 x 640
- 390 x 844
- 430 x 932
- 844 x 390 landscape
- 1440 x 900

## Motivy

V kazdem relevantnim kroku projdi vsech osm motivu:

- Synthoma
- Green Matrix
- Neon Hellfire
- Cyber Dystopia
- Acid Glitch
- Retro Arcade
- Mono BW
- Mono Light

## Audio Library

- Otevri hudbu z hlavicky Cyklu a over, ze panel obsahuje `KNIHOVNA STOP // 13`.
- Over poradi skladeb, mood, aktivni marker a stavy PLAY, PAUSE a MUTED.
- Vyber skladbu ze zacatku, stredu a konce seznamu; prehravac musi pouzivat stale jediny audio element.
- Over previous, next a automaticky prechod po konci skladby.
- Over seek, cas, mute, Escape, backdrop a navrat fokusu na tlacitko Hudba.
- Na mobilu musi byt hlavicka a ovladani dostupne, knihovna musi scrollovat bez horizontalniho overflow.
- V Mono Light musi byt aktivni stopa, text i focus ring citelne bez neonoveho glow.

## Subject Profile

- Na `/cyklus` otevri Identitu; musi se otevrit rovnou plny Profil subjektu bez mezilehleho popupu.
- Mimo `/cyklus` otevri stejny dialog kompaktnim globalnim triggerem.
- Over otevreni pres starsi `synthoma:open-profile` tok a po prihlaseni pres `?login=1`.
- Over pet sekci: PREHLED, PSYCHE, CYKLUS, ARCHIV a PRISTUP. Nastaveni nesmi byt v profilu.
- V Prehledu nesmi byt plna PsycheMap; detail se zobrazi jednou v sekci Psyche.
- Archiv musi obsahovat cteni i MNEM pristup. Pristup musi obsahovat ucet, soukromi a odhlaseni.
- Pro admina over odkaz ADMIN; pro bezneho uzivatele musi chybet.
- Over loading skeleton, chybovy stav a ZKUSIT ZNOVU.
- Over Escape, backdrop, explicitni zavreni, focus trap a navrat fokusu na Identitu.
- Otevreni profilu musi zavrit Audio a Ovladaci panel; otevreni techto panelu musi zavrit profil.

## Responsive And Theme Check

- Desktop: dialog je centrovany, levy rail se neposouva a scrolluje pouze obsah vpravo.
- Mobil: dossier vyplnuje viewport, close zustava dostupne a scrolluje pouze obsahova oblast.
- Landscape: kompaktni hlavicka nesmi vytlacit taby ani obsah.
- Dlouhy e-mail, nickname a datum nesmi pretekat.
- PsycheMap a RunDashboard musi zustat citelne na 360 px.
- Mono Light: svetly povrch, tmavy text, sede ramecky, citelny active tab a zadne cerne vnitrni karty.

## Result

- Audio library: PASS / HOLD
- Subject profile: PASS / HOLD
- Mobile and landscape: PASS / HOLD
- Eight-theme pass: PASS / HOLD
- Release decision: PASS / HOLD
- Notes:
