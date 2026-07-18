import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeShopClient from '../../../../app/components/ThemeShopClient';
import ControlCenterClient from '../../../../app/components/ControlCenterClient';
import { UI_THEMES } from '../../../lib/themes';
import { LangProvider } from '../../../lib/LangContext';

jest.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../../access/AccessProvider', () => ({
  useAccess: () => ({ applySnapshot: jest.fn() }),
}));

describe('Cyklus theme picker', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        balance: 999,
        themes: UI_THEMES.map((theme) => ({ ...theme, unlocked: true })),
      }),
    }) as jest.Mock;
  });

  it('offers every existing theme with palette and accessible active state', async () => {
    const { container } = render(<ThemeShopClient />);
    for (const theme of UI_THEMES) {
      expect(await screen.findByRole('button', { name: new RegExp(theme.name.cs, 'i') })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('.theme-palette')).toHaveLength(UI_THEMES.length);
    expect(screen.getByRole('button', { name: /Synthoma/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies Mono Light to the document and updates the active marker', async () => {
    render(<ThemeShopClient />);
    const monoLight = await screen.findByRole('button', { name: /Mono Light/i });
    fireEvent.click(monoLight);
    expect(document.body).toHaveAttribute('data-theme', 'mono-light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'mono-light');
    expect(monoLight).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders every canonical theme description in English immediately', async () => {
    render(<LangProvider initialLang="en"><ThemeShopClient /></LangProvider>);
    for (const theme of UI_THEMES) {
      expect(await screen.findByText(theme.description.en)).toBeInTheDocument();
    }
    expect(screen.getByRole('group', { name: 'Color theme' })).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('uses one shared theme media filter for videos and card posters', () => {
    const tokens = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/tokens.css'), 'utf8');
    const shell = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/shell.css'), 'utf8');
    const cards = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/card.css'), 'utf8');
    const themes = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/themes.css'), 'utf8');
    const menu = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/menu-polish.css'), 'utf8');
    const globalThemes = fs.readFileSync(path.join(process.cwd(), 'src/styles/themes.css'), 'utf8');

    expect(tokens).toMatch(/--cyklus-media-theme-filter:\s*var\(--synthoma-media-theme-filter, var\(--filter-primary, none\)\);/);
    expect(tokens.match(/--cyklus-media-theme-filter\s*:/g)).toHaveLength(1);
    for (const theme of UI_THEMES) expect(globalThemes).toMatch(new RegExp(`\\[data-theme=${theme.id}\\]\\s*\\{[^}]*--filter-primary\\s*:`));
    expect(shell).toMatch(/\.cyklus-menu__video\s*\{[^}]*filter:\s*var\(--cyklus-media-theme-filter, none\) var\(--cyklus-video-runtime-filter, none\);/);
    expect(cards).toMatch(/\.cyklus-card-art__image\s*\{[\s\S]*?filter:\s*var\(--cyklus-media-theme-filter, none\);[\s\S]*?transition:\s*filter 180ms ease;/);
    expect(themes).not.toMatch(/\.cyklus-card-art__image/);
    expect(themes).not.toMatch(/\.cyklus-menu__video\s*\{[^}]*(?:\r?\n)\s*filter\s*:/);
    expect(menu).not.toMatch(/\.cyklus-menu__video\s*\{[^}]*(?:\r?\n)\s*filter\s*:/);
  });
});

describe('control center behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<button id="toggle-panel-btn" aria-expanded="false">Settings</button><div id="synthoma-audio-panel"></div>';
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ balance: 0, themes: [] }) }) as jest.Mock;
  });

  it('opens, closes and responds to Escape without a duplicate panel', async () => {
    render(<LangProvider><ControlCenterClient /></LangProvider>);
    const trigger = document.getElementById('toggle-panel-btn') as HTMLButtonElement;

    trigger.focus();
    act(() => document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle')));
    const panel = await screen.findByRole('dialog', { name: /ovládací centrum/i });
    expect(panel).toHaveClass('visible');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(panel.querySelector('.control-center__close')).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());

    act(() => document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle')));
    const reopened = await screen.findByRole('dialog', { name: /ovládací centrum/i });
    fireEvent.click(reopened.querySelector('.control-center__close') as HTMLButtonElement);
    await waitFor(() => expect(document.querySelectorAll('#control-panel')).toHaveLength(0));
  });
});
