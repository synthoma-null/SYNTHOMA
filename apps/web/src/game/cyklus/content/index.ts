import type { CyklusContentPack, SwipeCard, CyklusItem, CyklusImprint, CardUnlock } from './contentTypes';
import { basePack } from './packs/basePack';
import { sandboxAbsurdPack } from './packs/sandboxAbsurdPack';
import { desireOrgiePack } from './packs/desireOrgiePack';
import { romanceResiduumPack } from './packs/romanceResiduumPack';
import { brutalBlackboxPack } from './packs/brutalBlackboxPack';
import { tollDvanactnikPack } from './packs/dvanactnikMytnicePack';
import { detectiveEchoCasePack } from './packs/detektivkaSynthPack';
import { sarkasmaTherapyPack } from './packs/terapieSarkasma';
import { glitchkaChatPack } from './packs/pokecGlitchka';

export { tollDvanactnikPack, detectiveEchoCasePack, sarkasmaTherapyPack, glitchkaChatPack };

export const CYKLUS_CONTENT_PACKS: CyklusContentPack[] = [
  basePack,
  sandboxAbsurdPack,
  desireOrgiePack,
  romanceResiduumPack,
  brutalBlackboxPack,
  tollDvanactnikPack,
  detectiveEchoCasePack,
  sarkasmaTherapyPack,
  glitchkaChatPack,
];

export function getAllContentPacks(): CyklusContentPack[] {
  return CYKLUS_CONTENT_PACKS;
}

export function getCardsFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): Record<string, SwipeCard> {
  const result: Record<string, SwipeCard> = {};
  for (const pack of packs) {
    if (!pack.cards) continue;
    for (const [id, card] of Object.entries(pack.cards)) {
      if (result[id]) {
        console.warn(`[cyklus content] duplicate card id ${id} in pack ${pack.id}`);
      }
      result[id] = card;
    }
  }
  return result;
}

export function getItemsFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): Record<string, CyklusItem> {
  const result: Record<string, CyklusItem> = {};
  for (const pack of packs) {
    if (!pack.items) continue;
    for (const [id, item] of Object.entries(pack.items)) {
      if (result[id]) {
        console.warn(`[cyklus content] duplicate item id ${id} in pack ${pack.id}`);
      }
      result[id] = item;
    }
  }
  return result;
}

export function getImprintsFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): Record<string, CyklusImprint> {
  const result: Record<string, CyklusImprint> = {};
  for (const pack of packs) {
    if (!pack.imprints) continue;
    for (const [id, imprint] of Object.entries(pack.imprints)) {
      if (result[id]) {
        console.warn(`[cyklus content] duplicate imprint id ${id} in pack ${pack.id}`);
      }
      result[id] = imprint;
    }
  }
  return result;
}

export function getUnlocksFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): CardUnlock[] {
  return packs.flatMap((pack) => pack.unlocks ?? []);
}

export function getGoalsFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): import('./contentTypes').CyklusRunGoal[] {
  return packs.flatMap((pack) => pack.goals ?? []);
}

export function getFindingsFromPacks(packs: CyklusContentPack[] = CYKLUS_CONTENT_PACKS): string[] {
  return packs.flatMap((pack) => pack.findings ?? []);
}

export function getCardsByPack(packId: string): Record<string, SwipeCard> {
  const pack = CYKLUS_CONTENT_PACKS.find((p) => p.id === packId);
  return pack?.cards ?? {};
}

export function getPackById(packId: string): CyklusContentPack | undefined {
  return CYKLUS_CONTENT_PACKS.find((p) => p.id === packId);
}

export function getCardsByRole(role: SwipeCard['role']): SwipeCard[] {
  return Object.values(CYKLUS_CARDS).filter((card) => card.role === role);
}

export function getCardsByTone(tone: string): SwipeCard[] {
  return Object.values(CYKLUS_CARDS).filter((card) => card.tone?.includes(tone));
}

export const CYKLUS_CARDS = getCardsFromPacks();
export const CYKLUS_ITEMS = getItemsFromPacks();
export const CYKLUS_IMPRINTS = getImprintsFromPacks();
export const CYKLUS_CARD_UNLOCKS = getUnlocksFromPacks();

export { basePack, sandboxAbsurdPack, desireOrgiePack, romanceResiduumPack, brutalBlackboxPack };
export type { CyklusContentPack } from './contentTypes';
