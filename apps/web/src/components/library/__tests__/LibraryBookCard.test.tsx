import { render, screen, fireEvent } from '@testing-library/react';
import LibraryBookCard from '../LibraryBookCard';
import type { LibraryCollection } from '../../../lib/synthoma/library/libraryTypes';

const collection: LibraryCollection = {
  slug: 'SYNTHOMA-NULL',
  title: 'SYNTHOMA-NULL',
  description: 'Smyčka začíná znovu.',
  cover: '/books/SYNTHOMA-NULL/SYNTHOMA_cover.png',
  chapters: [],
  availableCount: 3,
  totalCount: 5,
};

describe('LibraryBookCard', () => {
  it('renders a button with title, description, chapter count and CTA', () => {
    render(<LibraryBookCard collection={collection} onClick={jest.fn()} />);
    const btn = screen.getByRole('button', { name: /OTEVŘÍT: SYNTHOMA-NULL/ });
    expect(btn).toBeInTheDocument();
    expect(screen.getByText('SYNTHOMA-NULL')).toBeInTheDocument();
    expect(screen.getByText('Smyčka začíná znovu.')).toBeInTheDocument();
    expect(screen.getByText('5 kapitol')).toBeInTheDocument();
    expect(screen.getByText('OTEVŘÍT')).toBeInTheDocument();
    expect(screen.getByTestId('book-card')).toHaveAttribute('data-chapter-count', '5');
  });

  it('uses fallback description when none is provided', () => {
    const { description: _, ...noDesc } = collection;
    render(<LibraryBookCard collection={noDesc} onClick={jest.fn()} />);
    expect(screen.getByText('Dostupných 3 / 5 kapitol')).toBeInTheDocument();
  });

  it('shows continue CTA when there is unfinished progress', () => {
    render(<LibraryBookCard collection={collection} progressRecord={{ percent: 42 }} onClick={jest.fn()} />);
    expect(screen.getByText('POKRAČOVAT')).toBeInTheDocument();
    expect(screen.getByText('pokračovat 42%')).toBeInTheDocument();
  });

  it('marks a completed collection and keeps its total chapter count visible', () => {
    render(<LibraryBookCard collection={{ ...collection, status: 'complete', totalCount: 19 }} onClick={jest.fn()} />);
    expect(screen.getByText('DOKONČENO · 19 kapitol')).toBeInTheDocument();
  });

  it('calls onClick with collection slug when clicked', () => {
    const onClick = jest.fn();
    render(<LibraryBookCard collection={collection} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('SYNTHOMA-NULL');
  });

  it('does not contain nested interactive elements', () => {
    const { container } = render(<LibraryBookCard collection={collection} onClick={jest.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });
});
