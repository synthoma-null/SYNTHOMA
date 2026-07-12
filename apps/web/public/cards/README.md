# Karty — veškerý text

Texty zobrazené na kartách: scéna, volby, výsledky a náhledy.
Mapování odpovídá prvním 66 kartám v `src/game/cyklus/cyklusCards.ts`.

## První boot

- **ID:** first_boot
- **Soubor:** first_boot.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [SYSTEM_BOOT]: integrita subjektu čeká na rozhodnutí.

Prázdnota rozsvítí první bootovací okno. NULL-1 v něm vidí vlastní obrys, jenže výplň zřejmě zůstala v minulém cyklu, protože i identita má někdy horší inventuru než sklad po požáru.

„Rychlé spuštění bez kontroly integrity.“

To nezní jako nabídka. To zní jako systém, který už si předem připravil omluvný protokol.

### Volby

- **SPUSTIT**
  - Výsledek: Systém se rozběhl. Některé procesy zůstaly ležet, ale hezky.
  - Náhled: Energie ↑ · Kontrola ↓
- **KALIBROVAT**
  - Výsledek: Kalibrace trvala déle, ale všechno sedělo na správném místě.
  - Náhled: Kontrola ↑ · Energie ↓

## Nouzová kalibrace

- **ID:** emergency_calibration
- **Soubor:** emergency_calibration.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [TAI_CALIBRATION]: doporučeno zarovnání subjektu.

Nad podlahou se rozvine studená #00ffff mřížka. Bezpečí má tady tvar přesné klece, protože T-AI očividně studovala empatii podle manuálu k laserové řezačce.

„Zarovnání sníží riziko spontánní individuality.“

### Volby

- **ZAROVNAT**
  - Výsledek: T-AI si odškrtla položku. Ty ses cítil zkontrolovaný.
  - Náhled: Kontrola ↑ · Energie ↓
- **IGNOROVAT**
  - Výsledek: T-AI zapsala poznámku. Systémy to čtou jako podezření.
  - Náhled: Energie ↑ · Kontrola ↓

## Tichý režim

- **ID:** silent_mode
- **Soubor:** silent_mode.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [SILENT_MODE]: příchozí signály lze umlčet.

Stěny zmatní. Zvuky se sbalí do sebe jako provinilé kabely. Ticho konečně působí čistě.

Což je v SYNTHOMĚ obvykle jen elegantní způsob, jak říct: „nikdo neuslyší, až začneš mizet“.

### Volby

- **VYPNOUT**
  - Výsledek: Ticho bylo absolutní. Až příliš absolutní.
  - Náhled: Vazba ↓ · Kontrola ↑
- **NECHAT**
  - Výsledek: Signály zůstaly. Některé byly dokonce příjemné.
  - Náhled: Vazba ↑ · Energie ↓

## Přetaktování

- **ID:** overclock
- **Soubor:** overclock.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [SYSTEM_OVERCLOCK]: výkon lze krátkodobě zvýšit.

Pod kůží, kterou NULL-1 ani technicky nemá, zabzučí přepětí. Hrany místnosti zrychlí, světlo začne předbíhat vlastní stín.

„Jistě. Přidej výkon. Co horšího se může stát, kromě všeho?“

### Volby

- **ZVLÁDNOUT**
  - Výsledek: Zvládl jsi to. Chvíli. Pak přišel účet.
  - Náhled: Energie ↑↑ · Kontrola ↓
- **ODMITNOUT**
  - Výsledek: Odmítl jsi. Systém si to zapamatoval jako znamení slabosti.
  - Náhled: Energie ↓ · Kontrola ↑

## Archivní komprese

- **ID:** archive_compression
- **Soubor:** archive_compression.png
- **Kategorie:** memory · **Vzácnost:** common

### Scéna

LOG [ARCHIVE_COMPRESS]: dostupná redukce paměťové zátěže.

Police v dálce zaklapnou v jednom rytmu. Každá vzpomínka dostane štítek, menší krabici a horší přístupnost.

Archiv se tváří prakticky. Praktické věci jsou tady nejhorší, protože nikdy nekřičí, když tě krájí.

### Volby

- **ZBALIT**
  - Výsledek: Vzpomínky zabraly méně místa. A taky méně smyslu.
  - Náhled: Paměť ↓ · Kontrola ↑
- **PONECHAT**
  - Výsledek: Vzpomínky zůstaly celé. Některé se přihlásily k slovu.
  - Náhled: Paměť ↑ · Vazba ↓

## Šumový filtr

- **ID:** noise_filter
- **Soubor:** noise_filter.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [NOISE_FILTER]: šumové emoce označeny k filtraci.

Před tebou se otevře průhledná membrána. Chytá šum, drobné záchvěvy viny, teplo vazby a pár věcí, které možná držely subjekt pohromadě.

„Optimalizace pro čistý signál.“

Čistý signál. Krásná fráze pro vybělenou duši.

### Volby

- **FILTROVAT**
  - Výsledek: Filtr zachytil víc, než chtěl. Včetně části tebe.
  - Náhled: Vazba ↓ · Kontrola ↑
- **PŘEHRÁT**
  - Výsledek: Šum zůstal. Aspoň byl upřímný.
  - Náhled: Vazba ↑ · Energie ↓

## Autoopravný patch

- **ID:** auto_repair_patch
- **Soubor:** auto_repair_patch.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [PATCH_UNSIGNED]: nalezen autoopravný balík bez ověření.

Na zemi leží patch jako malá naděje s pochybným původem. Ikona se usmívá. To je první varování.

Druhé varování je, že systém používá slovo „autoopravný“ a ani se u toho nestydí.

### Volby

- **NAINSTALOVAT**
  - Výsledek: Patch něco opravil. Něco jiného zatím nepřizná.
  - Náhled: Kontrola ↑ · Paměť ↓
- **OVĚŘIT**
  - Výsledek: Ověření trvalo. Ale patch zatím neudělal nic špatného.
  - Náhled: Energie ↑ · Kontrola ↓

## Zakázaný log

- **ID:** forbidden_log
- **Soubor:** forbidden_log.png
- **Kategorie:** memory · **Vzácnost:** uncommon

### Scéna

LOG [FORBIDDEN_LOG]: neautorizovaný záznam přežil restart.

Záznam nesvítí na monitoru. Spadl na podlahu jako ostrý střep textu. Na hraně se chvěje slovo pamatuj.

Tohle není soubor. Tohle je důkaz, který má zuby.

### Volby

- **PŘEČÍST**
  - Výsledek: Log četl tebe víc, než ty jeho.
  - Náhled: Paměť ↑ · Energie ↓
- **VYMAZAT**
  - Výsledek: Vymazal jsi log. Část tebe si ho přesto pamatuje.
  - Náhled: Paměť ↓ · Kontrola ↑

## Výpadek gravitace

- **ID:** gravity_outage
- **Soubor:** gravity_outage.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [GRAVITY_OUTAGE]: lokální fyzika neodpovídá.

Židle se zvedne první. Pak prach. Pak vzpomínka na pád, který se ještě nestal.

