import {
  DEFAULT_UI_PREFERENCES,
  applyUiPreferencePreset,
  getEffectiveMotionMode,
  getMatchingUiPreferencePreset,
  applyUiPreferencesToDocument,
  readUiPreferences,
  setMovingBackground,
  updateUiPreferences,
} from '../uiPreferences';

describe('versioned UI preferences', () => {
  beforeEach(() => localStorage.clear());

  it('migrates legacy keys once into the versioned record', () => {
    localStorage.setItem('animationsDisabled', 'true');
    localStorage.setItem('fontSizeMultiplier', '1.2');
    localStorage.setItem('readerBgOpacity', '0.7');
    localStorage.setItem('glassMode', 'true');
    localStorage.setItem('glassBlur', '18');

    expect(readUiPreferences()).toMatchObject({ version: 4, motionMode: 'off', fontScale: 1.2, readerOpacity: 0.7 });
    expect(readUiPreferences()).not.toHaveProperty('glassEnabled');
    expect(localStorage.getItem('glassMode')).toBeNull();
    expect(localStorage.getItem('glassBlur')).toBeNull();
    const migrated = localStorage.getItem('synthoma_ui_preferences');
    readUiPreferences();
    expect(localStorage.getItem('synthoma_ui_preferences')).toBe(migrated);
  });

  it('repairs invalid values and clamps numeric preferences', () => {
    localStorage.setItem('synthoma_ui_preferences', JSON.stringify({ version: 4, motionMode: 'shake', fontScale: 9, readerOpacity: -4, glassBlur: 100, audioVolume: -1 }));
    expect(readUiPreferences()).toMatchObject({ motionMode: 'system', fontScale: 1.4, readerOpacity: 0.4, audioVolume: 0 });
    expect(readUiPreferences()).not.toHaveProperty('glassBlur');
  });

  it('applies the solid Reader surface contract and removes legacy glass state', () => {
    document.documentElement.dataset.readerGlass = 'on';
    document.documentElement.style.setProperty('--reader-glass-blur', '24px');
    document.body.classList.add('glass-mode');
    const preferences = updateUiPreferences({ readerOpacity: 0.8 });
    applyUiPreferencesToDocument(preferences);
    expect(document.documentElement).not.toHaveAttribute('data-reader-glass');
    expect(document.documentElement.style.getPropertyValue('--reader-surface-opacity')).toBe('80%');
    expect(document.documentElement.style.getPropertyValue('--reader-glass-blur')).toBe('');
    expect(document.body).not.toHaveClass('glass-mode');
  });

  it('persists Reader width, line spacing and effect intensity', () => {
    const preferences = updateUiPreferences({ readerWidth: 'wide', readerLineHeight: 'airy', effectIntensity: 0.4 });
    expect(preferences).toMatchObject({ readerWidth: 'wide', readerLineHeight: 'airy', effectIntensity: 0.4 });
    expect(document.documentElement).toHaveAttribute('data-reader-width', 'wide');
    expect(document.documentElement).toHaveAttribute('data-reader-line-height', 'airy');
    expect(document.documentElement.style.getPropertyValue('--reader-effect-intensity')).toBe('0.4');
  });

  it('exposes focus mode as a root presentation state', () => {
    applyUiPreferencesToDocument(updateUiPreferences({ focusMode: true }));
    expect(document.documentElement).toHaveAttribute('data-reader-focus', 'on');
    applyUiPreferencesToDocument(updateUiPreferences({ focusMode: false }));
    expect(document.documentElement).toHaveAttribute('data-reader-focus', 'off');
  });

  it('persists moving background and derives exact motion modes', () => {
    setMovingBackground(false);
    expect(readUiPreferences().backgroundMotion).toBe('off');
    expect(getEffectiveMotionMode(updateUiPreferences({ motionMode: 'system' }), true)).toBe('reduced');
    expect(getEffectiveMotionMode(updateUiPreferences({ motionMode: 'full' }), true)).toBe('full');
    expect(getEffectiveMotionMode(updateUiPreferences({ motionMode: 'off' }), false)).toBe('off');
  });

  it('applies presets atomically and reports manual changes as custom', () => {
    updateUiPreferences({ ...DEFAULT_UI_PREFERENCES });
    expect(getMatchingUiPreferencePreset(readUiPreferences())).toBe('canon');
    applyUiPreferencePreset('saver');
    expect(readUiPreferences()).toMatchObject({ motionMode: 'off', backgroundMotion: 'off', audioEnabled: false });
    expect(getMatchingUiPreferencePreset(readUiPreferences())).toBe('saver');
    updateUiPreferences({ fontScale: 1.1 });
    expect(getMatchingUiPreferencePreset(readUiPreferences())).toBe('saver');
    updateUiPreferences({ noiseEffects: true });
    expect(getMatchingUiPreferencePreset(readUiPreferences())).toBeNull();
  });

  it('does not bind audio to an ordinary motion-off update', () => {
    updateUiPreferences({ audioEnabled: true, audioVolume: 0.45, motionMode: 'off' });
    expect(readUiPreferences()).toMatchObject({ audioEnabled: true, audioVolume: 0.45, motionMode: 'off' });
  });
});
