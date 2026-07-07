# ITEM MOOD AUDIT V13

## Smysl revize

Inventář v SYNTHOMĚ má fungovat jako malý živý systém. Předměty si nepamatují jen to, že existují. Pamatují si sektor, vztah, statový tlak a vlastní trapně intenzivní důležitost. Konečně se z kapsy stává místo, které hráče aktivně komentuje a mechanicky jemně ovlivňuje.

## Nová vrstva: resonance

Každý item může nově definovat:

- `poolIds` – které pooly tematicky podporuje,
- `aliases` – další slova pro náladové a skórovací párování,
- `favoriteSectors` – kde reaguje silněji,
- `stabilizes` – které staty umí držet,
- `destabilizes` – které staty umí rozkolísat,
- `entity` – ke komu patří tónově nebo vztahově.

## Mechanický dopad

`explainItemMoodScore(state, card)` přidává omezený scoring bonus, pokud nálada itemu rezonuje s kartou.

Zdroje bonusu:

1. karta má odpovídající tag,
2. karta je v oblíbeném sektoru itemu,
3. karta odpovídá entitě itemu,
4. karta používá pool condition napojenou na resonance pool,
5. karta hýbe statem, který item stabilizuje nebo destabilizuje,
6. kapsa má více nestabilních nebo připravených itemů najednou.

Bonus je zastropovaný na `260`, takže nálada kapsy pomáhá dramaturgii, ale nepřetahuje celý výběrový systém za vlasy do sklepa. Aspoň zatím.

## Nejvýraznější předměty

### Gumový tuleň

Silněji reaguje na:

- krizi Vazby,
- Formulářovnu,
- Glitchku,
- Sealarium.

Jeho nálada dokáže signalizovat, že se blíží krize vztahu nebo byrokratická absurdita.

### Rezavý / teplý / pojmenovaný žeton

Žetonová linka je teď výraznější:

- tržiště,
- Dvanáctník,
- dluh,
- jméno,
- výměna hranic.

Žeton tím dostává postupnou evoluci místo pocitu „našel jsem kolečko, hurá“. Protože kolečko s dluhovým právníkem je mnohem zdravější.

### Černá složka

Silněji rezonuje s:

- Zakázaným archivem,
- Černým boxem,
- brutal blackbox pooly,
- vysokou Pamětí.

Když se stane nestabilní, je to jasný signál, že hráč nese příliš mnoho archivního tlaku.

### Vrácené ne

Nově je to předmět hranice, ne jen tržní gag.

Reaguje na:

- Tržiště,
- hranice,
- vysokou Vazbu,
- nízkou Kontrolu,
- aftercare touhy.

To dává itemu jasnou psychologickou funkci: chránit vlastní ne před tím, aby se znovu prodalo.

### Pojmenovaná chyba

Posiluje linku Glitchky, měkkých bugů a vztahového chaosu.

Je nebezpečná ve vysoké Vazbě a nízké Kontrole. Jinými slovy: když se roztomilá chyba začne učit vlastní jméno, hráč by měl zbystřit. Případně přestat adoptovat bugy, ale lidé milují špatná rozhodnutí.

## UI dopad

Nové CSS hooky umožňují zobrazit kapsu jako náladový pruh:

```html
<div class="item-mood-strip">
  <span class="item-mood-pill item-mood-unstable">Černá složka · nestabilní</span>
  <span class="item-mood-pill item-mood-ready">Gumový tuleň · připraveno</span>
</div>
<p class="pocket-ambient-text">Kapsa se chová nesouhlasně s fyzikálními zákony.</p>
```

## Ověřený stav

```txt
items: 24
trigger refs: 23
missing trigger cards: 0
missing item refs: 0
item resonance pools: 39
unknown item resonance pools: 0
```

## Doporučený další krok

Po item mood vrstvě dává smysl projít `cyklusProgression.ts`, protože meta-progression už může používat nálady předmětů pro:

- nové upgrady kapsy,
- místnosti v Prázdnotě,
- craft recepty,
- lepší rewardy za item komba,
- a možná i „inventární terapii“, což zní hloupě, ale to zněl i gumový tuleň a podívej se, kam jsme to dotáhli.
