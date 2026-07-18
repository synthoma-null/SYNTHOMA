'use client';

import { useEffect, useState } from 'react';
import { useUiPreferences } from '../../hooks/useUiPreferences';
import { updateUiPreferences } from '../../lib/uiPreferences';

export default function ReaderCommandUtilities({ articleId, locale }: { articleId: string; locale: 'cs' | 'en' }) {
  const [speaking, setSpeaking] = useState(false);
  const preferences = useUiPreferences();
  const copy = locale === 'en'
    ? { settings: 'SETTINGS', audio: 'AUDIO', focus: 'FOCUS', share: 'SHARE' }
    : { settings: 'NASTAVENÍ', audio: 'AUDIO', focus: 'FOKUS', share: 'SDÍLET' };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => {
    document.querySelector('.chapter-reader')?.classList.toggle('chapter-reader--focus', preferences.focusMode);
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

  const toggleFocus = () => {
    updateUiPreferences({ focusMode: !preferences.focusMode });
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
      <button type="button" aria-label={locale === 'en' ? 'Settings' : 'Nastavení'} onClick={() => document.getElementById('toggle-panel-btn')?.click()}>{copy.settings}</button>
      <button type="button" aria-label={locale === 'en' ? 'Audio' : 'Hudba'} onClick={() => document.dispatchEvent(new CustomEvent('synthoma:audio-toggle'))}>{copy.audio}</button>
      <button type="button" aria-label={locale === 'en' ? 'Read chapter aloud' : 'Přečíst kapitolu nahlas'} aria-pressed={speaking} onClick={toggleSpeech}>TTS</button>
      <button type="button" aria-label={locale === 'en' ? 'Focus mode' : 'Režim soustředění'} aria-pressed={preferences.focusMode} onClick={toggleFocus}>{copy.focus}</button>
      <button type="button" aria-label={locale === 'en' ? 'Share chapter' : 'Sdílet kapitolu'} onClick={() => void share()}>{copy.share}</button>
    </div>
  );
}
