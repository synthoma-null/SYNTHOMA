'use client';

import { useEffect, useState } from 'react';
import { useUiPreferences } from '../../hooks/useUiPreferences';
import { clearReaderDecisionState } from '../../lib/readerDecisions';
import { updateUiPreferences } from '../../lib/uiPreferences';

interface Props {
  articleId: string;
  locale: 'cs' | 'en';
  chapterId?: string;
  collection?: string;
  hasDecisions?: boolean;
}

export default function ReaderCommandUtilities({
  articleId,
  locale,
  chapterId,
  collection,
  hasDecisions = false,
}: Props) {
  const [speaking, setSpeaking] = useState(false);
  const preferences = useUiPreferences();
  const copy = locale === 'en'
    ? { settings: 'PANEL', audio: 'AUDIO', focus: 'FOCUS', focusExit: 'EXIT FOCUS', help: 'HELP', share: 'SHARE' }
    : { settings: 'PANEL', audio: 'AUDIO', focus: 'FOKUS', focusExit: 'UKONČIT SOUSTŘEDĚNÍ', help: 'NÁPOVĚDA', share: 'SDÍLET' };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => {
    document.querySelector('.chapter-reader')?.classList.toggle('chapter-reader--focus', preferences.focusMode);
  }, [preferences.focusMode]);
  useEffect(() => {
    if (!preferences.focusMode) return;
    const leaveFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') updateUiPreferences({ focusMode: false });
    };
    document.addEventListener('keydown', leaveFocus);
    return () => document.removeEventListener('keydown', leaveFocus);
  }, [preferences.focusMode]);
  useEffect(() => {
    if (!preferences.ttsEnabled && speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    }
  }, [preferences.ttsEnabled, speaking]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.getElementById(articleId)?.textContent?.trim();
    if (!text) return;
    updateUiPreferences({ ttsEnabled: true });
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'en' ? 'en-US' : 'cs-CZ';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };

  const resetDecisions = () => {
    if (!chapterId || !collection) return;
    const confirmed = window.confirm(locale === 'en'
      ? 'Start a new passage through this chapter? Saved choices in this chapter will be cleared.'
      : 'Začít nový průchod touto kapitolou? Uložené volby v této kapitole budou smazány.');
    if (!confirmed) return;
    clearReaderDecisionState(collection, chapterId);
    window.location.reload();
  };

  return (
    <div className="chapter-reader__utilities" aria-label={locale === 'en' ? 'Reader tools' : 'Nástroje čtečky'}>
      <button type="button" aria-label={locale === 'en' ? 'Settings' : 'Nastavení'} onClick={() => document.getElementById('toggle-panel-btn')?.click()}>{copy.settings}</button>
      <button type="button" aria-label={locale === 'en' ? 'Audio' : 'Hudba'} onClick={() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle'))}>{copy.audio}</button>
      <button type="button" aria-label={locale === 'en' ? 'Read chapter aloud' : 'Přečíst kapitolu nahlas'} aria-pressed={speaking} onClick={toggleSpeech}>TTS</button>
      <button
        type="button"
        data-reader-tool="focus"
        aria-label={preferences.focusMode
          ? locale === 'en' ? 'Exit focus mode' : 'Ukončit režim soustředění'
          : locale === 'en' ? 'Focus mode' : 'Režim soustředění'}
        aria-pressed={preferences.focusMode}
        onClick={() => updateUiPreferences({ focusMode: !preferences.focusMode })}
      >
        {preferences.focusMode ? copy.focusExit : copy.focus}
      </button>
      <button type="button" data-reader-tool="help" aria-label={locale === 'en' ? 'How to control the reader' : 'Jak ovládat čtečku'} onClick={() => document.dispatchEvent(new CustomEvent('synthoma:reader-help'))}>{copy.help}</button>
      {hasDecisions ? (
        <button type="button" data-reader-tool="reset-decisions" onClick={resetDecisions}>
          {locale === 'en' ? 'NEW PASSAGE' : 'NOVÝ PRŮCHOD'}
        </button>
      ) : null}
      <button type="button" aria-label={locale === 'en' ? 'Share chapter' : 'Sdílet kapitolu'} onClick={() => void share()}>{copy.share}</button>
    </div>
  );
}
