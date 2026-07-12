import { fireEvent, render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import SynthomaShell from '../SynthomaShell';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
const { usePathname } = require('next/navigation');

describe('SynthomaShell', () => {
  beforeEach(() => usePathname.mockReturnValue('/books'));

  it('owns one set of global controls and marks the active route', () => {
    render(<SynthomaShell><p>CONTENT</p></SynthomaShell>);
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
    render(<SynthomaShell><p>CONTENT</p></SynthomaShell>);
    fireEvent.click(screen.getByRole('button', { name: 'Identita' }));
    fireEvent.click(screen.getByRole('button', { name: /Hudba/ }));
    expect(identity).toHaveBeenCalledTimes(1);
    expect(audio).toHaveBeenCalledTimes(1);
    document.removeEventListener('synthoma:identity-toggle', identity);
    document.removeEventListener('synthoma:audio-toggle', audio);
  });

  it('does not duplicate the specialized Cyklus shell', () => {
    usePathname.mockReturnValue('/cyklus');
    render(<SynthomaShell><p>CYKLUS CONTENT</p></SynthomaShell>);
    expect(screen.getByText('CYKLUS CONTENT')).toBeInTheDocument();
    expect(screen.queryByTestId('synthoma-command-header')).not.toBeInTheDocument();
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
