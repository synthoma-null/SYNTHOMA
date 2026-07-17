export const UI_PREFERENCES_KEY = 'synthoma_ui_preferences';
export const UI_PREFERENCES_VERSION = 2 as const;
export const UI_PREFERENCES_CHANGED_EVENT = 'synthoma:ui-preferences-changed';

export type MotionMode = 'system' | 'full' | 'reduced' | 'off';
export type EffectiveMotionMode = Exclude<MotionMode, 'system'>;
export type BackgroundMotion = 'auto' | 'on' | 'off';
export type TextEffectsMode = 'normal' | 'reduced' | 'off';
export type TypewriterSpeed = 'slow' | 'normal' | 'fast' | 'instant';

export interface SynthomaUiPreferences {
  version: typeof UI_PREFERENCES_VERSION;
  theme: string;
  motionMode: MotionMode;
  backgroundMotion: BackgroundMotion;
  glitchEffects: boolean;
  noiseEffects: boolean;
  scanlines: boolean;
  textEffects: TextEffectsMode;
  typewriterSpeed: TypewriterSpeed;
  fontScale: number;
  readerOpacity: number;
  glassEnabled: boolean;
  glassBlur: number;
  audioEnabled: boolean;
  audioVolume: number;
  focusMode: boolean;
  ttsEnabled: boolean;
}

export type UiPreferencePresetId = 'canon' | 'focus' | 'saver' | 'calm';

export interface UiPreferencePreset {
  id: UiPreferencePresetId;
  patch: Partial<Omit<SynthomaUiPreferences, 'version'>>;
}

export const DEFAULT_UI_PREFERENCES: Readonly<SynthomaUiPreferences> = Object.freeze({
  version: UI_PREFERENCES_VERSION,
  theme: 'synthoma',
  motionMode: 'system',
  backgroundMotion: 'auto',
  glitchEffects: true,
  noiseEffects: true,
  scanlines: true,
  textEffects: 'normal',
  typewriterSpeed: 'normal',
  fontScale: 1,
  readerOpacity: 0.85,
  glassEnabled: false,
  glassBlur: 12,
  audioEnabled: true,
  audioVolume: 0.7,
  focusMode: false,
  ttsEnabled: false,
});

export const UI_PREFERENCE_PRESETS: readonly UiPreferencePreset[] = [
  { id: 'canon', patch: { theme: 'synthoma', motionMode: 'system', backgroundMotion: 'auto', glitchEffects: true, noiseEffects: true, scanlines: true, textEffects: 'normal', typewriterSpeed: 'normal', glassEnabled: false, readerOpacity: 0.85, focusMode: false } },
  { id: 'focus', patch: { backgroundMotion: 'off', glitchEffects: false, noiseEffects: false, textEffects: 'reduced', typewriterSpeed: 'instant', glassEnabled: false, readerOpacity: 0.95, focusMode: true, audioEnabled: false } },
  { id: 'saver', patch: { motionMode: 'off', backgroundMotion: 'off', glitchEffects: false, noiseEffects: false, scanlines: false, textEffects: 'off', typewriterSpeed: 'instant', audioEnabled: false } },
  { id: 'calm', patch: { motionMode: 'reduced', backgroundMotion: 'off', glitchEffects: false, noiseEffects: false, scanlines: false, textEffects: 'reduced', typewriterSpeed: 'instant', readerOpacity: 0.95 } },
] as const;

export function getMatchingUiPreferencePreset(preferences: SynthomaUiPreferences): UiPreferencePresetId | null {
  const match = UI_PREFERENCE_PRESETS.find((preset) => Object.entries(preset.patch).every(([key, value]) => preferences[key as keyof SynthomaUiPreferences] === value));
  return match?.id ?? null;
}

export function applyUiPreferencePreset(id: UiPreferencePresetId): SynthomaUiPreferences {
  const preset = UI_PREFERENCE_PRESETS.find((candidate) => candidate.id === id);
  return preset ? updateUiPreferences(preset.patch) : readUiPreferences();
}

const THEMES = new Set([
  'synthoma',
  'green-matrix',
  'neon-hellfire',
  'cyber-dystopia',
  'acid-glitch',
  'retro-arcade',
  'mono',
  'mono-light',
]);
const MOTION_MODES = new Set<MotionMode>(['system', 'full', 'reduced', 'off']);
const BACKGROUND_MODES = new Set<BackgroundMotion>(['auto', 'on', 'off']);
const TEXT_EFFECT_MODES = new Set<TextEffectsMode>(['normal', 'reduced', 'off']);
const TYPEWRITER_SPEEDS = new Set<TypewriterSpeed>(['slow', 'normal', 'fast', 'instant']);