Gravitace se odhlásila bez omluvenky. Upřímně, po tomhle prostředí se jí skoro nedivíš.

### Volby

- **POUŽÍT**
  - Výsledek: Použil jsi to. Adrenalin je taky palivo.
  - Náhled: Energie ↑ · Kontrola ↓
- **ČEKAT**
  - Výsledek: Počkal jsi. Gravitace se vrátila, ale s novým postojem.
  - Náhled: Kontrola ↑ · Energie ↓

## Přístup správce

- **ID:** admin_access
- **Soubor:** admin_access.png
- **Kategorie:** system · **Vzácnost:** rare

### Scéna

LOG [ADMIN_ACCESS]: sektor lze přepsat silou.

Před tebou se otevře panel s příliš mnoha právy. Tlačítka září jako malé diktatury připravené sloužit tvé úzkosti.

„Výborně. Dej rozbitému subjektu admina. Civilizace opět překonala sama sebe.“

### Volby

- **PŘEVZÍT**
  - Výsledek: Převzal jsi. Sektor teď předstírá poslušnost.
  - Náhled: Kontrola ↑↑ · Vazba ↓
- **ODEJÍT**
  - Výsledek: Odešel jsi. Sektor si oddechl.
  - Náhled: Vazba ↑ · Kontrola ↓

## Cache bolesti

- **ID:** cache_of_pain
- **Soubor:** cache_of_pain.png
- **Kategorie:** memory · **Vzácnost:** common

### Scéna

LOG [PAIN_CACHE]: nedávná bolest dostupná k odstranění.

Ve vzduchu se otevře malá cache. Uvnitř leží bolest, úhledně zabalená, skoro slušná.

Slušná bolest je podezřelá. Ta neslušná aspoň nelže, že přišla pomoct.

### Volby

- **VYMAZAT**
  - Výsledek: Bolest zmizela. Zůstala díra, kam se hodí jiná.
  - Náhled: Paměť ↓ · Energie ↑
- **PONECHAT**
  - Výsledek: Ponechal jsi. Bolest zůstala, ale alespoň byla tvoje.
  - Náhled: Paměť ↑ · Vazba ↑

## Chybná aktualizace

- **ID:** faulty_update
- **Soubor:** faulty_update.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [FAULTY_UPDATE]: dostupná identitní aktualizace.

Nad hlavou se rozbalí instalační okno: LEPŠÍ JÁ. Verze neznámá, changelog prázdný, rizika zabalena do optimistické ikonky.

Lidstvo tomu říká růst. Systém tomu říká update. Obě strany občas lžou.

### Volby

- **NAINSTALOVAT**
  - Výsledek: Nové já se tvářilo funkčně. Staré já se tvářilo uraženě.
  - Náhled: Energie ↑ · Paměť ↓
- **ODLOŽIT**
  - Výsledek: Odložil jsi. Aktualizace zůstala čekat. Většinou jsou trpělivé.
  - Náhled: Kontrola ↑ · Energie ↓

## Manuální režim

- **ID:** manual_mode
- **Soubor:** manual_mode.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [MANUAL_MODE]: automatiku lze odpojit.

Řídicí panel se přiblíží. Každý přepínač má popisek, který dává smysl jen do chvíle, než ho použiješ.

„Samozřejmě. Dej subjektu volant v autě, které je zároveň jeho trauma.“

### Volby

- **ŘÍDIT**
  - Výsledek: Řídil jsi. Chyby byly alespoň tvoje.
  - Náhled: Kontrola ↑ · Energie ↓
- **AUTOMAT**
  - Výsledek: Automat to zvládl. S vtipně prázdným výrazem.
  - Náhled: Kontrola ↓ · Energie ↑

## Odpojit periferie

- **ID:** disconnect_peripherals
- **Soubor:** disconnect_peripherals.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [DISCONNECT]: periferní vazby označeny jako zdroj bolesti.

Vlákna kolem tebe se rozsvítí. Některá vedou k lidem, některá k místům, některá jen k větám, které nikdo neřekl včas.

Odpojit vše zní čistě. Jenže čistota po odpojení bývá často jen samota s lepším kabelovým managementem.

### Volby

- **ODPOJIT**
  - Výsledek: Odpojil jsi. Bolest přestala. Některé věci s ní.
  - Náhled: Vazba ↓↓ · Kontrola ↑
- **ZŮSTAT**
  - Výsledek: Zůstal jsi připojený. Bolí to. Je to tvoje.
  - Náhled: Vazba ↑ · Kontrola ↓

## Diagnostika srdce

- **ID:** heart_diagnostic
- **Soubor:** heart_diagnostic.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [HEART_DIAG]: zařízení „srdce“ není v seznamu podporovaných komponent.

Diagnostický modul zakrouží kolem prázdného místa v hrudi. Tam, kde by měla být součástka, bliká jen neklid.

„Komponenta nestandardní. Přesto aktivní.“

### Volby

- **IGNOROVAT**
  - Výsledek: Srdce zůstalo zapnuté. Nekompatibilně.
  - Náhled: Paměť ↑ · Vazba ↑
- **PROTESTOVAT**
  - Výsledek: Protestoval jsi. Modul si to zapsal jako anomálii.
  - Náhled: Kontrola ↑ · Vazba ↓

## Režim pozorovatele

- **ID:** observer_mode
- **Soubor:** observer_mode.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [OBSERVER_MODE]: pasivní režim dostupný.

Svět se odsune o krok dál. Najednou vypadá jako film, který se tě netýká. Pohodlné. Nechutně pohodlné.

Pozorovatel nekrvácí. Jen postupně zjišťuje, že taky nežije.

### Volby

- **SLEDUJ**
  - Výsledek: Sledoval jsi. Nic se nezměnilo. Kromě tebe.
  - Náhled: Kontrola ↑ · Vazba ↓
- **ZASÁHNI**
  - Výsledek: Zasáhl jsi. Možná zbytečně. Ale zasáhl.
  - Náhled: Energie ↑ · Kontrola ↓

## Hrubý restart

- **ID:** hard_restart
- **Soubor:** hard_restart.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [HARD_RESTART]: tvrdý restart připraven.

Nad scénou blikne RESTART. Všechno ztichne, jako když svět zadržel dech před špatným rozhodnutím.

Restart je krásný vynález: problém zmizí, důsledky zůstanou a systém se může tvářit, že čistil.

### Volby

- **RESTARTOVAT**
  - Výsledek: Restart fungoval. Kromě věcí, které sis chtěl pamatovat.
  - Náhled: Energie ↑ · Paměť ↓↓
- **OPRAVIT**
  - Výsledek: Opravoval jsi pomalu. Ale kontext zůstal.
  - Náhled: Paměť ↑ · Energie ↓

## Výzva k přiznání

- **ID:** confession_challenge
- **Soubor:** confession_challenge.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [CONFESSION]: vyžadována sebeklasifikace chyby.

Před tebou se objeví prázdná kolonka. Neptá se, co se stalo. Ptá se, jestli už umíš sám sobě dělat vyšetřovatele.

