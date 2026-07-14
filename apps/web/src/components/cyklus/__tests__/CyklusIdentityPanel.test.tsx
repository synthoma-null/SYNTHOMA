import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SubjectProfilePanelClient from '../../../../app/components/SubjectProfilePanelClient';
import SynthomaShell from '../../synthoma-os/SynthomaShell';
import { HeaderProvider } from '../../synthoma-os/HeaderContext';

jest.mock('next/navigation', () => ({ usePathname: jest.fn(), useRouter: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
jest.mock('../../profile/ProfileDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-dashboard">Profil subjektu</div>,
}));
jest.mock('../../../lib/LangContext', () => ({
  useLang: () => ({
    t: (key: string) => ({
      'id.default': 'SUBJEKT',
      'id.aria.btn': 'Identita',
      'id.login': 'Přihlásit',
      'id.register': 'Registrovat',
      'profile.panel.aria': 'Profil subjektu',
      'profile.panel.title': 'PROFIL SUBJEKTU',
      'profile.panel.close': 'Zavřít profil subjektu',
    }[key] ?? key),
  }),
}));

const { usePathname, useRouter } = require('next/navigation');
const { useSession } = require('next-auth/react');

describe('Cyklus identity ownership', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/cyklus');
    useRouter.mockReturnValue({ replace: jest.fn() });
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('keeps one command trigger and opens the full logged-out subject profile directly', async () => {
    render(
      <HeaderProvider>
        <SynthomaShell>
          <SubjectProfilePanelClient />
        </SynthomaShell>
      </HeaderProvider>,
    );

    expect(screen.getAllByRole('button', { name: 'Identita' })).toHaveLength(1);
    expect(document.querySelector('.id-panel-popup')).toBeNull();

    const identityTrigger = screen.getByRole('button', { name: 'Identita' });
    fireEvent.click(identityTrigger);

    expect(await screen.findByRole('dialog', { name: 'Profil subjektu' })).toBeVisible();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'LOKÁLNÍ SUBJEKT' })).toBeInTheDocument();
    expect(screen.getByText('SUBJECT // LOCAL')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'PŘIHLÁSIT SE' })).toBeInTheDocument();
    expect(identityTrigger).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Zavřít profil subjektu' })).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(identityTrigger).toHaveFocus());
    expect(identityTrigger).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps open-profile compatibility and closes for competing panels', async () => {
    useSession.mockReturnValue({
      data: { user: { id: 'user-1', name: 'Mira', email: 'mira@example.test' } },
      status: 'authenticated',
    });
    render(<SubjectProfilePanelClient />);

    act(() => document.dispatchEvent(new CustomEvent('synthoma:open-profile')));
    expect(await screen.findByTestId('profile-dashboard')).toBeInTheDocument();

    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-open')));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('uses an explicit backdrop and traps focus inside the auth gate', async () => {
    render(<SubjectProfilePanelClient />);
    act(() => document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')));

    const close = await screen.findByRole('button', { name: 'Zavřít profil subjektu' });
    const login = screen.getByRole('link', { name: 'PŘIHLÁSIT SE' });
    close.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(login).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Zavřít profil kliknutím mimo panel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('delegates global controls to the shared shell outside gameplay', () => {
    usePathname.mockReturnValue('/books');
    render(
      <HeaderProvider>
        <SynthomaShell><SubjectProfilePanelClient /></SynthomaShell>
      </HeaderProvider>,
    );

    expect(screen.getByRole('link', { name: 'SYNTHOMA, hlavní uzel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nastavení' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Identita' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-synthoma-command="identity"]')).toHaveLength(1);
  });
});
