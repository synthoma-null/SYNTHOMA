import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CyklusCardCollection from '../CyklusCardCollection';

describe('CyklusCardCollection', () => {
  beforeEach(() => localStorage.clear());

  it('keeps unknown artwork out of the DOM and explains the state', () => {
    const { container } = render(<CyklusCardCollection />);
    expect(screen.getByRole('heading', { name: 'SBÍRKA KARET' })).toBeInTheDocument();
    expect(screen.getByText(/0 \/ \d+ OBJEVENO/)).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    fireEvent.click(screen.getAllByRole('button', { name: /NEZAZNAMENÁNO/ })[0]!);
    expect(screen.getByText(/Tato vizuální stopa zatím nebyla zaznamenána/)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a discovered poster in the shared viewer and restores focus', async () => {
    localStorage.setItem('synthoma_cyklus_discovery', JSON.stringify({
      cards: ['restart_0'], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [],
    }));
    render(<CyklusCardCollection />);
    const trigger = screen.getByRole('button', { name: /0 \[RESTART\].*OBJEVENO/ });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: /Zvětšený obrázek karty 0 \[RESTART\]/ });
    expect(within(dialog).getByRole('img', { name: /Obrazový záznam/ })).toBeInTheDocument();
    fireEvent.click(dialog.querySelector('.cyklus-poster-viewer__close') as HTMLButtonElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('filters discovered and unknown cards with pressed state', () => {
    localStorage.setItem('synthoma_cyklus_discovery', JSON.stringify({
      cards: ['restart_0'], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [],
    }));
    render(<CyklusCardCollection />);
    const discovered = screen.getByRole('button', { name: 'OBJEVENÉ' });
    fireEvent.click(discovered);
    expect(discovered).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('button', { name: /OBJEVENO/ })).toHaveLength(1);
  });
});
