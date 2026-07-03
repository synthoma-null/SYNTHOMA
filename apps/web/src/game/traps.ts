import type { TrapDefinition } from './types';

export const TRAPS: TrapDefinition[] = [
  {
    id: 'sumova-mina',
    name: 'Šumová mina',
    text: 'Pod nohama prasknul komprimovaný Šum. Systém tvrdí, že to není osobní. Systém lže.',
    triggerEffect: { kind: 'gain_resource', resource: 'noise', amount: 2 },
    disarmEffect: { kind: 'gain_resource', resource: 'laugh', amount: 1 },
    visible: true,
  },
  {
    id: 'pametova-smycka',
    name: 'Paměťová smyčka',
    text: 'Dostals se zpátky tam, kde jsi byl. Je stále 14:32. Bude 14:32 ještě chvíli.',
    triggerEffect: { kind: 'move_back', steps: 3 },
    disarmEffect: { kind: 'draw_cards', amount: 1 },
    visible: true,
  },
  {
    id: 'audit-osobnosti',
    name: 'Audit osobnosti',
    text: 'Z temnoty vystoupil formulář. Systém chce vědět, proč jsi to udělal. Systém má záznamy.',
    triggerEffect: { kind: 'skip_turn', turns: 1 },
    disarmEffect: { kind: 'gain_resource', resource: 'laugh', amount: 1 },
    visible: true,
  },
  {
    id: 'falesny-checkpoint',
    name: 'Falešný checkpoint',
    text: 'Checkpoint ukládal do koše. Systém to považuje za feature. Vrátíš se na START.',
    triggerEffect: { kind: 'move_to', nodeId: 'start' },
    disarmEffect: { kind: 'gain_resource', resource: 'fragments', amount: 1 },
    visible: false,
  },
  {
    id: 'kult-acidove-zluti',
    name: 'Kult acidové žluti',
    text: 'Přívrženci acidové žluti zpívají v kruhu. Jejich problémy trvají, ale jsou hezky žluté.',
    triggerEffect: { kind: 'gain_resource', resource: 'noise', amount: 2 },
    disarmEffect: { kind: 'gain_resource', resource: 'laugh', amount: 2 },
    visible: true,
  },
  {
    id: 'portal-spatneho-rozhodnuti',
    name: 'Portál špatného rozhodnutí',
    text: 'Portál vypadal jako zkratka. Portál lhal. Destináce: nejhorší místo na mapě.',
    triggerEffect: { kind: 'move_to', nodeId: 'trap-b' },
    disarmEffect: { kind: 'draw_cards', amount: 2 },
    visible: false,
  },
  {
    id: 'formular-47c',
    name: 'Formulář 47c',
    text: 'Pole 47c je povinné. Nedefinované. Věčné. Tah přeskočen na dokončení.',
    triggerEffect: { kind: 'skip_turn', turns: 1 },
    disarmEffect: { kind: 'gain_resource', resource: 'laugh', amount: 1 },
    visible: true,
  },
  {
    id: 'nekonecna-fronta',
    name: 'Nekonečná fronta',
    text: 'Fronta se nehýbe. Fronta se nikdy nehýbala. Fronta je konceptem, nikoliv místem.',
    triggerEffect: { kind: 'skip_turn', turns: 2 },
    disarmEffect: { kind: 'move_steps', steps: 2 },
    visible: false,
  },
  {
    id: 'panika-systemu',
    name: 'Panika systému',
    text: 'Systém panikařil. Systém to dělá každý čtvrtek. Ztratil jsi kartu a tempo.',
    triggerEffect: { kind: 'discard_card', amount: 1 },
    disarmEffect: { kind: 'draw_cards', amount: 2 },
    visible: true,
  },
  {
    id: 'admin-v-patek',
    name: 'Admin v pátek',
    text: 'Admin nasadil změnu v pátek ve 14:47. Nikdo nebyl připravený. Zejména systém.',
    triggerEffect: { kind: 'gain_resource', resource: 'noise', amount: 3 },
    disarmEffect: { kind: 'gain_resource', resource: 'laugh', amount: 2 },
    visible: false,
  },
];

export function getTrapById(id: string): TrapDefinition | undefined {
  return TRAPS.find((t) => t.id === id);
}
