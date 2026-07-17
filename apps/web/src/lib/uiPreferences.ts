const UI_PREFERENCES_KEY = 'synthoma_ui_preferences';
const UI_PREFERENCES_VERSION = 1;

export interface SynthomaUiPreferences {
  version: typeof UI_PREFERENCES_VERSION;
  movingBackground: boolean;
}

const DEFAULTS: SynthomaUiPreferences = {
  version: UI_PREFERENCES_VERSION,
  movingBackground: true,
};

export function readUiPreferences(): SynthomaUiPreferences {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(UI_PREFERENCES_KEY) ?? '{}') as Partial<SynthomaUiPreferences>;
    if (parsed.version !== UI_PREFERENCES_VERSION) return DEFAULTS;
    return { ...DEFAULTS, movingBackground: parsed.movingBackground !== false };
  } catch {
    return DEFAULTS;
  }
}

export function setMovingBackground(enabled: boolean): SynthomaUiPreferences {
  const preferences = { ...readUiPreferences(), movingBackground: enabled };
  window.localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(preferences));
  document.dispatchEvent(new CustomEvent('synthoma:ui-preferences-changed', { detail: preferences }));
  return preferences;
}
