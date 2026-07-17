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
    const apply = () => applyUiPreferencesToDocument(readUiPreferences());
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
