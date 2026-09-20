# Hudba

Veřejný přehrávač a samostatná PWA: https://www.synthoma.cz/hudba/index.html
Původní odkaz `/hudba.html` přesměruje na tuto adresu.

Aplikace má vlastní manifest s ID a rozsahem `/hudba/`, vlastní ikony a service worker.
Tlačítko „Nainstalovat aplikaci“ nabízí systémovou instalaci v podporovaných prohlížečích,
jinak zobrazí návod, včetně instalace přes Safari na iPhone.
Po první úspěšné návštěvě lze bez internetu otevřít rozhraní a poslední katalog.
MP3 se nestahují pro offline poslech; přehrávání vyžaduje připojení.
Cache `music-pwa-*` je oddělená od cache hlavní PWA a nemaže její data.
Při změně offline souborů aktualizujte verzi cache v `public/hudba/sw.js`.

Nové MP3 vložte do `apps/web/public/hudba/` a odešlete do větve `main` na GitHubu.
Po úspěšném nasazení se objeví v přehrávači automaticky. Stránku ani seznam není nutné měnit.
Název souboru bez přípony slouží jako název skladby; podporované jsou i mezery a diakritika.
Původních deset skladeb zachovává své pořadí, nové se řadí za ně podle názvu.
Odstranění MP3 z repozitáře skladbu při dalším nasazení také odstraní ze seznamu.

Samotné zkopírování souboru do složky v počítači veřejný web nezmění; soubor musí být také odeslán na GitHub.

`app/api/hudba/route.ts` při sestavení vygeneruje statický katalog z obsahu složky.
Přehrávač načítá tento katalog a MP3 přímo ze stejného nasazení. Nevyžaduje přihlášení ani databázi.
