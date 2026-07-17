'use client';

import { useEffect } from 'react';
import {
  applyUiPreferencesToDocument,
  readUiPreferences,
  subscribeUiPreferences,
} from '../../lib/uiPreferences';

export default function UiPreferencesRuntime() {
  useEffect(() => {
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const preferences = readUiPreferences();
      applyUiPreferencesToDocument(preferences);
      const audio = window.__synthomaAudio;
      if (audio) {
        audio.volume = preferences.audioVolume;
        if (!preferences.audioEnabled) audio.pause();
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'synthoma_ui_preferences') apply();
    };
    const unsubscribe = subscribeUiPreferences(apply);
    motion?.addEventListener?.('change', apply);
    window.addEventListener('storage', onStorage);
    apply();
    return () => {
      unsubscribe();
      motion?.removeEventListener?.('change', apply);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return null;
}
