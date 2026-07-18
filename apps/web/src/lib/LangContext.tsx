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

function readLegacyLanguage(): Lang {
  if (typeof window === 'undefined') return 'cs';
  try { return localStorage.getItem('synthoma_lang') === 'en' ? 'en' : 'cs'; } catch { return 'cs'; }
}

export function LangProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? readLegacyLanguage());

  useEffect(() => {
    if (initialLang) setLangState(initialLang);
  }, [initialLang]);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('synthoma_lang', l); } catch {}
    try { document.cookie = `synthoma_locale=${l}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch {}
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