type Listener = () => void;
const listeners = new Set<Listener>();
let memorySnapshot: SynthomaUiPreferences = { ...DEFAULT_UI_PREFERENCES };
let memorySerialized = JSON.stringify(memorySnapshot);

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function enumValue<T extends string>(value: unknown, values: Set<T>, fallback: T): T {
  return typeof value === 'string' && values.has(value as T) ? value as T : fallback;
}

export function validateUiPreferences(value: unknown): SynthomaUiPreferences {
  const source = isRecord(value) ? value : {};
  return {
    version: UI_PREFERENCES_VERSION,
    theme: typeof source.theme === 'string' && THEMES.has(source.theme) ? source.theme : DEFAULT_UI_PREFERENCES.theme,
    motionMode: enumValue(source.motionMode, MOTION_MODES, DEFAULT_UI_PREFERENCES.motionMode),
    backgroundMotion: enumValue(source.backgroundMotion, BACKGROUND_MODES, DEFAULT_UI_PREFERENCES.backgroundMotion),
    glitchEffects: booleanValue(source.glitchEffects, DEFAULT_UI_PREFERENCES.glitchEffects),
    noiseEffects: booleanValue(source.noiseEffects, DEFAULT_UI_PREFERENCES.noiseEffects),
    scanlines: booleanValue(source.scanlines, DEFAULT_UI_PREFERENCES.scanlines),
    textEffects: enumValue(source.textEffects, TEXT_EFFECT_MODES, DEFAULT_UI_PREFERENCES.textEffects),
    typewriterSpeed: enumValue(source.typewriterSpeed, TYPEWRITER_SPEEDS, DEFAULT_UI_PREFERENCES.typewriterSpeed),
    fontScale: clamp(source.fontScale, 0.8, 1.4, DEFAULT_UI_PREFERENCES.fontScale),
    readerOpacity: clamp(source.readerOpacity, 0, 1, DEFAULT_UI_PREFERENCES.readerOpacity),
    glassEnabled: booleanValue(source.glassEnabled, DEFAULT_UI_PREFERENCES.glassEnabled),
    glassBlur: clamp(source.glassBlur, 0, 24, DEFAULT_UI_PREFERENCES.glassBlur),
    audioEnabled: booleanValue(source.audioEnabled, DEFAULT_UI_PREFERENCES.audioEnabled),
    audioVolume: clamp(source.audioVolume, 0, 1, DEFAULT_UI_PREFERENCES.audioVolume),
    focusMode: booleanValue(source.focusMode, DEFAULT_UI_PREFERENCES.focusMode),
    ttsEnabled: booleanValue(source.ttsEnabled, DEFAULT_UI_PREFERENCES.ttsEnabled),
  };
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function readLegacyBoolean(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    if (value === 'true') return true;
    if (value === 'false') return false;
  } catch {}
  return fallback;
}

function readLegacyNumber(key: string, fallback: number): number {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : Number(value);
  } catch {
    return fallback;
  }
}

function migrateLegacyPreferences(stored: unknown): SynthomaUiPreferences {
  const v1 = isRecord(stored) && stored.version === 1 ? stored : {};
  let theme = DEFAULT_UI_PREFERENCES.theme;
  try {
    theme = window.localStorage.getItem('theme') ?? theme;
  } catch {}
  return validateUiPreferences({
    ...DEFAULT_UI_PREFERENCES,
    theme,
    motionMode: readLegacyBoolean('animationsDisabled', false) ? 'off' : 'system',
    backgroundMotion: v1.movingBackground === false ? 'off' : 'auto',
    fontScale: readLegacyNumber('fontSizeMultiplier', DEFAULT_UI_PREFERENCES.fontScale),
    readerOpacity: readLegacyNumber('readerBgOpacity', DEFAULT_UI_PREFERENCES.readerOpacity),
    glassEnabled: readLegacyBoolean('glassMode', DEFAULT_UI_PREFERENCES.glassEnabled),
    glassBlur: readLegacyNumber('glassBlur', DEFAULT_UI_PREFERENCES.glassBlur),
    ttsEnabled: readLegacyBoolean('ttsOn', DEFAULT_UI_PREFERENCES.ttsEnabled),
  });
}

function writeSnapshot(preferences: SynthomaUiPreferences): void {
  const serialized = JSON.stringify(preferences);
  memorySnapshot = preferences;
  memorySerialized = serialized;
  try {
    window.localStorage.setItem(UI_PREFERENCES_KEY, serialized);
  } catch {}
}

