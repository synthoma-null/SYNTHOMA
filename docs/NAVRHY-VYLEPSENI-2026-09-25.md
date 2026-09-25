# Návrhy na vylepšení SYNTHOMA

Datum: 25. 9. 2026. Podklad: současný pracovní adresář, včetně rozpracovaných změn.

## Následné provedené změny podle zadání

Níže uvedený audit zachycuje původní stav. Po následném zadání byly lokálně implementovány tyto změny:

- Intro se při každém novém otevření nebo obnovení domovské stránky zobrazí znovu. Video, logo, první a druhý řádek citátu a tlačítko Vstoupit se odhalují postupně. Původní font Text02 a glitch efekt citátu jsou obnovené, video má slabší překryv. Při omezeném pohybu se sekvence nezdržuje animací. Odkaz pro opakování na domovské stránce je odstraněný. Přímé odkazy do kapitol zůstávají přímé.
- Knihovna slučuje serverový postup s místním po jednotlivých kapitolách, včetně rozečtených. Účty mají oddělené čekající zápisy; starší opožděný zápis nesnižuje dosažený postup. Domovská akce načítá také serverové pokračování.
- Čtečka zobrazuje stav ukládání. Neodeslané změny uchovává a opakuje po návratu spojení i mimo čtečku.
- Domovská stránka má jednu hlavní akci pro čtení a odstraněné opakované nabídky. Cookies mají kompaktnější panel, ovládání klávesnicí a nezakrývají intro. Během intra jsou odložené také panely instalace a aktualizace aplikace.
- Styly čtečky, knih, přihlášení a her se načítají u příslušných částí. Sociální obrázek je nově JPEG 1200 × 630 o velikosti 176 155 bajtů místo původních 8 759 212 bajtů. Původní fonty zůstávají.
- Knihovna nabízí hledání a filtry dostupnosti/postupu; archiv hledání postav, témat a záznamů a volbu skrýt spoilery. Hledání neprohledává zamčené podrobnosti.
- Cyklus je označený jako hra pro jednoho, Nezlob Prázdnotu jako hra pro 2–6 hráčů.
- Hostovské herní tokeny mají kryptografickou náhodnost a serverové hashování, požadavky validaci a omezení četnosti; klient nemůže podstrčit celý herní stav. Souběžné změny místnosti kontrolují verzi. Staré anonymní tokeny nejsou kompatibilní a vyžadují novou místnost.
- Nové knihy a kapitoly se ukládají skryté. Úprava kapitoly ukládá předchozí obsah do historie; obnovení verze ji načte jako skrytý koncept k posouzení a uložení.

Ověření: závěrečná celá sada před poslední úpravou odložení PWA panelů měla 896 úspěšných testů, 22 přeskočených a žádné selhání. Po této poslední úpravě prošlo všech 32 souvisejících PWA testů. Produkční sestavení včetně lintingu a kontroly typů prošlo. Intro bylo ověřené v prohlížeči na desktopu i při šířce 390 px; ověřený je vstup bez smyčky, opakování po obnovení a hledání archivu. Živý databázový přístup prostředí odmítá, proto nebylo provedeno skutečné párování zařízení ani zápis revizí do připojené databáze. Změny nejsou nasazené do produkce.

## Rozsah a výsledek

Průřezová revize struktury projektu a hlavních oblastí: úvod, domovská stránka, knihovna, čtečka, archiv, hry, účty, administrace, veřejné API, offline režim, styly, média a automatické kontroly. Konkrétní zjištění níže vycházejí z implementace; produktové návrhy jsou označené jako návrhy. Nejde o kontrolu každého řádku, penetrační test ani ověření produkčního nasazení. V prohlížeči bylo vizuálně ověřeno intro, nikoli všechny obrazovky a zařízení.

SYNTHOMA už má výraznou identitu, propojení příběhů a her, nastavení čtečky, společné řízení přístupu a rozsáhlé testy. Největší přínos nyní vidím ve spolehlivém pokračování ve čtení, jasnějším prvním kontaktu a menší složitosti rozhraní. Původní fonty a výtvarný charakter doporučuji zachovat.

