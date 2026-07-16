import { render, screen, waitFor, within } from '@testing-library/react';
import SynthomaHome from '../SynthomaHome';

describe('Synthoma Home', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
  });

  afterEach(() => jest.restoreAllMocks());

  it('renders one literal brand, one primary action and all three sectors', async () => {
    render(<SynthomaHome />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toHaveTextContent('SYNTHOMA');
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' }).querySelector('br')).toBeNull();
    expect(document.querySelectorAll('[data-home-primary-action]')).toHaveLength(1);
    const sectors = screen.getByRole('navigation', { name: 'Sektory SYNTHOMA' });
    expect(within(sectors).getByRole('link', { name: /KNIHOVNA/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /ARCHIV/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /CYKLUS/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /AUTOR/ })).toHaveAttribute('href', '/autor');
    expect(screen.getByRole('link', { name: /PŘÍSTUP PRO AI.*AI ACCESS/ })).toHaveAttribute('href', '/ai/api');
    expect(screen.getByText(/SYNTHOMA je interaktivní psychologický román/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PRVNÍ NÁVŠTĚVA' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ZAČÍT PŘÍBĚH/ })).toHaveAttribute('href', '/chapter/0-inf-restart');
    expect(screen.getByRole('link', { name: /SPUSTIT CYKLUS/ })).toHaveAttribute('href', '/cyklus');
    expect(screen.getByRole('link', { name: /POCHOPIT SYNTHOMU/ })).toHaveAttribute('href', '/archive');
    await waitFor(() => expect(screen.getByRole('link', { name: /VSTOUPIT DO SYNTHOMY/ })).toHaveAttribute('href', '/books'));
  });

  it('prioritizes a real reading resume', async () => {
    store.lastChapterPath = '/api/chapter/0-1-start';
    render(<SynthomaHome />);
    await waitFor(() => expect(screen.getByRole('link', { name: /POKRAČOVAT VE ČTENÍ/ })).toHaveAttribute('href', '/chapter/0-1-start'));
  });

  it('translates a legacy book path to the canonical chapter route', async () => {
    store.lastChapterPath = '/books/SYNTHOMA-NULL/0-∞ [RESTART].html';
    render(<SynthomaHome />);
    await waitFor(() => expect(screen.getByRole('link', { name: /POKRAČOVAT VE ČTENÍ/ })).toHaveAttribute('href', '/chapter/0-inf-restart'));
  });

  it('continues an active Cyklus when no reading resume exists', async () => {
    store.synthoma_cyklus_run_v1 = JSON.stringify({ status: 'playing' });
    render(<SynthomaHome />);
    await waitFor(() => expect(screen.getByRole('link', { name: /POKRAČOVAT V CYKLU/ })).toHaveAttribute('href', '/cyklus'));
  });

  it('uses one decorative muted video with a fallback layer', () => {
    render(<SynthomaHome />);
    const video = document.querySelector('video') as HTMLVideoElement;
    expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(video).toHaveProperty('muted', true);
    expect(document.querySelector('.synthoma-media-layer__fallback')).toBeInTheDocument();
  });
});
