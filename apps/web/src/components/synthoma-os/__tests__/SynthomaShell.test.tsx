import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import SynthomaShell from '../SynthomaShell';
import { HeaderProvider } from '../HeaderContext';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
const { usePathname } = require('next/navigation');

function renderWithHeader(ui: React.ReactElement) {
  return render(<HeaderProvider>{ui}</HeaderProvider>);
}

describe('SynthomaShell', () => {
  beforeEach(() => usePathname.mockReturnValue('/books'));

  it('owns one set of global controls and marks the active route', () => {
    renderWithHeader(<SynthomaShell><p>CONTENT</p></SynthomaShell>);
    expect(screen.getAllByRole('button', { name: 'Identita' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Nastavení' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /Hudba/ })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Hlavní sektory' }).querySelector('a[aria-current="page"]')).toHaveTextContent('KNIHOVNA');
    expect(document.querySelectorAll('#toggle-panel-btn')).toHaveLength(1);
    expect(document.querySelectorAll('#toggle-audio-panel-btn')).toHaveLength(1);
  });

  it('uses the existing panel events', () => {
    const identity = jest.fn();
    const audio = jest.fn();
    document.addEventListener('synthoma:identity-toggle', identity);
    document.addEventListener('synthoma:audio-toggle', audio);
    renderWithHeader(<SynthomaShell><p>CONTENT</p></SynthomaShell>);
    fireEvent.click(screen.getByRole('button', { name: 'Identita' }));
    fireEvent.click(screen.getByRole('button', { name: /Hudba/ }));
    expect(identity).toHaveBeenCalledTimes(1);
    expect(audio).toHaveBeenCalledTimes(1);
    document.removeEventListener('synthoma:identity-toggle', identity);
    document.removeEventListener('synthoma:audio-toggle', audio);
  });

  it('does not duplicate the specialized Cyklus shell', () => {
    usePathname.mockReturnValue('/cyklus');
    renderWithHeader(<SynthomaShell><p>CYKLUS CONTENT</p></SynthomaShell>);
    expect(screen.getByText('CYKLUS CONTENT')).toBeInTheDocument();
    expect(screen.getByTestId('synthoma-command-header')).toBeInTheDocument();
  });

  it.each([
    { route: '/', variant: 'full' },
    { route: '/books', variant: 'full' },
    { route: '/archive', variant: 'full' },
    { route: '/login', variant: 'full' },
    { route: '/register', variant: 'full' },
    { route: '/privacy', variant: 'full' },
    { route: '/terms', variant: 'full' },
    { route: '/admin', variant: 'utility' },
    { route: '/game', variant: 'utility' },
    { route: '/reader', variant: 'quiet' },
    { route: '/chapter/0-0-null', variant: 'quiet' },
  ])('renders correct shell variant for $route ($variant)', ({ route, variant }) => {
    usePathname.mockReturnValue(route);
    const { container } = renderWithHeader(<SynthomaShell><p>CONTENT</p></SynthomaShell>);
    const shell = container.firstChild as HTMLElement;
    if (variant === 'quiet') {
      expect(shell).toHaveClass('synthoma-shell--quiet');
      expect(screen.queryByRole('navigation', { name: 'Hlavní sektory' })).not.toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: 'Mobilní sektory' })).not.toBeInTheDocument();
    } else if (variant === 'utility') {
      expect(shell).toHaveClass('synthoma-shell--utility');
      expect(screen.queryByRole('navigation', { name: 'Mobilní sektory' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Identita' })).toBeInTheDocument();
    } else {
      expect(shell).not.toHaveClass('synthoma-shell--quiet');
      expect(screen.getByRole('navigation', { name: 'Hlavní sektory' })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Mobilní sektory' })).toBeInTheDocument();
    }
  });

  it('hides the global shell for the intro sequence and Cyklus', () => {
    usePathname.mockReturnValue('/landing-intro');
    const { container: introContainer } = renderWithHeader(<SynthomaShell><p>INTRO</p></SynthomaShell>);
    expect(introContainer.firstChild).toHaveTextContent('INTRO');
    expect(screen.queryByTestId('synthoma-command-header')).not.toBeInTheDocument();

    usePathname.mockReturnValue('/cyklus/void');
    const { container: cyklusContainer } = renderWithHeader(<SynthomaShell><p>CYKLUS</p></SynthomaShell>);
    expect(cyklusContainer.firstChild).toHaveTextContent('CYKLUS');
    expect(screen.getByTestId('synthoma-command-header')).toBeInTheDocument();
  });

  it('keeps mobile controls bounded and reserves safe-area content space', () => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/layout.css'), 'utf8');
    const responsive = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/responsive.css'), 'utf8');
    expect(layout).toMatch(/grid-auto-columns:\s*var\(--os-tap\)/);
    expect(layout).toMatch(/white-space:\s*nowrap/);
    expect(responsive).toMatch(/padding-bottom:\s*calc\(var\(--os-mobile-nav-height\) \+ env\(safe-area-inset-bottom\)\)/);
    expect(responsive).toMatch(/grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  });
});
