import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CyklusCardPoster from '../CyklusCardPoster';

describe('Cyklus complete no-selection contract', () => {
  const foundation = readFileSync(join(process.cwd(), 'src/styles/cyklus/foundation.css'), 'utf8');
  const client = readFileSync(join(process.cwd(), 'src/components/cyklus/CyklusClient.tsx'), 'utf8');

  it('locks text, touch callouts and image dragging with form field exceptions', () => {
    expect(foundation).toMatch(/\.cyklus-no-select,\s*\.cyklus-no-select \*/);
    expect(foundation).toContain('-webkit-user-select: none');
    expect(foundation).toContain('user-select: none');
    expect(foundation).toContain('-webkit-touch-callout: none');
    expect(foundation).toMatch(/\.cyklus-no-select input,[\s\S]*\.cyklus-no-select textarea,[\s\S]*user-select: text/);
  });

  it('marks gameplay, tutorial, discovery, build and Void roots explicitly', () => {
    expect(client).toContain("'cyklus-no-select',\n      'cyklus-root'");
    expect(client).toContain('cyklus-no-select cyklus-overlay cyklus-overlay--warning');
    expect(client).toContain('cyklus-no-select cyklus-overlay cyklus-overlay--discovery');
    expect(client).toContain('cyklus-no-select cyklus-overlay cyklus-overlay--build');
    expect(client).toContain('cyklus-no-select cyklus-overlay cyklus-overlay--build cyklus-overlay--void-hub');
  });

  it('prevents native dragging on gameplay artwork', () => {
    render(
      <CyklusCardPoster
        cardTitle="Test card"
        presentation={{ mode: 'poster-then-text', artSrc: '/cards/test.webp' }}
        onReveal={jest.fn()}
      />,
    );
    const image = screen.getByRole('img', { name: 'Obrazový záznam: Test card' });
    expect(image).toHaveAttribute('draggable', 'false');
    expect(fireEvent.dragStart(image)).toBe(false);
  });
});
