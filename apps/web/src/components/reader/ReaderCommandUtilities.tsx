'use client';

import { useEffect, useState } from 'react';

export default function ReaderCommandUtilities({ articleId, locale }: { articleId: string; locale: 'cs' | 'en' }) {
  const [speaking, setSpeaking] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.getElementById(articleId)?.textContent?.trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'en' ? 'en-US' : 'cs-CZ';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const toggleFocus = () => {
    const next = !focusMode;
    document.querySelector('.chapter-reader')?.classList.toggle('chapter-reader--focus', next);
    setFocusMode(next);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };

  return (
    <div className="chapter-reader__utilities" aria-label={locale === 'en' ? 'Reader tools' : 'Nástroje čtečky'}>
      <button type="button" aria-label={locale === 'en' ? 'Settings' : 'Nastavení'} onClick={() => document.getElementById('toggle-panel-btn')?.click()}>NASTAVENÍ</button>
      <button type="button" aria-label={locale === 'en' ? 'Audio' : 'Hudba'} onClick={() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle'))}>AUDIO</button>
      <button type="button" aria-label={locale === 'en' ? 'Read chapter aloud' : 'Přečíst kapitolu nahlas'} aria-pressed={speaking} onClick={toggleSpeech}>TTS</button>
      <button type="button" aria-label={locale === 'en' ? 'Focus mode' : 'Režim soustředění'} aria-pressed={focusMode} onClick={toggleFocus}>FOKUS</button>
      <button type="button" aria-label={locale === 'en' ? 'Share chapter' : 'Sdílet kapitolu'} onClick={() => void share()}>SDÍLET</button>
    </div>
  );
}
