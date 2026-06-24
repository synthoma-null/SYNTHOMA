# SYNTHOMA - katalog textových efektů

Tento dokument shrnuje hlavní textové, dialogové a systémové efekty používané ve čtečce SYNTHOMA.

Cíl:

* rychle vědět, jaký efekt existuje,
* k čemu slouží,
* jak se píše v HTML,
* kdy ho použít,
* kde si dát pozor, aby se z kapitoly nestal CSS rituál bez dospělého dozoru.

---

## 1. Základní textové třídy

### `.text`

Základní vypravěčský text.

Použití:

```html
<p class="text">
  Prázdnota se nehýbala. Jen čekala, až jí NULL-1 dá důvod.
</p>
```

Význam:

* hlavní próza,
* popis prostředí,
* introspekce,
* běžný tok kapitoly.

Doporučení:

* většina odstavců má být právě `.text`,
* efekty dávat dovnitř přes `<span>`, ne na celý odstavec, pokud nemá celý odstavec změnit náladu.

---

### `.title`

Silný titulkový nebo systémově významný text.

Použití:

```html
<p class="title fx-flicker bios-warning">
  „ZADEJ JMÉNO: ____________“
</p>
```

Význam:

* názvy kapitol,
* velké systémové hlášky,
* klíčové věty,
* symbolické texty.

Pozor:

* `.title::before` přidává levou neonovou linku,
* ve čtečce a u hlavních glitch title je tato linka potlačená.

---

### `.log`

Systémový log.

Použití:

```html
<p class="log fx-scanline">
  <span class="datastream">LOG [IDENTITY_FRAGMENT]:</span>
</p>
```

Význam:

* systémová zpráva,
* diagnostika,
* změna pravidel,
* varování,
* stav objektu nebo entity.

Doporučení:

* držet krátké,
* používat jako rytmické zářezy do textu,
* nepřepisovat jím emoce, log má být chladný, tím je nepříjemný.

---

### `.dialog`

Obecný dialog nebo systémový hlas.

Použití:

```html
<p class="dialog">
  „Subjekt vykazuje známky nestandardní odezvy.“
</p>
```

Význam:

* systém,
* neurčené hlasy,
* běžný přímý hlas,
* citace bez konkrétní postavy.

---

### `.dialogN`

NULL-1.

Použití:

```html
<p class="dialogN">
  „Nevím, jestli je to moje. Ale prošlo to skrz mě.“
</p>
```

Význam:

* přímá řeč NULL-1,
* jeho vnitřní formulace,
* aktivní rozhodnutí.

---

### `.dialogS`

Sarkasma.

Použití:

```html
<p class="dialogS">
  „Gratuluju. Našel jsi další problém a tváříš se, že je to vývoj postavy.“
</p>
```

Význam:

* Sarkasma,
* ironický ochranný hlas,
* červený kouř, firewall, obranný řez.

Doporučení:

* používat na ostré, úsporné věty,
* vtip má bolet přesně, ne náhodně,
* Sarkasma nesmí být jen generátor hlášek, má chránit.

---

### `.dialogG`

Glitchka.

Použití:

```html
<p class="dialogG halo">
  „Ne všechno, co je rozbité, musíš hned opravit. 🦊🩹“
</p>
```

Význam:

* Glitchka,
* ochranný dětský glitch,
* bezpečí, hravost, měkký odpor proti systému.

Tvrdé pravidlo:

* Každá mluvená replika Glitchky končí přesně dvěma emoji.
* Ne jedním.
* Ne třemi.
* Přesně dvěma, protože i chaos má někde hranice, k neuvěření.

---

### `.dialogD`

Dvanáctník nebo mýtná / archivní entita.

Použití:

```html
<p class="dialogD">
  „Paměť není zdarma. Jen účet chodí později.“
</p>
```

Význam:

* mýtný hlas,
* obchodník s pamětí,
* zvláštní zeleno-modro-zlatý entitní tón.

---

### `.dialog.fx-gradient`

Aktuálně používané pro Glitchenu.

Použití:

```html
<p class="dialog fx-gradient">
  „Jsem to, co vznikne, když se bezpečí přestane bát těla.“
</p>
```

Význam:

* Glitchena,
* černo-červená dospělá liščí entita,
* touha, tělo, hranice, přijetí, nebezpečná něha.

Pozor:

* Třída `.fx-gradient` má obecný význam gradientu, ale v kombinaci `.dialog.fx-gradient` je přepsaná na červený Glitchena styl.
* Do budoucna by bylo čistší vytvořit samostatnou třídu třeba `.dialogX` nebo `.dialogGlitchena`.

