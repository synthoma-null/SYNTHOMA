'use client';

import { useEffect, useRef } from 'react';
import { attachGlitchHeading } from '../../lib/glitchHeading';

export interface SynthomaWordmarkProps {
  context: 'intro' | 'home' | 'compact';
  animated?: boolean;
  className?: string;
  id?: string;
}

const TITLE = 'SYNTHOMA';

export default function SynthomaWordmark({ context, animated = true, className, id }: SynthomaWordmarkProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!animated || typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const intervalMs = context === 'intro' ? 260 : 420;
    const detach = attachGlitchHeading(root, TITLE, {
      intervalMs,
      chance: 0.08,
      perCharChance: 0.11,
      perTickMax: 3,
    });

    return () => {
      try { detach(); } catch {}
    };
  }, [animated, context]);

  return (
    <h1
      id={id}
      ref={rootRef}
      className={`synthoma-wordmark synthoma-wordmark--${context}${className ? ` ${className}` : ''}`}
    >
      <span className="synthoma-wordmark__layer synthoma-wordmark__layer--magenta" aria-hidden="true">{TITLE}</span>
      <span className="synthoma-wordmark__layer synthoma-wordmark__layer--cyan" aria-hidden="true">{TITLE}</span>
      <span className="synthoma-wordmark__text glitch-real" aria-hidden="true">
        {TITLE.split('').map((ch, idx) => (
          <span key={idx} className="synthoma-wordmark__char glitch-char">{ch}</span>
        ))}
      </span>
      <span className="synthoma-wordmark__base sr-only">{TITLE}</span>
    </h1>
  );
}
