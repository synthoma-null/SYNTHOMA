import type { SwipeCard, CyklusItem, CyklusImprint, CardUnlock, CyklusRunGoal, SectorId, PackTone } from '../cyklusTypes';

export type { SwipeCard, CyklusItem, CyklusImprint, CardUnlock, CyklusRunGoal, SectorId } from '../cyklusTypes';

export interface CyklusContentPack {
  id: string;
  title: string;
  description: string;
  tone: PackTone[];
  sectors: SectorId[];
  requiresPools?: string[];
  unlocksPools?: string[];
  cards?: Record<string, SwipeCard>;
  items?: Record<string, CyklusItem>;
  imprints?: Record<string, CyklusImprint>;
  unlocks?: CardUnlock[];
  goals?: CyklusRunGoal[];
  findings?: string[];
}

export type { PackTone, PackCardRole } from '../cyklusTypes';