---

## 2. Hlavní inline textové efekty

### `.fx-neon`

Klasická neonová záře.

Použití:

```html
<span class="fx-neon">T</span>
```

Význam:

* důležitý znak,
* fragment identity,
* energeticky zvýrazněné slovo.

Doporučení:

* používat střídmě,
* vhodné pro písmena T / H / O / fragmenty jména,
* ne na celé dlouhé věty, jinak čtenář oslepne, což je možná dramatické, ale nepraktické.

---

### `.halo`

Měkká záře, méně agresivní než `.fx-neon`.

Použití:

```html
<span class="halo">SMÍCH</span>
```

Význam:

* něha,
* kotva,
* dočasná stabilita,
* měkký význam.

Doporučení:

* vhodné pro Glitchku, bezpečí, vzpomínkové předměty,
* funguje dobře v kombinaci `.dialogG halo`.

---

### `.fx-gradient`

Gradientový text cyan-magenta.

Použití:

```html
<span class="fx-gradient">Glitchka</span>
```

Význam:

* přechod mezi dvěma stavy,
* glitch,
* nejednoznačná entita,
* symbolická proměna.

Pozor:

* na běžném span funguje jako gradient,
* na `.dialog.fx-gradient` má speciální červený styl pro Glitchenu.

---

### `.fx-glow-magenta`

Silná magenta záře.

Použití:

```html
<span class="fx-glow-magenta">touha</span>
```

Význam:

* emoční přetlak,
* glitch,
* tělesnost,
* nestabilní přitažlivost.

---

### `.fx-shadow-lg`

Velký textový stín.

Použití:

```html
<span class="fx-shadow-lg">stín</span>
```

Význam:

* těžká slova,
* fyzická váha textu,
* masivnější vizuální dojem.

---

### `.fx-outline`

Obrysový text.

Použití:

```html
<span class="fx-outline">NULL-1</span>
```

Význam:

* neúplnost,
* obrys bez plného obsahu,
* identita, která ještě není vyplněná.

Pozor:

* v CSS je `.fx-outline` definováno dvakrát.
* Druhá definice v souboru přebíjí část první.
* Doporučení: sjednotit do jedné definice, jinak budeš za půl roku obětovat klávesnici bohům specificity.

---

### `.fx-outline.is-lit`

Rozsvícený obrys.

Použití:

```html
<span class="fx-outline is-lit">NULL-1</span>
```

Význam:

* obrys, který se dočasně stabilizoval,
* postava / pojem je v dané scéně aktivní,
* identita dostává tvar.

Doporučení:

* výborné pro první výskyty NULL-1 v kapitole,
* neplýtvat na běžná slova.

---

### `.fx-outline.hollow`

Dutý obrys.

Použití:

```html
<span class="fx-outline hollow">JMÉNO</span>
```

Význam:

* prázdný pojem,
* jméno bez vlastníka,
* místo, které čeká na obsah.

---

### `.fx-scanline`

CRT / scanline efekt.

Použití:

```html
<p class="log fx-scanline">
  <span class="datastream">LOG [WARNING]:</span>
</p>
```

Nebo inline:

```html
<span class="fx-scanline">diagnostika</span>
```

Význam:

* systém,
* monitor,
* staré rozhraní,
* neklidný digitální záznam.

Pozor:

* v CSS je `.fx-scanline` definováno dvakrát.
* Druhá definice mění display na `inline-block`, což může ovlivnit mezery v textu.
* Používat hlavně pro logy a krátké tokeny.

---

### `.fx-flicker`

Blikání.

Použití:

```html
<span class="fx-flicker">Píše zprávu…</span>
```

Význam:

* nestabilita,
* výpadek,
* světlo, které nechce držet,
* slovo na hraně smazání.

Doporučení:

* dobré pro varování, chybové texty, semafory, nápisy,
* nepoužívat na dlouhé odstavce.

---

### `.fx-wave`

Jemné vlnění.

Použití:

```html
<span class="fx-wave">šum</span>
```

Význam:

* živé chvění,
* měkká nestabilita,
* vlna paměti.

Doporučení:

* vhodné spíš pro krátká slova,
* používat jako jemný efekt, ne jako hlavní atrakci cirkusu.

---

### `.fx-rainbow`

Duhový animovaný gradient.

Použití:

```html
<span class="fx-rainbow">novopaměť</span>
```

Význam:

