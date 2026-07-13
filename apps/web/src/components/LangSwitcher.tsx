'use client';

import { useLang } from '../lib/LangContext';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switcher" role="group" aria-label="Jazyk rozhraní">
      <button
        type="button"
        className={`lang-btn${lang === 'cs' ? ' lang-btn--active' : ''}`}
        onClick={() => setLang('cs')}
        aria-pressed={lang === 'cs'}
      >
        Čeština
      </button>
      <button
        type="button"
        className={`lang-btn${lang === 'en' ? ' lang-btn--active' : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
    </div>
  );
}
