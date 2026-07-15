import React from 'react';
import { render, screen } from '@testing-library/react';
import PsycheMap from './PsycheMap';

jest.mock('../../lib/LangContext', () => ({ useLang: () => ({ t: (key: string) => key }) }));

describe('PsycheMap interpretation', () => {
  it('derives dominant, secondary and instability labels from stored values', () => {
    render(<PsycheMap detailed psyche={{
      ni: 61, fe: 72, ti: 88, se: 31,
      joy: 1, trust: 2, fear: 3, surprise: 4, sadness: 5, disgust: 6, anger: 7, anticipation: 8,
      shadow: 18, tone: 'neutrální_sarkastický', initiative: 'active', risk: 'medium', tempo: 'steady', strategy: 'observe',
    }} />);

    expect(screen.getByText('TI // VNITŘNÍ ANALÝZA')).toBeInTheDocument();
    expect(screen.getByText('FE // EMPATICKÁ ODEZVA')).toBeInTheDocument();
    expect(screen.getByText('NEUTRÁLNÍ SARKASTICKÝ')).toBeInTheDocument();
    expect(screen.getByText('18 %')).toBeInTheDocument();
    expect(screen.getByText(/Subjekt dává přednost rozboru/)).toBeInTheDocument();
  });
});