* hravost,
* Pískoviště,
* Glitchka,
* absurdní bezpečný moment.

Doporučení:

* používat hlavně v Pískovišti nebo u Glitchky,
* v hororových scénách působí buď geniálně kontrastně, nebo jako web z roku 2003, podle dávkování.

---

### `.fx-noise`

Šumový overlay na textu.

Použití:

```html
<span class="fx-noise">poškozený fragment</span>
```

Význam:

* poškození,
* datový rozpad,
* kontaminovaný text.

Pozor:

* vytváří pseudo-element `::after`,
* u dlouhých inline částí může být vizuálně silný.

---

### `.fx-uppercase-wide`

Velká písmena s roztažením.

Použití:

```html
<p class="title fx-uppercase-wide">
  „NIKDY UŽ TO NEBUDEŠ MOCT ŘÍCT.“
</p>
```

Význam:

* rozsudek,
* systémový výkřik,
* nápis v prostoru.

Doporučení:

* ideální pro krátké věty,
* nepoužívat v běžném textu, protože čtenář nechce číst celou kapitolu jako nápis na jaderné elektrárně.

---

### `.fx-underline`

Neonové podtržení.

Použití:

```html
<span class="fx-underline">pravdu nahlas</span>
```

Význam:

* důraz,
* skryté nebezpečí,
* důležité slovo nebo věta.

Doporučení:

* dobré pro psychologicky bodavou frázi,
* ne na odkazy, pokud by se to míchalo s navigací.

---

## 3. Echo, glitch a datové poruchy

### `.echo-ghost`

Duchová ozvěna textu.

Použití:

```html
<span class="echo-ghost" data-echo="nevyřčených vět">nevyřčených vět</span>
```

Nebo na dialogu:

```html
<p class="dialog echo-ghost" data-echo="Proč jsi nikdy nepřišel?">
  „Proč jsi nikdy nepřišel?“
</p>
```

Význam:

* text má ozvěnu,
* slovo nese druhý význam,
* paměť za textem šeptá.

Důležité:

* vyžaduje `data-echo`,
* bez `data-echo` nemá co zobrazit.

Doporučení:

* výborné pro RUINS, REZIDUUM, SECTOR,
* ideální na slova, která mají být „slyšet dvakrát“.

---

### `.fx-glitch`

Glitch efekt na textu.

Použití:

```html
<span class="fx-glitch" data-glitch="SYNTH0MA">SYNTHOMA</span>
```

Význam:

* aktivní narušení,
* rozpad identity,
* slovo není stabilní.

Důležité:

* `data-glitch` slouží jako alternativní překryv,
* bez `data-glitch` funguje jen pulz/glow, ne plný overlay.

---

### `.fx-glitch.glitch-echo`

Připnutý glitch overlay.

Použití:

```html
<span class="fx-glitch glitch-echo" data-glitch="NULL">NULL</span>
```

Význam:

* alternativní význam visí nad původním,
* slovo je napadené druhou verzí sebe sama.

---

### `.fx-glitch[data-glitch-pinned="1"]`

Připnutý glitch přes atribut.

Použití:

```html
<span class="fx-glitch" data-glitch="PACIENT" data-glitch-pinned="1">PROCES</span>
```

Význam:

* viditelná vrstva přepisu,
* staré označení stále straší nad novým.

---

### `.glitching`

Inline token rozbitý po znacích.

Použití:

```html
<span class="glitching">@&SĐYŁ</span>
```

Význam:

* nečitelný identifikátor,
* poškozený název,
* glitch token.

Pozor:

* CSS záměrně vypíná animace na `.glitching`,
* skutečné přehazování znaků má dělat JS,
* dobré pro bránu / intro / systémové šifry.

---

### `.glitching-char`

Jednotlivý znak uvnitř JS glitch tokenu.

Použití generuje obvykle JS:

```html
<span class="glitching">
  <span class="glitching-char glitch-1">@</span>
  <span class="glitching-char glitch-2">&</span>
</span>
```

Význam:

* per-character glitch,
* interní stavební prvek.

---

### `.glitchy`

Jemný chromatic shift.

Použití:

```html
<span class="glitchy">nestabilní</span>
```

Význam:

* malý posun,
* levý / pravý barevný duch,
* nenápadný glitch.

Pozor:

* používá animaci `glitch-shift`,
* nepřehánět v dlouhém textu.

---

### `.glitch-master`

Velké glitch nadpisy s fake vrstvami.

Použití:

