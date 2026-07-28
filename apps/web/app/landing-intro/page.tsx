'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUiPreferences } from '../../src/hooks/useUiPreferences';
import { getEffectiveMotionMode, type EffectiveMotionMode } from '../../src/lib/uiPreferences';
import { useLang } from '../../src/lib/LangContext';
import { writeStorage } from '../../src/lib/browser';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../src/lib/intro';
import { useUiLayer } from '../../src/components/ui-layer/UiLayerProvider';

const PHASE_DURATION_MS = 1700;
const FINAL_PHASE = 4;

const COPY = {
  cs: {
    aria: 'Příběhové intro SYNTHOMA',
    title: 'SYNTHOMA',
    signal: 'SIGNÁL NALEZEN',
    slogan: ['Tma nikdy není opravdová.', 'Je jen světlem, které se vzdalo smyslu.'],
    rule: 'Dveře musí mít kliku z obou stran.',
    enter: 'VSTOUPIT',
    skip: 'PŘESKOČIT',
  },
  en: {
    aria: 'SYNTHOMA story intro',
    title: 'SYNTHOMA',
    signal: 'SIGNAL FOUND',
    slogan: ['Darkness is never real.', 'It is only light that surrendered its meaning.'],
    rule: 'Doors must have a handle on both sides.',
    enter: 'ENTER',
    skip: 'SKIP',
  },
} as const;

export default function LandingIntroPage() {
  const router = useRouter();
  const { lang } = useLang();
  const copy = COPY[lang];
  const preferences = useUiPreferences();
  const [systemReduced, setSystemReduced] = useState(false);
  const [phase, setPhase] = useState(0);
  const motion: EffectiveMotionMode = getEffectiveMotionMode(preferences, systemReduced);

  const finishIntro = useCallback(() => {
    writeStorage(SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION);
    document.documentElement.removeAttribute('data-synthoma-intro-pending');
    router.replace('/');
  }, [router]);

  const { closeLayer } = useUiLayer({
    id: 'story-intro',
    type: 'intro',
    open: true,
    onClose: finishIntro,
  });

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const sync = () => setSystemReduced(media?.matches ?? false);
    sync();
    media?.addEventListener?.('change', sync);
    return () => media?.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    if (motion === 'off') {
      setPhase(FINAL_PHASE);
      return;
    }
    if (motion === 'reduced') {
      const timer = window.setTimeout(() => setPhase(FINAL_PHASE), 450);
      return () => window.clearTimeout(timer);
    }
    if (phase >= FINAL_PHASE) return;
    const timer = window.setTimeout(
      () => setPhase((current) => Math.min(FINAL_PHASE, current + 1)),
      PHASE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [motion, phase]);

  return (
    <main
      className="synthoma-intro"
      aria-label={copy.aria}
      data-phase={phase}
      data-motion={motion}
    >
      <div className="synthoma-intro__noise" aria-hidden="true" />
      <div className="synthoma-intro__signal" aria-hidden="true">
        <span />
        <strong>{copy.signal}</strong>
      </div>

      <section className="synthoma-intro__composition" aria-labelledby="synthoma-intro-title">
        <img className="synthoma-intro__circle" src="/assets/background_circle.png" alt="" />
        <div className="synthoma-intro__assembly" aria-hidden="true">
          <img className="synthoma-intro__mark" src="/assets/background_logo.png" alt="" />
          <img className="synthoma-intro__title-image" src="/assets/background_title.png" alt="" />
        </div>
        <h1 id="synthoma-intro-title" className="sr-only">{copy.title}</h1>

        <blockquote className="synthoma-intro__slogan">
          <span>{copy.slogan[0]}</span>
          <span>{copy.slogan[1]}</span>
        </blockquote>

        <p className="synthoma-intro__rule">{copy.rule}</p>
      </section>

      <div className="synthoma-intro__actions">
        <button className="os-command synthoma-intro__skip" type="button" onClick={closeLayer}>
          {copy.skip}
        </button>
        {phase >= FINAL_PHASE ? (
          <button className="os-command synthoma-intro__enter" type="button" onClick={closeLayer} autoFocus>
            {copy.enter}
          </button>
        ) : null}
      </div>
    </main>
  );
}
