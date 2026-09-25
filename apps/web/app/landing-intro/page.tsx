'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SynthomaMediaLayer from '../../src/components/synthoma-os/SynthomaMediaLayer';
import SynthomaWordmark from '../../src/components/synthoma/SynthomaWordmark';
import { useUiLayer } from '../../src/components/ui-layer/UiLayerProvider';
import { useUiPreferences } from '../../src/hooks/useUiPreferences';
import { completeIntroForDocument } from '../../src/lib/intro';
import { useLang } from '../../src/lib/LangContext';
import { getEffectiveMotionMode, type EffectiveMotionMode } from '../../src/lib/uiPreferences';

const COPY = {
  cs: {
    aria: 'Vítejte v SYNTHOMA',
    slogan: ['Tma nikdy není opravdová.', 'Je jen světlem, které se vzdalo smyslu.'],
    enter: 'VSTOUPIT',
  },
  en: {
    aria: 'Welcome to SYNTHOMA',
    slogan: ['Darkness is never real.', 'It is only light that surrendered its meaning.'],
    enter: 'ENTER',
  },
} as const;

function quoteLetters(text: string, line: number) {
  return Array.from(text, (letter, index) =>
    index % 11 === 3 && /\p{L}/u.test(letter)
      ? <span key={index} className="synthoma-intro__letter" style={{ animationDelay: `${1.8 + line * 2.1 + index * 0.14}s` }}>{letter}</span>
      : letter,
  );
}

export default function LandingIntroPage() {
  const router = useRouter();
  const { lang } = useLang();
  const copy = COPY[lang];
  const preferences = useUiPreferences();
  const [phase, setPhase] = useState(0);
  const [systemReduced, setSystemReduced] = useState(false);
  const motion: EffectiveMotionMode = getEffectiveMotionMode(preferences, systemReduced);

  const finishIntro = useCallback(() => {
    completeIntroForDocument();
    document.documentElement.removeAttribute('data-synthoma-intro-pending');
    router.replace(`/${window.location.search || (lang === 'en' ? '?locale=en' : '')}`);
  }, [router, lang]);

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
    if (motion !== 'full') { setPhase(4); return; }
    if (phase >= 4) return;
    const timer = window.setTimeout(() => setPhase(value => value + 1), [650, 900, 1200, 900][phase]);
    return () => window.clearTimeout(timer);
  }, [motion, phase]);

  return (
    <main
      className="synthoma-intro"
      aria-label={copy.aria}
      data-motion={motion}
      data-phase={phase}
    >
      <SynthomaMediaLayer src="/video/SYNTHOMA1.webm" />
      <div className="synthoma-intro__scrim" aria-hidden="true" />

      <section className="synthoma-intro__stage" aria-labelledby="synthoma-intro-title">
        <SynthomaWordmark
          id="synthoma-intro-title"
          context="intro"
          animated={motion === 'full'}
          className="synthoma-intro__brand"
        />

        <blockquote className="synthoma-intro__slogan">
          <p className="sr-only">{copy.slogan.join(' ')}</p>
          <span aria-hidden="true" data-text={copy.slogan[0]}>{quoteLetters(copy.slogan[0], 0)}</span>
          <span aria-hidden="true" data-text={copy.slogan[1]}>{quoteLetters(copy.slogan[1], 1)}</span>
        </blockquote>
        {phase >= 4 && <div className="synthoma-intro__actions">
          <button className="os-command synthoma-intro__enter" type="button" onClick={closeLayer} autoFocus>
            {copy.enter}
          </button>
        </div>}
      </section>
    </main>
  );
}
