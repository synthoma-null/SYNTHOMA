import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import CyklusCardPoster from '../CyklusCardPoster';
import type { CardPresentation } from '../../../game/cyklus/cyklusTypes';

const presentation: CardPresentation = {
  mode: 'poster-then-text',
  artSrc: '/cards/cyklus/cache_of_pain.webp',
  artAlt: 'Obrazový záznam: Cache bolesti',
  revealLabel: 'OTEVŘÍT ZÁZNAM',
};

describe('CyklusCardPoster responsive contract', () => {
  it('keeps the scrollable viewport separate from the stable CTA footer', () => {
    const { container } = render(
      <CyklusCardPoster presentation={presentation} cardTitle="Cache bolesti" onReveal={jest.fn()} />,
    );

    const shell = container.querySelector('.cyklus-card-art') as HTMLElement;
    const viewport = screen.getByRole('region', { name: 'Obrazová strana karty Cache bolesti' });
    const footer = container.querySelector('.cyklus-card-art__footer') as HTMLElement;
    const cta = screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' });

    expect(shell).toHaveAttribute('data-poster-mode', 'responsive');
    expect(viewport).toHaveAttribute('data-desktop-mode', 'contain');
    expect(viewport).toHaveAttribute('data-mobile-mode', 'scroll');
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport).not.toContainElement(cta);
    expect(footer).toContainElement(cta);
    expect(within(shell).getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' })).toHaveAttribute('loading', 'eager');
  });

  it('resets the local poster scroll when a new art source is mounted', async () => {
    const { rerender } = render(
      <CyklusCardPoster presentation={presentation} cardTitle="Cache bolesti" onReveal={jest.fn()} />,
    );
    const viewport = screen.getByRole('region', { name: 'Obrazová strana karty Cache bolesti' });
    viewport.scrollTop = 140;

    rerender(
      <CyklusCardPoster
        presentation={{ ...presentation, artSrc: '/cards/cyklus/rubber_seal.webp', artAlt: 'Obrazový záznam: Gumový tuleň' }}
        cardTitle="Gumový tuleň"
        onReveal={jest.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByRole('region', { name: 'Obrazová strana karty Gumový tuleň' }).scrollTop).toBe(0));
  });

  it('declares desktop contain geometry and portrait mobile natural-height scrolling', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/card.css'), 'utf8');

    expect(css).toMatch(/\.cyklus-card-art__image\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*contain;/);
    expect(css).toMatch(/@media \(max-width: 767px\) and \(orientation: portrait\)[\s\S]*?\.cyklus-card-art__viewport\s*\{[^}]*overflow-y:\s*auto;/);
    expect(css).toMatch(/@media \(max-width: 767px\) and \(orientation: portrait\)[\s\S]*?\.cyklus-card-art__image\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;[^}]*max-height:\s*none;/);
  });
});
