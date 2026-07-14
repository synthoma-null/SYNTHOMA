import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LangSwitcher from '../../LangSwitcher';
import { LangProvider } from '../../../lib/LangContext';
import HomeSectorLinks from '../HomeSectorLinks';

jest.mock('../../../game/cyklus/cyklusStorage', () => ({
  hasActiveCyklusRun: jest.fn(),
}));

import { hasActiveCyklusRun } from '../../../game/cyklus/cyklusStorage';

const mockedHasActiveCyklusRun = hasActiveCyklusRun as jest.MockedFunction<typeof hasActiveCyklusRun>;

describe('HomeSectorLinks', () => {
  beforeEach(() => {
    mockedHasActiveCyklusRun.mockReset();
    localStorage.removeItem('synthoma_lang');
  });

  it('renders the three main sectors and the canonical Author entry', () => {
    mockedHasActiveCyklusRun.mockReturnValue(false);
    render(<HomeSectorLinks />);
    expect(screen.getByRole('link', { name: /KNIHOVNA/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ARCHIV/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CYKLUS/ })).toBeInTheDocument();
    const author = screen.getByRole('link', { name: /AUTOR/ });
    expect(author).toHaveAttribute('href', '/autor');
    expect(author).toHaveTextContent('Záznam o člověku, který systém spustil.');
    author.focus();
    expect(author).toHaveFocus();
  });

  it('updates Author copy through the existing locale provider without changing its route', async () => {
    mockedHasActiveCyklusRun.mockReturnValue(false);
    render(<LangProvider><LangSwitcher /><HomeSectorLinks /></LangProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    const author = await screen.findByRole('link', { name: /AUTHOR/ });
    await waitFor(() => expect(author).toHaveTextContent('A record of the human who started the system.'));
    expect(author).toHaveAttribute('href', '/autor');
    expect(screen.getAllByText('OPEN')).toHaveLength(2);
    expect(screen.getByText('READ')).toBeInTheDocument();
  });

  it('uses Czech navigation actions in the Czech locale', () => {
    mockedHasActiveCyklusRun.mockReturnValue(false);
    render(<LangProvider><HomeSectorLinks /></LangProvider>);
    expect(screen.queryByText('OPEN')).not.toBeInTheDocument();
    expect(screen.queryByText('READ')).not.toBeInTheDocument();
    expect(screen.getAllByText('OTEVŘÍT')).toHaveLength(2);
    expect(screen.getByText('ČÍST')).toBeInTheDocument();
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
