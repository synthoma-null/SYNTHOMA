import { render, screen, fireEvent } from '@testing-library/react';
import ArchiveDetailDialog from '../ArchiveDetailDialog';

const card = {
  id: 'rec-1',
  category: 'memory',
  title: 'Záznam jedna',
  teaser: 'Krátký náhled.',
  quote: 'Citát záznamu.',
  body: ['První odstavec.', 'Druhý odstavec.'],
  tags: ['tagA', 'tagB'],
  display: { icon: '◇', accent: '#0ff' },
  related: ['rec-2'],
};

const related = [{
  id: 'rec-2',
  category: 'log',
  title: 'Záznam dva',
  teaser: 'Související náhled.',
  body: [],
  display: { icon: '◈' },
}];

const onClose = jest.fn();

describe('ArchiveDetailDialog', () => {
  it('renders full content for full mode', () => {
    render(<ArchiveDetailDialog card={card} mode="full" relatedCards={related} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Záznam: Záznam jedna' })).toBeInTheDocument();
    expect(screen.getByText('První odstavec.')).toBeInTheDocument();
    expect(screen.getByText('tagA')).toBeInTheDocument();
    expect(screen.getByText('Související náhled.')).toBeInTheDocument();
  });

  it('shows locked state for teaser mode and does not render body', () => {
    render(<ArchiveDetailDialog card={card} mode="teaser" relatedCards={[]} onClose={onClose} />);
    expect(screen.getByText(/Záznam je uzamčen/)).toBeInTheDocument();
    expect(screen.queryByText('První odstavec.')).not.toBeInTheDocument();
  });

  it('returns null for hidden mode', () => {
    const { container } = render(<ArchiveDetailDialog card={card} mode="hidden" relatedCards={[]} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose on close and overlay click', () => {
    const { container } = render(<ArchiveDetailDialog card={card} mode="full" relatedCards={[]} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zavřít záznam' }));
    expect(onClose).toHaveBeenCalled();
    onClose.mockClear();
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });
});
