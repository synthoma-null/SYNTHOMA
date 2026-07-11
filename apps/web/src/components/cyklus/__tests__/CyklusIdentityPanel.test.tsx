import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import IdentityPanelClient from '../../../../app/components/IdentityPanelClient';
import CyklusGameHeader from '../CyklusGameHeader';
import { createCyklusRun } from '../../../game/cyklus/cyklusEngine';

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn(), signOut: jest.fn() }));
jest.mock('../../../lib/LangContext', () => ({
  useLang: () => ({
    t: (key: string) => ({
      'id.default': 'SUBJEKT',
      'id.aria.btn': 'Identita',
      'id.aria.panel': 'Panel identity',
      'id.log.unrecognised': 'Subjekt nerozpoznán',
      'id.login': 'Přihlásit',
      'id.register': 'Registrovat',
    }[key] ?? key),
  }),
}));

const { usePathname } = require('next/navigation');
const { useSession } = require('next-auth/react');

describe('Cyklus identity ownership', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/cyklus');
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('keeps one command trigger while opening the existing identity panel', async () => {
    const state = createCyklusRun(true);
    render(
      <>
        <CyklusGameHeader state={state} showTutorialSkip={false} onTutorialSkip={jest.fn()} />
        <IdentityPanelClient />
      </>,
    );

    expect(screen.getAllByRole('link', { name: 'Domů' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Identita' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Ovládací panel' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /Hudba/ })).toHaveLength(1);
    expect(document.querySelector('.id-panel-btn')).toBeNull();
    expect(document.querySelectorAll('#toggle-panel-btn')).toHaveLength(1);

    const identityTrigger = screen.getByRole('button', { name: 'Identita' });
    fireEvent.click(identityTrigger);
    expect(await screen.findByRole('region', { name: 'Panel identity' })).toHaveAttribute('aria-hidden', 'false');
    expect(identityTrigger).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(screen.getByRole('link', { name: 'Přihlásit' })).toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: 'Ovládací panel' }));
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Panel identity' })).not.toBeInTheDocument());

    fireEvent.click(identityTrigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(identityTrigger).toHaveFocus());
  });

  it('preserves global controls outside the Cyklus gameplay route', () => {
    usePathname.mockReturnValue('/books');
    render(<IdentityPanelClient />);

    expect(screen.getByRole('link', { name: 'Zpět na hlavní stránku' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ovládací panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Identita' })).toBeInTheDocument();
  });
});
