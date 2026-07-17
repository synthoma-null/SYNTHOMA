'use client';

import { useSyncExternalStore } from 'react';
import {
  getServerUiPreferencesSnapshot,
  getUiPreferencesSnapshot,
  subscribeUiPreferences,
} from '../lib/uiPreferences';

export function useUiPreferences() {
  return useSyncExternalStore(
    subscribeUiPreferences,
    getUiPreferencesSnapshot,
    getServerUiPreferencesSnapshot,
  );
}
