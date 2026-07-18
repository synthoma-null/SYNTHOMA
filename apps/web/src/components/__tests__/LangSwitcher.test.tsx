import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import LangSwitcher from '../LangSwitcher';
import { LangProvider } from '../../lib/LangContext';

const replace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

describe('LangSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'cs';
    window.history.replaceState({}, '', '/chapter/0-0-null');
    replace.mockClear();
  });

  it('persists the selected settings locale and updates html lang', () => {
    render(<LangProvider><LangSwitcher /></LangProvider>);

    expect(screen.getByRole('button', { name: 'Čeština' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('lang', 'cs');
    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('synthoma_lang')).toBe('en');
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(replace).toHaveBeenCalledWith('/chapter/0-0-null?locale=en', { scroll: true });
  });

  it('is mounted in Settings rather than the command header', () => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
    const controlCenter = fs.readFileSync(path.join(process.cwd(), 'app/components/ControlCenterClient.tsx'), 'utf8');
    const header = fs.readFileSync(path.join(process.cwd(), 'src/components/synthoma-os/SynthomaCommandHeader.tsx'), 'utf8');

    expect(layout).toContain('<ControlCenterClient />');
    expect(controlCenter).toContain('<LangSwitcher />');
    expect(controlCenter).toContain("language: 'Jazyk'");
    expect(header).not.toContain('LangSwitcher');
  });

  it('hydrates the server-resolved locale without changing content identifiers', async () => {
    render(<LangProvider initialLang="en"><LangSwitcher /></LangProvider>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });
  });
});
