'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getT, type Lang, type TKey } from './i18n';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

export const LangContext = createContext<LangCtx>({
  lang: 'cs',
  setLang: () => {},
  t: getT('cs'),
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('cs');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('synthoma_lang');
      if (stored === 'en' || stored === 'cs') setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('synthoma_lang', l); } catch {}
  }, []);

  const t = useCallback((key: TKey) => getT(lang)(key), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangCtx {
  return useContext(LangContext);
}
