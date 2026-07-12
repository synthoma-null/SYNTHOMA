import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CyklusCardPoster from '../CyklusCardPoster';
import type { CardPresentation } from '../../../game/cyklus/cyklusTypes';

const presentation: CardPresentation = {
  mode: 'poster-then-text',
  artSrc: '/cards/cyklus/cache_of_pain.webp',
  artAlt: 'Obrazový záznam: Cache bolesti',
  revealLabel: 'OTEVŘÍT ZÁZNAM',
};

function renderFullscreen(onReveal = jest.fn()) {
  const rendered = render(
    <CyklusCardPoster presentation={presentation} cardTitle="Cache bolesti" fullscreen onReveal={onReveal} />,
  );
  const viewport = screen.getByRole('region', { name: 'Obrazová strana karty Cache bolesti' });
  Object.defineProperty(viewport, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ x: 0, y: 0, left: 0, top: 0, right: 300, bottom: 400, width: 300, height: 400, toJSON: () => ({}) }),
  });
  const image = screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' });
  Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 300 });
  Object.defineProperty(image, 'naturalHeight', { configurable: true, value: 400 });
  return { ...rendered, viewport, image, onReveal };
}

function firePointer(
  target: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  values: { pointerId: number; clientX: number; clientY: number },
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: values.pointerId },
    clientX: { value: values.clientX },
    clientY: { value: values.clientY },
  });
  fireEvent(target, event);
}

