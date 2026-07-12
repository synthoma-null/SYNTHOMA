import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import CyklusGameHeader from '../CyklusGameHeader';
import { createCyklusRun } from '../../../game/cyklus/cyklusEngine';

describe('CyklusGameHeader', () => {
  it('keeps one stable, accessible command order and complete status', () => {
    const state = { ...createCyklusRun(true), cycle: 5, choiceInCycle: 7, sector: 'archive' as const };
    render(<CyklusGameHeader state={state} showTutorialSkip={false} onTutorialSkip={jest.fn()} />);

    const header = screen.getByTestId('cyklus-gameplay-header');
    const actions = within(header).getByRole('navigation', { name: 'Ovládání Cyklu' });
    expect(Array.from(header.children)).toEqual([
      within(header).getByRole('link', { name: 'Domů' }),
      within(header).getByLabelText('Archiv, cyklus 5, postup 7 z 12'),
      actions,
    ]);
    const commands = Array.from(header.querySelectorAll<HTMLElement>('a, button')).map((item) => item.getAttribute('aria-label'));
    expect(commands).toEqual(['Domů', 'Identita', 'Ovládací panel', 'Hudba: pozastaveno']);
    expect(within(header).getAllByRole('link', { name: 'Domů' })).toHaveLength(1);
    expect(within(header).getAllByRole('button', { name: 'Identita' })).toHaveLength(1);
    expect(within(header).getAllByRole('button', { name: 'Ovládací panel' })).toHaveLength(1);
    expect(within(header).getAllByRole('button', { name: /Hudba/ })).toHaveLength(1);
    expect(within(header).getByText('Archiv')).toBeInTheDocument();
    expect(within(header).getByText('C05')).toBeInTheDocument();
    expect(within(header).getByText('07/12')).toBeInTheDocument();
    expect(Array.from(actions.children)).toHaveLength(3);
    expect(Array.from(actions.children).every((item) => item.tagName === 'BUTTON' && item.classList.contains('cyklus-header__action'))).toBe(true);
    expect(header).not.toHaveClass('cyklus-header');
  });

  it('adds tutorial skip as an explicit final command slot', () => {
    render(<CyklusGameHeader state={createCyklusRun(false)} showTutorialSkip onTutorialSkip={jest.fn()} />);

    const header = screen.getByTestId('cyklus-gameplay-header');
    const actions = within(header).getByRole('navigation', { name: 'Ovládání Cyklu' });
    const commands = Array.from(header.querySelectorAll<HTMLElement>('a, button')).map((item) => item.getAttribute('aria-label'));
    expect(commands).toEqual(['Domů', 'Identita', 'Ovládací panel', 'Hudba: pozastaveno', 'Přeskočit tutorial']);
    expect(header).toHaveClass('cyklus-game-header--with-skip');
    expect(Array.from(actions.children)).toHaveLength(4);
    expect(actions.lastElementChild).toHaveAccessibleName('Přeskočit tutorial');
  });

  it('keeps header geometry in one non-wrapping 44px flex row', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/command-header.css'), 'utf8');

    expect(css).toMatch(/\.cyklus-game-header\s*\{[^}]*display:\s*flex;[^}]*height:\s*44px;[^}]*flex-wrap:\s*nowrap;[^}]*overflow:\s*hidden;/);
    expect(css).toMatch(/\.cyklus-game-header__actions\s*\{[^}]*display:\s*flex;[^}]*flex-flow:\s*row nowrap;[^}]*height:\s*44px;/);
    expect(css).toMatch(/\.cyklus-game-header \.cyklus-header__action\s*\{[^}]*flex:\s*0 0 44px;[^}]*width:\s*44px;[^}]*height:\s*44px;/);
  });
});