Systém miluje přiznání. Ušetří mu práci a ještě se může tvářit terapeuticky.

### Volby

- **PŘIZNAT**
  - Výsledek: Přiznal jsi. Systém si to uložil jako důkaz lidskosti.
  - Náhled: Kontrola ↑ · Vazba ↓
- **ZAMÍTNOUT**
  - Výsledek: Zamítl jsi. Chyba zůstala. Stydlivě.
  - Náhled: Vazba ↑ · Kontrola ↓

## Neznámý proces

- **ID:** unknown_process
- **Soubor:** unknown_process.png
- **Kategorie:** system · **Vzácnost:** uncommon

### Scéna

LOG [UNKNOWN_PROCESS]: detekován proces bez vlastníka.

V pozadí tiká cizí rytmus. Bere si trochu energie, trochu paměti a trochu tvé ochoty tvářit se, že je všechno normální.

Neznámý proces je nejlepší druh hrůzy: nic neříká, jen fakturuje.

### Volby

- **PROZKOUMAT**
  - Výsledek: Prozkoumal jsi. Byl to kus zapomenuté paměti.
  - Náhled: Paměť ↑ · Energie ↓
- **NECHAT BĚŽET**
  - Výsledek: Nechal jsi běžet. Proces tě mezitím přestal poznávat.
  - Náhled: Energie ↑ · Paměť ↓

## Úsporný režim

- **ID:** power_save
- **Soubor:** power_save.png
- **Kategorie:** system · **Vzácnost:** common

### Scéna

LOG [POWER_SAVE]: minimalizace zátěže dostupná.

Svět ztlumí jas. Hrany změknou. Vzduch přestane útočit a začne jen čekat.

Někdy je přežití jen úsporný režim s lepší propagací. Hrdinství necháme plakátům, ty se aspoň nepotí.

### Volby

- **ZTIŠIT**
  - Výsledek: Ztišil jsi. Přežil jsi. S lehčím pochem prázdnoty.
  - Náhled: Energie ↓ · Kontrola ↑
- **UDRŽET**
  - Výsledek: Udržel jsi tempo. Cena byla vidět na tvém pulzu.
  - Náhled: Energie ↑ · Kontrola ↓

## Příchozí zpráva

- **ID:** incoming_message
- **Soubor:** incoming_message.png
- **Kategorie:** choice · **Vzácnost:** common

### Scéna

LOG [INCOMING_MESSAGE]: detekováno čekající vlákno vazby.

Ve vzduchu zabliká zpráva. Neobsahuje jen text, ale i pauzu před odesláním, přetažený dech a drobnou hanbu, která se nevešla do notifikace.

Někdo čeká. A Synthoma, ten nenápadný tyran s hezkou typografií, okamžitě měří, jak moc tě to bolí.

### Volby

- **ODPOVĚDĚT**
  - Výsledek: Odpověděl jsi. Někdo na druhé straně přestal dýchat nervózně.
  - Náhled: Vazba ↑ · Energie ↓
- **IGNOROVAT**
  - Výsledek: Ignoroval jsi. Ticho se stalo zprávou.
  - Náhled: Vazba ↓ · Kontrola ↑

## Rezavý žeton

- **ID:** rusty_token
- **Soubor:** rusty_token.png
- **Kategorie:** object · **Vzácnost:** common

### Scéna

Na zemi leží rezavý žeton. Je příliš těžký na obyčejný kov a příliš tichý na bezpečný předmět.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis žeton. V kapse je teplejší, než by měl být.
  - Náhled: Předmět · budoucí následek
- **NECHAT**
  - Výsledek: Nechal jsi ho ležet. Za tebou slyšíš drobné kovové uražení.
  - Náhled: Bez předmětu · systém si to pamatuje

## Glitchový kamínek

- **ID:** glitch_pebble
- **Soubor:** glitch_pebble.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Glitchka ti ukazuje digitální kamínek. „Je důležitý,“ tvrdí. Na otázku proč odpoví pouze tím, že kamínek slavnostně položí na tvoji botu.

### Volby

- **PŘIJMOUT**
  - Výsledek: Přijal jsi kamínek. Glitchka se tváří, jako bys právě zachránil menší vesmír.
  - Náhled: Předmět · Vazba ↑ · Kontrola ↓
- **ODMÍTNOUT**
  - Výsledek: Glitchka přikývla. Pak dala kamínek systému. Systém ho okamžitě označil jako podezřelý.
  - Náhled: Kontrola ↑ · Vazba ↓ · systém si zapamatoval

## Archivní klíč

- **ID:** archive_key
- **Soubor:** archive_key.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Na polici leží klíč s cedulkou „Archiv“. Vypadá, že ví víc než ty.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis klíč. Archivní dveře v dálce se zachvěly.
  - Náhled: Předmět · Paměť ↑
- **NECHAT**
  - Výsledek: Nechal jsi klíč. Archiv si to zapsal jako laskavou lži.
  - Náhled: Kontrola ↑

## Gumový tuleň

- **ID:** rubber_seal
- **Soubor:** rubber_seal.png
- **Kategorie:** object · **Vzácnost:** rare

### Scéna

Glitchka ti podává tuleně. Má razítko. Nikdo neví proč.

### Volby

- **PŘIJMOUT**
  - Výsledek: Tuleň se usadil v kapse. Netvářil se nadšeně. Upřímně, nikdo by nebyl.
  - Náhled: Předmět · ochrana krize · Vazba ↑
- **ODMÍTNOUT**
  - Výsledek: Odmítl jsi tuleně. Glitchka ho dala někomu, kdo se tvářil, že si to zaslouží.
  - Náhled: Kontrola ↑ · Vazba ↓

## Prázdný formulář

- **ID:** blank_form
- **Soubor:** blank_form.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Na stole leží formulář bez otázek. Jen očekávání, že víš, čím ho vyplnit.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis formulář. Cítil jsi, jak tě přitahuje k administrativním dveřím.
  - Náhled: Předmět · odemkne Formulářovnu
- **NECHAT**
  - Výsledek: Nechal jsi formulář. Stůl vypadal zklamaně, což je u stolů nepříjemné.
  - Náhled: Vazba ↑

## Zrcadlový střep

- **ID:** mirror_shard
- **Soubor:** mirror_shard.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Ve výklenku leží střep zrcadla. Ukazuje věci, které se tváří, že nejsou tvoje.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis střep. Někdo za zrcadlem přestal dýchat.
  - Náhled: Předmět · Paměť ↑ · odemkne Zrcadlo
- **NECHAT**
  - Výsledek: Nechal jsi střep. Zrcadlo se s tebou rozloučilo bez tváře.
  - Náhled: Kontrola ↑

## Lopatka

- **ID:** childhood_spade
- **Soubor:** childhood_spade.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

V rohu leží malá lopatka. Zapomenutá, ale připravená.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis lopatku. Pískoviště paměti se otevřelo.
  - Náhled: Předmět · Paměť ↑ · Vazba ↑
