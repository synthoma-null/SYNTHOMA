import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ControlCenterClient from '../ControlCenterClient';
import { LangProvider } from '../../../src/lib/LangContext';
import { updateUiPreferences } from '../../../src/lib/uiPreferences';

let mockPathname = '/';
jest.mock('next/navigation', () => ({ usePathname: () => mockPathname, useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../ThemeShopClient', () => ({ __esModule: true, default: () => <div data-testid="theme-shop" /> }));
jest.mock('../ControlCenterAudio', () => ({ __esModule: true, default: () => <div data-testid="control-audio" /> }));

function renderCenter(initialLang: 'cs' | 'en' = 'cs') {
  document.body.innerHTML = '<button id="toggle-panel-btn" aria-expanded="false">Settings</button>';
  const view = render(<LangProvider initialLang={initialLang}><ControlCenterClient /></LangProvider>);
  act(() => document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle')));
  return view;
}

describe('ControlCenterClient', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('synthoma_lang', 'cs');
    mockPathname = '/';
  });

  it('does not render utility markup until the panel is opened', () => {
    document.body.innerHTML = '<button id="toggle-panel-btn" aria-expanded="false">Settings</button>';
    render(<LangProvider initialLang="cs"><ControlCenterClient /></LangProvider>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('SYS / CTRL')).not.toBeInTheDocument();
  });

  it('shows only relevant tabs and keeps opacity separate from glass blur', async () => {
    renderCenter();
    expect(await screen.findByRole('dialog', { name: /ovládací centrum/i })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Vzhled' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Čtení' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Zvuk' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Aplikace' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'PRŮHLEDNOST ČTECÍ PLOCHY' })).toBeEnabled();
    expect(screen.getByRole('slider', { name: 'Rozostření skla' })).toBeDisabled();
  });

  it('shows PWA status and cache actions in the application tab', async () => {
    renderCenter();
    fireEvent.click(await screen.findByRole('tab', { name: 'Aplikace' }));
    expect(screen.getByText('REŽIM')).toBeInTheDocument();
    expect(screen.getByText('VERZE')).toBeInTheDocument();
    expect(screen.getByText('OFFLINE PAMĚŤ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ZKONTROLOVAT AKTUALIZACI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VYČISTIT CACHE APLIKACE' })).toBeInTheDocument();
  });

  it('confirms replacement of custom values and applies a preset atomically', async () => {
    updateUiPreferences({ noiseEffects: false });
    renderCenter();
    fireEvent.click(screen.getByRole('button', { name: 'ÚSPORNÝ' }));
    const confirmation = screen.getByRole('alertdialog', { name: /nahradit vlastní úpravy/i });
    fireEvent.click(withinDialog(confirmation, 'Použít'));
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-motion', 'off'));
    expect(screen.getByRole('button', { name: 'ÚSPORNÝ' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows reader controls only on a chapter and localizes to English', async () => {
    mockPathname = '/chapter/0-0-null';
    renderCenter('en');
    expect(await screen.findByRole('tab', { name: 'Reading' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Reading' }));
    expect(screen.getByText('FOR THIS SCREEN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /focus mode/i })).toBeInTheDocument();
  });
});

function withinDialog(dialog: HTMLElement, name: string) {
  const button = Array.from(dialog.querySelectorAll('button')).find((candidate) => candidate.textContent === name);
  if (!button) throw new Error(`Missing dialog button: ${name}`);
  return button;
}
