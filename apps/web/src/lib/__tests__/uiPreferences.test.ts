import { readUiPreferences, setMovingBackground } from '../uiPreferences';

describe('versioned UI preferences', () => {
  beforeEach(() => localStorage.clear());

  it('persists the moving background choice in the shared versioned record', () => {
    expect(readUiPreferences().backgroundMotion).toBe('auto');
    setMovingBackground(false);
    expect(JSON.parse(localStorage.getItem('synthoma_ui_preferences') ?? '{}')).toMatchObject({
      version: 2,
      backgroundMotion: 'off',
    });
    expect(readUiPreferences().backgroundMotion).toBe('off');
  });
});
