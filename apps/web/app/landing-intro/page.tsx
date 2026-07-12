'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SynthomaMediaLayer from '../../src/components/synthoma-os/SynthomaMediaLayer';
import { readStorage, writeStorage } from '../../src/lib/browser';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../src/lib/intro';

const BOOT_LINES = [
  'THERAPEUTIC ENVIRONMENT 0.9.72-beta',
  'MEMORY CHANNEL: CONNECTING',
  'MEMORY INTEGRITY: FAILED',
  'SUBJECT: NULL',
  'IDENTITY COLLISION DETECTED',
  'ARCHIVE RESPONSE: HUNGRY',
  'SYNTHOMA OS: READY',
] as const;

export default function LandingIntroPage() {
  const router = useRouter();
  const skipRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const repeatVisit = useMemo(() => readStorage(SYNTHOMA_INTRO_STORAGE_KEY, null) === SYNTHOMA_INTRO_VERSION, []);

  const complete = useCallback(() => {
    writeStorage(SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION);
    router.replace('/');
  }, [router]);

  const advance = useCallback(() => {
    setStep((current) => {
      if (current >= BOOT_LINES.length - 1) {
        queueMicrotask(complete);
        return current;
      }
      return current + 1;
    });
  }, [complete]);

  useEffect(() => {
    skipRef.current?.focus();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    setReducedMotion(reduced);
    if (reduced) setStep(BOOT_LINES.length - 1);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const delay = repeatVisit ? 240 : 720;
    const timer = window.setTimeout(step >= BOOT_LINES.length - 1 ? complete : advance, step >= BOOT_LINES.length - 1 ? delay + 280 : delay);
    return () => window.clearTimeout(timer);
  }, [advance, complete, reducedMotion, repeatVisit, step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance]);

  const visibleLines = reducedMotion ? BOOT_LINES : BOOT_LINES.slice(0, step + 1);

  return (
    <main className="synthoma-intro" aria-label="Inicializace SYNTHOMA OS">
      <SynthomaMediaLayer src="/video/SYNTHOMA1.webm" />
      <div className="synthoma-intro__scrim" aria-hidden="true" />
      <section className="synthoma-intro__terminal" aria-labelledby="synthoma-intro-title">
        <header>
          <h1 id="synthoma-intro-title" className="synthoma-intro__brand">SYNTHOMA</h1>
          <p className="synthoma-intro__channel">OS // BLACK MEMORY INTERFACE</p>
        </header>
        <div className="synthoma-intro__lines" role="status" aria-live="polite" aria-atomic="true">
          {visibleLines.map((line, index) => (
            <p key={line} className={`synthoma-intro__line${index === visibleLines.length - 1 ? ' synthoma-intro__line--active' : ''}${line.includes('FAILED') || line.includes('NULL') ? ' synthoma-intro__line--error' : ''}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}{' // '}</span>{line}
            </p>
          ))}
        </div>
        <div className="synthoma-intro__actions">
          <button ref={skipRef} className="os-command" type="button" onClick={complete}>PŘESKOČIT</button>
          <button className="os-command synthoma-intro__enter" type="button" onClick={step >= BOOT_LINES.length - 1 ? complete : advance}>
            {step >= BOOT_LINES.length - 1 ? 'VSTOUPIT DO SYSTÉMU' : 'POKRAČOVAT'}
          </button>
        </div>
      </section>
    </main>
  );
}
