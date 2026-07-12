import { resolveArchiveCardVisibility } from '../resolveArchiveLock';
import type { ArchiveCard } from '../archiveTypes';

describe('resolveArchiveCardVisibility', () => {
  const base: ArchiveCard = {
    id: 'test-1',
    category: 'entity',
    title: 'Test Entity',
    teaser: 'teaser',
    body: [],
  };

  it('returns full for free mode', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'free', visibility: 'teaser', requiredChapterId: null, requiredChapterTitle: null, mnemCost: 0, label: 'free' },
    };
    expect(resolveArchiveCardVisibility(card, new Set(), 0, true)).toBe('full');
  });

  it('returns teaser for chapter mode when required chapter not completed', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'teaser', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, new Set(), 0, true)).toBe('teaser');
  });

  it('returns full for chapter mode when required chapter completed', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'teaser', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, new Set(['0-0-null']), 0, true)).toBe('full');
  });

  it('returns full for mnems mode when user can afford', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'mnems', visibility: 'teaser', requiredChapterId: null, requiredChapterTitle: null, mnemCost: 32, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, new Set(), 64, true)).toBe('full');
  });

  it('returns visibility when access not loaded', () => {
    const card: ArchiveCard = {
      ...base,
      access: { mode: 'chapter', visibility: 'hidden', requiredChapterId: 'null', requiredChapterTitle: '0-0', mnemCost: 0, label: 'locked' },
    };
    expect(resolveArchiveCardVisibility(card, new Set(['0-0-null']), 0, false)).toBe('hidden');
  });
});
