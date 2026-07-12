import { CHAPTERS } from '../../../content/booksManifest';
import type { ArchiveCard, ArchiveCardAccess, ArchiveCardVisibility } from './archiveTypes';

const CHAPTER_ID_MAP: Record<string, string> = {
  restart: '0-inf-restart',
  null: '0-0-null',
  start: '0-1-start',
  run: '0-2-run',
  discontinuum: '0-3-discontinuum',
  defragmentation: '0-4-defragmentation',
  pause: '0-5-pause',
  searching: '0-6-searching',
  ruins: '0-7-ruins',
  reziduum: '0-8-reziduum',
  sector: '0-9-sector',
  rest: '0-10-rest',
  orgie: '0-11-orgie-1',
};

export function resolveArchiveCardVisibility(
  card: ArchiveCard,
  completedChapterIds: Set<string>,
  mnemBalance: number,
  accessLoaded: boolean,
): ArchiveCardVisibility {
  const acc = card.access;
  if (!acc || acc.mode === 'free') return 'full';

  if (!accessLoaded) {
    return acc.visibility;
  }

  const manifestId = acc.requiredChapterId ? (CHAPTER_ID_MAP[acc.requiredChapterId] ?? acc.requiredChapterId) : null;
  const chapterDone = manifestId ? completedChapterIds.has(manifestId) : false;
  const canAfford = acc.mnemCost > 0 && mnemBalance >= acc.mnemCost;

  if (acc.mode === 'chapter') {
    return chapterDone ? 'full' : acc.visibility;
  }
  if (acc.mode === 'mnems') {
    return canAfford ? 'full' : acc.visibility;
  }
  if (acc.mode === 'chapter_or_mnems') {
    return chapterDone || canAfford ? 'full' : acc.visibility;
  }
  return acc.visibility;
}
