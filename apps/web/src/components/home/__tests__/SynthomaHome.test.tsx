import fs from 'fs';
import path from 'path';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import LangSwitcher from '../../LangSwitcher';
import { LangProvider } from '../../../lib/LangContext';
import SynthomaHome from '../SynthomaHome';
import SynthomaFooter from '../../synthoma-os/SynthomaFooter';

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
    expect(screen.queryByText(/SUBJECT_CONTACT/)).not.toBeInTheDocument();
    expect(screen.getByText(/SYNTHOMA je interaktivní psychologický román/)).toBeInTheDocument();
    expect(screen.getByText('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'SPUSTIT INTRO' })).toHaveAttribute('href', '/landing-intro?replay=1');
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

  it('leaves the decorative background video to the global shell', () => {
    render(<SynthomaHome />);
    expect(document.querySelector('video')).not.toBeInTheDocument();
    expect(document.querySelector('.synthoma-global-background')).not.toBeInTheDocument();
  });

  it('leaves the shared footer to the shell and keeps the corrected Czech Cyklus CTA', () => {
    render(<SynthomaHome />);
    expect(document.querySelectorAll('footer')).toHaveLength(0);
    expect(screen.getByText('SPUSTIT')).toBeInTheDocument();
    expect(screen.queryByText('SPOUSTIT')).not.toBeInTheDocument();
    const sectors = screen.getByRole('navigation', { name: 'Sektory SYNTHOMA' });
    expect(within(sectors).getByRole('link', { name: /KNIHOVNA/ })).toHaveAttribute('href', '/books');
    expect(within(sectors).getByRole('link', { name: /ARCHIV/ })).toHaveAttribute('href', '/archive');
    expect(within(sectors).getByRole('link', { name: /CYKLUS/ })).toHaveAttribute('href', '/cyklus');
    expect(within(sectors).getByRole('link', { name: /AUTOR/ })).toHaveAttribute('href', '/autor');
  });

  it('localizes the shared legal navigation without changing its canonical route', async () => {
    render(<LangProvider initialLang="en"><LangSwitcher /><SynthomaHome /><SynthomaFooter /></LangProvider>);
    const nav = await screen.findByRole('navigation', { name: 'System links' });
    expect(within(nav).getByRole('link', { name: 'TERMS' })).toHaveAttribute('href', '/terms?locale=en');
    expect(within(nav).getByRole('link', { name: 'PRIVACY' })).toHaveAttribute('href', '/privacy?locale=en');
    expect(within(nav).getByRole('link', { name: 'AI / API' })).toHaveAttribute('href', '/ai/api?locale=en');
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

  it('delegates legal links and safe-area spacing to the global footer', () => {
    const homeCss = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/home.css'), 'utf8');
    const shellCss = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/layout.css'), 'utf8');
    expect(homeCss).not.toContain('.synthoma-home__memory');
    expect(homeCss).not.toContain('.synthoma-home__legal');
    expect(shellCss).toMatch(/\.synthoma-global-footer\s*\{[^}]*display:\s*grid/);
  });

  it('prioritizes the descriptor and entry paths in short mobile and landscape viewports', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/home.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 767px\) and \(max-height: 700px\)[\s\S]*?home-first-contact__paths a\s*\{[^}]*min-height:\s*60px/);
    expect(css).toMatch(/@media \(min-width: 768px\) and \(max-height: 640px\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  });
});
