﻿Teď bych to celé posunul ještě o úroveň výš. Aktuálně už máš podle výpisu hotový solo roguelite základ: RunHUD, EnemyCard, ActionBar, RunMapView, EncounterPanel, RunEndReport, solo route, localStorage run loop a CSS vrstvu, navíc TypeScript kompiluje bez chyb. To je dobré. Ale dobré technicky neznamená dobré herně, protože software má ten odporný zvyk fungovat a přesto nebavit.

Teď je potřeba udělat z toho zážitek.

Nová hlavní vize

Ne:

„Mám mapu, encounter, akce, konec.“

Ale:

„Vstoupím do Prázdnoty. Každý sektor je scéna. Každá akce má textovou odezvu. Každý nepřítel má záměr. Každé rozhodnutí mění můj build, můj profil a mou osobní Prázdnotu.“

Tohle musí být základ.

Hra nemá stát na grafice.
Hra musí stát na:

1. silném UI,
2. dobrých textech,
3. krátkých dramatických scénách,
4. pocitu rizika,
5. odměnách,
6. buildování balíčku,
7. osobní Prázdnotě,
8. znovuhratelnosti.
UI: hlavní problém

Teď bych úplně přestal přemýšlet stylem:

mapa + panel + tlačítka

A začal bych přemýšlet stylem:

Hráč sedí v rozbitém terminálu Prázdnoty

UI není normální menu.
UI je diegetické. Tedy tváří se, že je součást světa.

Žádné „Attack button“.
Ale:

