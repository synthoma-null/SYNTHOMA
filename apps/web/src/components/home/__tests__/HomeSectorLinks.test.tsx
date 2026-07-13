import { render, screen } from '@testing-library/react';
import HomeSectorLinks from '../HomeSectorLinks';

jest.mock('../../../game/cyklus/cyklusStorage', () => ({
  hasActiveCyklusRun: jest.fn(),
}));

import { hasActiveCyklusRun } from '../../../game/cyklus/cyklusStorage';

const mockedHasActiveCyklusRun = hasActiveCyklusRun as jest.MockedFunction<typeof hasActiveCyklusRun>;

describe('HomeSectorLinks', () => {
  beforeEach(() => {
    mockedHasActiveCyklusRun.mockReset();
  });

  it('renders all three sector links', () => {
    mockedHasActiveCyklusRun.mockReturnValue(false);
    render(<HomeSectorLinks />);
    expect(screen.getByRole('link', { name: /KNIHOVNA/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ARCHIV/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CYKLUS/ })).toBeInTheDocument();
  });

  it('marks Cyklus as featured and shows start CTA when no active run', () => {
    mockedHasActiveCyklusRun.mockReturnValue(false);
    render(<HomeSectorLinks />);
    const cyklus = screen.getByRole('link', { name: /CYKLUS/ });
    expect(cyklus).toHaveClass('home-sector-link--featured');
    expect(screen.getByText('Spusť nový diagnostický běh a podrob se analýze paměti.')).toBeInTheDocument();
    expect(screen.getByText('SPOUSTIT')).toBeInTheDocument();
  });

  it('shows continue CTA when an active Cyklus run exists', () => {
    mockedHasActiveCyklusRun.mockReturnValue(true);
    render(<HomeSectorLinks />);
    const cyklus = screen.getByRole('link', { name: /CYKLUS/ });
    expect(cyklus).toHaveClass('home-sector-link--featured');
    expect(screen.getByText('Diagnostický běh zůstal otevřený. Systém čeká na další volbu.')).toBeInTheDocument();
    expect(screen.getByText('POKRAČOVAT')).toBeInTheDocument();
  });
});
