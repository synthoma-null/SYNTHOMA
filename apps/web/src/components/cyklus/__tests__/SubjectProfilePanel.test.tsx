import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { act, render, screen, waitFor } from '@testing-library/react';
import SubjectProfilePanelClient from '../../../../app/components/SubjectProfilePanelClient';

jest.mock('next/navigation', () => ({ usePathname: jest.fn(), useRouter: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
jest.mock('../../profile/ProfileDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="subject-dashboard">Dossier</div>,
}));
jest.mock('../../profile/LocalSubjectProfile', () => ({
  __esModule: true,
  default: () => <section data-profile-state="local-active"><h2>LOKÁLNÍ SUBJEKT</h2><span>SUBJECT // LOCAL</span></section>,
}));
jest.mock('../../../lib/LangContext', () => ({
  useLang: () => ({
    t: (key: string) => ({
      'id.default': 'SUBJEKT', 'id.aria.btn': 'Identita', 'id.login': 'Přihlásit', 'id.register': 'Registrovat',
      'profile.panel.aria': 'Profil subjektu', 'profile.panel.title': 'PROFIL SUBJEKTU', 'profile.panel.close': 'Zavřít profil subjektu',
    }[key] ?? key),
  }),
}));

const { usePathname, useRouter } = require('next/navigation');
const { useSession } = require('next-auth/react');

describe('SubjectProfilePanelClient', () => {
  const replace = jest.fn();

  beforeEach(() => {
    usePathname.mockReturnValue('/books');
    useRouter.mockReturnValue({ replace });
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    window.history.replaceState({}, '', '/books');
  });

  it('is the only Identity/Profile owner mounted by the root layout', () => {
    const layout = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');
    expect(layout.match(/<SubjectProfilePanelClient\s*\/>/g)).toHaveLength(1);
    expect(layout).not.toContain('<IdentityPanelClient');
    expect(layout).not.toContain('<ProfilePanelClient');
  });

  it('auto-opens the authenticated dossier after login and cleans the URL', async () => {
    window.history.replaceState({}, '', '/books?login=1');
    useSession.mockReturnValue({ data: { user: { id: 'user-1', name: 'Mira' } }, status: 'authenticated' });
    render(<SubjectProfilePanelClient />);

    expect(await screen.findByTestId('subject-dashboard')).toBeInTheDocument();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(replace).toHaveBeenCalledWith('/books');
  });

  it('auto-opens the local dossier from the direct profile route state', async () => {
    window.history.replaceState({}, '', '/books?profile=1');
    render(<SubjectProfilePanelClient />);
    expect(await screen.findByRole('heading', { name: 'LOKÁLNÍ SUBJEKT' })).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/books');
  });

  it('toggles the same dialog through the compatibility event', async () => {
    render(<SubjectProfilePanelClient />);

    act(() => document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')));
    expect(await screen.findByRole('heading', { name: 'LOKÁLNÍ SUBJEKT' })).toBeInTheDocument();
    expect(screen.queryByText(/401|VERIFIED/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('subject-dashboard')).not.toBeInTheDocument();

    act(() => document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('applies the selection lock only when opened from Cyklus gameplay', async () => {
    usePathname.mockReturnValue('/cyklus');
    render(<SubjectProfilePanelClient />);

    act(() => document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')));
    await screen.findByRole('heading', { name: 'LOKÁLNÍ SUBJEKT' });
    expect(document.querySelector('.id-panel-root')).toHaveClass('cyklus-no-select');
  });

  it('keeps profile scrolling inside the viewport-bounded content panel', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/profile.css'), 'utf8');

    expect(css).toMatch(/\.profile-panel-popup\s*\{[\s\S]*?height:\s*min\(880px, calc\(100dvh - 32px\)\)/);
    expect(css).toMatch(/\.profile-tabs\s*\{[\s\S]*?overflow-x:\s*auto[\s\S]*?overscroll-behavior-x:\s*contain/);
    expect(css).toMatch(/\.profile-content\s*\{[\s\S]*?min-height:\s*0[\s\S]*?overflow-y:\s*auto[\s\S]*?touch-action:\s*pan-y/);
    expect(css).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.profile-panel-popup\s*\{[\s\S]*?width:\s*100vw[\s\S]*?height:\s*100dvh/);
  });
});
