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

function renderFullscreen(onReveal = jest.fn(), onClose = jest.fn()) {
  const viewportSize = { width: 300, height: 400 };
  const rendered = render(
    <CyklusCardPoster presentation={presentation} cardTitle="Cache bolesti" fullscreen onReveal={onReveal} onClose={onClose} />,
  );
  const viewport = screen.getByRole('region', { name: 'Obrazová strana karty Cache bolesti' });
  Object.defineProperty(viewport, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ x: 0, y: 0, left: 0, top: 0, right: viewportSize.width, bottom: viewportSize.height, width: viewportSize.width, height: viewportSize.height, toJSON: () => ({}) }),
  });
  const image = screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' });
  Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 300 });
  Object.defineProperty(image, 'naturalHeight', { configurable: true, value: 400 });
  fireEvent.load(image);
  return {
    ...rendered,
    viewport,
    image,
    onReveal,
    onClose,
    resizeViewport(width: number, height: number) {
      viewportSize.width = width;
      viewportSize.height = height;
      fireEvent(window, new Event('resize'));
    },
  };
}

function zoomWithButtons(times = 3) {
  for (let index = 0; index < times; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Přiblížit obrázek' }));
  }
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
    pointerType: { value: 'touch' },
  });
  fireEvent(target, event);
}