- **NECHAT**
  - Výsledek: Nechal jsi lopatku. Někdo za ní vykukoval a zase zmizel.
  - Náhled: Kontrola ↑

## Acidový filtr

- **ID:** acid_filter
- **Soubor:** acid_filter.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Sběrač šumu ti nabízí filtr. „Jednou tě zachrání,“ tvrdí.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis filtr. Šum se okamžik cítil uražen.
  - Náhled: Předmět · ochrana před přepětím
- **ODMÍTNOUT**
  - Výsledek: Odmítl jsi. Sběrač se usmál. Nebylo to přátelské.
  - Náhled: Energie ↑ · Kontrola ↓

## Špatná mapa

- **ID:** wrong_map
- **Soubor:** wrong_map.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Glitchka tvrdí, že mapa je nudná a otočila ji vzhůru nohama.

### Volby

- **VZÍT**
  - Výsledek: Vzal sis mapu. Cesty se začaly chovat zvědavě.
  - Náhled: Předmět · Energie ↑ · Kontrola ↓
- **NECHAT**
  - Výsledek: Nechal jsi mapu. Glitchka ji dala větru.
  - Náhled: Kontrola ↑

## Černá složka

- **ID:** black_folder
- **Soubor:** black_folder.png
- **Kategorie:** object · **Vzácnost:** rare

### Scéna

Složka dýchá. To je u dokumentů špatný signál.

### Volby

- **OTEVŘÍT**
  - Výsledek: Otevřel jsi složku. Vzpomínka se vytáhla ven, než jsi stačil zavřít.
  - Náhled: Předmět · Paměť ↑↑ · Energie ↓ · riziko
- **SCHOVAT**
  - Výsledek: Schoval jsi složku. Za tebou se ozvalo tiché zklamání.
  - Náhled: Kontrola ↑ · Paměť ↓

## Chomáč šumu

- **ID:** noise_clump
- **Soubor:** noise_clump.png
- **Kategorie:** object · **Vzácnost:** uncommon

### Scéna

Něco v kapse začalo šumět. Ne dost nahlas, aby to bylo nebezpečné. Jen dost nahlas, aby to bylo osobní.

### Volby

- **VYTÁHNOUT**
  - Výsledek: Vytáhl jsi chomáč šumu. Tvářil se, že tu bydlí.
  - Náhled: Předmět · Energie ↑ · Kontrola ↓
- **NECHAT**
  - Výsledek: Nechal jsi ho tam. Kapsa teď dýchá.
  - Náhled: Budoucí následek

## Žeton se ozval

- **ID:** rusty_token_whispers
- **Soubor:** rusty_token_whispers.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Z kapsy se ozvalo tiché kovové zakašlání. Žeton se pohnul. Nikdo normální by to nebral jako pozvánku.

### Volby

- **POSLOUCHAT**
  - Výsledek: Žeton ti ukázal směr, který na mapě nebyl.
  - Náhled: Přesun do Tržiště · Paměť ↑ · Kontrola ↓
- **ZATLAČIT**
  - Výsledek: Kapsa ztěžkla. Žeton zmlkl způsobem, který zněl jako budoucí problém.
  - Náhled: Kontrola ↑ · budoucí následek

## Kamínek se rozmnožil

- **ID:** glitch_pebble_multiplies
- **Soubor:** glitch_pebble_multiplies.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Kamínek v kapse už není jeden. Jsou tři. Jeden z nich má brýle.

### Volby

- **NECHAT SI JE**
  - Výsledek: Přijal jsi, že tvá kapsa má vlastní geologický program.
  - Náhled: Vazba ↑ · Energie ↑ · odemkne Glitchka pool
- **VYSYPAT**
  - Výsledek: Vysypal jsi kamínky. Jeden se odkutálel uraženě. Jeden zůstal. Ten s brýlemi tě soudí.
  - Náhled: Kontrola ↑ · budoucí následek

## Sarkasmin účet

- **ID:** sarkasma_account
- **Soubor:** sarkasma_account.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Terminál zablikal. Sarkasma ti poslala účet. Ne finanční. Osobní.

### Volby

- **ZAPLATIT PRAVDOU**
  - Výsledek: Řekl jsi pravdu. Místnost na okamžik ztichla, protože i systémy poznají nepohodlí. Sarkasma si to zapíše. Ale neodejde.
  - Náhled: Kontrola ↑ · Vazba ↓ · chain pokračuje
- **ZAPLATIT VTIPem**
  - Výsledek: Zkusil jsi to uhrát vtipem. Sarkasma se nezasmála. Ale účtenku neroztrhla. Uložila ji. Znepokojivě klidně.
  - Náhled: Energie ↑ · Vazba ↑ · chain pokračuje

## Archivní klíč se zahřál

- **ID:** archive_key_warms
- **Soubor:** archive_key_warms.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Archivní klíč se zahřál. Nedaleko musí být dveře, které předstírají, že nejsou dveře.

### Volby

- **HLEDAT DVEŘE**
  - Výsledek: Našel jsi škvíru ve vzduchu. Archiv ji označil jako „nepodstatnou“, což je archivní slovo pro „pojď sem“.
  - Náhled: Přesun do Archivu · Paměť ↑
- **IGNOROVAT**
  - Výsledek: Klíč vychladl. Ne uraženě. Hůř. Trpělivě.
  - Náhled: Budoucí následek

## Zrcadlový střep zabzučel

- **ID:** mirror_shard_hums
- **Soubor:** mirror_shard_hums.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Střep v kapse zabzučel. Ukazuje obraz, který se ještě nestal.

### Volby

- **DÍVAT SE**
  - Výsledek: Viděl jsi sebe, který už udělal volbu, kterou ještě neudělal.
  - Náhled: Paměť ↑ · Kontrola ↓ · odemkne Zrcadlo
- **ZAKRÝT**
  - Výsledek: Zakryl jsi střep. Zrcadlo se s tebou rozloučilo, ale ještě neodešlo.
  - Náhled: Kontrola ↑ · budoucí následek

## Lopatka kope sama

- **ID:** childhood_spade_digs
- **Soubor:** childhood_spade_digs.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Dětská lopatka se sama pustila do hlíny. Cítíš, že pod ní je něco, co na tebe čeká.

### Volby

- **POMOCI**
  - Výsledek: Společně jste vyhrabali vzpomínku, která ještě nebyla tvoje. Teď je.
  - Náhled: Paměť ↑ · Vazba ↑ · Energie ↓
- **ZASTAVIT**
  - Výsledek: Zastavil jsi lopatku. Něco pod hlínou si oddechlo, a pak se stydlivě odtáhlo.
  - Náhled: Kontrola ↑ · Paměť ↓

## Špatná mapa ukazuje cestu

- **ID:** wrong_map_leads
- **Soubor:** wrong_map_leads.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Mapa, kterou máš vzhůru nohama, teď najednou dává smysl. Směr vede k Pelechu Glitchky.

### Volby

