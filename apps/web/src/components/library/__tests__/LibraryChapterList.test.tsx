import { render, screen, fireEvent } from '@testing-library/react';
import LibraryChapterList from '../LibraryChapterList';
import type { LibraryCollection } from '../../../lib/synthoma/library/libraryTypes';

const collection: LibraryCollection = {
  slug: 'SYNTHOMA-NULL',
  title: 'SYNTHOMA-NULL',
  chapters: [
    { id: '0-inf-restart', title: '0-∞ [RESTART]', order: 0, summary: 'Smyčka začíná znovu.', access: 'free', mnemCost: 0, packageIds: [], path: '/books/0.html', filename: '0.html', collectionSlug: 'SYNTHOMA-NULL' },
    { id: 'ch-1', title: '0-0 [NULL]', order: 1, summary: 'Prázdnota.', access: 'free', mnemCost: 0, packageIds: [], path: '/books/1.html', filename: '1.html', collectionSlug: 'SYNTHOMA-NULL' },
    { id: 'ch-2', title: 'Locked chapter', order: 2, summary: 'Uzamčená.', access: 'locked', mnemCost: 64, packageIds: [], path: '/books/2.html', filename: '2.html', collectionSlug: 'SYNTHOMA-NULL' },
  ],
  availableCount: 2,
  totalCount: 3,
};

describe('LibraryChapterList', () => {
  it('renders free chapters as links with encoded href', () => {
    render(<LibraryChapterList collection={collection} progressByChapterId={{}} />);
    const restart = screen.getByRole('link', { name: /0-∞ \[RESTART\]/ });
    expect(restart).toHaveAttribute('href', '/chapter/0-inf-restart');
    expect(screen.getByText('Smyčka začíná znovu.')).toBeInTheDocument();
  });

  it('renders locked chapters as buttons that open a modal', () => {
    const onLockedClick = jest.fn();
    render(<LibraryChapterList collection={collection} progressByChapterId={{}} onLockedClick={onLockedClick} />);
    const locked = screen.getByRole('button', { name: /Locked chapter, uzamčeno/ });
    expect(locked).toBeInTheDocument();
    fireEvent.click(locked);
    expect(onLockedClick).toHaveBeenCalledWith(collection.chapters[2]);
  });

  it('shows chapter summary with proper typography', () => {
    const { container } = render(<LibraryChapterList collection={collection} progressByChapterId={{}} />);
    const summary = container.querySelector('.library-chapter-list__summary');
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent('Smyčka začíná znovu.');
  });
});
