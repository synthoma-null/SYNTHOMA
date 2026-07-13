import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LangSwitcher from '../LangSwitcher';
import { LangProvider } from '../../lib/LangContext';

describe('LangSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'cs';
  });

  it('persists the selected settings locale and updates html lang', () => {
    render(<LangProvider><LangSwitcher /></LangProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('synthoma_lang')).toBe('en');
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('restores a stored locale without changing content identifiers', async () => {
    localStorage.setItem('synthoma_lang', 'en');
    render(<LangProvider><LangSwitcher /></LangProvider>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });
  });
});