describe('CyklusCardPoster responsive contract', () => {
  it('keeps only zoom and reveal controls outside the gesture viewport', () => {
    const { container, viewport } = renderFullscreen();
    const shell = container.querySelector('.cyklus-card-art') as HTMLElement;
    const footer = container.querySelector('.cyklus-card-art__footer') as HTMLElement;
    const reveal = screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' });

    expect(shell).toHaveAttribute('data-poster-mode', 'mobile-fullscreen');
    expect(shell).toHaveAttribute('data-zoom-mode', 'complete');
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-active-pointers', '0');
    expect(viewport).toHaveAccessibleDescription('Obraz lze přiblížit dvěma prsty nebo tlačítkem Zvětšit.');
    expect(viewport).not.toContainElement(reveal);
    expect(footer).toContainElement(reveal);
    expect(within(shell).getAllByRole('button')).toHaveLength(2);
    expect(within(shell).queryByRole('button', { name: /Zrušit/i })).not.toBeInTheDocument();
    expect(within(shell).getAllByRole('img')).toHaveLength(1);
  });

  it('uses the same transform state for the accessible zoom and complete-card buttons', () => {
    const { container, viewport, image } = renderFullscreen();

    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));
    expect(viewport).toHaveAttribute('data-scale', '2');
    expect(viewport).toHaveAttribute('data-mobile-mode', 'transform-zoom');
    expect(screen.getByRole('button', { name: 'CELÁ KARTA' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' })).toBe(image);
    expect(container.querySelectorAll('.cyklus-card-art__image')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'CELÁ KARTA' }));
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-translate-x', '0');
    expect(viewport).toHaveAttribute('data-translate-y', '0');
  });

  it('zooms around the two-pointer midpoint and clamps scale to 1 through 4', () => {
    const { viewport } = renderFullscreen();

    firePointer(viewport, 'pointerdown', { pointerId: 1, clientX: 100, clientY: 200 });
    firePointer(viewport, 'pointerdown', { pointerId: 2, clientX: 200, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 300, clientY: 200 });

    expect(viewport).toHaveAttribute('data-scale', '2');
    expect(viewport).toHaveAttribute('data-translate-x', '50');
    expect(screen.getByRole('button', { name: 'CELÁ KARTA' })).toBeInTheDocument();

    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 900, clientY: 200 });
    expect(viewport).toHaveAttribute('data-scale', '4');

    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 110, clientY: 200 });
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-translate-x', '0');
  });

  it('pans a zoomed image in both axes without letting it leave the viewport', () => {
    const { viewport } = renderFullscreen();
    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));

    firePointer(viewport, 'pointerdown', { pointerId: 8, clientX: 150, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 8, clientX: 900, clientY: 900 });

    expect(viewport).toHaveAttribute('data-translate-x', '150');
    expect(viewport).toHaveAttribute('data-translate-y', '200');
  });

  it('clears every active pointer on pointercancel', () => {
    const { viewport } = renderFullscreen();
    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));
    firePointer(viewport, 'pointerdown', { pointerId: 4, clientX: 100, clientY: 100 });
    expect(viewport).toHaveAttribute('data-active-pointers', '1');

    firePointer(viewport, 'pointercancel', { pointerId: 4, clientX: 100, clientY: 100 });
    expect(viewport).toHaveAttribute('data-active-pointers', '0');
    firePointer(viewport, 'pointermove', { pointerId: 4, clientX: 250, clientY: 250 });
    expect(viewport).toHaveAttribute('data-translate-x', '0');
    expect(viewport).toHaveAttribute('data-translate-y', '0');
  });

  it('resets scale, translation, pointers, and scroll when the card changes', async () => {
    const { rerender, viewport } = renderFullscreen();
    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));
    firePointer(viewport, 'pointerdown', { pointerId: 7, clientX: 100, clientY: 100 });
    viewport.scrollTop = 140;

    rerender(
      <CyklusCardPoster
        presentation={{ ...presentation, artSrc: '/cards/cyklus/rubber_seal.webp', artAlt: 'Obrazový záznam: Gumový tuleň' }}
        cardTitle="Gumový tuleň"
        fullscreen
        onReveal={jest.fn()}
      />,
    );

    const nextViewport = screen.getByRole('region', { name: 'Obrazová strana karty Gumový tuleň' });
    await waitFor(() => expect(nextViewport).toHaveAttribute('data-scale', '1'));
    expect(nextViewport).toHaveAttribute('data-translate-x', '0');
    expect(nextViewport).toHaveAttribute('data-translate-y', '0');
    expect(nextViewport).toHaveAttribute('data-active-pointers', '0');
    expect(nextViewport.scrollTop).toBe(0);
  });

  it('resets gesture state before revealing without invoking a game choice', () => {
    const onReveal = jest.fn();
    const { viewport } = renderFullscreen(onReveal);
    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));
    fireEvent.click(screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' }));

    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(screen.queryByRole('button', { name: /Přijmout|Odmítnout/ })).not.toBeInTheDocument();
  });

  it('keeps the same image and transform when the document theme changes', () => {
    const { image, viewport } = renderFullscreen();
    const source = image.getAttribute('src');
    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));

    document.documentElement.setAttribute('data-theme', 'mono-light');
    document.body.setAttribute('data-theme', 'mono-light');

    expect(screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' })).toBe(image);
    expect(image).toHaveAttribute('src', source);
    expect(viewport).toHaveAttribute('data-scale', '2');
  });

  it('declares contain image geometry and a transform-only touch contract', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/card.css'), 'utf8');

    expect(css).toMatch(/\.cyklus-card-art__viewport\s*\{[^}]*touch-action:\s*none;[^}]*user-select:\s*none;[^}]*-webkit-user-select:\s*none;[^}]*overscroll-behavior:\s*contain;/);
    expect(css).toMatch(/\.cyklus-card-art__transform-layer\s*\{[^}]*inset:\s*4px;[^}]*transform:\s*translate3d\(var\(--poster-x,[^)]+\), var\(--poster-y,[^)]+\), 0\) scale\(var\(--poster-scale, 1\)\);[^}]*transform-origin:\s*center center;/);
    expect(css).toMatch(/\.cyklus-card-art__image\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*contain;/);
    expect(css).not.toMatch(/cyklus-card-art--zoomed[\s\S]*?height:\s*auto/);
  });
});
