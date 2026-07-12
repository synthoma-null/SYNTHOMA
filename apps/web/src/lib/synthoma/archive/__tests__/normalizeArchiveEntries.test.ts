import { normalizeArchiveCards } from '../normalizeArchiveEntries';
import type { ArchiveCardData } from '../../../../../app/archive/ArchiveClient';

describe('normalizeArchiveCards', () => {
  const sample: ArchiveCardData[] = [
    {
      id: 'card-2',
      category: 'lore',
      title: 'Second',
      teaser: 'teaser 2',
      body: ['body 2'],
      order: 2,
    },
    {
      id: 'card-1',
      category: 'entity',
      title: 'First',
      teaser: 'teaser 1',
      body: ['body 1'],
      order: 1,
    },
  ];

  it('sorts cards by order', () => {
    const result = normalizeArchiveCards(sample);
    expect(result[0]?.id).toBe('card-1');
    expect(result[1]?.id).toBe('card-2');
  });

  it('normalizes access fields', () => {
    const data: ArchiveCardData[] = [
      {
        id: 'card-3',
        category: 'lore',
        title: 'Third',
        teaser: 'teaser',
        body: [],
        access: {
          mode: 'chapter',
          visibility: 'teaser',
          requiredChapterId: 'null',
          requiredChapterTitle: '0-0',
          mnemCost: 0,
          label: 'locked',
          lockedText: 'Locked',
          reason: 'Requires 0-0',
        },
      },
    ];
    const result = normalizeArchiveCards(data);
    expect(result[0]?.access?.reason).toBe('Requires 0-0');
    expect(result[0]?.access?.mode).toBe('chapter');
  });
});