```html
<h1 id="glitch-synthoma" class="glitch-master">
  <span class="glitch-real">SYNTHOMA</span>
  <span class="glitch-fake1">SYNTHOMA</span>
  <span class="glitch-fake2">SYNTHOMA</span>
</h1>
```

Význam:

* hlavní logo,
* název stránky,
* reader title,
* velký glitchový nápis.

Používá:

* `.glitch-real`,
* `.glitch-fake1`,
* `.glitch-fake2`,
* `.glitch-char`.

Doporučení:

* nepoužívat uvnitř běžných odstavců,
* je to velký efekt, ne koření do každé věty.

---

### `.scramble-title`

Scramble title s přístupností.

Použití:

```html
<span class="scramble-title">
  <span class="scramble-base">SYNTHOMA</span>
  <span class="scramble-layer">SYNTHOMA</span>
  <span class="sr-only">SYNTHOMA</span>
</span>
```

Význam:

* nadpis, který může být vizuálně přepisovaný,
* zachování layoutu přes `.scramble-base`,
* čitelný text pro screen reader přes `.sr-only`.

Doporučení:

* dobré pro landing / intro,
* ne do běžných kapitol, pokud JS nepracuje se scramble vrstvou.

---

## 4. Neonové znaky a per-character efekty

### `.neon-char`

Jednotlivý neonový znak.

Použití:

```html
<span class="neon-char bright">T</span>
```

Význam:

* znak jako samostatná světelná jednotka,
* použití pro animované názvy,
* písmena identity.

---

### `.neon-char.bright`

Plně rozsvícený neonový znak.

Použití:

```html
<span class="neon-char bright">O</span>
```

Význam:

* aktivní fragment,
* jasný znak,
* silná identitní odezva.

---

### `.neon-char.flickering`

Blikající neonový znak.

Použití:

```html
<span class="neon-char flickering">H</span>
```

Význam:

* znak se snaží stabilizovat,
* porucha,
* nejistý význam.

---

### `.neon-char.flickering-off`

Pohasínající neonový znak.

Použití:

```html
<span class="neon-char flickering-off">A</span>
```

Význam:

* ztracená část slova,
* fragment na hraně zániku.

---

### `.neon-word`

Kontejner pro více neonových znaků.

Použití:

```html
<span class="neon-word">
  <span class="neon-char bright">T</span>
  <span class="neon-char flickering">H</span>
  <span class="neon-char bright">O</span>
</span>
```

Význam:

* složené neonové slovo,
* písmena identity,
* fragmentovaný název.

---

## 5. Výstražné a poškozené efekty

### `.bios-warning`

Varovný stav.

Použití:

```html
<p class="log fx-scanline bios-warning">
  <span class="datastream">LOG [WARNING]:</span>
</p>
```

Význam:

* nebezpečí,
* varování,
* systémová hranice,
* blížící se kolaps.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.bios-warning`,
* pokud není definovaná jinde, je potřeba ji doplnit.

---

### `.corrupt`

Poškozený text.

Použití:

```html
<span class="corrupt">výčitka</span>
```

Význam:

* rozbitý fragment,
* nečistá paměť,
* věta kontaminovaná systémem.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.corrupt`,
* pokud není jinde, doplnit.

---

### `.static-noise`

Statický šum.

Použití:

```html
<span class="static-noise">popel</span>
```

Význam:

* šum,
* popel dat,
* rozpad zvuku / obrazu.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.static-noise`.

---

### `.quantum-blur`

Rozmazaná nejistota.

Použití:

```html
<span class="quantum-blur">park</span>
```

Význam:

* neurčitá vzpomínka,
* simultánní možnosti,
* něco je a není zároveň.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.quantum-blur`.

---

### `.redacted`

Cenzurovaný / useknutý text.

Použití:

```html
<p class="dialog redacted">
  „Chtěl jsem ti říct, že…“
</p>
```

Význam:

