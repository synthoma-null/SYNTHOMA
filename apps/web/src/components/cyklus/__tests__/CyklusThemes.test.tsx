import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeShopClient from '../../../../app/components/ThemeShopClient';
import ControlPanelClient from '../../../../app/components/ControlPanelClient';
import { UI_THEMES } from '../../../lib/themes';

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
      expect(await screen.findByRole('button', { name: new RegExp(theme.label, 'i') })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('.theme-palette')).toHaveLength(UI_THEMES.length);
    expect(screen.getByRole('button', { name: /Synthoma/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('AKTIVNÍ')).toBeInTheDocument();
  });

  it('applies Mono Light to the document and updates the active marker', async () => {
    render(<ThemeShopClient />);
    const monoLight = await screen.findByRole('button', { name: /Mono Light/i });

    fireEvent.click(monoLight);

    expect(document.body).toHaveAttribute('data-theme', 'mono-light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'mono-light');
    expect(monoLight).toHaveAttribute('aria-pressed', 'true');
    expect(monoLight).toHaveTextContent('AKTIVNÍ');
    expect(localStorage.getItem('theme')).toBe('mono-light');
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
    for (const theme of UI_THEMES) {
      expect(globalThemes).toMatch(new RegExp(`\\[data-theme=${theme.id}\\]\\s*\\{[^}]*--filter-primary\\s*:`));
    }
    expect(shell).toMatch(/\.cyklus-menu__video\s*\{[^}]*filter:\s*var\(--cyklus-media-theme-filter, none\) var\(--cyklus-video-runtime-filter, none\);/);
    expect(cards).toMatch(/\.cyklus-card-art__image\s*\{[\s\S]*?filter:\s*var\(--cyklus-media-theme-filter, none\);[\s\S]*?transition:\s*filter 180ms ease;/);
    expect(themes).not.toMatch(/\.cyklus-card-art__image/);
    expect(themes).not.toMatch(/\.cyklus-menu__video\s*\{[^}]*(?:\r?\n)\s*filter\s*:/);
    expect(menu).not.toMatch(/\.cyklus-menu__video\s*\{[^}]*(?:\r?\n)\s*filter\s*:/);
    expect(cards).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.cyklus-card-art__image\s*\{[^}]*transition:\s*none;/);
    expect(cards).not.toMatch(/\.cyklus-card-art__image\s*\{[^}]*filter:\s*none/);
  });
});

describe('existing control panel behavior', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    document.body.innerHTML = `
      <button id="toggle-panel-btn" aria-expanded="false" aria-pressed="false">Nastavení</button>
      <div id="control-panel" aria-hidden="true">
        <button id="cp-close-btn" type="button">Zavřít</button>
      </div>
      <div id="synthoma-audio-panel"></div>
    `;
    window.__cpBootedOnce = false;
    window.__cpPanelDelegationAttached = false;
    window.__cpActionsDelegationAttached = false;
  });

  afterEach(() => warnSpy.mockRestore());

  it('opens, closes and responds to Escape without a duplicate panel', async () => {
    render(<ControlPanelClient />);
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const trigger = document.getElementById('toggle-panel-btn') as HTMLButtonElement;
    const panel = document.getElementById('control-panel') as HTMLElement;

    fireEvent.click(trigger);
    await waitFor(() => expect(panel).toHaveClass('visible'));
    expect(panel).toHaveAttribute('aria-hidden', 'false');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(document.getElementById('cp-close-btn')).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(panel).not.toHaveClass('visible');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(trigger).toHaveAttribute('aria-pressed', 'false');
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    fireEvent.click(document.getElementById('cp-close-btn') as HTMLButtonElement);
    expect(panel).not.toHaveClass('visible');
    expect(document.querySelectorAll('#control-panel')).toHaveLength(1);
  });
});
