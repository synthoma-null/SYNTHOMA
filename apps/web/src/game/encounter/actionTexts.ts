import type { PlayerActionId } from './encounterTypes';

// ── Action text variants ──────────────────────────────────────────────────────
// 5 variants per action, picked based on (round + seed) % 5

export const ACTION_TEXTS: Record<PlayerActionId, string[]> = {
  attack: [
    'Útok prošel skrz Šum jako špatná výmluva skrz rodinnou oslavu.',
    'Nepřítel zavrávoral. V jeho datech to udělalo zvuk, který by žádná slušná databáze neměla vydat.',
    'Zásah byl přesný. Systém si to odmítl zapsat, protože nechce podporovat sebevědomí.',
    'Úder dopadl tam, kde by normální bytost měla mít hrudník. On tam měl komprimovanou úzkost a jeden starý formulář. Obojí se rozpadlo.',
    'Útok proběhl čistě. Tedy čistě na poměry sektoru, který se právě rozpadá.',
  ],
  dash: [
    'Subjekt se posunul o půl vteřiny stranou. Realita si toho všimla pozdě, jako obvykle.',
    'Dash proběhl čistě. Tedy čistě na poměry něčeho, co se právě rozmazalo do tří chyb.',
    'Úhyb vypadal elegantně. Systém to odmítl zapsat, protože nechce podporovat sebevědomí.',
    'Pohyb byl registrován jako „odložené". Nikdo neví odkdy.',
    'Nepřítel trefil místo, kde ještě před okamžikem stál někdo s velmi optimistickým plánem.',
  ],
  hack: [
    'Zkusil jsi přepsat jeho pohybový vzorec. Systém nalezl příkaz „ignoruj etiku". Přepsáno.',
    'Hack proběhl rychleji, než si kdokoli myslel, že je povoleno. Systém si to zapsal jako „technická anomálie".',
    'Přístup získán. Systém se tvářil překvapeně, i když by správně neměl mít mimiku.',
    'Data byla manipulována způsobem, který je legálně těžko popsatelný, ale výsledkově uspokojivý.',
    'Hackování je v podstatě jen přesvědčování systémů, které jim nikdo neřekl, že mají právo říci ne.',
  ],
  defend: [
    'Blok byl nastaven. Nepřítel to ignoroval na vlastní riziko.',
    'Obranná pozice aktivována. Systém to zaregistroval jako „zbabělost (efektivní)".',
    'Štít přijal útok bez protestů. Na rozdíl od všeho ostatního v tomto sektoru.',
    'Obrana fungovala přesně tak, jak měla. To je podezřelé.',
    'Blok absorboval záměr. Záměr byl zklamán, ale nepřiznal to.',
  ],
  sarcasm: [
    '"Tohle je všechno? Já čekal aspoň trochu reprezentativní trauma." Nepřítel na okamžik zaváhal.',
    'Sarkasmus dopadl na cíl jako správně načasovaná pravda — příliš přesně, aby byl ignorován.',
    '"Skvělý plán," řekl jsi. "Opravdu skvělý." Systém si nebyl jistý, zda jde o kompliment.',
    'Nepřátelský entita dočasně zastavila, protože nebyla naprogramována na odpověď na ironii.',
    '"Archivní chyba má záměr." Pauza. "To je v tomto sektoru výjimečně ambiciózní."',
  ],
};

// ── Outcome text variants ─────────────────────────────────────────────────────

export const OUTCOME_TEXTS: Record<string, string[]> = {
  attack_success: [
    'Zásah. Systém zaznamenal poškození jako „strukturální komplikaci".',
    'Nepřítel ztratil HP. Tváří se, jako by to byl plán.',
    'Poškození způsobeno. Nikdo není spokojen, ale někdo je ve výhodě.',
  ],
  dash_success: [
    'Útok zrušen. Získáváš 1 Smích za efektivitu, kterou systém nechtěl odměňovat.',
    'Úhyb úspěšný. Nepřítel minul vše, co si myslel, že zasáhne.',
    'Blok nastaven včas. To je vlastně celkem vzácné.',
  ],
  hack_success: [
    'Systém byl přepsán. Nepřítel ztrácí záměr.',
    'Přístup získán. Nepřítel ztratí stabilitu.',
    'Hack dokončen. Systém zaznamenal jako „neplánovaná optimalizace".',
  ],
  sarcasm_good: [
    'Sarkasmus fungoval. To se nestává příliš často, aby to nebylo podezřelé.',
    'Nepřítel zaváhal. Získáváš 1 Smích a trochu naděje, která je možná neoprávněná.',
    '"Výborně," řekl systém. Bylo z toho cítit lehce konfrontační podtext.',
  ],
  sarcasm_bad: [
    'Sarkasmus se vrátil jako 1 Šum. Ne každá pravda potřebuje být vyslovena nahlas.',
    'Ironie nebyla přijata. Získáváš 1 Šum a ponaučení, které ignoruješ.',
    'Cíl reagoval netypicky efektivně. Šum +1. Příště možná ticho.',
  ],
  defend_success: [
    'Blok absorboval útok. Štít funguje lépe, než by měl.',
    'Útok zastaven. Systém si to zapsal jako „přijatelný výsledek".',
    'Obrana přijata. Nic nebolí, což je v tomto sektoru neobvyklé.',
  ],
};
