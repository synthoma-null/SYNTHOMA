'use client';

import { useLang } from '../lib/LangContext';
import { useRouter } from 'next/navigation';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const router = useRouter();

  const switchLanguage = (next: 'cs' | 'en') => {
    setLang(next);
    const target = new URL(window.location.href);
    if (next === 'en') target.searchParams.set('locale', 'en');
    else target.searchParams.delete('locale');
    router.replace(`${target.pathname}${target.search}${target.hash}`, { scroll: true });
  };

  return (
    <div className="lang-switcher" role="group" aria-label={lang === 'en' ? 'Interface language' : 'Jazyk rozhraní'}>
      <button
        type="button"
        className={`lang-btn${lang === 'cs' ? ' lang-btn--active' : ''}`}
        onClick={() => switchLanguage('cs')}
        aria-pressed={lang === 'cs'}
      >
        Čeština
      </button>
      <button
        type="button"
        className={`lang-btn${lang === 'en' ? ' lang-btn--active' : ''}`}
        onClick={() => switchLanguage('en')}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
    </div>
  );
}
