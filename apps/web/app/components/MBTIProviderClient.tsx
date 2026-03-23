"use client";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { readStorageJSON, writeStorageJSON } from "../../src/lib/browser";

export type MBTIScores = { I: number; E: number; N: number; S: number; F: number; T: number; J: number; P: number };
export type MBTIContextType = {
  scores: MBTIScores;
  inc: (delta: Partial<MBTIScores>) => void;
  reset: () => void;
  getType: () => string;
  lastUpdated: number;
};

const EMPTY: MBTIScores = { I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 };

export const MBTIContext = createContext<MBTIContextType | null>(null);

export default function MBTIProviderClient({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<MBTIScores>(() => {
    const stored = readStorageJSON<Partial<MBTIScores>>("mbtiScores", EMPTY);
    return { ...EMPTY, ...stored };
  });
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  // On first mount, optionally seed from URL ?mbti=XXXX if current scores are all zero
  useEffect(() => {
    try {
      const isAllZero = Object.values(scores).every(v => !v);
      if (!isAllZero) return;
      const qs = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const mbti = (qs?.get('mbti') || '').toUpperCase().trim();
      if (!/^[IE][NS][FT][JP]$/.test(mbti)) return;
      const seeded: MBTIScores = { ...EMPTY };
      // Give small bias 1 point per winning letter so axes nejsou extrémní
      const pairs: [keyof MBTIScores, keyof MBTIScores][] = [ ['I','E'], ['N','S'], ['F','T'], ['J','P'] ];
      pairs.forEach(([a,b], idx) => {
        const ch = mbti[idx] as 'I'|'E'|'N'|'S'|'F'|'T'|'J'|'P';
        if (ch === a) seeded[a] = 1; else if (ch === b) seeded[b] = 1;
      });
      setScores(seeded);
      setLastUpdated(Date.now());
    } catch {}
  // run only once after first render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeStorageJSON("mbtiScores", scores);
  }, [scores]);

  // Sync with external updates (e.g., TypewriterReader or legacy SPA)
  useEffect(() => {
    const onExternal = () => {
      try {
        const ext = readStorageJSON<Partial<MBTIScores>>("mbtiScores", EMPTY);
        setScores((prev: MBTIScores) => ({ ...prev, ...ext }));
        setLastUpdated(Date.now());
      } catch {}
    };
    document.addEventListener('synthoma:choice-made', onExternal as any);
    window.addEventListener('storage', onExternal as any);
    return () => {
      document.removeEventListener('synthoma:choice-made', onExternal as any);
      window.removeEventListener('storage', onExternal as any);
    };
  }, []);

  const inc = useCallback((delta: Partial<MBTIScores>) => {
    setScores((prev: MBTIScores) => {
      const next: MBTIScores = { ...prev };
      for (const k in delta) {
        const key = k as keyof MBTIScores;
        if (typeof delta[key] === "number") next[key] += delta[key] as number;
      }
      return next;
    });
    setLastUpdated(Date.now());
  }, []);

  const reset = useCallback(() => {
    setScores(EMPTY);
    setLastUpdated(Date.now());
  }, []);

  const getType = useCallback(() => {
    const s = scores;
    return `${s.I >= s.E ? "I" : "E"}${s.N >= s.S ? "N" : "S"}${s.F >= s.T ? "F" : "T"}${s.J >= s.P ? "J" : "P"}`;
  }, [scores]);

  const value = useMemo<MBTIContextType>(() => ({ scores, inc, reset, getType, lastUpdated }), [scores, inc, reset, getType, lastUpdated]);

  return (
    <MBTIContext.Provider value={value}>{children}</MBTIContext.Provider>
  );
}
