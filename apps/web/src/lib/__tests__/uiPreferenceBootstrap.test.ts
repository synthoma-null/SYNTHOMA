import { UI_PREFERENCE_BOOTSTRAP } from '../uiPreferenceBootstrap';

describe('UI preference bootstrap', () => {
  beforeEach(() => {
    localStorage.clear();
    (globalThis as typeof globalThis & { matchMedia: typeof window.matchMedia }).matchMedia = jest.fn().mockReturnValue({ matches: false });
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false } });
  });

  it('applies motion, theme and layout variables before hydration', () => {
    localStorage.setItem('synthoma_ui_preferences', JSON.stringify({
      version: 2, theme: 'mono', motionMode: 'off', backgroundMotion: 'auto', glitchEffects: true,
      noiseEffects: true, scanlines: true, textEffects: 'normal', fontScale: 1.2,
      readerOpacity: 0.72, glassEnabled: true, glassBlur: 18, focusMode: true,
    }));
    Function(UI_PREFERENCE_BOOTSTRAP)();
    const root = document.documentElement;
    expect(root).toHaveAttribute('data-theme', 'mono');
    expect(root).toHaveAttribute('data-motion', 'off');
    expect(root).toHaveAttribute('data-background-motion', 'off');
    expect(root).toHaveAttribute('data-glitch', 'off');
    expect(root.style.getPropertyValue('--font-size-multiplier')).toBe('1.2');
    expect(root.style.getPropertyValue('--glass-blur')).toBe('18px');
    expect(root).toHaveAttribute('data-reader-glass', 'on');
    expect(root).toHaveAttribute('data-reader-focus', 'on');
    expect(root.style.getPropertyValue('--reader-surface-opacity')).toBe('72%');
    expect(root.style.getPropertyValue('--reader-glass-blur')).toBe('18px');
  });

  it('resolves system motion and data saver without loading background motion', () => {
    (globalThis.matchMedia as jest.Mock).mockReturnValue({ matches: true });
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    Function(UI_PREFERENCE_BOOTSTRAP)();
    expect(document.documentElement).toHaveAttribute('data-motion', 'reduced');
    expect(document.documentElement).toHaveAttribute('data-background-motion', 'off');
  });
});
