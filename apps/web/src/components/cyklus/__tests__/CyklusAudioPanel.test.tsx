import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import SynthomaAudioPanel from '../../../../app/components/SynthomaAudioPanel';

jest.mock('next/navigation', () => ({ usePathname: jest.fn(() => '/cyklus') }));

describe('SynthomaAudioPanel', () => {
  let playSpy: jest.SpyInstance;
  let pauseSpy: jest.SpyInstance;
  let loadSpy: jest.SpyInstance;
  let scrollIntoViewSpy: jest.Mock;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="toggle-audio-panel-btn" aria-expanded="false" aria-pressed="false">Hudba</button>
      <div id="control-panel"></div>
    `;
    playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      Object.defineProperty(this, 'paused', { configurable: true, value: false });
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    });
    pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      Object.defineProperty(this, 'paused', { configurable: true, value: true });
      this.dispatchEvent(new Event('pause'));
    });
    loadSpy = jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    scrollIntoViewSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewSpy;
  });

  afterEach(() => {
    playSpy.mockRestore();
    pauseSpy.mockRestore();
    loadSpy.mockRestore();
    delete window.__synthomaAudio;
  });

  it('opens outside the control panel and returns focus after Escape', async () => {
    render(<SynthomaAudioPanel />);
    const trigger = document.getElementById('toggle-audio-panel-btn') as HTMLButtonElement;

    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')));

    const dialog = await screen.findByRole('dialog', { name: /SYNTHOMA 11/ });
    expect(dialog).toBeVisible();
    expect(document.getElementById('synthoma-audio-panel')).toHaveClass('cyklus-no-select');
    expect(trigger).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('#control-panel #synthoma-audio-panel')).toBeNull();
    expect(within(dialog).getByRole('button', { name: 'Zavřít hudební přehrávač' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses one shared audio element for play, next, mute and real progress', async () => {
    render(<SynthomaAudioPanel />);
    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')));
    const sharedAudio = document.getElementById('synthoma-shared-audio') as HTMLAudioElement;

    expect(sharedAudio).toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(1);

    fireEvent.click(await screen.findByRole('button', { name: 'Přehrát hudbu' }));
    expect(playSpy).toHaveBeenCalled();
    expect(sharedAudio.currentSrc || sharedAudio.querySelector('source')?.src).toContain('/audio/SynthBachmoff.mp3');
    expect(document.getElementById('toggle-audio-panel-btn')).toHaveAttribute('data-audio-state', 'playing');

    fireEvent.click(screen.getByRole('button', { name: 'Další skladba' }));
    expect(sharedAudio.src).toContain('/audio/SYNTHOMA1.mp3');

    fireEvent.click(screen.getByRole('button', { name: 'Ztlumit hudbu' }));
    act(() => sharedAudio.dispatchEvent(new Event('volumechange')));
    expect(sharedAudio.muted).toBe(true);
    expect(document.getElementById('toggle-audio-panel-btn')).toHaveAttribute('data-audio-state', 'muted');

    Object.defineProperty(sharedAudio, 'duration', { configurable: true, value: 339 });
    Object.defineProperty(sharedAudio, 'currentTime', { configurable: true, writable: true, value: 137 });
    act(() => {
      sharedAudio.dispatchEvent(new Event('loadedmetadata'));
      sharedAudio.dispatchEvent(new Event('timeupdate'));
    });
    expect(await screen.findByText('2:17')).toBeInTheDocument();
    expect(screen.getByText('5:39')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Pozice skladby' })).toHaveAttribute('aria-valuetext', '2:17 z 5:39');
  });

  it('keeps the existing global playback bridge on the same element', () => {
    render(<SynthomaAudioPanel />);
    const sharedAudio = document.getElementById('synthoma-shared-audio');

    act(() => window.audioPanelPlay?.('/audio/Run.mp3'));

    expect(document.querySelectorAll('audio')).toHaveLength(1);
    expect(window.__synthomaAudio).toBe(sharedAudio);
    expect((sharedAudio as HTMLAudioElement).src).toContain('/audio/Run.mp3');
  });

  it('renders the full ordered library and selects a track on the shared player', async () => {
    render(<SynthomaAudioPanel />);
    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')));

    const library = await screen.findByRole('heading', { name: 'KNIHOVNA STOP // 13' });
    const list = library.nextElementSibling as HTMLOListElement;
    const trackButtons = within(list).getAllByRole('button');

    expect(trackButtons).toHaveLength(13);
    expect(trackButtons[0]).toHaveAccessibleName('Přehrát skladbu Comet, ambient');
    expect(trackButtons[12]).toHaveAccessibleName('Přehrát skladbu Nuova, run');
    expect(within(trackButtons[0]!).getByText('ambient')).toBeInTheDocument();

    fireEvent.click(within(list).getByRole('button', { name: 'Přehrát skladbu Run, action' }));
    const sharedAudio = document.getElementById('synthoma-shared-audio') as HTMLAudioElement;
    expect(sharedAudio.src).toContain('/audio/Run.mp3');
    expect(within(list).getByRole('button', { name: 'Aktivní skladba Run, přehrává se' })).toHaveAttribute('aria-current', 'true');
    expect(document.querySelectorAll('audio')).toHaveLength(1);
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('keeps previous, next and ended navigation in sync with the active library row', async () => {
    render(<SynthomaAudioPanel />);
    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')));
    const list = (await screen.findByRole('heading', { name: 'KNIHOVNA STOP // 13' })).nextElementSibling as HTMLOListElement;
    const sharedAudio = document.getElementById('synthoma-shared-audio') as HTMLAudioElement;

    fireEvent.click(within(list).getByRole('button', { name: 'Přehrát skladbu Run, action' }));
    fireEvent.click(screen.getByRole('button', { name: 'Další skladba' }));
    expect(within(list).getByRole('button', { name: 'Aktivní skladba Searching, přehrává se' })).toHaveAttribute('aria-current', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Předchozí skladba' }));
    expect(within(list).getByRole('button', { name: 'Aktivní skladba Run, přehrává se' })).toHaveAttribute('aria-current', 'true');

    act(() => sharedAudio.dispatchEvent(new Event('ended')));
    expect(await within(list).findByRole('button', { name: 'Aktivní skladba Searching, přehrává se' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows an external source without adding it to the playlist library', async () => {
    render(<SynthomaAudioPanel />);
    act(() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')));
    const list = (await screen.findByRole('heading', { name: 'KNIHOVNA STOP // 13' })).nextElementSibling as HTMLOListElement;

    act(() => window.audioPanelPlay?.('/audio/ExternalSignal.mp3'));

    expect(await screen.findByText('ExternalSignal')).toBeInTheDocument();
    expect(within(list).getAllByRole('button')).toHaveLength(13);
    expect(within(list).queryByText('ExternalSignal')).not.toBeInTheDocument();
    expect(within(list).queryByRole('button', { current: true })).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(1);
  });
});
