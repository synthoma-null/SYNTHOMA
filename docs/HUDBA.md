# Hudba

Veřejný přehrávač: https://www.synthoma.cz/hudba.html

Nové MP3 vložte do `apps/web/public/hudba/` a odešlete do větve `main` na GitHubu.
Po úspěšném nasazení se objeví v přehrávači automaticky. Stránku ani seznam není nutné měnit.
Název souboru bez přípony slouží jako název skladby; podporované jsou i mezery a diakritika.
Původních deset skladeb zachovává své pořadí, nové se řadí za ně podle názvu.
Odstranění MP3 z repozitáře skladbu při dalším nasazení také odstraní ze seznamu.

Samotné zkopírování souboru do složky v počítači veřejný web nezmění; soubor musí být také odeslán na GitHub.

`app/api/hudba/route.ts` při sestavení vygeneruje statický katalog z obsahu složky.
Přehrávač načítá tento katalog a MP3 přímo ze stejného nasazení. Nevyžaduje přihlášení ani databázi.
