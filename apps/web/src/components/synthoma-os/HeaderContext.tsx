'use client';

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export type HeaderMode = 'site' | 'reader' | 'cyklus' | 'utility';

export interface HeaderContextValue {
  mode: HeaderMode;
  status: ReactNode | null;
  actions: ReactNode | null;
  setMode: (mode: HeaderMode) => void;
  setStatus: (status: ReactNode | null) => void;
  setActions: (actions: ReactNode | null) => void;
  reset: () => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<HeaderMode>('site');
  const [status, setStatus] = useState<ReactNode | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  const setMode = useCallback((next: HeaderMode) => {
    setModeState(next);
  }, []);

  const reset = useCallback(() => {
    setModeState('site');
    setStatus(null);
    setActions(null);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      status,
      actions,
      setMode,
      setStatus,
      setActions,
      reset,
    }),
    [mode, status, actions, setMode, reset]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider');
  return ctx;
}