* chybějící obsah,
* nedořečená věta,
* systémová cenzura,
* bolest, která nedostala tvar.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.redacted`.

---

### `.memory-leak`

Prosakování paměti.

Použití:

```html
<span class="memory-leak">promiň</span>
```

Význam:

* paměť vytéká do reality,
* slovo není stabilní,
* emoce prosakuje mimo kontext.

Pozor:

* třída je v safeguard seznamu, ale ve vloženém CSS není vidět její konkrétní styl.

---

### `.overheat`

Přehřátý text.

Použití:

```html
<span class="overheat">hutné, dusivé, roztřepené</span>
```

Význam:

* emoční přetížení,
* příliš intenzivní stav,
* text má pálit.

Pozor:

* ve vloženém CSS není vidět samostatná definice `.overheat`.

---

### `.neon-blood`

Krvavý neon.

Použití:

```html
<span class="neon-blood">H</span>
```

Význam:

* bolest,
* vina,
* krvavá historie,
* nebezpečný fragment.

Pozor:

* třída je v safeguard seznamu a má padding korekci, ale ve vloženém CSS není vidět plná barevná definice.

---

### `.alarm-emote`

Pulzující výstražný symbol / emoji.

Použití:

```html
<span class="alarm-emote">⚠</span>
```

Význam:

* alarm,
* systémová výstraha,
* vizuální přerušení věty.

Doporučení:

* používat na ikony a krátké symboly,
* ne na běžný text.

---

## 6. Speciální textové utility

### `.datastream`

Technický systémový token.

Použití:

```html
<span class="datastream">LOG [BUFFER]:</span>
```

Význam:

* kód,
* log label,
* datový proud,
* systémová typografie.

---

### `.textV`

Inline kurzivní hlas / zvýraznění v textu.

Použití:

```html
<span class="textV">vnitřní hlas</span>
```

Význam:

* vložený hlas,
* jemná změna tónu,
* kurzivní technický akcent.

Doporučení:

* vhodné do odstavce,
* nenahrazuje `.dialog`.

---

### `.accent`

Barva textového akcentu.

Použití:

```html
<span class="accent">důležité</span>
```

Význam:

* jednoduché zvýraznění podle tématu,
* bez velkého efektu.

---

### `.manifest`

Velký manifestový text.

Použití:

```html
<p class="manifest">
  Tady začíná archiv bolesti.
</p>
```

Význam:

* landing intro,
* velký autorský slogan,
* rituální statement.

---

### `.lib-note`

Poznámka pod kartou knihovny.

Použití:

```html
<p class="lib-note">0 % přečteno</p>
```

Význam:

* drobná UI poznámka,
* progress,
* metadata v knihovně.

---

## 7. Choice efekty

### `.choice`

Obal volby.

Použití:

```html
<p class="choice" data-tags="N">
  <span>▼ </span>Hledám skrytý význam.
</p>
```

Nebo:

```html
<p class="choice" data-tags="N">
  <a class="choice-link" href="/books/SYNTHOMA-NULL/0-1 [START].html">
    <span>▼ </span>Pokračovat
  </a>
</p>
```

Význam:

* interaktivní volba,
* MBTI / diagnostický otisk,
* navigace nebo story branch.

---

### `.choice-link`

Klikací odkaz / tlačítko volby.

Použití:

```html
<a class="choice-link" href="/books">Otevřít knihovnu</a>
```

Význam:

* jednotný vzhled voleb,
* používá se v readeru i landing intro.

---

### `p.choice[data-tags="E"]`

Extravertní / akční volba.

Barva:

* oranžová.

Význam:

* pohyb ven,
* akce,
* reakce,
* vstup do kontaktu.

---

### `p.choice[data-tags="I"]`

Introvertní / vnitřní volba.

Barva:

* modrofialová.

Význam:

* pozorování,
* ticho,
* introspekce,
* vnitřní prostor.

---

### `p.choice[data-tags="S"]`

Senzorická / konkrétní volba.

Barva:

* zelená.

Význam:

* detail,
* konkrétní slovo,
* fyzický objekt,
* faktická stopa.

---

### `p.choice[data-tags="N"]`

Intuitivní / symbolická volba.

Barva:

* fialová.

Význam:

* vzorec,
* symbol,
* širší souvislost,
* skrytý význam.

---

### `p.choice[data-tags="T"]`

Logická / analytická volba.

Barva:

* cyan.

Význam:

* analýza,
* systém,
* pravidlo,
* řez přes emoci.

---

### `p.choice[data-tags="F"]`

Citová / vztahová volba.

Barva:

* růžovo-červená.

Význam:

* emoce,
* vztah,
* bolest,
* soucit.

---

### `p.choice[data-tags="J"]`

Strukturovaná / rozhodovací volba.

Barva:

* žlutá.

Význam:

* plán,
* řád,
* rozhodnutí,
* uzavření.

---

### `p.choice[data-tags="P"]`

Improvizační / otevřená volba.

Barva:

* tyrkysová.

Význam:

* možnost,
* proud,
* experiment,
* otevřený konec.

---

## 8. Gateway textové efekty

### `.synth-gateway-shell`

Obal intro brány.

Použití:

```html
<div class="synth-gateway-shell">
  ...
