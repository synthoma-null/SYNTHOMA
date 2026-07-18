import { render, screen } from '@testing-library/react';
import SynthomaSkipLink from '../SynthomaSkipLink';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
const { usePathname } = require('next/navigation');

describe('SynthomaSkipLink', () => {
  it('targets the fullscreen game root on the Cyklus gameplay route', () => {
    usePathname.mockReturnValue('/cyklus');
    render(<SynthomaSkipLink label="Přeskočit na obsah" />);
    expect(screen.getByRole('link', { name: 'Přeskočit na obsah' })).toHaveAttribute('href', '#cyklus-game');
  });

  it('keeps the shared content target on other routes and in English', () => {
    usePathname.mockReturnValue('/books');
    render(<SynthomaSkipLink label="Skip to content" />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
  });
});
