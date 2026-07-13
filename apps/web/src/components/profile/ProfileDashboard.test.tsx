import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ProfileDashboard, { type ProfileData } from './ProfileDashboard';

jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));
jest.mock('./PsycheMap', () => ({ __esModule: true, default: ({ detailed }: { detailed?: boolean }) => <div data-testid="psyche-map">Psyche {String(detailed)}</div> }));
jest.mock('./ReadingProgressPanel', () => ({ __esModule: true, default: () => <div data-testid="reading-progress">Čtení</div> }));
jest.mock('./MnemAccessPanel', () => ({ __esModule: true, default: () => <div data-testid="mnem-access">Mnemy</div> }));
jest.mock('./PrivacyPanel', () => ({ __esModule: true, default: () => <div data-testid="privacy-panel">Soukromí</div> }));
jest.mock('../run/RunDashboard', () => ({ __esModule: true, default: () => <div data-testid="run-dashboard">Cyklus</div> }));

const profile: ProfileData = {
  user: {
    id: 'user-1',
    nickname: 'Mira',
    email: 'mira@example.test',
    role: 'admin',
    createdAt: '2025-01-02T10:00:00.000Z',
    lastLoginAt: '2026-07-12T08:30:00.000Z',
    profile: {
      displayName: 'Mira', bio: null, title: 'Archivní subjekt', publicProfile: false,
      showPsycheMap: true, showProgress: true, showChoices: false,
    },
    settings: null,
    psyche: {
      ni: 81, fe: 44, ti: 63, se: 22, joy: 50, trust: 51, fear: 52, surprise: 53,
      sadness: 54, disgust: 55, anger: 56, anticipation: 57, shadow: 38,
      tone: 'tender', initiative: 'active', risk: 'medium', tempo: 'steady', strategy: 'observe',
    },
    _count: { choices: 42, reading: 7 },
  },
  mnemBalance: 19,
  ledger: [],
  ownership: [],
  purchases: [],
};

describe('ProfileDashboard dossier', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => profile });
  });

  it('renders five accessible sections without duplicate settings or psyche content', async () => {
    render(<ProfileDashboard userId="user-1" nickname="Mira" mode="popup" />);

    const tablist = await screen.findByRole('tablist', { name: 'Sekce profilu subjektu' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    expect(tabs.map((tab) => tab.textContent)).toEqual(['01PŘEHLED', '02PSYCHÉ', '03CYKLUS', '04ARCHIV', '05PŘÍSTUP']);
    expect(screen.queryByRole('tab', { name: /nastavení/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('psyche-map')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /psyché/i }));
    expect(screen.getAllByTestId('psyche-map')).toHaveLength(1);

    fireEvent.click(screen.getByRole('tab', { name: /cyklus/i }));
    expect(screen.getByTestId('run-dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /archiv/i }));
    expect(screen.getByTestId('reading-progress')).toBeInTheDocument();
    expect(screen.getByTestId('mnem-access')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /přístup/i }));
    expect(screen.getByTestId('privacy-panel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ADMIN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ODHLÁSIT' })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('supports Arrow, Home and End navigation in the tablist', async () => {
    render(<ProfileDashboard userId="user-1" nickname="Mira" mode="popup" />);
    const overview = await screen.findByRole('tab', { name: /přehled/i });

    overview.focus();
    fireEvent.keyDown(overview, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /psyché/i })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tab', { name: /psyché/i }), { key: 'End' });
    expect(screen.getByRole('tab', { name: /přístup/i })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('tab', { name: /přístup/i }), { key: 'Home' });
    expect(overview).toHaveFocus();
  });

  it('shows a retry action after a failed profile request', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => profile });
    render(<ProfileDashboard userId="user-1" nickname="Mira" mode="popup" />);

    fireEvent.click(await screen.findByRole('button', { name: 'ZKUSIT ZNOVU' }));
    await waitFor(() => expect(screen.getByRole('tablist')).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
