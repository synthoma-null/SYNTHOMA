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
});
