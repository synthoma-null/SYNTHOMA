# STORY AUDIT V11 — Aftermath napojení na příběhový tah

## Co bylo špatně před v11

Patch v10 doplnil aftermath karty pro death/meta pooly. To znamenalo, že extrémní smrt už uměla odemknout konkrétní obsah.

Ale story vrstva ještě nevěděla, **proč se má ten obsah tlačit dopředu**.

Jinými slovy: hra měla trauma, ale ne priority. Typická organizační struktura, jen s lepším neónem.

## Co řeší v11

V11 propojuje:

1. kolaps statu,
2. story progression,
3. aftermath pooly,
4. scoring karet,
5. pre-run atmosferické varování.

Teď když subjekt umře na extrém, `cyklusStory.ts` uloží `lastDeathTrace` a nastaví `activeAftermath`. Další běh pak přes `getStoryDirective()` zvýhodní odpovídající aftermath směr.

## Logika detekce smrti

Detekce probíhá z aktuálního `CyklusRunState`:

- stat `<= 0` znamená `low`,
- stat `>= 100` znamená `high`,
- při více extrémech se bere nejvzdálenější hodnota od středu.

To odpovídá tomu, jak engine pracuje s hranicemi statů. Ano, je to jednoduché. Někdy je jednoduché správně, což lidstvo z nějakého důvodu pořád bere jako osobní urážku.

## Aftermath dokončení

Když hráč potká kartu, která odpovídá aktivnímu aftermathu, story vrstva ji označí jako dotčenou:

- přidá záznam do `completedAftermaths`,
- vyčistí `activeAftermath`,
- zapíše event `aftermath_touched_*`.

Tím se aftermath netlačí donekonečna. Systém je dotěrný, ne úplně blbý.

## Doporučený další krok

Další smysluplná revize je `cyklusUnlocks.ts` + `cyklusFindings.ts`:

- zkontrolovat duplicity pool unlocků,
- sjednotit názvy meta poolů,
- přidat unlocky pro story-focused aftermathy, pokud se bude chtít ještě tvrdší navádění,
- projít, jestli každý pack má entry → object/escalation → twist → bill → resolution → echo rytmus.

V překladu: teď už příběh umí následky. Příště je potřeba zkontrolovat, jestli ekonomika odemykání nedělá bordel v účetnictví bolesti.