## Provedená úprava intra

- Průhlednost vrstvy pozadí se změnila z 0,44 na 1 a samotné video má v intru vlastní hodnotu 0,9. Dříve se násobilo ztlumení celé vrstvy a globální nastavení videa (ve výchozím tématu 0,42).
- Výrazně slabší tmavé překryvy. Text má stín a silnější řez, tlačítko tmavé pozadí.
- Jediné tlačítko Vstoupit a respektování vypnutých/omezených animací zůstávají.
- Změna je místní, bez nasazení. Náhled: http://localhost:3011/landing-intro.

## Nejdřív: spolehlivost a hlavní uživatelská cesta

### 1. Dokončit synchronizaci rozečtené knihy mezi zařízeními

**Zjištění:** `useLibraryProgress` načítá serverový `progressPercent`, ale pro nedočtené kapitoly používá místní procenta. Přehled `byCollection`, ze kterého se vybírá pokračování, vzniká jen z místní paměti. `ChapterReadingProgress` obnovuje místo také z místního stavu.

**Návrh:** sloučit místní a serverový postup podle kapitoly a času změny; při přihlášení nabídnout přenos postupu hosta. Uchovávat samostatně poslední místo a nejvyšší dosažený postup. Současná hodnota procent jen roste, takže návrat k dřívějšímu odstavci nezmění uložené místo.

**Hotovo bude, když:** rozečtená kapitola na telefonu nabídne stejné místo na počítači; změna velikosti písma neodsune čtenáře jinam. Pro přesné místo využít identifikátor odstavce, pro který už existuje pole `lastBlockId`.

Podklad: `apps/web/src/lib/synthoma/library/useLibraryProgress.ts`, `apps/web/src/components/reader/ChapterReadingProgress.tsx`, `apps/web/src/lib/readerState.ts`.

### 2. Zviditelnit a opravovat neúspěšné ukládání

**Zjištění:** čtečka při odesílání postupu neověřuje HTTP výsledek, chyby zachytí prázdnou obsluhou a posune poslední odeslané procento ještě před potvrzením. Po dokončení kapitoly navíc podmínka omezení odesílání přestává platit a další posuny stránky mohou znovu odesílat hotový stav.

**Návrh:** nenápadné stavy „Uloženo“, „Uloženo v tomto zařízení“, „Čeká na synchronizaci“, opakování po obnovení připojení a slučování požadavků. Server by měl odolávat opožděným odpovědím a starším zápisům.

Podklad: `apps/web/src/components/reader/ChapterReadingProgress.tsx`, `apps/web/app/api/me/progress/route.ts`.

### 3. Zpevnit vstup do online herních místností

**Zjištění:** anonymní token vzniká pomocí `Math.random` a času. Server ukládá a porovnává vlastní 32bitový hash. V obsluze vytvoření místnosti není sdílený limit požadavků ani schéma validující povolený režim a délku přezdívky. Toto je zjištění z kódu, nikoli provedený útok.

**Návrh:** kryptograficky náhodné tokeny, standardní kryptografický otisk, společná implementace ověření, validace vstupů a limity vytváření/připojování. Prověřit souběžné připojení hráčů a tahy.

Podklad: `apps/web/app/game/GameClient.tsx`, `apps/web/app/api/game/rooms/route.ts`, navazující obsluhy `start` a `move`.

### 4. Zjednodušit domovskou stránku

**Zjištění:** HomeFirstContact nabízí příběh, Cyklus a archiv; HomeSectorLinks znovu nabízí knihovnu, Cyklus a archiv. Vracející se návštěvník zároveň dostane další blok pokračování.

**Návrh:** hlavní akce „Začít číst zdarma“, u vracejícího se čtenáře „Pokračovat v kapitole …“. Pod tím jednou nabídnout další části světa. První návštěva potřebuje krátké vysvětlení, co je SYNTHOMA a co návštěvník dostane po kliknutí.

Podklad: `apps/web/src/components/home/SynthomaHome.tsx`, `HomeFirstContact.tsx`, `HomeSectorLinks.tsx`, `HomePrimaryAction.tsx`.

