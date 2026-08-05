import { render, screen } from '@testing-library/react';
import LocalSubjectProfile from './LocalSubjectProfile';
import { LOCAL_SUBJECT_PROFILE_KEY } from '../../game/cyklus/cyklusLocalProfile';

describe('LocalSubjectProfile', () => {
  beforeEach(() => localStorage.clear());

  it('shows an empty local dossier instead of an authentication error', () => {
    render(<LocalSubjectProfile />);
    expect(screen.getByRole('heading', { name: 'LOKÁLNÍ SUBJEKT' })).toBeInTheDocument();
    expect(screen.getByText('SUBJECT // LOCAL')).toBeInTheDocument();
    expect(screen.getByText('ULOŽENO V TOMTO ZAŘÍZENÍ')).toBeInTheDocument();
    expect(screen.getByText('ZATÍM BEZ DAT')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'SPUSTIT CYKLUS' })).toHaveAttribute('href', '/cyklus');
    expect(screen.queryByText('POSLEDNÍ STAV')).not.toBeInTheDocument();
    expect(screen.queryByText(/401|VERIFIED|purchase/i)).not.toBeInTheDocument();
  });

  it('renders the latest local decision and disconnected MNEM state', () => {
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, JSON.stringify({
      version: 1,
      decisions: [{
        cardId: 'restart_0',
        direction: 'yes',
        timestamp: 1_700_000_000_000,
        runId: 'run-local',
        cycle: 1,
        resultingStats: { energy: 51, memory: 49, bond: 52, control: 48 },
      }],
    }));
    render(<LocalSubjectProfile />);
    expect(document.querySelector('[data-profile-state="local-active"]')).toBeInTheDocument();
    expect(screen.queryByText('NEPŘIPOJENO')).not.toBeInTheDocument();
    expect(screen.getByText('0 [RESTART]')).toBeInTheDocument();
    expect(screen.getByText(/Energie 51/)).toBeInTheDocument();
  });
});