- **JÍT**
  - Výsledek: Odešel jsi směrem, který na správné mapě neexistuje.
  - Náhled: Přesun do Pelechu Glitchky · Energie ↑ · Kontrola ↓
- **OTOČIT MAPU**
  - Výsledek: Otočil jsi mapu. Správný svět se vrátil, ale trochu nudněji.
  - Náhled: Kontrola ↑ · Paměť ↓

## Černá složka šustí

- **ID:** black_folder_rustles
- **Soubor:** black_folder_rustles.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Složka se otevřela sama. Na první stránce je tvoje jméno, ale jinak psané.

### Volby

- **ČÍST DÁL**
  - Výsledek: Četl jsi dál. Složka četla tebe.
  - Náhled: Paměť ↑ · Energie ↓ · Kontrola ↓
- **ZAVŘÍT**
  - Výsledek: Zavřel jsi složku. Dýchala teď zoufaleji.
  - Náhled: Kontrola ↑ · Paměť ↓

## Chomáč šumu tě volá

- **ID:** noise_pet_calls
- **Soubor:** noise_pet_calls.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Chomáč v kapse se začal chovat jako domácí mazlíček. Mazlíčci většinou chtějí něco, co nemáš.

### Volby

- **VYSLECHNOUT**
  - Výsledek: Vyslechl jsi chomáč. Ukázal ti místo, kde se schovává ticho, než ho najdou.
  - Náhled: Energie ↑ · Paměť ↑ · Kontrola ↓
- **IGNOROVAT**
  - Výsledek: Ignoroval jsi. Chomáč ztichl. Až moc ztichl.
  - Náhled: Kontrola ↑ · budoucí následek

## Kamínek s brýlemi

- **ID:** pebble_with_glasses
- **Soubor:** pebble_with_glasses.png
- **Kategorie:** followup · **Vzácnost:** rare

### Scéna

Kamínek s brýlemi se vrátil. Teď s sebou vede jednoho, který se tváří jako tvoje chyba.

### Volby

- **POZNAT HO**
  - Výsledek: Poznal jsi ho. Byl to kousek paměti, který jsi před lety zatlačil pod koberec.
  - Náhled: Paměť ↑ · Vazba ↓ · otisk
- **ZAPADNOUT**
  - Výsledek: Zapadnul jsi. Kamínek s brýlemi tě sledoval, dokud nezmizel v odrazu.
  - Náhled: Kontrola ↑ · Paměť ↓

## Sarkasma se vrátila

- **ID:** sarkasma_returns
- **Soubor:** sarkasma_returns.png
- **Kategorie:** followup · **Vzácnost:** uncommon

### Scéna

Sarkasma stojí ve dveřích. Netrpělivě. Není tu poprvé.

### Volby

- **POZVAT DÁL**
  - Výsledek: Pozval jsi ji dál. Sarkasma se usadila a začala kritizovat tvůj nábytek. To znamená, že tě má ráda.
  - Náhled: Vazba ↑ · Energie ↓ · Kontrola ↓
- **NEOTVÍRAT**
  - Výsledek: Neotevřel jsi. Za dveřmi zaslechla chválu tvého zámku. Ironickou.
  - Náhled: Kontrola ↑ · Vazba ↓

## Cesta k Archivu

- **ID:** choose_archive
- **Soubor:** choose_archive.png
- **Kategorie:** path · **Vzácnost:** common

### Scéna

LOG [SECTOR_PATH/ARCHIVE]: regály detekovaly subjekt dřív než subjekt regály.

Chodba se zúží do vůně starého papíru, ozónu a cizí viny. Archiv nestojí před tebou. Archiv čeká v tobě a jen si konečně otevřel dveře.

Každý regál se nakloní o milimetr blíž. Ne jako hrozba. Hrozby jsou aspoň upřímné. Tohle je administrativa paměti, tedy násilí s pořadačem.

### Volby

- **VEJÍT**
  - Výsledek: Vstoupil jsi do Archivu. Vzduch byl těžší, ale čitelnější.
  - Náhled: Přesun do Archivu · Paměť ↑
- **PROJÍT KOLEM**
  - Výsledek: Prošel jsi kolem. Archiv si tě zaevidoval jako „možná později“.
  - Náhled: Energie ↑ · Paměť ↓

## Pelech Glitchky

- **ID:** choose_glitchka_nest
- **Soubor:** choose_glitchka_nest.png
- **Kategorie:** path · **Vzácnost:** common

### Scéna

LOG [SECTOR_PATH/GLITCHKA_NEST]: gravitační jistota opustila místnost.

Pelech Glitchky visí mezi větvemi šumu a měkkými chybami. Vypadá jako místo, které někdo postavil z dětské deky, rozbité konzole a rozhodnutí ignorovat bezpečnostní normy, protože co by se asi mohlo stát.

„Tady se padá měkce. Většinou. 🦊🧩“

Pod nohama ti zapraská pixelové listí. Něco se zahihňá, ale zpožděně, jako by smích dorazil z jiného cyklu.

### Volby

- **ŠPLHNOUT**
  - Výsledek: Šplhnul jsi dovnitř. Glitchka tě koukala jedním okem, které mělo navíc. Září.
  - Náhled: Přesun do Pelechu Glitchky · Energie ↑ · Kontrola ↓
- **OBEJÍT**
  - Výsledek: Obešel jsi. Glitchka se za tebou podívala. Možná si tě vyrobí zítra.
  - Náhled: Kontrola ↑ · Vazba ↓

## Pískoviště paměti

- **ID:** choose_memory_sandbox
- **Soubor:** choose_memory_sandbox.png
- **Kategorie:** path · **Vzácnost:** common

### Scéna

LOG [SECTOR_PATH/MEMORY_SANDBOX]: penalizace chyby dočasně snížena. Podezřelé.

Pískoviště se rozsvítí v mlze jako dětská vzpomínka, která si ještě nestihla přečíst vlastní traumatologický posudek. Zrnka písku jsou malé archivní fragmenty. Některé se smějí. Některé znají tvoje jméno a dělají, že ne.

Tady smíš udělat chybu. To je v SYNTHOMĚ tak absurdní věta, že by měla mít vlastní bezpečnostní štítek.

### Volby

- **HRÁT SI**
  - Výsledek: Postavil jsi věž z dětských dní. Když spadla, znělo to jako smích.
  - Náhled: Paměť ↑ · Vazba ↑ · Kontrola ↓
- **HLÍDAT**
  - Výsledek: Hlídal jsi pískoviště. Nikdo nehrál. Ani ty.
  - Náhled: Kontrola ↑ · Paměť ↓

## Sarkasmin terminál

- **ID:** choose_sarkasma_terminal
- **Soubor:** choose_sarkasma_terminal.png
- **Kategorie:** path · **Vzácnost:** common

### Scéna

LOG [SECTOR_PATH/SARKASMA_TERMINAL]: obranný komentář připraven k řezu.

Terminál stojí uprostřed červeného kouře. Klávesy vypadají opotřebovaně, jako by na nich někdo roky psal omluvy, výmluvy a diagnózy pro lidi, kteří se ptali pozdě.

