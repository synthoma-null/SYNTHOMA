import { fireEvent, render, screen } from '@testing-library/react';
import ReaderCommandUtilities from '../ReaderCommandUtilities';

describe('ReaderCommandUtilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-reader-focus');
    document.body.innerHTML = '<main class="chapter-reader"><article id="chapter-reader-article">Text kapitoly.</article><button id="toggle-panel-btn">Global settings</button></main>';
    Object.defineProperty(global, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class { lang = ''; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(public text: string) {} },
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { speak: jest.fn(), cancel: jest.fn() },
    });
  });

  it('exposes settings, audio, TTS and focus as keyboard buttons', () => {
    const settings = jest.spyOn(document.getElementById('toggle-panel-btn')!, 'click');
    const audio = jest.fn();
    document.addEventListener('synthoma:audio-toggle', audio, { once: true });
    render(<ReaderCommandUtilities articleId="chapter-reader-article" locale="cs" />);

    fireEvent.click(screen.getByRole('button', { name: 'Nastavení' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hudba' }));
    fireEvent.click(screen.getByRole('button', { name: 'Přečíst kapitolu nahlas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Režim soustředění' }));

    expect(settings).toHaveBeenCalled();
    expect(audio).toHaveBeenCalled();
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
