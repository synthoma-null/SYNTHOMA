import { render, screen, fireEvent } from '@testing-library/react';
import LibraryCoverDialog from '../LibraryCoverDialog';

const collection = {
  slug: 'SYNTHOMA-NULL',
  title: 'SYNTHOMA-NULL',
  cover: '/books/SYNTHOMA-NULL/SYNTHOMA_cover.png',
  chapters: [
    { id: 'ch-0', title: '0 - ∞ [RESTART]', order: 0, summary: 'Smyčka začíná znovu.', access: 'free' as const, mnemCost: 0, path: '/books/.../0.html', filename: '0.html', collectionSlug: 'SYNTHOMA-NULL' },
    { id: 'ch-1', title: '0 - 0 [NULL]', order: 1, access: 'free' as const, mnemCost: 0, path: '/books/.../1.html', filename: '1.html', collectionSlug: 'SYNTHOMA-NULL' },
  ],
  availableCount: 2,
  totalCount: 2,
};

const onClose = jest.fn();
const onEnter = jest.fn();

describe('LibraryCoverDialog', () => {
  it('renders collection title and chapter count', () => {
    render(<LibraryCoverDialog collection={collection} onClose={onClose} onEnter={onEnter} />);
    expect(screen.getByRole('dialog', { name: 'Přebal: SYNTHOMA-NULL' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SYNTHOMA-NULL' })).toBeInTheDocument();
    expect(screen.getByText('2 / 2 kapitol')).toBeInTheDocument();
  });

  it('lists chapters with summaries', () => {
    render(<LibraryCoverDialog collection={collection} onClose={onClose} onEnter={onEnter} />);
    expect(screen.getByText('Smyčka začíná znovu.')).toBeInTheDocument();
    expect(screen.getByText('0 - 0 [NULL]')).toBeInTheDocument();
  });

  it('calls onEnter when entering the collection', () => {
    render(<LibraryCoverDialog collection={collection} onClose={onClose} onEnter={onEnter} />);
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT DO SBÍRKY' }));
    expect(onEnter).toHaveBeenCalled();
  });

  it('calls onClose on overlay click and close button', () => {
    const { container } = render(<LibraryCoverDialog collection={collection} onClose={onClose} onEnter={onEnter} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zavřít přebal' }));
    expect(onClose).toHaveBeenCalled();
    onClose.mockClear();
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });
});
