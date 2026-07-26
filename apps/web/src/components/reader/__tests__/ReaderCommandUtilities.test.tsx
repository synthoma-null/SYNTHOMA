import { fireEvent, render, screen } from '@testing-library/react';
import ReaderCommandUtilities from '../ReaderCommandUtilities';

describe('ReaderCommandUtilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-reader-focus');
    document.body.innerHTML = '<main class="chapter-reader"><article id="chapter-reader-article">Text kapitoly.</article></main>';
    Object.defineProperty(global, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class { lang = ''; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(public text: string) {} },
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { speak: jest.fn(), cancel: jest.fn() },
    });
  });

  it('leaves global settings and audio to the shell and exposes contextual reader tools', () => {
    render(<ReaderCommandUtilities articleId="chapter-reader-article" locale="cs" />);

    expect(screen.queryByRole('button', { name: 'Nastavení' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Hudba' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Přečíst kapitolu nahlas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Režim soustředění' }));

    expect(window.speechSynthesis.speak).toHaveBeenCalledWith(expect.objectContaining({ text: 'Text kapitoly.' }));
    expect(document.querySelector('.chapter-reader')).toHaveClass('chapter-reader--focus');
    expect(document.documentElement).toHaveAttribute('data-reader-focus', 'on');
    expect(screen.getByRole('button', { name: 'Ukončit režim soustředění' })).toHaveTextContent('UKONČIT SOUSTŘEDĚNÍ');
  });

  it('leaves focus with Escape and keeps the explicit exit control available', () => {
    render(<ReaderCommandUtilities articleId="chapter-reader-article" locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Focus mode' }));
    expect(screen.getByRole('button', { name: 'Exit focus mode' })).toHaveAttribute('data-reader-tool', 'focus');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.querySelector('.chapter-reader')).not.toHaveClass('chapter-reader--focus');
    expect(document.documentElement).toHaveAttribute('data-reader-focus', 'off');
  });
});
