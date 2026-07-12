import { render, screen } from '@testing-library/react';
import Loading from '../../../../app/loading';
import NotFound from '../../../../app/not-found';

describe('Synthoma route states', () => {
  it('provides a themed accessible loading state', () => {
    render(<Loading />);
    expect(screen.getByRole('main', { name: 'Načítání SYNTHOMA OS' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('heading', { name: 'NAČÍTÁM STOPU' })).toBeInTheDocument();
  });

  it('keeps recovery navigation available on unknown routes', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: 'TADY NIC NEZŮSTALO' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ZPĚT DO UZLU' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'OTEVŘÍT KNIHOVNU' })).toHaveAttribute('href', '/books');
  });
});
