'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SynthomaMediaLayer from '../../src/components/synthoma-os/SynthomaMediaLayer';
import SynthomaWordmark from '../../src/components/synthoma/SynthomaWordmark';
import { useUiLayer } from '../../src/components/ui-layer/UiLayerProvider';
import { useUiPreferences } from '../../src/hooks/useUiPreferences';
import { writeStorage } from '../../src/lib/browser';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../src/lib/intro';
import { useLang } from '../../src/lib/LangContext';
import { getEffectiveMotionMode, type EffectiveMotionMode } from '../../src/lib/uiPreferences';

const FINAL_PHASE = 3;
const PHASE_DELAYS_MS = [650, 800, 1050] as const;

const COPY = {
  cs: {
    aria: 'Příběhové intro SYNTHOMA',
    signal: 'SIGNÁL NALEZEN',
    slogan: ['Tma nikdy není opravdová.', 'Je jen světlem, které se vzdalo smyslu.'],
    enter: 'VSTOUPIT',
    skip: 'PŘESKOČIT',
  },
  en: {
    aria: 'SYNTHOMA story intro',
    signal: 'SIGNAL FOUND',
    slogan: ['Darkness is never real.', 'It is only light that surrendered its meaning.'],
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
      const timer = window.setTimeout(() => setPhase(FINAL_PHASE), 240);
      return () => window.clearTimeout(timer);
    }
    if (phase >= FINAL_PHASE) return;
    const timer = window.setTimeout(
      () => setPhase((current) => Math.min(FINAL_PHASE, current + 1)),
      PHASE_DELAYS_MS[phase],
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
      <SynthomaMediaLayer src="/video/SYNTHOMA1.webm" />
      <div className="synthoma-intro__scrim" aria-hidden="true" />

      <section className="synthoma-intro__stage" aria-labelledby="synthoma-intro-title">
        <div className="synthoma-intro__signal" aria-hidden="true">
          <span />
          <strong>{copy.signal}</strong>
        </div>

        <SynthomaWordmark
          id="synthoma-intro-title"
          context="intro"
          animated={motion === 'full'}
          className="synthoma-intro__brand"
        />

        <blockquote className="synthoma-intro__slogan">
          <span>{copy.slogan[0]}</span>
          <span>{copy.slogan[1]}</span>
        </blockquote>
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