export function readUiPreferences(): SynthomaUiPreferences {
  if (typeof window === 'undefined') return memorySnapshot;
  const stored = parseJson(window.localStorage.getItem(UI_PREFERENCES_KEY));
  const preferences = isRecord(stored) && stored.version === UI_PREFERENCES_VERSION
    ? validateUiPreferences(stored)
    : migrateLegacyPreferences(stored);
  const serialized = JSON.stringify(preferences);
  if (serialized !== memorySerialized || !(isRecord(stored) && stored.version === UI_PREFERENCES_VERSION)) {
    writeSnapshot(preferences);
  }
  return memorySnapshot;
}

export function getUiPreferencesSnapshot(): SynthomaUiPreferences {
  return readUiPreferences();
}

export function getServerUiPreferencesSnapshot(): SynthomaUiPreferences {
  return memorySnapshot;
}

export function getEffectiveMotionMode(
  preferences: SynthomaUiPreferences = readUiPreferences(),
  systemReduced = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    : false,
): EffectiveMotionMode {
  return preferences.motionMode === 'system'
    ? systemReduced ? 'reduced' : 'full'
    : preferences.motionMode;
}

export function isBackgroundMotionAllowed(
  preferences: SynthomaUiPreferences = readUiPreferences(),
  saveData = typeof navigator !== 'undefined'
    ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    : false,
): boolean {
  const motion = getEffectiveMotionMode(preferences);
  if (saveData || motion !== 'full') return false;
  return preferences.backgroundMotion !== 'off';
}

export function applyUiPreferencesToDocument(preferences: SynthomaUiPreferences = readUiPreferences()): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  const effectiveMotion = getEffectiveMotionMode(preferences);
  const backgroundMotion = isBackgroundMotionAllowed(preferences) ? 'on' : 'off';
  root.dataset.theme = preferences.theme;
  root.dataset.motionPreference = preferences.motionMode;
  root.dataset.motion = effectiveMotion;
  root.dataset.backgroundMotion = backgroundMotion;
  root.dataset.glitch = preferences.glitchEffects && effectiveMotion === 'full' ? 'on' : 'off';
  root.dataset.noise = preferences.noiseEffects && effectiveMotion === 'full' ? 'on' : 'off';
  root.dataset.scanlines = preferences.scanlines && effectiveMotion !== 'off' ? 'on' : 'off';
  root.dataset.textEffects = effectiveMotion === 'off' ? 'off' : preferences.textEffects;
  root.dataset.glass = preferences.glassEnabled ? 'on' : 'off';
  root.style.setProperty('--font-size-multiplier', String(preferences.fontScale));
  root.style.setProperty('--app-bg-opacity', String(preferences.readerOpacity));
  root.style.setProperty('--bg-opacity', String(preferences.readerOpacity));
  root.style.setProperty('--app-bg-blur', `${preferences.glassBlur}px`);
  root.style.setProperty('--glass-blur', `${preferences.glassBlur}px`);
  if (body) {
    body.dataset.theme = preferences.theme;
    body.classList.toggle('no-animations', effectiveMotion === 'off');
    body.classList.toggle('glass-mode', preferences.glassEnabled);
  }
}

function notify(preferences: SynthomaUiPreferences): void {
  applyUiPreferencesToDocument(preferences);
  listeners.forEach((listener) => listener());
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(UI_PREFERENCES_CHANGED_EVENT, { detail: preferences }));
  }
}

export function updateUiPreferences(patch: Partial<Omit<SynthomaUiPreferences, 'version'>>): SynthomaUiPreferences {
  if (typeof window === 'undefined') return memorySnapshot;
  const preferences = validateUiPreferences({ ...readUiPreferences(), ...patch, version: UI_PREFERENCES_VERSION });
  writeSnapshot(preferences);
  notify(preferences);
  return preferences;
}

export function replaceUiPreferences(value: unknown): SynthomaUiPreferences {
  if (typeof window === 'undefined') return memorySnapshot;
  const preferences = validateUiPreferences(value);
  writeSnapshot(preferences);
  notify(preferences);
  return preferences;
}

export function resetUiPreferences(): SynthomaUiPreferences {
  return replaceUiPreferences(DEFAULT_UI_PREFERENCES);
}

export function subscribeUiPreferences(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMovingBackground(enabled: boolean): SynthomaUiPreferences {
  return updateUiPreferences({ backgroundMotion: enabled ? 'auto' : 'off' });
}
