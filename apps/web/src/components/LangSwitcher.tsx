'use client';

import { useLang } from '../lib/LangContext';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switcher" aria-label="Language / Jazyk">
      <button
        className={`lang-btn${lang === 'cs' ? ' lang-btn--active' : ''}`}
        onClick={() => setLang('cs')}
        aria-pressed={lang === 'cs'}
        title="Čeština"
      >
        CS
      </button>
      <span className="lang-sep" aria-hidden="true">|</span>
      <button
        className={`lang-btn${lang === 'en' ? ' lang-btn--active' : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
