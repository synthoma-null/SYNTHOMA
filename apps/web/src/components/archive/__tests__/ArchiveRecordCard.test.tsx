import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArchiveRecordCard from '../ArchiveRecordCard';
import type { ArchiveCard } from '../../../lib/synthoma/archive/archiveTypes';

const card: ArchiveCard = {
  id: 'rec-1',
  category: 'memory',
  title: 'Záznam jedna',
  teaser: 'Krátký náhled.',
  quote: 'Citát.',
  body: ['První odstavec.', 'Druhý odstavec.'],
  tags: ['tagA'],
  display: { icon: '◇', accent: '#0ff' },
  related: ['rec-2'],
};

describe('ArchiveRecordCard', () => {
  it('full card is a button with aria-haspopup', () => {
    render(<ArchiveRecordCard card={card} visibility="full" />);
    const btn = screen.getByRole('button', { name: /otevřít záznam/i });
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    expect(btn).toHaveClass('archive-record-card--interactive');
    expect(btn).toHaveClass('archive-record-card--full');
  });

  it('teaser card is a button', () => {
    render(<ArchiveRecordCard card={card} visibility="teaser" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('archive-record-card--interactive');
    expect(screen.getByRole('button')).toHaveClass('archive-record-card--teaser');
  });

  it('hidden card is not a button', () => {
    const { container } = render(<ArchiveRecordCard card={card} visibility="hidden" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('article')).toHaveClass('archive-record-card--locked');
  });

  it('clicking anywhere on the card opens the dialog', () => {
    const onOpen = jest.fn();
    render(<ArchiveRecordCard card={card} visibility="full" onOpen={onOpen} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onOpen).toHaveBeenCalledWith('rec-1');

    onOpen.mockClear();
    fireEvent.click(screen.getByText('Krátký náhled.'));
    expect(onOpen).toHaveBeenCalledWith('rec-1');

    onOpen.mockClear();
    fireEvent.click(screen.getByText('memory'));
    expect(onOpen).toHaveBeenCalledWith('rec-1');
  });

  it('Enter and Space open the dialog', async () => {
    const onOpen = jest.fn();
    render(<ArchiveRecordCard card={card} visibility="full" onOpen={onOpen} />);
    const btn = screen.getByRole('button');
    (btn as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith('rec-1');

    onOpen.mockClear();
    (btn as HTMLElement).focus();
    await userEvent.keyboard(' ');
    expect(onOpen).toHaveBeenCalledWith('rec-1');
  });

  it('hidden card is not clickable and does not open dialog', () => {
    const onOpen = jest.fn();
    const { container } = render(<ArchiveRecordCard card={card} visibility="hidden" onOpen={onOpen} />);
    const article = container.querySelector('article');
    fireEvent.click(article as HTMLElement);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('interactive card has interactive modifier and locked card has locked modifier', () => {
    const { rerender } = render(<ArchiveRecordCard card={card} visibility="full" />);
    expect(screen.getByRole('button')).toHaveClass('archive-record-card--interactive');
    expect(screen.getByRole('button')).not.toHaveClass('archive-record-card--locked');

    rerender(<ArchiveRecordCard card={card} visibility="hidden" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('article')).toHaveClass('archive-record-card--locked');
    expect(document.querySelector('article')).not.toHaveClass('archive-record-card--interactive');
  });
});
