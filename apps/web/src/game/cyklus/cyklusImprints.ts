import type { CyklusImprint } from './cyklusTypes';

export const CYKLUS_IMPRINTS: Record<string, CyklusImprint> = {
  unfinished_conversation: {
    id: 'unfinished_conversation',
    title: 'Nedokončený rozhovor',
    description: 'Vztahové follow-up karty se objevují častěji.',
    tags: ['bond', 'memory', 'relationship'],
    passiveEffects: [{ type: 'flag', flag: 'unfinished_conversation_active' }],
    unlockPool: 'relationship_followups',
  },
  archive_scent: {
    id: 'archive_scent',
    title: 'Archivní pach',
    description: 'Vyšší šance na Paměťové karty.',
    tags: ['archive', 'memory'],
    passiveEffects: [{ type: 'flag', flag: 'archive_scent_active' }],
  },
  rubber_stamp: {
    id: 'rubber_stamp',
    title: 'Gumové razítko',
    description: 'Jednou za run zruší Form Office past.',
    tags: ['form', 'office', 'save'],
    passiveEffects: [{ type: 'flag', flag: 'rubber_stamp_ready' }],
  },
  acid_echo: {
    id: 'acid_echo',
    title: 'Acidový dozvuk',
    description: 'Energie se zvedá snadněji.',
    tags: ['acid', 'energy'],
    passiveEffects: [{ type: 'flag', flag: 'acid_echo_active' }],
  },
  mirror_crack: {
    id: 'mirror_crack',
    title: 'Zrcadlová trhlina',
    description: 'Zrcadlové karty se mohou objevit kdekoliv.',
    tags: ['mirror', 'memory', 'glitch'],
    passiveEffects: [{ type: 'flag', flag: 'mirror_crack_active' }],
  },
  sarkasma_debt: {
    id: 'sarkasma_debt',
    title: 'Sarkasmin účet',
    description: 'Sarkasma si jednou vybere platbu.',
    tags: ['sarkasma', 'debt', 'followup'],
    passiveEffects: [{ type: 'flag', flag: 'sarkasma_debt_active' }],
  },
  noise_resident: {
    id: 'noise_resident',
    title: 'Rezident šumu',
    description: 'Šumové karty se objevují častěji.',
    tags: ['noise', 'energy', 'glitch'],
    passiveEffects: [{ type: 'flag', flag: 'noise_resident_active' }],
  },
  childhood_anchor: {
    id: 'childhood_anchor',
    title: 'Dětské kotvení',
    description: 'Paměťové karty mají častěji pozitivní Vazbu.',
    tags: ['childhood', 'memory', 'bond'],
    passiveEffects: [{ type: 'flag', flag: 'childhood_anchor_active' }],
  },
};

export function getImprintById(id: string): CyklusImprint | undefined {
  return CYKLUS_IMPRINTS[id];
}