</div>
```

Význam:

* vstupní portál,
* rituální UI,
* gateway do SYNTHOMY.

---

### `.synth-gate-title`

Velký glitch titul brány.

Použití:

```html
<h1 class="synth-gate-title" data-text="SYNTHOMA">SYNTHOMA</h1>
```

Význam:

* hlavní titul intro stránky,
* má vlastní cyan / magenta glitch vrstvy přes `::before` a `::after`.

Důležité:

* vyžaduje `data-text`, jinak pseudo vrstvy nemají co zobrazit.

---

### `.synth-gate-subtitle`

Podtitul gateway.

Použití:

```html
<p class="text synth-gate-subtitle">
  Vstupní brána do systému, který si pamatuje i to, co ty nechceš.
</p>
```

Význam:

* krátký atmosferický úvod,
* ne manuál, spíš rituální pozvánka.

---

### `.synth-gate-chip`

Stavový štítek v gateway.

Použití:

```html
<span class="synth-gate-chip">
  <span class="synth-gate-pulse"></span>
  STATUS: <strong>ONLINE</strong>
</span>
```

Význam:

* drobné stavové informace,
* systémová atmosféra.

Varianty:

* `.synth-gate-warning`
* `.synth-gate-danger`

---

### `.synth-gate-ritual`

Rituální textový blok.

Použití:

```html
<div class="synth-gate-ritual">
  <p class="text">Začni tam, kde systém poprvé zakašle.</p>
</div>
```

Význam:

* hlavní doporučení,
* story cache,
* gateway text s levou neonovou linkou.

---

### `.synth-gate-terminal`

Terminálový box.

Použití:

```html
<div class="synth-gate-terminal">
  <span>sys:</span> čekám na vstup<span class="blink">_</span>
