import { readUiPreferences, setMovingBackground } from '../uiPreferences';

describe('versioned UI preferences', () => {
  beforeEach(() => localStorage.clear());

  it('persists the moving background choice in the shared versioned record', () => {
    expect(readUiPreferences().movingBackground).toBe(true);
    setMovingBackground(false);
    expect(JSON.parse(localStorage.getItem('synthoma_ui_preferences') ?? '{}')).toEqual({
      version: 1,
      movingBackground: false,
    });
    expect(readUiPreferences().movingBackground).toBe(false);
  });
});
