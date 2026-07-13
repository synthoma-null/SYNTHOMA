import type { ContentAccess } from '../../../content/catalog';
import type { ArchiveCard, ArchiveCardVisibility } from './archiveTypes';

export function resolveArchiveCardVisibility(
  card: ArchiveCard,
  access: ContentAccess | undefined,
  accessLoaded: boolean,
): ArchiveCardVisibility {
  if (!card.access || card.access.mode === 'free') return 'full';
  if (!accessLoaded || !access) return card.access.visibility;
  return access.canAccess ? 'full' : card.access.visibility;
}