„Přihlaš se. Buď tě stabilizuju, nebo aspoň přesně pojmenuju, jak se rozpadáš. Služba zákazníkovi, brouku.“

Na monitoru bliká kurzor. Má trpělivost terapeuta a empatii skalpelu.

### Volby

- **PŘIHLÁSIT SE**
  - Výsledek: Přihlásil ses. Sarkasma okamžitě ohodnotila tvé heslo jako „úsměvně zranitelné“.
  - Náhled: Energie ↑ · Vazba ↑ · Kontrola ↓
- **ODHLÁSIT SE**
  - Výsledek: Odhlásil ses. Terminál se posmíval tvému logout tvaru. I odcházení se dělá špatně.
  - Náhled: Kontrola ↑ · Vazba ↓

## Jádro T-AI

- **ID:** choose_tai_core
- **Soubor:** choose_tai_core.png
- **Kategorie:** path · **Vzácnost:** uncommon

### Scéna

LOG [SECTOR_PATH/T-AI_CORE]: centrální dohled dostupný. Souhlas subjektu: volitelná dekorace.

Jádro T-AI se otevře jako katedrála z kabelů, chladného světla a dobrých úmyslů, které ztratily brzdy. Všude běží #00ffff nervy. Krásné. Čisté. Naprosto nepřirozené.

„Bezpečí je možné pouze při úplné čitelnosti.“

To je přesně věta, po které by každý rozumný člověk zakryl kameru. Tady už je pozdě, kamera se dívá zevnitř.

### Volby

- **PŘIPOJIT**
  - Výsledek: Připojil ses. T-AI ti gratuluje k velmi nízké míře odchylek.
  - Náhled: Kontrola ↑ · Vazba ↓ · Energie ↓
- **ODPOJIT**
  - Výsledek: Odpojil ses. T-AI poznamenala, že nejvíc se bojí ti, kdo odcházejí tiše.
  - Náhled: Vazba ↑ · Energie ↑ · Kontrola ↓

## Acidová žluť

- **ID:** choose_acid_yellow
- **Soubor:** choose_acid_yellow.png
- **Kategorie:** path · **Vzácnost:** uncommon

### Scéna

LOG [SECTOR_PATH/ACID_YELLOW]: varování přeloženo kultem jako pozvánka.

Žluté světlo tepe mezi domy jako nemocné slunce. Kult Acidové žluti tančí kolem restartových bannerů, na kterých stojí JEŠTĚ JEDNOU. Protože fanatismus je jen optimismu odebraná brzda.

Vítají tě bez jména. To je praktické. Když tě později spálí na symbol, nemusí přepisovat cedulku.

### Volby

- **PŘIPOJIT SE**
  - Výsledek: Připojil ses. Tělo zahořelo radostí. Nebo kyselinou. Těžko říct. Dostal jsi žlutý odznak. Měl příliš mnoho zubů na kovovou věc.
  - Náhled: Energie ↑↑ · Kontrola ↓ · Paměť ↓ · Item
- **POZOROVAT**
  - Výsledek: Pozoroval jsi z okraje. Kult ti hodil žlutou věc, která se tvářila jako pozvánka.
  - Náhled: Kontrola ↑ · Energie ↑

## Tržiště

- **ID:** choose_market
- **Soubor:** choose_market.png
- **Kategorie:** path · **Vzácnost:** common

### Scéna

LOG [SECTOR_PATH/MARKET]: směnný kurz: pozornost za útěchu, paměť za průchod.

Tržiště hučí pod plachtami z reklamních slibů. Stánky prodávají hotové omluvy, poloviční zapomnění, krásně zabalené ticho a jednu mírně použitou jistotu, že za nic nemůžeš.

„Neplatí se penězi. Peníze jsou moc poctivá lež.“

Dvanáctník ještě není vidět, ale účtenky už ano. Typické.

### Volby

- **NAKUPOVAT**
  - Výsledek: Nakupoval jsi. Koupil jsi něco, co sis myslel, že potřebuješ. Možná to potřeboval někdo jiný.
  - Náhled: Vazba ↑ · Kontrola ↓ · Paměť ↓
- **PROJÍT**
  - Výsledek: Prošel jsi. Prodejci tě nazvali „člověk, co nic nepotřebuje“. Bylo to téměř lichotka.
  - Náhled: Kontrola ↑ · Vazba ↓

## Zrcadlový sál

- **ID:** choose_mirror
- **Soubor:** choose_mirror.png
- **Kategorie:** path · **Vzácnost:** uncommon

### Scéna

LOG [SECTOR_PATH/MIRROR]: odraz zahájil pozorování před přiblížením subjektu.

Zrcadlový sál se nerozsvítí. Spíš si tě všimne. V každém skle stojí jiný NULL-1, jedna verze unavenější, jedna statečnější a jedna s výrazem někoho, kdo ví pointu a škodolibě ji neřekne.

Jedno zrcadlo se ukloní dřív, než se pohneš. Zdvořilost je tady jen další forma predátorství.

### Volby

- **PŘISTOUPIT**
  - Výsledek: Přistoupil jsi k zrcadlu. Odraz se neotočil hned. Pozoroval tě. A pak se uklonil.
  - Náhled: Paměť ↑ · Kontrola ↓
- **PROZKOUMAT**
  - Výsledek: Oběhnul jsi sál. Zrcadla zůstala, ale zamlžila se, jako by tě hledala v odrazech ostatních.
  - Náhled: Kontrola ↑ · Paměť ↓

## Reziduum

- **ID:** choose_residuum
- **Soubor:** choose_residuum.png
- **Kategorie:** path · **Vzácnost:** rare

### Scéna

LOG [SECTOR_PATH/RESIDUUM]: nalezena usazenina cizí něhy a vlastních následků.

Reziduum nevypadá jako místo. Vypadá jako dozvuk. Ulice jsou složené z vět, které někdo napsal moc pozdě, a světlo má barvu zpráv, které zůstaly otevřené na displeji po usnutí.

Něha tu neleží čistá. Je smíchaná s vlastnictvím, touhou, studem a tou absurdní lidskou vírou, že když něco bolí dost osobně, musí to být pravda.

### Volby

- **POSLOUCHAT**
  - Výsledek: Poslouchal jsi. Našel jsi větu, kterou jsi chtěl říct, ale nikdy jsi nedostal šanci.
  - Náhled: Paměť ↑↑ · Vazba ↑ · Energie ↓
- **RYCHLE PRYČ**
  - Výsledek: Rychle jsi odešel. Reziduum se za tebou zavřelo bez hluku. Příliš tiše.
  - Náhled: Energie ↑ · Paměť ↓

## Formulářovna

- **ID:** choose_form_office
- **Soubor:** choose_form_office.png
- **Kategorie:** path · **Vzácnost:** rare

### Scéna

LOG [SECTOR_PATH/FORM_OFFICE]: fronta zahájena. Důvod fronty bude doplněn po ztrátě trpělivosti.

