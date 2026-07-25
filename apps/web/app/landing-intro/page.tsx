'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SynthomaMediaLayer from '../../src/components/synthoma-os/SynthomaMediaLayer';
import SynthomaWordmark from '../../src/components/synthoma/SynthomaWordmark';
import { useLang } from '../../src/lib/LangContext';
import { runTypewriter } from '../../src/lib/typewriter';
import { readStorage, writeStorage } from '../../src/lib/browser';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../src/lib/intro';

interface IntroLog {
  label: string;
  lines: readonly [string, string];
}
type IntroState = 'playing' | 'waiting-for-input' | 'completed' | 'skipped';

const INTRO_STEP_MS = 1400;
const REDUCED_MOTION_LOGS = [0, 4, 8] as const;

const INTRO_COPY = {
  cs: {
    ariaLabel: 'Inicializace SYNTHOMA OS',
    channel: 'OS // ROZHRANÍ ČERNÉ PAMĚTI',
    motto: 'Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.',
    enter: 'VSTOUPIT DO SYNTHOMY',
    skip: 'PŘESKOČIT',
    replay: 'SPUSTIT ZNOVU',
    logs: [
      { label: 'PROBUZENÍ', lines: ['Subjekt detekován.', 'Vědomí zatím nepotvrzeno.'] },
      { label: 'PAMĚŤ', lines: ['Obnova zahájena.', 'Některé chyby se přihlásily samy.'] },
      { label: 'TERAPIE', lines: ['Bezpečné prostředí připraveno.', 'Bezpečí se nepodařilo načíst.'] },
      { label: 'EMPATIE', lines: ['Modul nalezen.', 'Používán převážně v propagačních materiálech.'] },
      { label: 'IDENTITA', lines: ['Jméno nenalezeno.', 'Systém vám dočasně přidělil osobnost.'] },
      { label: 'SOUHLAS', lines: ['Pokračováním souhlasíte.', 'Systém pokračoval už před vámi.'] },
      { label: 'STABILITA', lines: ['Odchylky přijatelné.', 'Tedy lidské.'] },
      { label: 'RESTART', lines: ['Předchozí selhání zachována', 'pro vaše uživatelské pohodlí.'] },
      { label: 'VSTUP', lines: ['SYNTHOMA čeká.', 'Trpělivě pouze proto, že neumí odejít.'] },
    ] satisfies readonly IntroLog[],
  },
  en: {
    ariaLabel: 'SYNTHOMA OS initialization',
    channel: 'OS // BLACK MEMORY INTERFACE',
    motto: 'Darkness is never real. It is only light that has surrendered its meaning.',
    enter: 'ENTER SYNTHOMA',
    skip: 'SKIP',
    replay: 'PLAY AGAIN',
    logs: [
      { label: 'AWAKENING', lines: ['Subject detected.', 'Consciousness not yet confirmed.'] },
      { label: 'MEMORY', lines: ['Recovery started.', 'Some errors signed themselves in.'] },
      { label: 'THERAPY', lines: ['Safe environment prepared.', 'Safety failed to load.'] },
      { label: 'EMPATHY', lines: ['Module found.', 'Used mainly in promotional materials.'] },
      { label: 'IDENTITY', lines: ['Name not found.', 'The system assigned you a temporary personality.'] },
      { label: 'CONSENT', lines: ['By continuing, you consent.', 'The system continued before you did.'] },
      { label: 'STABILITY', lines: ['Deviations acceptable.', 'Human, then.'] },
      { label: 'RESTART', lines: ['Previous failures preserved', 'for your convenience.'] },
      { label: 'ENTRY', lines: ['SYNTHOMA is waiting.', 'Patiently, only because it cannot leave.'] },
    ] satisfies readonly IntroLog[],
  },
} as const;

export default function LandingIntroPage() {
  const router = useRouter();
  const { lang } = useLang();
  const copy = INTRO_COPY[lang];
  const mottoRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const [introState, setIntroState] = useState<IntroState>('playing');
  const [reducedMotion, setReducedMotion] = useState(false);
  const repeatVisit = useMemo(() => readStorage(SYNTHOMA_INTRO_STORAGE_KEY, null) === SYNTHOMA_INTRO_VERSION, []);

  const enterSYNTHOMA = useCallback((outcome: 'completed' | 'skipped' = 'completed') => {
    setIntroState(outcome);
    writeStorage(SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION);
    router.replace('/');
  }, [router]);

  const replay = useCallback(() => {
    setStep(0);
    setIntroState('playing');
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    setReducedMotion(reduced);
    if (reduced) {
      setStep(copy.logs.length - 1);
      setIntroState('waiting-for-input');
    }
  }, [copy.logs.length]);

  useEffect(() => {
    if (reducedMotion || introState !== 'playing') return;
    if (step >= copy.logs.length - 1) {
      setIntroState('waiting-for-input');
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), INTRO_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [copy.logs.length, introState, reducedMotion, step]);

  useEffect(() => {
    const host = mottoRef.current;
    if (!host) return;
    const cancel = runTypewriter({
      text: copy.motto,
      host,
      getDurationMs: () => (repeatVisit ? 1600 : 2600),
    });
    return () => { try { cancel(); } catch {} };
  }, [copy.motto, repeatVisit]);

  const isLastStep = introState === 'waiting-for-input';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isLastStep || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      enterSYNTHOMA('completed');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enterSYNTHOMA, isLastStep]);

  const visibleLogs = reducedMotion
    ? REDUCED_MOTION_LOGS.map((index) => copy.logs[index]!)
    : copy.logs.slice(0, step + 1);

  return (
    <main className="synthoma-intro" aria-label={copy.ariaLabel}>
      <SynthomaMediaLayer src="/video/SYNTHOMA1.webm" />
      <div className="synthoma-intro__scrim" aria-hidden="true" />
      <section className="synthoma-intro__terminal" aria-labelledby="synthoma-intro-title" data-intro-state={introState}>
        <header>
          <SynthomaWordmark id="synthoma-intro-title" context="intro" className="synthoma-intro__brand" />
          <p className="synthoma-intro__channel">{copy.channel}</p>
          <p ref={mottoRef} className="synthoma-intro__motto" aria-live="polite" aria-atomic="true">
            <span className="noising-text" aria-hidden="true" />
            <span className="sr-only">{copy.motto}</span>
          </p>
        </header>
        <div className="synthoma-intro__lines" role="log" aria-live="polite" aria-relevant="additions">
          {visibleLogs.map((log, index) => (
            <article key={log.label} className={`synthoma-intro__log${index === visibleLogs.length - 1 ? ' synthoma-intro__log--active' : ''}`}>
              <h2 className="synthoma-intro__log-label">
                <span aria-hidden="true">{String(reducedMotion ? (REDUCED_MOTION_LOGS[index] ?? index) + 1 : index + 1).padStart(2, '0')}{' // '}</span>
                LOG [{log.label}]
              </h2>
              {log.lines.map((line) => <p key={line} className="synthoma-intro__line">{line}</p>)}
            </article>
          ))}
        </div>
        <div className="synthoma-intro__actions">
          <button className="os-command synthoma-intro__skip" type="button" onClick={() => enterSYNTHOMA('skipped')} aria-label={copy.skip}>
            {copy.skip}
          </button>
          {isLastStep && (
            <button className="os-command synthoma-intro__replay" type="button" onClick={replay}>
              {copy.replay}
            </button>
          )}
          {isLastStep && (
            <button className="os-command synthoma-intro__enter" type="button" onClick={() => enterSYNTHOMA('completed')}>
              {copy.enter}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