### 5. Zmenšit překryvné panely a sladit jejich ovládání

**Zjištění:** při první návštěvě v náhledu velký panel cookies překryl tlačítko intra. CookieConsent deklaruje modální dialog, ale nepoužívá společný `useUiLayer`; fokus v pozorovaném stavu zůstával na tlačítku pod panelem. Čtečka navíc při první návštěvě otevírá vlastní onboarding.

**Návrh:** stručnější panel souhlasu se srozumitelným textem a podrobnostmi až po rozbalení. Sjednotit správu fokusu, pořadí panelů a návrat do stránky. Tipy ke čtečce nabízet kompaktně, aby uživatel nemusel zavírat několik překryvů před čtením. Jde o návrh ovládání, nikoli právní posouzení souhlasu.

Podklad: `apps/web/src/components/consent/CookieConsent.tsx`, `apps/web/src/components/reader/ReaderOnboarding.tsx`, vizuální kontrola intra.

## Další etapa: přehlednost a rychlost

### 6. Vyhledávání v knihovně a archivu

**Zjištění:** archiv má filtry, ale jeho hlavní seznam nemá textové hledání; knihovna pracuje s výběrem knihy a kapitol. Filtry knih v archivu jsou pevně vyjmenované v komponentě.

**Návrh:** hledání podle názvu/postavy/tématu, filtry „Rozečtené“, „Dostupné“, „Dočtené“ a odvození knih z katalogu. Zvolený filtr a otevřený záznam zapisovat do URL, aby šly sdílet. Doplňkově nabídnout režim bez spoilerů navázaný na čtenářský postup.

Podklad: `apps/web/src/components/archive/SynthomaArchive.tsx`, `apps/web/src/components/library/SynthomaLibrary.tsx`.

### 7. Zrychlit první načtení a zjednodušit styly

**Zjištění:** kořenový layout importuje styly čtečky, profilu, přihlašování, Cyklu i efekty jednotlivých knih. Pozdější sjednocovací styly dále upravují stejné oblasti. Sociální obrázek `og-synthoma.png` má 8 759 212 bajtů.

**Návrh:** přesunout styly do příslušných částí webu, konsolidovat opakovaná pravidla a změřit mobilní načítání před/po změně. Zmenšit sociální náhled, doplnit vhodné statické náhledy videí a případně menší mobilní varianty. Fonty zachovat. Samotnou velikost obrázku nezaměňovat za naměřené zpomalení každé návštěvy.

Podklad: `apps/web/app/layout.tsx`, `apps/web/src/styles/synthoma-art-direction.css`, `apps/web/src/components/synthoma-os/SynthomaMediaLayer.tsx`, velikosti souborů v `public`.

### 8. Sjednotit názvy a vstupy do her

**Zjištění:** metadata `/game` říkají „Prázdnota na tahu“, titul hlavní obrazovky „SYNTHOMA: CYKLUS“ a party část „Nezlob Prázdnotu“. Dokumentace rozlišuje samostatnou party hru a sólový Cyklus.

**Návrh:** dvě jasné nabídky: „Cyklus — pro jednoho“ a „Nezlob Prázdnotu — pro 2–6 hráčů“. U každé jednotný název, krátký cíl a vlastní spuštění. Pro Cyklus nabídnout krátký ukázkový tah vysvětlující rovnováhu čtyř hodnot.

Podklad: `apps/web/app/game/page.tsx`, `apps/web/app/game/GameClient.tsx`, `apps/web/src/game/README.md`, `apps/web/src/game/cyklus/README.md`.

### 9. Dokončit českou a anglickou verzi

**Zjištění:** archiv obsahuje natvrdo české načítání a tlačítko opakování; offline obrazovka je česká. Překlad archivu se načítá asynchronně bez zrušení zastaralého požadavku, takže rychlé přepnutí jazyka může znovu dosadit starou odpověď.

**Návrh:** jednotný slovník i pro chybové a prázdné stavy, rušení zastaralých požadavků a kontrola celých cest v obou jazycích. Stejnou pozornost dát dialogům a validačním chybám jako hlavním nadpisům.

