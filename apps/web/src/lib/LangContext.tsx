'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function LangProvider({ children, initialLang = 'cs' }: { children: React.ReactNode; initialLang?: Lang }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => setLangState(initialLang), [initialLang]);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('synthoma_lang', l); } catch {}
    try { document.cookie = `synthoma_locale=${l}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch {}
    try {
      const target = new URL(window.location.href);
      if (l === 'en') target.searchParams.set('locale', 'en');
      else target.searchParams.delete('locale');
      router.replace(`${target.pathname}${target.search}${target.hash}`, { scroll: true });
    } catch {}
  }, [router]);

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
