import { render, screen } from '@testing-library/react';
import LibraryResume from '../LibraryResume';
import type { LibraryChapter, LibraryCollection } from '../../../lib/synthoma/library/libraryTypes';

const chapter: LibraryChapter = {
  id: '0-inf-restart', title: '0-∞ [RESTART]', path: '/books/SYNTHOMA-NULL/0-∞ [RESTART].html',
  filename: '0-∞ [RESTART].html', collectionSlug: 'SYNTHOMA-NULL', order: 0, access: 'free',
  mnemCost: 0, packageIds: [],
};

const collection: LibraryCollection = {
  slug: 'SYNTHOMA-NULL', title: 'SYNTHOMA-NULL', chapters: [chapter], availableCount: 1, totalCount: 1,
};

describe('LibraryResume', () => {
  it('continues through the canonical server-rendered chapter route', () => {
    render(<LibraryResume collection={collection} chapter={chapter} percent={38} />);
    expect(screen.getByRole('link', { name: 'POKRAČOVAT' })).toHaveAttribute('href', '/chapter/0-inf-restart');
    expect(document.body.innerHTML).not.toContain('/reader?u=');
  });
});
