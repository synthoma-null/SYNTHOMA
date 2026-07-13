import type { ContentAccess } from '../../content/catalog';

export type NextChapter = { id: string; title: string; route?: string };

export function resolveNextChapterAction(
  nextChapter: NextChapter | null,
  access: ContentAccess | undefined,
): 'none' | 'loading' | 'continue' | 'purchase' | 'unavailable' {
  if (!nextChapter) return 'none';
  if (!access) return 'loading';
  if (access.canAccess) return 'continue';
  if (access.state === 'unavailable') return 'unavailable';
  return access.canPurchase ? 'purchase' : 'unavailable';
}