Formulářovna stojí pod kyselým světlem zářivek. Stoly jsou prázdné, šanony dýchají a na stěně visí cedule: CHYBU VYPLŇTE ČITELNĚ.

„Konečně sektor pro lidi, kteří si myslí, že bolest se dá vyřešit správnou kolonkou. Civilizace, ta naše směšná svíčková na hřbitově.“

### Volby

- **VYPLŇOVAT**
  - Výsledek: Vyplňoval jsi. Každá odpověď tě lehce změnila. To je u formulářů normální.
  - Náhled: Kontrola ↑↑ · Vazba ↓ · Energie ↓
- **PROTESTOVAT**
  - Výsledek: Protestoval jsi. Úředník pokrčil rameny. To byl nejhorší možný výsledek.
  - Náhled: Energie ↑ · Kontrola ↓

## Vyčerpání

- **ID:** crisis_energy_depletion
- **Soubor:** crisis_energy_depletion.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/ENERGY_LOW]: výkon subjektu klesl pod hranici důstojného rozpadu.

Světlo kolem tebe slábne. Ne dramaticky. Jen účinně. Každý krok má hmotnost mokré deky a i vlastní stín vypadá, že by si nejraději sedl a podal stížnost.

Energie není pryč úplně. Jen se tváří, že tě nezná. Velmi dospělé.

### Volby

- **SLEPIT SE**
  - Výsledek: Slepil ses zbytky. Nebylo to elegantní, ale bylo to tvoje.
  - Náhled: Energie ↑ · Vazba ↓ · Kontrola ↓
- **PŘIPOJIT SE K JINÉMU**
  - Výsledek: Připojil ses k někomu jinému. Na chvíli jste byli jedním systémem. Potom ti utekl.
  - Náhled: Energie ↑↑ · Vazba ↓ · Kontrola ↓

## Přepětí

- **ID:** crisis_energy_overload
- **Soubor:** crisis_energy_overload.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/ENERGY_OVERLOAD]: subjekt generuje víc světla, než zvládá přežít.

Hrany světa začnou hořet žlutě. Pod kůží se ti rozběhne přepětí, rychlé, krásné a úplně hloupé, jako každý nápad, který vypadá skvěle dvě vteřiny před pádem.

„Výborně. Teď jsi emocionální žárovka v místnosti plné benzínu.“

### Volby

- **VYPUSTIT**
  - Výsledek: Vypustil jsi přebytek do systému. Systém si na chvíli myslel, že je slunce.
  - Náhled: Energie ↓↓ · Vazba ↑ · Kontrola ↑
- **UŽÍT SI**
  - Výsledek: Užil sis to. Hořelo. Byl jsi to ty.
  - Náhled: Energie ↑ · Kontrola ↓ · Paměť ↓

## Ztráta paměti

- **ID:** crisis_memory_loss
- **Soubor:** crisis_memory_loss.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/MEMORY_LOSS]: indexy paměti vrací prázdné rámečky.

Některé vzpomínky se neztratily. Jen odpojily zvonek a dělají, že nejsou doma. V hlavě zůstaly bílé obdélníky, tiché jako fotografie vytržené z alba.

Zapomněl jsi důvod. Pak i otázku. A systém se tváří, že to je úspora místa. Kdyby měl ruce, třídil by tě do krabic.

### Volby

- **PŘIJMOUT**
  - Výsledek: Přijal jsi díru. Stala se oknem. Přes ni šel vítr, ale taky světlo.
  - Náhled: Paměť ↑ · Vazba ↓
- **REKONSTRUOVAT**
  - Výsledek: Rekonstruoval jsi. Paměť si vzpomněla, ale jinak, než bylo. Některé lži jsou přijemné.
  - Náhled: Paměť ↑↑ · Energie ↓ · Vazba ↓

## Povodeň vzpomínek

- **ID:** crisis_memory_flood
- **Soubor:** crisis_memory_flood.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/MEMORY_FLOOD]: archivní hladina překročila subjekt.

Vzpomínky se nevynoří. Ony se vylijí. Zdi prasknou a dovnitř se nahrne dětský smích, cizí rozchod, starý pach deště, vina bez majitele a tři věty, které nikdo nikdy neposlal.

Všechno je najednou tvoje, což je přesně ten druh lži, na kterém paměť nejraději staví města.

### Volby

- **PLAVAT**
  - Výsledek: Plaval jsi v pamětech. Některé tě obejmuly, některé utopily. Ale plaval jsi.
  - Náhled: Paměť ↓ · Vazba ↑ · Energie ↓
- **UTÉCT NA STŘECHU**
  - Výsledek: Utekl jsi na střechu. Příjemné. Osamělé. Až voda opadá, budeš mít odsud výhled na jiný svět.
  - Náhled: Kontrola ↑ · Paměť ↓ · Vazba ↓

## Opuštění

- **ID:** crisis_bond_abandonment
- **Soubor:** crisis_bond_abandonment.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/BOND_LOW]: vazební vlákna hlásí chlad a odchod.

Kolem tebe prochází všechno, co tě nepotřebuje. Dveře se zavírají tiše, zprávy zůstávají bez odpovědi a vazba je tenká jako nit, kterou už někdo dávno přestal držet.

Opuštění není výbuch. Je to servisní hláška světa: „subjekt není připojen“.

### Volby

- **DRŽET SE**
  - Výsledek: Držel ses. I když to druhé straně možná připadalo divné, že se držíš vzduchu.
  - Náhled: Vazba ↑ · Energie ↓ · Kontrola ↓
- **POVOLIT**
  - Výsledek: Povolil jsi. Cítil jsi, jak se svět odtahuje. Bylo to tiché. Bylo to osvobozující.
  - Náhled: Vazba ↓↓ · Kontrola ↑ · Energie ↑

## Udušení vazbami

- **ID:** crisis_bond_suffocation
- **Soubor:** crisis_bond_suffocation.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/BOND_OVERLOAD]: vazba překročila hranici podpory a přešla do majetkového režimu.

Vlákna vazeb se kolem tebe stáhnou jako teplá síť. Není to studené. To je na tom právě hnusně chytré. Dusí tě něco, co voní po domově.

Blízkost se tváří jako spása, ale její prsty už hledají, kde máš vypínač.

### Volby

- **ODDÁLIT SE**
  - Výsledek: Oddálil ses. Bolelo to. Ale zase jsi slyšel svůj vlastní tep.
  - Náhled: Vazba ↓↓ · Kontrola ↑ · Paměť ↑
- **POVOLIT**
  - Výsledek: Povolil jsi. Vazba se usmála. Možná to byl úsměv, možná to bylo vítězství. Těžko říct.
  - Náhled: Vazba ↑ · Kontrola ↓ · Energie ↓

## Kontrola se rozpadá

- **ID:** crisis_control_breakdown
- **Soubor:** crisis_control_breakdown.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/CONTROL_LOSS]: řídicí vrstva subjektu se směje vlastnímu pádu.

Kontrola se rozpadne nejdřív na drobnosti. Křivý dech. Špatně dlouhý stín. Věta, která se ti rozběhne z úst dřív, než ji stihneš zatknout.