[ÚTOK // hrubý zásah]
[DASH // posun mimo realitu]
[HACK // přepsat problém]
[OBRANA // stabilizovat rámec]
[SARKASMUS // riskovat důstojnost]

Žádné „Enemy HP“.
Ale:

ŠUMOVÝ BĚŽEC
Stabilita entity: 9 / 14
Záměr: nárazový útok + infekce Šumem
Chování: agresivní, přímé, trapně sebejisté

Žádné „You won“.
Ale:

LOG [SECTOR_STABILIZED]:
Sektor ztichl.
Ne proto, že by byl v pořádku.
Spíš proto, že se bojí, co uděláš dál.

Tohle je rozdíl mezi prototypem a SYNTHOMOU.

Základní rozložení obrazovky
Desktop

Hlavní obrazovka encounteru:

┌──────────────────────────────────────────────────────────────┐
│ RUN HUD                                                       │
│ HP 18/24 | Šum 4 | Smích 2 | Void 7/20 | Karty 12 | Relikvie 2 │
├───────────────────────────────┬──────────────────────────────┤
│ ENCOUNTER PANEL               │ ENEMY / THREAT PANEL          │
│                               │                              │
│ LOG [NOISE_RUNNER]            │ ŠUMOVÝ BĚŽEC                  │
│ Text scény                    │ Stabilita: 9 / 14             │
│                               │ Záměr: ÚTOK 5 + ŠUM           │
│ Poslední vyhodnocení          │ Statusy: Zmatený              │
│                               │                              │
├───────────────────────────────┴──────────────────────────────┤
│ ACTION LOG                                                    │
│ „Subjekt se rozmazal mimo zásah. Realita to vzala osobně.“    │
├──────────────────────────────────────────────────────────────┤
│ ACTION BAR                                                    │
│ [ÚTOK] [DASH] [HACK] [OBRANA] [SARKASMUS]                     │
├──────────────────────────────────────────────────────────────┤
│ HAND                                                          │
│ [Kompresní úder] [Gumový tuleň] [Přepsat chybu]               │
└──────────────────────────────────────────────────────────────┘

Mapa průchodu nemá být hlavní obrazovka pořád. Mapa je mezi scénami.

Encounter panel je hlavní hra.

Mobil

Mobil musí být kartový, ne zmenšený desktop. Protože zmenšený desktop je jen digitální forma pomsty.

┌──────────────────────┐
│ HP / Šum / Void      │
├──────────────────────┤
│ ENEMY CARD           │
├──────────────────────┤
│ LOG TEXT             │
├──────────────────────┤
│ ACTIONS              │
│ [ÚTOK] [DASH]        │
│ [HACK] [OBRANA]      │
│ [SARKASMUS]          │
├──────────────────────┤
│ HAND scroll          │
└──────────────────────┘

Na mobilu:

nepoužívat malé uzly,
nepoužívat moc side panelů,
karty horizontálně scrollovat,
event text max 80–120 slov,
akce velké minimálně 44 px,
mapa jako samostatný „výběr dalšího sektoru“, ne permanentní miniaturka.
Grafika bez grafiky

Jestli nejsou obrázky, musíš použít:

1. typografii,
2. barvy,
3. rámečky,
4. animované stavy,
5. SVG tvary,
6. textové logy,
7. ikonové symboly,
8. karty,
9. „fake terminal“ estetiku.
Nepřátelé jako karty

Nepřítel nemusí mít obrázek. Musí mít osobnost.

┌──────────────────────────────┐
│ ENTITY: ŠUMOVÝ BĚŽEC         │
│ Stabilita: ███████░░ 9/14    │
│ Záměr: ÚTOK 5 + ŠUM          │
│                              │
│ „Má příliš mnoho kloubů      │
│  a žádný důvod zpomalit.“    │
└──────────────────────────────┘

Typ nepřítele podle barvy:

Typ	Barva / styl
Šum	magenta + červený šum
Archiv	cyan + fialová mřížka
Acid	žlutá + černé warning pruhy
Formulář	bílá + červené validační chyby
Paměť	violet + rozmazané okraje
Zrcadlo	invert / RGB split
Run mapa

Mapa má být krásná, ale jednoduchá.

Ne obyčejný graf.
Spíš diagnostický strom průchodu.

        [ ? ]
       /     \
   [COMBAT] [EVENT]
      |       |
   [ELITE] [MARKET]
       \     /
       [BOSS]

Každý node:

má typ,
krátký název,
ikonu,
stav,
riziko,
odměnu.

Příklad:

[ŠUMOVÁ CHODBA]
Typ: Combat
Riziko: střední
Odměna: karta

Node tooltip nebo modal:

LOG [SECTOR_PREVIEW]:
Z chodby teče nízkofrekvenční šum.
Někdo tam nechal otevřenou ránu v systému.
A samozřejmě ji nikdo neoznačil páskou.
UI vrstvy

Navrhuju rozdělit hru na 5 jasných obrazovek:

1. /game

Rozcestník.

SYNTHOMA: Nezlob Prázdnotu

[PRŮCHOD PRÁZDNOTOU]
Solo roguelite run. Karty, encountery, relikvie, boss.

[PARTY: NEZLOB PRÁZDNOTU]
Online chaos. Kostka, pasti, svinění.

[MOJE PRÁZDNOTA]
Osobní sektor subjektu. Vylepšení, archiv, stabilizace.

[SPOLEČNÝ PRŮCHOD]
Koop roguelite. Připravuje se.
2. /game/solo

Výběr průchodu.

Tady hráč vybere typ runu:

[Krátký průchod]
12 sektorů, 1 boss, 10–15 minut

[Šumová čistka]
Více combat encounterů, lepší odměny

[Archivní výprava]
Více textových eventů a lore fragmentů

[Glitch režim]
Víc náhod, víc odměn, víc ostudy
3. /game/solo/run/[id]

Hlavní hra.

mapa mezi encountery,
encounter panel během scén,
výběr odměn,
boss,
výsledek.
4. /game/void

Osobní Prázdnota.

upgrade uzlů,
archiv,
stabilizátor,
glitche,
relikvie,
denní anomálie.
5. /game/room/[code]

Party mód.

Zůstane.

Herní mechanismus: hlavní loop
Solo run
1. Vybereš průchod.
2. Vygeneruje se mapa.
3. Vybereš další sektor.
4. Spustí se encounter.
5. Čteš scénu.
6. Rozhodneš akci.
7. Nepřítel / event reaguje.
8. Získáš odměnu.
9. Vylepšíš deck / získáš relikvii / snížíš Šum.
10. Jdeš dál.
11. Boss.
12. Výsledek.
13. Odměny do Moje Prázdnota.

Tohle je funkční.

Soubojový systém

Hlavní pravidlo:

Nepřítel vždy ukazuje záměr.

Hráč nesmí mít pocit, že jen kliká náhodně.

Nepřátelské záměry
type EnemyIntent =
  | 'attack'
  | 'attack_noise'
  | 'defend'
  | 'buff'
  | 'debuff'
  | 'summon'
  | 'lock_card'
  | 'audit'
  | 'charge';

Příklad:

Šumový běžec
Záměr: ÚTOK 5 + 1 Šum

Archivní chyba
Záměr: ZAMKNOUT 1 kartu

Acidová larva
Záměr: ŠUMOVÁ infekce 2 kola

Zrcadlový subjekt
Záměr: zkopíruje tvoji poslední akci

Hráč reaguje:

Akce	Kdy je dobrá
ÚTOK	když chceš rychle ukončit souboj
DASH	když přijde silný útok
HACK	když nepřítel chystá status/audit
OBRANA	když nevíš, co dál, protože mozek šel na pauzu
SARKASMUS	risk/reward, Smích nebo Šum
KARTA	speciální řešení
Akce musí mít upgrade varianty

Základní akce jsou pořád dostupné. Ale během runu můžeš získat jejich mutace.

ÚTOK mutace
Kompresní úder
Způsob 6 damage.

Přesný zásah
Způsob 4 damage. Pokud má nepřítel intent attack, +4 damage.

Hrubý patch
Způsob 8 damage. Získáš 1 Šum.
DASH mutace
Dash mimo protokol
Zruš příchozí attack intent.

Dvojitý úhyb
Získáš 3 block a lízneš kartu.

Zbabělost s licencí
Vyhneš se útoku, ale ztratíš 1 Smích.
HACK mutace
Přepsat chybu
Odstraň nepříteli status nebo zruš intent.

Vynutit restart
Nepřítel přeskočí příští akci. Získáš 1 Šum.

Neautorizovaný přístup
Způsob 3 damage a lízni kartu.

Tohle dává buildování.

Karty

Karty musí dělat tři věci:

1. měnit rozhodnutí,
2. přidávat kombo,
3. dávat textovou radost.

Každá karta má:

interface RunCard {
  id: string;
  type: 'attack' | 'defense' | 'hack' | 'support' | 'risk' | 'dialogue' | 'void';
  cost?: number;
  title: string;
  rulesText: string;
  flavorText: string;
  effects: RunEffect[];
  tags: string[];
}
Příklad
GUMOVÝ TULEŇ ZASAHUJE
Typ: defense/support

Efekt:
Zruš jeden negativní efekt.
Pokud šlo o Audit nebo Formulář, získáš 2 Smích.

Flavor:
Tuleň se objevil s razítkem.
Nikdo ho nezval.
To je u skutečné autority běžné.
Karta pro dialogy
NEPŘÍJEMNĚ PŘESNÁ OTÁZKA

Efekt:
V dialogue/event encounteru odemkne třetí volbu.

Flavor:
Otázka byla krátká, přesná a okamžitě zhoršila atmosféru.
Tedy kvalitní práce.

Tohle je důležité: karty nemají být jen combat.

Musí fungovat i v dialozích a eventech.

Relikvie

Relikvie jsou dlouhodobý build.

Každá relikvie musí změnit styl hry.

Dobré relikvie
Gumový tuleň

První smrt v runu tě nechá přežít s 1 HP.

Archivní klíč

V archive/dialogue encounteru vidíš jednu skrytou volbu.

Vadné razítko

Po každém Formulář/Audit encounteru získáš náhodnou kartu.

Acidový filtr

První Šum získaný v každém encounteru se ignoruje.

Kompas do špatného sektoru

Jednou za run můžeš přeskočit node. Přidá +2 Void pressure.

Sarkasmin podpis

Sarkasmus nikdy nemůže selhat kriticky.

Glitchová jehla

Když zahraješ hack kartu, způsobíš 1 damage všem nepřátelům.

Dětská lopatka z Pískoviště

Po rest node získáš 1 extra odměnu.

Tohle dává runům identitu.

Šum, Smích, HP, Void pressure

Tady bych to zpřesnil.

HP

Krátkodobé přežití.

Když HP padne na 0:

run nekončí hned,
hráč získá Fragmentaci.
Fragmentace 1: -max HP
Fragmentace 2: začínáš encounter s 1 Šumem
Fragmentace 3: run končí

To je lepší než okamžitá smrt.

Šum

Šum je mentální infekce / nestabilita.

Efekty podle hladiny:

Šum	Efekt
0–3	bezpečné
4–6	občas horší event volby
7–9	po každém encounteru riziko negativního logu
10+	spustí Šumový kolaps

Šum není jen číslo. Otevírá horší texty a horší možnosti.

Smích

Smích je ochranný absurdní zdroj.

Použití:

1 Smích: přehodit Sarkasmus
2 Smíchy: zrušit 1 Šum
3 Smíchy: uniknout negativnímu eventu

Smích má být cenný.

Void pressure

Globální časovač runu.

Roste:

+1 za kolo souboje,
+1 při některých volbách,
+2 při zkratkách,
+3 při chybě v boss fázi.

Efekty:

Void	Efekt
0–5	normál
6–10	nepřátelé mají silnější intenty
11–15	eventy mají horší varianty
16–19	každý encounter začíná s negativním statusem
20	kolaps / finální audit

Tohle dělá tlak.

Encountery

MVP potřebuje 12 encounterů, ale každý musí mít jasnou funkci.

Doporučený MVP seznam
Combat 1: Šumový běžec

Učí útok/dash.

Combat 2: Archivní chyba

Učí hack, zamykání karet.

Combat 3: Acidová larva

Učí Šum a statusy.

Combat 4: Zrcadlový subjekt

Kopíruje poslední akci hráče.

Elite 1: Paměťová šelma

Těžší fight, odměna relikvie.

Elite 2: Formulářový dozorce

Audit mechanika, zamyká možnosti.

Event 1: Špatně popsané dveře

Risk/reward volba.

Event 2: Místnost, která čekala na omluvu

Profilová volba.

Dialogue: Sarkasmin terminál

3 volby, jedna drsná, jedna laskavá, jedna riskantní.

Market: Tržiště vadných relikvií

Koupit kartu / odstranit Šum / relikvie s vadou.

Rest: Pískoviště paměti

Heal / snížit Šum / upgradovat kartu.

Boss: Nekonečný Formulář

3 fáze.

Tohle je dobrá první sada.

Boss: Nekonečný Formulář

Boss musí být highlight.

Fáze 1: Předběžná kontrola

Mechanika:

útoky slabší,
zamkne jednu kartu,
hráč musí pochopit audit.

Text:

Formulář se rozvinul přes celou místnost.
Měl sedm stran, žádný účel a tón člověka, který miluje kolonky.
Fáze 2: Chybějící příloha

Mechanika:

objevují se volby,
špatná volba přidá Šum,
dobrá volba oslabí bosse.

Volby:

[Přiložit vzpomínku]
[Přiložit výmluvu]
[Přiložit gumového tuleně]
Fáze 3: Elektronický podpis selhal

Mechanika:

silné útoky,
Void pressure roste rychleji,
Sarkasmus může přerušit audit,
Hack může zrušit validaci.

Konec:

Formulář se pokusil uložit sám sebe.
Systém odpověděl: „Chyba při ukládání chyby.“
To bylo poprvé, kdy se místnost usmála.
Textový systém

Tady bych přidal datovou vrstvu:

src/game/encounter/textPools.ts
src/game/encounter/logComposer.ts
Každá akce má texty podle výsledku
type ActionOutcome = 'success' | 'fail' | 'crit' | 'partial';

interface ActionTextPool {
  actionId: string;
  outcome: ActionOutcome;
  texts: string[];
}

Příklad:

{
  actionId: 'dash',
  outcome: 'success',
  texts: [
    'Subjekt se rozmazal mimo zásah. Nepřítel trefil jen ozvěnu a ještě se tvářil uraženě.',
    'Dash proběhl čistě. Systém to zapsal jako chybu měření, protože elegance se sem nehodí.'
  ]
}
Nepřátelé mají texty
text: {
  intro: string[];
  intent: string[];
  hit: string[];
  death: string[];
  special: string[];
}

Tím dostaneš variabilitu bez nové grafiky.

Dialogový systém

Dialogy by měly měnit profil.

Profilové osy:

Řád / Chaos
Empatie / Dominance
Tvorba / Destrukce
Odvaha / Opatrnost
Sarkasmus / Něha
Paměť / Zapomnění

Příklad:

Sarkasmin terminál:
„Vidím, že jsi poslední souboj přežil stylem, který by neobhájil ani tvůj advokát.“

[Byl to plán]
+ Dominance, + Sarkasmus

[Měl jsem štěstí]
+ Opatrnost, + Něha

[Zkusím to znovu, ale hůř]
+ Chaos, + Odvaha, získáš kartu Glitchová zkratka

Tím hra vytváří profil, ne dotazník.

Moje Prázdnota

Tohle bych začal připravovat už teď v UI, i kdyby nebyla hotová.

Po runu zobraz:

Získáno:
+ 6 Fragmentů paměti
+ 2 Smích
+ 1 Relikvie
+ Profil: Sarkasmus +3, Odvaha +2, Chaos +1

Odemčeno:
[Moje Prázdnota – připravuje se]

Ať hráč ví, že runy někam vedou.

Budoucí struktura
Jádro Prázdnoty
Archiv reziduí
Stabilizační věž
Glitch dílna
Tulenárium
Sarkasmin terminál

Každý upgrade:

odemkne kartu,
sníží startovní Šum,
přidá event,
dá relikvii,
změní intro texty.
Vizuální styl konkrétně
Pozadí
temný gradient,
pomalý šum,
scanlines,
slabý pulz podle Void pressure.

Při vysokém Void pressure:

víc červené,
glitch,
enemy card pulzuje,
logy mají chyby v textu.
Karty

Karty musí mít výraznou identitu.

Útok: červená / magenta
Obrana: cyan
Hack: zeleno-cyan
Sarkasmus: žlutá
Void: černá + červená
Relikvie: zlatá / acid
Dialog: fialová
Enemy card

Měla by být větší a dramatická.

HP bar,
intent badge,
status chips,
flavor text,
danger border podle záměru.
Action buttons

Ne obyčejná tlačítka.

Každé tlačítko:

ikona,
název,
stručný efekt,
hover text.

Příklad:

[DASH]
Vyhneš se útoku.
Silné proti: Attack intent.
Slabé proti: Audit, Debuff.
Animace

Opatrně. Ne diskotéka pro kyborgy s migrénou.

Použít:

shake enemy card při damage,
pulse intent badge,
type-in log text,
reward cards slide in,
map node reveal,
HP bar drain,
Void pressure glitch při růstu.

Nepoužít:

40 věcí najednou,
blikání přes celou obrazovku,
animaci každého písmena všude,
efekty, které zdržují tah.

A respektovat prefers-reduced-motion.

Kritická věc: rychlost tahu

Hráč musí být schopný zahrát kolo za 5–15 sekund.

Proto:

text krátký,
akce jasné,
tooltipy dostupné,
log volitelně rozbalitelný,
animace rychlé,
žádný dlouhý modal po každém kliknutí.

Dobrý rytmus:

Intro encounteru: 10–20 sekund čtení
Kolo souboje: 5–10 sekund rozhodnutí
Vyhodnocení: 3–5 sekund
Odměna: 5 sekund
Co bych teď konkrétně zadal jako další úpravy
1. EncounterPanel udělat hlavní obrazovku, RunMapView zobrazit jen mezi encountery.
2. Přidat RewardChoice panel: výběr 1 ze 3 odměn.
3. Přidat Relic systém v UI i logice.
4. Přidat Starter Deck a Card Upgrade systém.
5. Přidat textPools/logComposer pro variabilní akční texty.
6. Přidat enemy intent tooltips.
7. Přidat Void pressure stupně a vizuální změnu UI podle stupně.
8. Přidat Fragmentation místo okamžité smrti.
9. Přidat boss fáze jako zvláštní UI stav.
10. Přidat after-run obrazovku s náznakem Moje Prázdnota.
Nový MVP, který bych považoval za správný
Solo Průchod Prázdnotou v localStorage:

Obsah:
- 1 akt
- 12 uzlů
- 6 nepřátel
- 12 encounterů
- 20 karet
- 8 relikvií
- 1 boss se 3 fázemi
- 5 základních akcí
- 5 textových variant pro každou akci
- 3 texty zásahu pro každého nepřítele
- 2 death texty pro každého nepřítele
- 3 reward typy
- Fragmentation systém
- Void pressure stupně
- RunEndReport s profilem

Tohle už je dost malé na implementaci a dost velké na zábavu.

Jedna důležitá změna názvu

SYNTHOMA: Nezlob Prázdnotu mi pořád sedí pro party mód.

Ale solo režim bych pojmenoval samostatně:

SYNTHOMA: Průchod Prázdnotou

A v menu:

SYNTHOMA: Nezlob Prázdnotu
├─ Průchod Prázdnotou       solo roguelite
├─ Party: Nezlob Prázdnotu  online chaos
├─ Moje Prázdnota           osobní základna
└─ Společný průchod         coop roguelite, později

Tím se přestane plést deskovka a roguelite.

Finální myšlenka

Teď už není otázka „jak to implementovat“.
Teď je otázka:

Co hráč cítí po třech minutách?

Správná odpověď má být:

„Jsem v divném živém systému. Každý sektor mi něco říká. Nepřítel má plán. Já mám špatné možnosti. Karty mi dovolí podvádět. Smích mě chrání. Šum mě kazí. A chci ještě jeden sektor.“

Když tohle trefíš, grafika může být minimalistická.

Když to netrefíš, můžeš tam dát 4K ilustrace gumového tuleně v kybernetickém brnění a stejně to bude jen hezký hřbitov nápadů.

Takže další krok není „víc funkcí“.

Další krok je:

udělat jeden encounter tak dobrý, že hráč chce hned další.