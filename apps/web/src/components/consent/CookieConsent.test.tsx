import { render, screen } from '@testing-library/react';
import CookieConsent from './CookieConsent';
import { LangProvider } from '../../lib/LangContext';

jest.mock('../../lib/consent', () => ({
  getConsent: () => null,
  saveConsent: jest.fn(),
}));

describe('CookieConsent locale', () => {
  it('renders the public consent surface in English', async () => {
    render(<LangProvider initialLang="en"><CookieConsent /></LangProvider>);
    expect(await screen.findByRole('dialog', { name: 'Memory traces consent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ACCEPT ALL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'NECESSARY ONLY' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CONFIGURE' })).toBeInTheDocument();
    expect(screen.queryByText('POVOLIT VŠECHNO')).not.toBeInTheDocument();
  });
});