Podklad: `apps/web/src/components/archive/SynthomaArchive.tsx`, `apps/web/app/offline/OfflineClient.tsx`, `apps/web/app/api/auth/register/route.ts`.

### 10. Bezpečnější práce autora v administraci

**Zjištění:** nové koncepty knih a kapitol začínají s `visibility: 'published'`. Editor má živý náhled a přepínání viditelnosti.

**Návrh:** nové položky vytvářet skryté, oddělit uložení rozepsaného obsahu od publikování a doplnit historii verzí s obnovením. Před publikací ukázat konkrétní výsledek, jazyk, cenu a přístupnost; varovat při neuložených změnách.

Podklad: `apps/web/app/components/admin/AdminContentTab.tsx`, modely ManagedBook/ManagedChapter v `apps/web/prisma/schema.prisma`.

## Navazující provozní práce

11. **Odolnost katalogu:** připravit poslední známý veřejný přehled knih pro výpadek databáze. Zachovat bezpečné rozhodování o přístupu ke kapitolám; záložní seznam nesmí obejít nově skrytý nebo placený obsah. Podklad: `apps/web/app/books/page.tsx`, `apps/web/src/server/content/managedContent.ts`.

12. **Přesně vymezit offline funkce:** čtení kapitol se záměrně necachuje podle oprav z 8. 9.; offline obrazovka stále hledá cachovanou kapitolu. Sladit texty a funkce s aktuálními pravidly. Případné stahování kapitol navrhnout jako samostatnou funkci s pravidly přístupu, nikoli návratem plošné cache. Podklad: `apps/web/app/offline/OfflineClient.tsx`, `docs/REPAIRS-2026-09-08.md`.

13. **Ověření e-mailu a dotažení ochrany skriptů:** registrace nyní nepotvrzuje vlastnictví e-mailu; produkční CSP stále připouští inline skripty. Navrhuji ověřovací odkazy a postupný přechod k nonce/hashům se zkouškami čtečky, plateb a vložených skriptů. Podklad: `apps/web/app/api/auth/register/route.ts`, `apps/web/prisma/schema.prisma`, `apps/web/next.config.ts`.

14. **Testovat celé cesty v prohlížeči:** CI už má jednotkové, databázové a publikační HTTP testy. Doplnit prohlížečové scénáře pro první návštěvu, pokračování po přihlášení, čtenářskou volbu, nákup v testovacím prostředí, klávesnici a úzký mobilní displej. Ty zachytí překryvy a vizuální regrese, které testy komponent nepokrývají. Podklad: `.github/workflows`, existující testy v `apps/web`.

15. **Uklidit pracovní prostor a dokumentaci:** oddělit Blender zdroje, náhledy, dočasné skripty a historické patche od aktivní aplikace; nic plošně nemazat. Zkrátit README na aktuální instalaci, konfiguraci a nasazení. Historické audity uchovat s datem, aby nebyly považované za aktuální výsledek bezpečnostní kontroly.

## Doporučené pořadí

1. Opravit synchronizaci a potvrzování ukládání; zpevnit herní tokeny a validace.
2. Zjednodušit domovskou stránku a panely, sjednotit názvy her.
3. Rozdělit styly, optimalizovat média, dokončit překlady.
4. Přidat hledání, revize obsahu, odolnější katalog a prohlížečové testy.

## Provedené ověření

- Typová kontrola prošla.
- Celá testovací sada: 137 sad prošlo, 2 sady / 22 testů přeskočeno. 881 testů prošlo a jeden starší test intra očekával odstraněné tlačítko Přeskočit.
- Tento zastaralý test byl upraven pro jednu okamžitou akci. Následný cílený běh obou souborů intra: 2 sady, všech 11 testů prošlo. Celá sada nebyla po této opravě spouštěna podruhé.
- Intro vizuálně ověřeno v místním prohlížeči: výrazné video, čitelnější motto, jedno tlačítko.
- Nebyl proveden živý nákup, odesílání e-mailu, produkční nasazení ani kompletní test mobilních zařízení.
