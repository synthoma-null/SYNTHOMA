import { resolveArchiveCardVisibility } from '../resolveArchiveLock';
import type { ArchiveCard } from '../archiveTypes';
import type { ContentAccess } from '../../../../content/catalog';

describe('resolveArchiveCardVisibility', () => {
  const base: ArchiveCard = {
    id: 'test-1',
    category: 'entity',
    title: 'Test Entity',
    teaser: 'teaser',
    body: [],
  };
  const owned: ContentAccess = {
    contentType: 'archive_record', contentId: 'test-1', state: 'owned', reason: 'direct_entitlement',
    canAccess: true, canPurchase: false, mnemCost: 32, title: 'Test Entity',
    purchasePackageIds: [], prerequisiteChapterId: null,
  };
  const locked: ContentAccess = {
    ...owned, state: 'locked', reason: 'purchase_required', canAccess: false, canPurchase: true,
  };

  it('returns full for free mode', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'free', visibility: 'teaser', requiredChapterId: null, requiredChapterTitle: null, mnemCost: 0, label: 'free' },
    };
    expect(resolveArchiveCardVisibility(card, undefined, true)).toBe('full');
  });

  it('returns teaser for chapter mode when required chapter not completed', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'teaser', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, locked, true)).toBe('teaser');
  });

  it('returns full for chapter mode when required chapter completed', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'teaser', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, owned, true)).toBe('full');
  });

  it('does not confuse an MNEM balance with ownership', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'mnems', visibility: 'teaser', requiredChapterId: null, requiredChapterTitle: null, mnemCost: 32, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, locked, true)).toBe('teaser');
  });

  it('returns visibility when access not loaded', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'hidden', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, owned, false)).toBe('hidden');
  });
});
