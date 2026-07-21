'use client';

import { useEffect, useRef, useState } from 'react';

export const READER_ONBOARDING_KEY = 'synthoma_reader_onboarding_v3_seen';

export default function ReaderOnboarding({ locale }: { locale: 'cs' | 'en' }) {
  const [open, setOpen] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);
  const copy = locale === 'en'
    ? { title: 'CUSTOMIZE THE READER', body: 'The control panel changes text size, page width, line spacing, theme and effect intensity.', open: 'OPEN PANEL', continue: 'CONTINUE READING' }
    : { title: 'PŘIZPŮSOB SI ČTEČKU', body: 'Ovládací panel mění velikost textu, šířku stránky, řádkování, motiv a intenzitu efektů.', open: 'OTEVŘÍT PANEL', continue: 'POKRAČOVAT VE ČTENÍ' };

  useEffect(() => {
    try { setOpen(window.localStorage.getItem(READER_ONBOARDING_KEY) !== 'true'); } catch {}
    const show = () => setOpen(true);
    document.addEventListener('synthoma:reader-help', show);
    return () => document.removeEventListener('synthoma:reader-help', show);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => continueRef.current?.focus());
  }, [open]);

  const dismiss = () => {
    try { window.localStorage.setItem(READER_ONBOARDING_KEY, 'true'); } catch {}
    setOpen(false);
  };
  const openPanel = () => {
    dismiss();
    document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle'));
  };

  if (!open) return null;
  return (
    <div className="reader-onboarding" role="dialog" aria-modal="true" aria-labelledby="reader-onboarding-title">
      <span className="reader-onboarding__kicker">READER // START</span>
      <h2 id="reader-onboarding-title">{copy.title}</h2>
      <p>{copy.body}</p>
      <div className="reader-onboarding__actions">
        <button type="button" onClick={openPanel}>{copy.open}</button>
        <button ref={continueRef} type="button" onClick={dismiss}>{copy.continue}</button>
      </div>
    </div>
  );
}
