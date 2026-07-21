import { fireEvent, render, screen } from '@testing-library/react';
import SynthomaLibrary from '../SynthomaLibrary';
import type { LibraryCatalog, LibraryChapter, LibraryCollection } from '../../../lib/synthoma/library/libraryTypes';

jest.mock('../../synthoma-os/SynthomaMediaLayer', () => ({ __esModule: true, default: () => null }));
jest.mock('../../../../app/components/ChapterLockModal', () => ({ __esModule: true, default: () => null }));
jest.mock('../../access/AccessProvider', () => ({
  useAccess: () => ({ resolve: jest.fn().mockResolvedValue([]), getCachedAccess: () => undefined }),
}));
jest.mock('../../../lib/synthoma/library/useLibraryProgress', () => ({
  useLibraryProgress: () => ({ byCollection: {}, byChapterId: {}, loading: false }),
  getResumeChapter: () => null,
}));

function chapter(index: number): LibraryChapter {
  return {
    id: `kp-${String(index).padStart(2, '0')}`,
    title: `${String(index).padStart(2, '0')}. Kapitola`,
    path: `/books/konec/${index}.html`,
    filename: `${index}.html`,
    collectionSlug: 'konec-podpory',
    order: index,
    access: 'free',
    mnemCost: 0,
    packageIds: [],
  };
}

const collections: LibraryCollection[] = [
  {
    slug: 'SYNTHOMA-NULL', title: 'SYNTHOMA-NULL', chapters: [chapter(99)],
    availableCount: 1, totalCount: 1, status: 'ongoing',
  },
  {
    slug: 'konec-podpory', title: 'SYNTHOMA: KONEC PODPORY', description: 'Konec centrální podpory.',
    chapters: Array.from({ length: 19 }, (_, index) => chapter(index)),
    availableCount: 19, totalCount: 19, status: 'complete',
  },
];

const catalog: LibraryCatalog = { collections };

describe('SynthomaLibrary runtime surface', () => {
  it('renders two real book cards and opens the complete 19 chapter collection', () => {
    render(<SynthomaLibrary catalog={catalog} />);
    expect(screen.getByRole('heading', { name: 'K dispozici: 2 sbírky' })).toBeInTheDocument();
    expect(screen.getAllByTestId('book-card')).toHaveLength(2);
    expect(screen.getByText('SYNTHOMA-NULL')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /SYNTHOMA: KONEC PODPORY/ }));

    expect(screen.getByRole('heading', { name: 'SYNTHOMA: KONEC PODPORY' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /Kapitoly sbírky SYNTHOMA: KONEC PODPORY/ }).children).toHaveLength(19);
  });
});