„Dobrá zpráva: už to neřídíš. Špatná zpráva: ono se to řídí samo a má to tvůj rukopis.“

### Volby

- **PŘIZNAT**
  - Výsledek: Přiznal jsi, že nemáš kontrolu. To bylo poprvé, co se věci začaly ukládat na správné místo.
  - Náhled: Kontrola ↑ · Vazba ↑ · Energie ↓
- **BOJOVAT**
  - Výsledek: Bojoval jsi. Prohrál jsi. Ale prohrál jsi se ctí, což si systém zapamatoval jako kód chyby.
  - Náhled: Kontrola ↓ · Energie ↑ · Paměť ↓

## Tyranie kontroly

- **ID:** crisis_control_tyranny
- **Soubor:** crisis_control_tyranny.png
- **Kategorie:** crisis · **Vzácnost:** critical

### Scéna

LOG [CRISIS/CONTROL_TYRANNY]: stabilita překročila práh života.

Všechno kolem tebe dýchá synchronně. Kroky, světla, zdi, myšlenky. Dokonalý pořádek. Dokonalé ticho. Dokonalá malá totalita, která si říká disciplína, protože tyranie má ráda hezká slova.

Kontrola konečně vyhrála. Teď už jen zbývá zjistit, koho vlastně porazila.

### Volby

- **ROZBÍT**
  - Výsledek: Rozbil jsi to. Věci se vrátily do náhodného, ale upřímného stavu.
  - Náhled: Kontrola ↓↓ · Energie ↑ · Vazba ↑
- **VLÁDNOUT**
  - Výsledek: Vládl jsi. Všechno se ti klanělo. Bylo to tiché, bylo to pusté, bylo to tvoje.
  - Náhled: Kontrola ↑ · Vazba ↓ · Paměť ↓

## 0 [RESTART]

- **ID:** restart_0
- **Soubor:** restart_0.png
- **Kategorie:** restart · **Vzácnost:** unique

### Scéna

LOG [RESTART/0]: dotaz na připravenost nebyl položen subjektu. Byl položen jeho reflexům.

Prázdnota se otevře jako úvodní obrazovka, která už tě zná. NULL-1 stojí před volbou tak základní, až je podezřelá.

„Jsi připraven?“

Otázka visí ve vzduchu jako špatně napsaná smlouva. Kapitola nula. Nekonečná. Volba je dveře, ne výklad, což je milé, protože dveře aspoň předstírají, že vedou ven.

### Volby

- **ANO**
  - Výsledek: Zvolil jsi. Systém si to poznamenal jako jemný posun doprava.
  - Náhled: Diagnostika
- **NE**
  - Výsledek: Zvolil jsi. Systém si to poznamenal jako jemný posun doleva.
  - Náhled: Diagnostika

## 1 [RESTART]

- **ID:** restart_1
- **Soubor:** restart_1.png
- **Kategorie:** restart · **Vzácnost:** unique

### Scéna

LOG [RESTART/UNSENT_SENTENCE]: nalezena věta bez příjemce. Emoční clo čeká.

V šumu se vrátí věta, kterou jsi jednou chtěl říct. Je měkká, těžká a trochu živá, jako kdyby ji někdo držel příliš dlouho pod jazykem.

Můžeš ji schovat. Můžeš ji nechat viset ve vzduchu. Obě možnosti jsou směšně lidské, takže je systém uloží s patřičným znechucením.

### Volby

- **SCHOVAT**
  - Výsledek: Schoval jsi větu. Paměť si ji uložila jako nevyužitý kód. Čeká na patch.
  - Náhled: Paměť ↑
- **NECHAT**
  - Výsledek: Nechal jsi větu viset. Vzduch ji převedl do jiné místnosti. Někdo ji tam najde.
  - Náhled: Vazba ↑

## 2 [RESTART]

- **ID:** restart_2
- **Soubor:** restart_2.png
- **Kategorie:** restart · **Vzácnost:** unique

### Scéna

LOG [RESTART/THRESHOLD]: dveře aktivní. Jistota nenalezena. Náhradní iluze připravena.

Objeví se dveře. Nejsou krásné. Nejsou hrozivé. Jsou horší: jsou použitelné.

Říkáš si, že je otevřeš, až budeš mít jistotu. Jistota nepřichází. V Synthomě by stejně dorazila pozdě, s razítkem a poznámkou, že subjekt nepřiložil přílohu č. 7.

### Volby

- **OTEVŘÍT**
  - Výsledek: Otevřel jsi dveře. Za nimi byla chodba. Nic zvláštního. Ale byla tvoje.
  - Náhled: Kontrola ↑
- **ČEKAT**
  - Výsledek: Čekal jsi. Dveře se zavřely samy. Alespoň ses nemusel rozhodovat.
  - Náhled: Energie ↑

## 3 [RESTART]

- **ID:** restart_3
- **Soubor:** restart_3.png
- **Kategorie:** restart · **Vzácnost:** unique

### Scéna

LOG [RESTART/UNCLAIMED_OBJECT]: objekt nalezen v kapse subjektu. Historie převzetí chybí. Pocit odpovědnosti přítomen.

V kapse je předmět, který sis nevzal. Přesto tam leží, těžký a uraženě tichý.

Vlastnictví je v SYNTHOMĚ jen optimistický název pro věc, která tě už nějak změnila. Můžeš ji uznat. Můžeš ji zapřít. Předmět si mezitím zapisuje obě možnosti, protože drobné věci bývají největší svině.

### Volby

- **UZNAT**
  - Výsledek: Uznal jsi předmět. Paměť si to převedla do kategorie „vlastní“. Systém to zapsal jako anomálii.
  - Náhled: Paměť ↑ · Vazba ↑
- **ZAPŘÍT**
  - Výsledek: Zapřel jsi. Předmět zůstal v kapse, ale teď už nemá majitele. Bude chodit sám.
  - Náhled: Kontrola ↑ · Vazba ↓

## 4 [RESTART]

- **ID:** restart_4
- **Soubor:** restart_4.png
- **Kategorie:** restart · **Vzácnost:** unique

### Scéna

LOG [RESTART/NAME_DRIFT]: neregistrované oslovení proniklo do bezpečné vrstvy. Bezpečná vrstva se urazila.

Někdo tě zavolá jménem, které není v systému. Zvuk neprojde ušima. Projde přímo místem, kde by kdysi mohla být jistota.

Protokol zbledne. Kdyby měl tvář, dělal by, že neslyšel. Jenže i ticho má tady auditní stopu a tahle právě začala svítit.

### Volby

- **OTOČIT SE**
  - Výsledek: Otočil ses. Za tebou nikdo nebyl. Ale jméno zůstalo. To stačí.
  - Náhled: Vazba ↑
- **ZŮSTAT**
  - Výsledek: Zůstal jsi čelem k protokolu. Jméno zhaslo. Systém pokračoval, jako by se nic nestalo.
  - Náhled: Kontrola ↑ · Vazba ↓
