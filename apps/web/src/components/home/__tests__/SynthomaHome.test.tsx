import fs from 'fs';
import path from 'path';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import LangSwitcher from '../../LangSwitcher';
import { LangProvider } from '../../../lib/LangContext';
import SynthomaHome from '../SynthomaHome';

jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe('Synthoma Home', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
  });

  afterEach(() => jest.restoreAllMocks());

  it('renders one literal brand, the three public paths and all sectors', () => {
    render(<SynthomaHome />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toHaveTextContent('SYNTHOMA');
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' }).querySelector('br')).toBeNull();
    expect(document.querySelectorAll('[data-home-primary-action]')).toHaveLength(0);
    const sectors = screen.getByRole('navigation', { name: 'Sektory SYNTHOMA' });
    expect(within(sectors).getByRole('link', { name: /KNIHOVNA/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /ARCHIV/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /CYKLUS/ })).toBeInTheDocument();
    expect(within(sectors).getByRole('link', { name: /AUTOR/ })).toHaveAttribute('href', '/autor');
    expect(screen.getByRole('link', { name: 'PŘÍSTUP PRO AI' })).toHaveAttribute('href', '/ai/api');
    expect(screen.getByText(/SYNTHOMA je interaktivní psychologický román/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PRVNÍ NÁVŠTĚVA' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ZAČÍT PŘÍBĚH/ })).toHaveAttribute('href', '/chapter/0-inf-restart');
    expect(screen.getByRole('link', { name: /SPUSTIT CYKLUS/ })).toHaveAttribute('href', '/cyklus');
    expect(screen.getByRole('link', { name: /POCHOPIT SVĚT/ })).toHaveAttribute('href', '/archive');
    expect(screen.getByText(/První stopy jsou veřejné/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'PŘIHLÁSIT' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'REGISTROVAT' })).toHaveAttribute('href', '/register');
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

  it('keeps one footer, the main routes and the corrected Czech Cyklus CTA', () => {
    render(<SynthomaHome />);
    expect(document.querySelectorAll('footer')).toHaveLength(1);
    expect(screen.getByText('SPUSTIT')).toBeInTheDocument();
    expect(screen.queryByText('SPOUSTIT')).not.toBeInTheDocument();
    const sectors = screen.getByRole('navigation', { name: 'Sektory SYNTHOMA' });
    expect(within(sectors).getByRole('link', { name: /KNIHOVNA/ })).toHaveAttribute('href', '/books');
    expect(within(sectors).getByRole('link', { name: /ARCHIV/ })).toHaveAttribute('href', '/archive');
    expect(within(sectors).getByRole('link', { name: /CYKLUS/ })).toHaveAttribute('href', '/cyklus');
    expect(within(sectors).getByRole('link', { name: /AUTOR/ })).toHaveAttribute('href', '/autor');
  });

  it('localizes the shared legal navigation without changing its canonical route', async () => {
    render(<LangProvider initialLang="en"><LangSwitcher /><SynthomaHome /></LangProvider>);
    const nav = await screen.findByRole('navigation', { name: 'Legal information' });
    expect(within(nav).getByRole('link', { name: 'TERMS OF USE AND SALE' })).toHaveAttribute('href', '/terms');
    expect(within(nav).getByRole('link', { name: 'PRIVACY POLICY' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('navigation', { name: 'SYNTHOMA sectors' })).toHaveTextContent('LIBRARY');
    expect(screen.getByText(/SYNTHOMA is an interactive psychological novel/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /START THE STORY/ })).toHaveAttribute('href', '/chapter/0-inf-restart?locale=en');
    expect(screen.getByRole('link', { name: /START THE CYCLE/ })).toHaveAttribute('href', '/cyklus?locale=en');
    expect(screen.getByRole('link', { name: /UNDERSTAND THE WORLD/ })).toHaveAttribute('href', '/archive?locale=en');
  });

  it('keeps the story, Cycle and Archive as the three explicit first-contact paths', () => {
    render(<SynthomaHome />);
    const paths = Array.from(document.querySelectorAll('[data-first-contact-path]'));
    expect(paths.map((path) => path.getAttribute('data-first-contact-path'))).toEqual([
      '/chapter/0-inf-restart',
      '/cyklus',
      '/archive',
    ]);
    expect(paths[0]).toHaveClass('home-first-contact__path--primary');
  });

  it('keeps the legal footer in flow, touch-safe and clear of the mobile dock', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/home.css'), 'utf8');
    expect(css).toMatch(/\.synthoma-home__memory\s*\{[^}]*display:\s*grid/);
    expect(css).not.toMatch(/\.synthoma-home__memory\s*\{[^}]*position:\s*(?:fixed|sticky)/);
    expect(css).toMatch(/\.synthoma-home__legal a\s*\{[^}]*min-height:\s*44px/);
    expect(css).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.synthoma-home__memory\s*\{[^}]*safe-area-inset-bottom/);
    expect(css).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.synthoma-home__legal\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  });
});
