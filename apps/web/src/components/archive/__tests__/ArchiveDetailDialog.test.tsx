import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  beforeEach(() => onClose.mockClear());

  it('renders full content for full mode', () => {
    render(<ArchiveDetailDialog card={card} mode="full" relatedCards={related} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Záznam jedna' })).toBeInTheDocument();
    expect(screen.getByText('První odstavec.')).toBeInTheDocument();
    expect(screen.getByText('tagA')).toBeInTheDocument();
    expect(screen.getByText('Související náhled.')).toBeInTheDocument();
  });

  it('shows locked state for teaser mode and does not render body', () => {
    render(<ArchiveDetailDialog card={card} mode="teaser" relatedCards={[]} onClose={onClose} />);
    expect(screen.getByText(/Záznam je uzamčen/)).toBeInTheDocument();
    expect(screen.queryByText('První odstavec.')).not.toBeInTheDocument();
  });

  it('renders a safe access gate for hidden mode without protected body', () => {
    render(<ArchiveDetailDialog card={card} mode="hidden" relatedCards={[]} onClose={onClose} />);
    expect(screen.getByText(/Záznam je uzamčen/)).toBeInTheDocument();
    expect(screen.queryByText('První odstavec.')).not.toBeInTheDocument();
  });

  it('calls onClose on close and overlay click', () => {
    const { container } = render(<ArchiveDetailDialog card={card} mode="full" relatedCards={[]} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zavřít detail karty' }));
    expect(onClose).toHaveBeenCalled();
    onClose.mockClear();
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes with Escape and traps keyboard focus', async () => {
    render(<ArchiveDetailDialog card={card} mode="teaser" relatedCards={[]} onClose={onClose} access={{
      contentType: 'archive_record', contentId: card.id, state: 'locked', reason: 'purchase_required',
      canAccess: false, canPurchase: true, mnemCost: 12, title: card.title,
      purchasePackageIds: [], prerequisiteChapterId: null,
    }} onPurchase={jest.fn()} />);
    const close = screen.getByRole('button', { name: 'Zavřít detail karty' });
    await waitFor(() => expect(close).toHaveFocus());
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('button', { name: 'ODEMKNOUT ZA 12 MNEM' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('removes the body scroll lock when unmounted', () => {
    const { unmount } = render(<ArchiveDetailDialog card={card} mode="full" relatedCards={[]} onClose={onClose} />);
    expect(document.body).toHaveClass('synthoma-dialog-lock');
    unmount();
    expect(document.body).not.toHaveClass('synthoma-dialog-lock');
  });
});