describe('CyklusCardPoster responsive contract', () => {
  it('keeps only zoom and reveal controls outside the gesture viewport', () => {
    const { container, viewport } = renderFullscreen();
    const shell = container.querySelector('.cyklus-card-art') as HTMLElement;
    const footer = container.querySelector('.cyklus-card-art__footer') as HTMLElement;
    const reveal = screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' });

    expect(shell).toHaveAttribute('data-poster-mode', 'fullscreen-viewer');
    expect(shell).toHaveAttribute('data-zoom-mode', 'complete');
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-active-pointers', '0');
    expect(viewport).toHaveAccessibleDescription('Obraz lze přiblížit kolečkem, tlačítky, dvojklikem nebo dvěma prsty a posouvat tažením.');
    expect(viewport).not.toContainElement(reveal);
    expect(footer).toContainElement(reveal);
    expect(within(shell).getAllByRole('button')).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'Zavřít zvětšený obrázek' })).toHaveLength(2);
    expect(within(shell).getAllByRole('img')).toHaveLength(1);
  });

  it('uses the same transform state for the accessible zoom and complete-card buttons', () => {
    const { container, viewport, image } = renderFullscreen();

    zoomWithButtons();
    expect(viewport).toHaveAttribute('data-scale', '2.5');
    expect(viewport).toHaveAttribute('data-mobile-mode', 'transform-zoom');
    expect(screen.getByRole('button', { name: 'Obnovit 100 %' })).toHaveTextContent('250 %');
    expect(screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' })).toBe(image);
    expect(container.querySelectorAll('.cyklus-card-art__image')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Obnovit 100 %' }));
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-translate-x', '0');
    expect(viewport).toHaveAttribute('data-translate-y', '0');
  });

  it('offers one explicit 44px fullscreen trigger on the contained poster', () => {
    const onOpenViewer = jest.fn();
    const { container } = render(
      <CyklusCardPoster presentation={presentation} cardTitle="Cache bolesti" onReveal={jest.fn()} onOpenViewer={onOpenViewer} />,
    );

    const trigger = screen.getByRole('button', { name: 'Zvětšit obrázek' });
    expect(trigger).toHaveAttribute('title', 'Zvětšit obrázek');
    expect(trigger.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.cyklus-card-art__open-viewer')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveAttribute('draggable', 'false');
    fireEvent.click(trigger);
    expect(onOpenViewer).toHaveBeenCalledTimes(1);
  });

  it('zooms with the mouse wheel, double click and mobile double tap', () => {
    const { viewport } = renderFullscreen();

    fireEvent.wheel(viewport, { deltaY: -100 });
    expect(viewport).toHaveAttribute('data-scale', '1.5');
    fireEvent.doubleClick(viewport);
    expect(viewport).toHaveAttribute('data-scale', '1');

    firePointer(viewport, 'pointerdown', { pointerId: 20, clientX: 140, clientY: 180 });
    firePointer(viewport, 'pointerup', { pointerId: 20, clientX: 140, clientY: 180 });
    firePointer(viewport, 'pointerdown', { pointerId: 21, clientX: 140, clientY: 180 });
    firePointer(viewport, 'pointerup', { pointerId: 21, clientX: 140, clientY: 180 });
    expect(viewport).toHaveAttribute('data-scale', '2.5');
  });

  it('closes from Escape and backdrop without revealing the card', () => {
    const onClose = jest.fn();
    const onReveal = jest.fn();
    const { container } = renderFullscreen(onReveal, onClose);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('.cyklus-poster-viewer__backdrop') as HTMLButtonElement);
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onReveal).not.toHaveBeenCalled();
  });

  it('zooms around the two-pointer midpoint and clamps scale to 1 through 4', () => {
    const { viewport } = renderFullscreen();

    firePointer(viewport, 'pointerdown', { pointerId: 1, clientX: 100, clientY: 200 });
    firePointer(viewport, 'pointerdown', { pointerId: 2, clientX: 200, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 300, clientY: 200 });

    expect(viewport).toHaveAttribute('data-scale', '2');
    expect(viewport).toHaveAttribute('data-translate-x', '50');
    expect(screen.getByRole('button', { name: 'Obnovit 100 %' })).toBeInTheDocument();

    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 900, clientY: 200 });
    expect(viewport).toHaveAttribute('data-scale', '4');

    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 110, clientY: 200 });
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(viewport).toHaveAttribute('data-translate-x', '0');
  });

  it('pans a zoomed image in both axes without letting it leave the viewport', () => {
    const { viewport } = renderFullscreen();
    zoomWithButtons();

    firePointer(viewport, 'pointerdown', { pointerId: 8, clientX: 150, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 8, clientX: 900, clientY: 900 });

    expect(viewport).toHaveAttribute('data-translate-x', '225');
    expect(viewport).toHaveAttribute('data-translate-y', '300');
  });

  it('clears every active pointer on pointercancel', () => {
    const { viewport } = renderFullscreen();
    zoomWithButtons();
    firePointer(viewport, 'pointerdown', { pointerId: 4, clientX: 100, clientY: 100 });
    expect(viewport).toHaveAttribute('data-active-pointers', '1');

    firePointer(viewport, 'pointercancel', { pointerId: 4, clientX: 100, clientY: 100 });
    expect(viewport).toHaveAttribute('data-active-pointers', '0');
    firePointer(viewport, 'pointermove', { pointerId: 4, clientX: 250, clientY: 250 });
    expect(viewport).toHaveAttribute('data-translate-x', '0');
    expect(viewport).toHaveAttribute('data-translate-y', '0');
  });

  it('makes all four image corners reachable at maximum zoom', () => {
    const { viewport } = renderFullscreen();
    firePointer(viewport, 'pointerdown', { pointerId: 1, clientX: 100, clientY: 200 });
    firePointer(viewport, 'pointerdown', { pointerId: 2, clientX: 200, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 1, clientX: -150, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 2, clientX: 450, clientY: 200 });
    expect(viewport).toHaveAttribute('data-scale', '4');
    expect(viewport).toHaveAttribute('data-max-x', '450');
    expect(viewport).toHaveAttribute('data-max-y', '600');

    firePointer(viewport, 'pointerup', { pointerId: 2, clientX: 450, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 1, clientX: 2000, clientY: 2200 });
    expect(viewport).toHaveAttribute('data-translate-x', '450');
    expect(viewport).toHaveAttribute('data-translate-y', '600');

    firePointer(viewport, 'pointermove', { pointerId: 1, clientX: -2000, clientY: -2200 });
    expect(viewport).toHaveAttribute('data-translate-x', '-450');
    expect(viewport).toHaveAttribute('data-translate-y', '-600');
  });

  it('recomputes contain geometry and clamps the current view after rotation', () => {
    const { viewport, resizeViewport } = renderFullscreen();
    zoomWithButtons();
    firePointer(viewport, 'pointerdown', { pointerId: 12, clientX: 150, clientY: 200 });
    firePointer(viewport, 'pointermove', { pointerId: 12, clientX: 900, clientY: 900 });
    expect(viewport).toHaveAttribute('data-translate-x', '225');
    expect(viewport).toHaveAttribute('data-translate-y', '300');

    resizeViewport(600, 300);

    expect(viewport).toHaveAttribute('data-base-width', '225');
    expect(viewport).toHaveAttribute('data-base-height', '300');
    expect(viewport).toHaveAttribute('data-translate-x', '0');
    expect(viewport).toHaveAttribute('data-translate-y', '225');
  });

  it('resets scale, translation, pointers, and scroll when the card changes', async () => {
    const { rerender, viewport } = renderFullscreen();
    zoomWithButtons();
    firePointer(viewport, 'pointerdown', { pointerId: 7, clientX: 100, clientY: 100 });
    viewport.scrollTop = 140;

    rerender(
      <CyklusCardPoster
        presentation={{ ...presentation, artSrc: '/cards/cyklus/rubber_seal.webp', artAlt: 'Obrazový záznam: Gumový tuleň' }}
        cardTitle="Gumový tuleň"
        fullscreen
        onReveal={jest.fn()}
        onClose={jest.fn()}
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
    zoomWithButtons();
    fireEvent.click(screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' }));

    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(viewport).toHaveAttribute('data-scale', '1');
    expect(screen.queryByRole('button', { name: /Přijmout|Odmítnout/ })).not.toBeInTheDocument();
  });

  it('keeps the same image and transform when the document theme changes', () => {
    const { image, viewport } = renderFullscreen();
    const source = image.getAttribute('src');
    zoomWithButtons();

    document.documentElement.setAttribute('data-theme', 'mono-light');
    document.body.setAttribute('data-theme', 'mono-light');

    expect(screen.getByRole('img', { name: 'Obrazový záznam: Cache bolesti' })).toBe(image);
    expect(image).toHaveAttribute('src', source);
    expect(viewport).toHaveAttribute('data-scale', '2.5');
  });

  it('declares contain image geometry and a transform-only touch contract', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/card.css'), 'utf8');

    expect(css).toMatch(/\.cyklus-card-art__viewport\s*\{[^}]*touch-action:\s*none;[^}]*-webkit-user-select:\s*none;[^}]*user-select:\s*none;[^}]*overscroll-behavior:\s*contain;/);
    expect(css).toMatch(/\.cyklus-card-art__transform-layer\s*\{[^}]*top:\s*50%;[^}]*left:\s*50%;[^}]*width:\s*var\(--poster-base-width,[^;]+;[^}]*height:\s*var\(--poster-base-height,[^;]+;[^}]*transform-origin:\s*center center;/);
    expect(css).toMatch(/\.cyklus-card-art__image\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*contain;/);
    expect(css).toMatch(/\.cyklus-card-art__transform-layer\[data-geometry-ready="true"\] \.cyklus-card-art__image\s*\{[^}]*object-fit:\s*fill;/);
    expect(css).not.toMatch(/cyklus-card-art--zoomed[\s\S]*?height:\s*auto/);
  });

  it('keeps the card shell at a definite height so the poster viewport is not zero', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus/card.css'), 'utf8');

    expect(css).not.toMatch(/\.cyklus-card\s*\{[^}]*height:\s*min\(100%,/);
    expect(css).toMatch(/\.cyklus-card\s*\{[^}]*height:\s*100%/);
  });
});
