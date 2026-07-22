# Vizuální konzistence

## Stav ověření

Automatizovaný browser přístup na https://www.synthoma.cz byl explicitně odmítnut bezpečnostní politikou prostředí. Nebyl použit jiný browser ani CDP obcházení. Požadovaných 48 screenshotů nebylo vytvořeno; adresář screenshots obsahuje pouze vysvětlení blokace.

| Route/oblast | Statické vlastnictví | Browser verdict |
|---|---|---|
| Home | SynthomaShell + home komponenty | HOLD |
| Books | library komponenty + books CSS | HOLD |
| Archive | shared shell, vlastní grid/dialog | HOLD |
| Cyklus | vlastní OS vrstva a rozsáhlé doménové CSS | HOLD |
| Autor | vlastní module CSS, fallback vrstva | HOLD |
| Install/PWA | shared shell + PWA komponenty | HOLD |
| Profile/Settings | shared panely, několik lokálních vrstev | HOLD |
| NULL reader | společný reader + NULL CSS | HOLD |
| KONEC PODPORY reader | společný reader + 452 KB knižního CSS | HOLD |
| Offline/404 | App Router shell | HOLD |

## Statické závěry

- Společný SynthomaShell, command header, portal rooty a reader komponenty jsou správným směrem.
- Autor má vlastní fallback stylesheet a vyžaduje ověření, že výsledný shell není starší paralelní varianta.
- NULL a KONEC PODPORY sdílejí reader controllers, ale výrazová CSS vrstva druhé knihy je natolik velká, že vizuální equivalence ověřit jen import graph nelze.
- Archiv má accent barvy přímo v locale JSON; dialogy čerpají speaker registry/CSS. Je nutné vizuálně i datově sjednotit původ barev.
- Cyklus má vlastní dominantní UI jazyk. Integrace přes globální header existuje, ale soudržnost je browser otázka.

## Ruční screenshot matice

Po odblokování zachytit home, books, archive, cycle, autor, install, profile, settings, oba readery, offline a 404 na 390×844, 768×1024, 1440×900 a 1920×1080. Ke každému snímku zaznamenat overflow, header, focus, text scale, prázdný/loading/error stav a identitu shellu.