</div>
```

Význam:

* drobný terminálový text,
* aktivní systémová přítomnost.

---

### `.blink`

Blikající kurzor / značka.

Použití:

```html
<span class="blink">_</span>
```

Význam:

* čekání na vstup,
* terminál,
* nedokončená odpověď.

---

## 9. Efekty, které jsou používané v kapitolách, ale ve vloženém CSS nejsou plně definované

Tyhle třídy se v textu SYNTHOMY často používají nebo dávají smysl, ale v poskytnutém CSS nejsou vidět jako samostatně definované efekty:

* `.bios-warning`
* `.corrupt`
* `.static-noise`
* `.quantum-blur`
* `.redacted`
* `.memory-leak`
* `.overheat`
* `.neon-blood`

Pokud nejsou definované jinde, doporučené doplnění:

```css
.bios-warning {
  color: var(--accent-warning, #f6ff00);
  text-shadow:
    0 0 6px color-mix(in oklab, var(--accent-warning, #f6ff00) 65%, transparent),
    0 0 14px color-mix(in oklab, var(--accent-error, #ff0044) 35%, transparent);
}

.corrupt {
  color: color-mix(in oklab, var(--accent-error, #ff0044) 82%, white);
  text-shadow:
    1px 0 color-mix(in oklab, var(--accent-secondary, #00ffff) 70%, transparent),
    -1px 0 color-mix(in oklab, var(--accent-primary, #ff00ff) 70%, transparent),
    0 0 8px color-mix(in oklab, var(--accent-error, #ff0044) 45%, transparent);
  filter: saturate(1.25);
}

.static-noise {
  color: color-mix(in oklab, var(--text-primary) 72%, #9aa0aa);
  text-shadow:
    0 0 2px rgba(255,255,255,.35),
    1px 0 rgba(0,255,255,.32),
    -1px 0 rgba(255,0,255,.26);
  opacity: .88;
}

.quantum-blur {
  filter: blur(0.45px);
  opacity: .84;
  text-shadow:
    0 0 8px color-mix(in oklab, var(--accent-primary, #ff00ff) 35%, transparent),
    0 0 14px color-mix(in oklab, var(--accent-secondary, #00ffff) 28%, transparent);
}

.redacted {
  color: transparent !important;
  text-shadow: none !important;
  background:
    linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.05)),
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,.65) 0 8px,
      rgba(255,255,255,.18) 8px 12px
    );
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.memory-leak {
  color: color-mix(in oklab, var(--accent-secondary, #00ffff) 76%, white);
  text-shadow:
    0 0 6px color-mix(in oklab, var(--accent-secondary, #00ffff) 60%, transparent),
    0 0 14px color-mix(in oklab, var(--accent-primary, #ff00ff) 28%, transparent);
  animation: memoryLeakPulse 2.8s ease-in-out infinite;
}

.overheat {
  color: color-mix(in oklab, var(--accent-error, #ff1744) 82%, #ffcc66);
  text-shadow:
    0 0 6px color-mix(in oklab, var(--accent-error, #ff1744) 62%, transparent),
    0 0 16px rgba(255, 80, 0, .28);
}

.neon-blood {
  color: #ff1744;
  text-shadow:
    0 0 5px rgba(255, 23, 68, .82),
    0 0 12px rgba(255, 23, 68, .52),
    0 0 22px rgba(255, 0, 80, .32);
}

@keyframes memoryLeakPulse {
  0%, 100% { opacity: .82; filter: saturate(1); }
  50% { opacity: 1; filter: saturate(1.25) hue-rotate(6deg); }
}
```

---

## 10. Doporučená pravidla používání efektů v kapitolách

### Běžná věta

```html
<p class="text">
  NULL-1 šel dál.
</p>
```

### Důležité slovo

```html
<span class="fx-neon">T</span>
```

### Nejasná vzpomínka

```html
<span class="quantum-blur">park</span>
```

### Poškozené slovo

```html
<span class="corrupt">odpověď</span>
```

### Slovo s ozvěnou

```html
<span class="echo-ghost" data-echo="nikdy neodesláno">zpráva</span>
```

### Systémový log

```html
<p class="log fx-scanline">
  <span class="datastream">LOG [WARNING]:</span>
</p>
<p class="dialog">
  „Stabilita subjektu klesá.“
</p>
```

### Varovný systémový log

```html
<p class="log fx-scanline bios-warning">
  <span class="datastream">LOG [CRITICAL]:</span>
</p>
<p class="dialog">
  „Restart není možný.“
</p>
```

### Glitchka

```html
<p class="dialogG halo">
  „Jsem tady. Jen trochu rozpadle. 🦊🩹“
</p>
```

### Sarkasma

```html
<p class="dialogS">
  „Tohle je vývoj postavy, nebo jen další elegantní forma paniky?“
</p>
```

### NULL-1

```html
<p class="dialogN">
  „Nebudu utíkat hned, jak to začne bolet.“
</p>
```

### Glitchena

```html
<p class="dialog fx-gradient">
  „Touha bez souhlasu je past.“
</p>
```

---

## 11. Doporučená dramaturgie efektů

### Kapitoly Prázdnoty

Vhodné efekty:

* `.fx-outline`
* `.fx-outline.is-lit`
* `.halo`
* `.fx-scanline`
* `.datastream`
* `.static-noise`

Používat málo:

* `.fx-rainbow`
* `.fx-wave`

---

### RUN / STRACH

Vhodné efekty:

* `.bios-warning`
* `.corrupt`
* `.memory-leak`
* `.echo-ghost`
* `.fx-flicker`
* `.neon-blood`

---

### DISCONTINUUM

Vhodné efekty:

* `.fx-glitch`
* `.fx-noise`
* `.quantum-blur`
* `.fx-scanline`
* `.corrupt`
* `.static-noise`

---

### DEFRAGMENTATION / PAUSE

Vhodné efekty:

* `.halo`
* `.dialogG halo`
* `.memory-leak`
* `.fx-gradient`
* `.fx-outline.is-lit`

---

### PÍSKOVIŠTĚ

Vhodné efekty:

* `.fx-rainbow`
* `.halo`
* `.fx-wave`
* `.dialogG halo`
* `.memory-leak`

---

### RUINS

Vhodné efekty:

* `.echo-ghost`
* `.redacted`
* `.static-noise`
* `.corrupt`
* `.fx-flicker`
* `.neon-blood`

---

### REZIDUUM / SECTOR

Vhodné efekty:

* `.quantum-blur`
* `.echo-ghost`
* `.memory-leak`
* `.fx-outline`
* `.neon-blood`
* `.fx-scanline`

---

### ORGIE / TOUHA / GLITCHENA

Vhodné efekty:

* `.dialog.fx-gradient`
* `.neon-blood`
* `.overheat`
* `.fx-gradient`
* `.fx-flicker`
* `.halo`

Pozor:

* Glitchena není Glitchka.
* Glitchena nemá povinnost dvou emoji.
* Glitchka ano.

---

## 12. Technické poznámky k současnému CSS

### Duplicitní definice

V souboru jsou některé třídy definované víckrát:

* `.fx-outline`
* `.fx-scanline`
* `.glitching`
* `.video-background`
* `#control-panel`

To není automaticky chyba, ale je to místo, kde může CSS začít provozovat vlastní politiku. Doporučení:

* jednou verzí definovat základ,
* později jen rozšiřovat přes modifikátory,
* neduplikovat celé bloky.

---

### `.dialog.fx-gradient`

Aktuálně slouží jako Glitchena styl.

Doporučené budoucí řešení:

```css
.dialogX,
.dialogGlitchena {
  color: #ff1744;
  text-shadow:
    0 0 8px rgba(255, 23, 68, 0.9),
    0 0 16px rgba(255, 23, 68, 0.7),
    0 0 24px rgba(255, 23, 68, 0.5);
}
```

A v HTML:

```html
<p class="dialogX">
  „Jsem to, co vznikne, když se bezpečí přestane bát těla.“
</p>
```

Tím zůstane `.fx-gradient` obecný efekt a Glitchena dostane vlastní hlas.

---

### Nejbezpečnější kombinace tříd

Dobré:

```html
<span class="fx-neon">T</span>
<span class="echo-ghost" data-echo="mlčení">ticho</span>
<span class="fx-outline is-lit">NULL-1</span>
<p class="dialogG halo">„Držím tě. 🦊🩹“</p>
```

Rizikové:

```html
<p class="text fx-rainbow fx-flicker fx-noise fx-wave">
  Celý dlouhý odstavec...
</p>
```

Proč:

* moc animací,
* horší čitelnost,
* výkon,
* čtenář začne bojovat s UI místo s textem, což je sice meta, ale ne cíleně dobré.

---

## 13. Rychlá taháková tabulka

| Třída                 | Typ         | Význam         | Používat na             |
| --------------------- | ----------- | -------------- | ----------------------- |
| `.text`               | blok        | próza          | běžné odstavce          |
| `.title`              | blok        | silný text     | nadpisy, systémové věty |
| `.log`                | blok        | systém         | LOG hlášky              |
| `.dialog`             | blok        | obecný hlas    | systém, neurčený hlas   |
| `.dialogN`            | blok        | NULL-1         | řeč NULL-1              |
| `.dialogS`            | blok        | Sarkasma       | sarkasmus, ochrana      |
| `.dialogG`            | blok        | Glitchka       | něha, ochrana, 2 emoji  |
| `.dialogD`            | blok        | Dvanáctník     | mýtný / obchodní hlas   |
| `.dialog.fx-gradient` | blok        | Glitchena      | černo-červená touha     |
| `.fx-neon`            | inline      | neon           | fragmenty, znaky        |
| `.halo`               | inline      | měkká záře     | bezpečí, kotvy          |
| `.fx-gradient`        | inline      | přechod        | glitch, proměna         |
| `.fx-outline`         | inline      | obrys          | neúplná identita        |
| `.fx-outline.is-lit`  | inline      | stabilní obrys | aktivní NULL-1          |
| `.fx-scanline`        | inline/blok | CRT            | logy, systém            |
| `.fx-flicker`         | inline      | blikání        | varování, nestabilita   |
| `.fx-wave`            | inline      | vlnění         | šum, paměť              |
| `.fx-rainbow`         | inline      | hravost        | Glitchka, Pískoviště    |
| `.fx-noise`           | inline      | šum            | poškození               |
| `.fx-uppercase-wide`  | inline/blok | rozsudek       | krátké výkřiky          |
| `.fx-underline`       | inline      | důraz          | klíčová slova           |
| `.echo-ghost`         | inline/blok | ozvěna         | RUINS, nevyřčené věty   |
| `.fx-glitch`          | inline      | glitch         | rozpad významu          |
| `.glitching`          | inline      | JS token       | šifry, corrupted jména  |
| `.neon-char`          | inline      | znak           | skládání písmen         |
| `.neon-word`          | inline      | slovo ze znaků | fragmenty jména         |
| `.bios-warning`       | inline/blok | varování       | logy, kritické stavy    |
| `.corrupt`            | inline      | poškození      | vadná slova             |
| `.static-noise`       | inline      | statika        | šum, popel dat          |
| `.quantum-blur`       | inline      | neurčitost     | vzpomínky               |
| `.redacted`           | inline/blok | cenzura        | nedořečené věty         |
| `.memory-leak`        | inline      | prosakování    | paměťová slova          |
| `.overheat`           | inline      | přetlak        | bolest, přehřátí        |
| `.neon-blood`         | inline      | krvavý neon    | vina, fragment H        |
