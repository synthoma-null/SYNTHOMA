'use client';

import { useEffect, useState } from 'react';
import {
  UI_PREFERENCES_CHANGED_EVENT,
  isBackgroundMotionAllowed,
  readUiPreferences,
} from '../lib/uiPreferences';

type NetworkInformationLike = EventTarget & { saveData?: boolean };

function readAllowed(): boolean {
  return isBackgroundMotionAllowed(readUiPreferences());
}

export function useBackgroundMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const update = () => setAllowed(readAllowed());

    update();
    motion?.addEventListener?.('change', update);
    connection?.addEventListener?.('change', update);
    document.addEventListener(UI_PREFERENCES_CHANGED_EVENT, update);
    window.addEventListener('storage', update);

    return () => {
      motion?.removeEventListener?.('change', update);
      connection?.removeEventListener?.('change', update);
      document.removeEventListener(UI_PREFERENCES_CHANGED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return allowed;
}
