# Dramaturgický audit v10

## Co bylo špatně / slabé

Po v9 byly všechny původní karty vizuálně a textově vylepšené, ale druhá vrstva ukázala logickou díru: `cyklusFindings.ts` uměl po smrti odemykat 20 meta poolů, ale část z nich neměla žádnou kartu, která by se na daný pool napojila.

Výsledek: hráč mohl dostat meta unlock, který vypadal důležitě, ale reálně nic neudělal. To je ve hře horší než bug, protože bug aspoň upřímně smrdí. Tohle se tváří jako obsah.

## Opravený princip

Každý extrémní kolaps statu má mít hratelný dozvuk:

- Paměť vysoká → přetlak archivu, povodeň, utopené otisky.
- Paměť nízká → prázdné štítky, formátování, stránky bez obsahu.
- Energie vysoká → dosvit, přepálení, přetaktování.
- Energie nízká → vypnutí, spánkový protokol.
- Vazba nízká → prázdné kontakty, poslední signál, nit pod dveřmi.
- Vazba vysoká → rozpuštěná hranice, sloučení.
- Kontrola vysoká → dokonalý pokoj, socha, audit ticha.
- Kontrola nízká → chaos, rozbitý protokol.

## Stav po v10

Každý death-meta pool z `DEATH_UNLOCKS` má hratelnou kartu. To znamená, že smrt není jen záznam v historii, ale reálný dramaturgický materiál pro další běhy.

## Další doporučený krok

Další patch by měl projít `cyklusStory.ts` a sladit story acty s těmito meta aftermathy:

- po konkrétních typech smrti zvýšit šanci, že story directive preferuje odpovídající pool,
- u některých aftermath karet přidat `packId` a `role`, aby se z nich staly minilinky,
- propojit death-meta karty s Prázdnotou jako místnostmi / paměťovými jizvami.

To by posunulo systém od „karty mají následky“ k „celý běh si pamatuje, jak ses rozbil“. Což je v SYNTHOMĚ v podstatě romantika.
