export type ConsentState = {
  version: 1;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  readerTrace: boolean;
  acceptedAt: string;
};

const KEY = 'synthoma_consent_v1';

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(state: Omit<ConsentState, 'version' | 'necessary' | 'acceptedAt'>): ConsentState {
  const full: ConsentState = {
    version: 1,
    necessary: true,
    preferences: state.preferences,
    analytics: state.analytics,
    readerTrace: state.readerTrace,
    acceptedAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(full));
  }
  return full;
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

export function hasReaderTraceConsent(): boolean {
  return getConsent()?.readerTrace === true;
}

export function hasPreferencesConsent(): boolean {
  return getConsent()?.preferences === true;
}
