import type { CyklusContentPack, SwipeCard } from '../contentTypes';
import { CYKLUS_CARDS as rawCards } from '../../cyklusCards';
import { CYKLUS_ITEMS as rawItems } from '../../cyklusItems';
import { CYKLUS_IMPRINTS as rawImprints } from '../../cyklusImprints';
import { CYKLUS_UNLOCKS } from '../../cyklusUnlocks';

function inferBaseRole(card: SwipeCard): NonNullable<SwipeCard['role']> {
  if (card.id.startsWith('restart_')) return 'echo';
  if (card.category === 'object' || card.tags.includes('item')) return 'object';
  if (card.category === 'crisis') return 'escalation';
  if (card.category === 'entity') return 'temptation';
  if (card.tags.includes('contract') || card.tags.includes('collect')) return 'bill';
  if (card.tags.includes('stabilize') || card.tags.includes('system')) return 'resolution';
  return 'entry';
}

const cards = Object.fromEntries(
  Object.entries(rawCards).map(([id, card]) => [
    id,
    { ...card, packId: 'base', role: card.role ?? inferBaseRole(card), tone: card.tone ?? ['tragic'] },
  ])
);

const interludeCards: Record<string, SwipeCard> = {
  interlude_glitchka_sandbox: {
    id: 'interlude_glitchka_sandbox',
    title: 'Mezihra: Liška a písek',
    logLabel: 'INTERLUDE',
    scene: 'Glitchka se na chvíli zastavila. Pískoviště přestalo hýbat. Něco mezi vámi zůstalo, aniž by to muselo mít jméno.',
    yesLabel: 'Přijmout',
    noLabel: 'Odložit',
    yes: {
      resultText: 'Přijal jsi mezihru. Něco se uvolnilo, aniž by to zmizelo.',
      effects: [{ type: 'stat', key: 'bond', amount: 3 }, { type: 'stat', key: 'control', amount: -2 }, { type: 'flag', flag: 'glitchka_sandbox_interlude' }],
      preview: { hint: 'Vazba ↑ · Kontrola ↓', risk: 'low' },
    },
    no: {
      resultText: 'Odložil jsi mezihru. Příběh si to zapamatoval a počká.',
      effects: [{ type: 'stat', key: 'memory', amount: 3 }, { type: 'stat', key: 'bond', amount: -2 }, { type: 'flag', flag: 'glitchka_sandbox_interlude_deferred' }],
      preview: { hint: 'Paměť ↑ · Vazba ↓', risk: 'low' },
    },
    category: 'memory',
    sector: 'memory_sandbox',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['tender'],
    tags: ['interlude', 'glitchka', 'sandbox', 'memory'],
    once: true,
  },
  interlude_sarkasma_blackbox: {
    id: 'interlude_sarkasma_blackbox',
    title: 'Mezihra: Pohovka a box',
    logLabel: 'INTERLUDE',
    scene: 'Sarkasma se podívala na Černý box. Box se podíval na tebe. Nikdo se neusmál. Přesto se něco uvolnilo.',
    yesLabel: 'Vstoupit',
    noLabel: 'Zůstat venku',
    yes: {
      resultText: 'Vstoupil jsi. Obrana se nezhroutila, ale konečně mluví tichým hlasem.',
      effects: [{ type: 'stat', key: 'control', amount: 3 }, { type: 'stat', key: 'energy', amount: -2 }, { type: 'flag', flag: 'sarkasma_blackbox_interlude' }],
      preview: { hint: 'Kontrola ↑ · Energie ↓', risk: 'low' },
    },
    no: {
      resultText: 'Zůstal jsi venku. Černý box si to zapamatoval jako otevřený případ.',
      effects: [{ type: 'stat', key: 'memory', amount: 3 }, { type: 'stat', key: 'control', amount: -2 }, { type: 'flag', flag: 'sarkasma_blackbox_interlude_deferred' }],
      preview: { hint: 'Paměť ↑ · Kontrola ↓', risk: 'low' },
    },
    category: 'memory',
    sector: 'sarkasma_terminal',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['comic'],
    tags: ['interlude', 'sarkasma', 'blackbox', 'memory'],
    once: true,
  },
  interlude_residuum_desire: {
    id: 'interlude_residuum_desire',
    title: 'Mezihra: Cizí něha',
    logLabel: 'INTERLUDE',
    scene: 'Reziduum něhy projde tebou a nezůstane. Touha se na to dívá z druhé strany zrcadla.',
    yesLabel: 'Projít',
    noLabel: 'Uchovat',
    yes: {
      resultText: 'Prošel jsi. Něha zůstala cizí. Bylo to dost.',
      effects: [{ type: 'stat', key: 'bond', amount: 3 }, { type: 'stat', key: 'memory', amount: -2 }, { type: 'flag', flag: 'residuum_desire_interlude' }],
      preview: { hint: 'Vazba ↑ · Paměť ↓', risk: 'low' },
    },
    no: {
      resultText: 'Uchoval jsi. Něha se stala tvou. Systém zapsal anomálii.',
      effects: [{ type: 'stat', key: 'memory', amount: 3 }, { type: 'stat', key: 'bond', amount: -2 }, { type: 'flag', flag: 'residuum_desire_interlude_deferred' }],
      preview: { hint: 'Paměť ↑ · Vazba ↓', risk: 'low' },
    },
    category: 'memory',
    sector: 'residuum',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['romantic'],
    tags: ['interlude', 'residuum', 'desire', 'memory'],
    once: true,
  },
  interlude_detective_toll: {
    id: 'interlude_detective_toll',
    title: 'Mezihra: Účtenka a případ',
    logLabel: 'INTERLUDE',
    scene: 'Detektivka našla účtenku. Dvanáctník našel detektivku. Pravda se dívá na cenu a obě se usmívají.',
    yesLabel: 'Zaplatit',
    noLabel: 'Otevřít',
    yes: {
      resultText: 'Zaplatil jsi. Cena pravdy není vysoká, když víš, že nejsi viník.',
      effects: [{ type: 'stat', key: 'control', amount: 3 }, { type: 'stat', key: 'energy', amount: -2 }, { type: 'flag', flag: 'detective_toll_interlude' }],
      preview: { hint: 'Kontrola ↑ · Energie ↓', risk: 'low' },
    },
    no: {
      resultText: 'Otevřel jsi. Případ zůstal otevřený. Dvanáctník počítá.',
      effects: [{ type: 'stat', key: 'memory', amount: 3 }, { type: 'stat', key: 'control', amount: -2 }, { type: 'flag', flag: 'detective_toll_interlude_deferred' }],
      preview: { hint: 'Paměť ↑ · Kontrola ↓', risk: 'low' },
    },
    category: 'memory',
    sector: 'archive',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['comic'],
    tags: ['interlude', 'detective', 'dvanactnik', 'memory'],
    once: true,
  },
  interlude_no_restart: {
    id: 'interlude_no_restart',
    title: 'Mezihra: Bez restartu',
    logLabel: 'INTERLUDE',
    scene: 'Systém se ptá, jestli chceš pokračovat. Tentokrát není restart. Je to otázka, ne příkaz.',
    yesLabel: 'Pokračovat',
    noLabel: 'Zastavit se',
    yes: {
      resultText: 'Pokračoval jsi. Bez restartu. To je nový druh odpovědi.',
      effects: [{ type: 'stat', key: 'energy', amount: 3 }, { type: 'stat', key: 'bond', amount: 2 }, { type: 'flag', flag: 'no_restart_interlude' }],
      preview: { hint: 'Energie ↑ · Vazba ↑', risk: 'low' },
    },
    no: {
      resultText: 'Zastavil ses. Zastavení není selhání. Je to volba, kterou systém neumí přepsat.',
      effects: [{ type: 'stat', key: 'control', amount: 3 }, { type: 'stat', key: 'energy', amount: -2 }, { type: 'flag', flag: 'no_restart_interlude_deferred' }],
      preview: { hint: 'Kontrola ↑ · Energie ↓', risk: 'low' },
    },
    category: 'memory',
    sector: 'form_office',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['tragic'],
    tags: ['interlude', 'no_restart', 'finale', 'memory'],
    once: true,
  },
};

const items = Object.fromEntries(
  Object.entries(rawItems).map(([id, item]) => [id, { ...item, tags: [...item.tags, 'base'] }])
);

const imprints = Object.fromEntries(
  Object.entries(rawImprints).map(([id, imprint]) => [id, { ...imprint, tags: [...imprint.tags, 'base'] }])
);

export const basePack: CyklusContentPack = {
  id: 'base',
  title: 'Základní cyklus',
  description: 'Původní jádro SYNTHOMA: CYKLUS. Prázdnota, entity, itemy, stabilizační cesty a příběhové mezihry.',
  tone: ['tragic', 'horror', 'tender'],
  sectors: ['void', 'archive', 'mirror', 'glitchka_nest', 'form_office', 'residuum', 'market', 'acid_yellow'],
  cards: { ...cards, ...interludeCards },
  items,
  imprints,
  unlocks: CYKLUS_UNLOCKS,
};
