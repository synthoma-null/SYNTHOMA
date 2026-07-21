import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReaderOnboarding, { READER_ONBOARDING_KEY } from '../ReaderOnboarding';

describe('ReaderOnboarding', () => {
  beforeEach(() => localStorage.clear());

  it('appears once, explains the panel and can be reopened from help', async () => {
    render(<ReaderOnboarding locale="cs" />);
    expect(await screen.findByRole('dialog', { name: 'PŘIZPŮSOB SI ČTEČKU' })).toBeInTheDocument();
    expect(screen.getByText(/šířku stránky, řádkování, motiv/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'POKRAČOVAT VE ČTENÍ' }));
    expect(localStorage.getItem(READER_ONBOARDING_KEY)).toBe('true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    act(() => document.dispatchEvent(new CustomEvent('synthoma:reader-help')));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  });

  it('opens the existing control panel from its primary action', async () => {
    const listener = jest.fn();
    document.addEventListener('synthoma:control-panel-toggle', listener);
    render(<ReaderOnboarding locale="cs" />);
    fireEvent.click(await screen.findByRole('button', { name: 'OTEVŘÍT PANEL' }));
    expect(listener).toHaveBeenCalledTimes(1);
    document.removeEventListener('synthoma:control-panel-toggle', listener);
  });
});
