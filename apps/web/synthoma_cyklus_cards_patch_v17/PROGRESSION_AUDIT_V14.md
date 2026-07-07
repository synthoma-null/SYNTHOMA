# PROGRESSION AUDIT V14

## Cíl auditu

Zkontrolovat a rozšířit `cyklusProgression.ts` tak, aby změny z v13, tedy živé nálady předmětů, měly dlouhodobý herní význam.

## Zjištění před úpravou

1. Inventář měl nálady a resonance metadata.
2. Engine uměl tyto nálady použít při výběru karet.
3. Meta-progression ale zatím nevěděla, že kapsa existuje jako dlouhodobý systém.
4. Některé starší craft recepty odkazovaly na itemy/imprinty, které v aktuálním datasetu neexistovaly.

To poslední je klasický případ „design má vizi, databáze má nožík“.

## Přidané progression větve

### Kapesní oltář

Nová void-room větev pro hráče, kteří sbírají a aktivují předměty.

- Level 1: čitelnější nálady předmětů
- Level 2: silnější resonance tuning
- Level 3: mediace kapesních konfliktů a +1 artifact slot přes loadout limit

### Kapesní upgrady

- `pocket_listener`: víc preview informací z kapsy
- `pocket_resonance_tuner`: silnější vazba item mood → follow-up/item-trigger
- `pocket_mediator`: stabilizační šance při přetíženém inventáři

### Kapesní materiály

Materiály padají podle:

- počtu itemů v inventory,
- počtu item-trigger karet,
- primárních nálad kapsy,
- pojmenovaných předmětů,
- připravených/unstable/angry itemů.

## Přepsané starší recepty

Staré recepty byly opraveny tak, aby používaly existující itemy/imprinty:

- `fox_blanket_protocol` nyní používá `childhood_spade`, `soft_bug`, `childhood_anchor`
- `sarkasma_clean_cut` nyní používá `sarkasma_receipt`, `sarkasma_mark`
- `blackbox_named_shell` nyní používá `black_folder`, `calibration_receipt`, `reflected_self`
- `toll_refund_stamp` nyní používá `spent_token`, `sarkasma_receipt`, `sarkasma_debt`

## Nové recepty

- `seal_stamp_charm_recipe`
- `pocket_weather_vane_recipe`
- `named_resonance_thread_recipe`
- `boundary_clip_recipe`
- `archive_pocket_index_recipe`

## Dopad na gameplay

Hráč, který sbírá itemy, dostává dlouhodobou cestu:

1. item se objeví,
2. item začne reagovat,
3. item vyvolá následky,
4. běh z toho vytvoří materiály,
5. materiály otevřou craft,
6. craft se propíše do dalšího běhu,
7. další běh má jiný tón a jiné pravděpodobnosti.

Tedy konečně smyčka. Ne jen hezké předměty v kapse, které tam sedí jako sbírka špatných rozhodnutí se jmény.

## Rizika

- Kapesní scoring může ve velmi plném inventáři zvyšovat počet follow-up karet.
- `pocket_resonance_tuner` má úmyslně posílit následky, takže je dobré hlídat frekvenci item-trigger karet při playtestu.
- `pocket_mediator` částečně tlumí krize, ale neodstraňuje je. Kapsa není airbag. Je to spolupachatel.

## Doporučený další krok

Navázat UI:

- zobrazit `getPocketProgressionOverview`,
- ukázat `Kapesní oltář` ve Void room přehledu,
- zobrazit kapesní materiály v craft inventáři,
- přidat štítky nálad itemů v loadoutu před runem.
