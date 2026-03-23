"use client";
import React from "react";
import { MBTIContext } from "./MBTIProviderClient";

import { readBooleanStorage, writeStorage } from "../../src/lib/browser";

export default function MBTIHudClient() {
  const ctx = React.useContext(MBTIContext);
  // Safe fallback so hooks are never conditional and component can mount even if provider is missing
  const fallback = React.useMemo(() => ({
    scores: { I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 },
    inc: (_: Partial<{ I: number; E: number; N: number; S: number; F: number; T: number; J: number; P: number }>) => {},
    reset: () => {},
    getType: () => "INFJ",
    lastUpdated: 0,
  }), []);
  const { scores, getType, lastUpdated, reset } = ctx ?? fallback;
  const type = getType();
  const [blink, setBlink] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState<boolean>(() => {
    return readBooleanStorage('mbtiHudVisible', false);
  });
  const [rightOffset, setRightOffset] = React.useState<number>(16);
  const [compact, setCompact] = React.useState<boolean>(() => {
    return readBooleanStorage('mbtiHudCompact', false);
  });

  React.useEffect(() => {
    setMounted(true);
    if (!lastUpdated) return;
    setBlink(true);
    const t = setTimeout(() => setBlink(false), 600);
    return () => clearTimeout(t);
  }, [lastUpdated]);

  // Persist visibility state
  React.useEffect(() => {
    writeStorage('mbtiHudVisible', visible ? 'true' : 'false');
  }, [visible]);

  // Persist compact state
  React.useEffect(() => {
    writeStorage('mbtiHudCompact', compact ? 'true' : 'false');
  }, [compact]);

  // Keyboard shortcut: Alt+M toggles HUD visibility
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      try {
        const k = (e.key || '').toLowerCase();
        if (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey && (k === 'm')) {
          e.preventDefault();
          setVisible((v: boolean) => !v);
        }
      } catch {}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Compute dynamic right offset so HUD sits to the left of control panel toggle
  React.useEffect(() => {
    const compute = () => {
      try {
        const btn = document.getElementById('toggle-panel-btn');
        if (!btn) { setRightOffset(16); return; }
        const rect = btn.getBoundingClientRect();
        const gap = 12; // pixels between HUD and the button
        const fromRightToBtnLeft = Math.max(0, Math.round(window.innerWidth - rect.left));
        setRightOffset(Math.max(16, fromRightToBtnLeft + gap));
      } catch { setRightOffset(16); }
    };
    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    // recompute shortly after to account for late layout shifts
    const t = setTimeout(compute, 150);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [visible]);

  const pairPct = (a: keyof typeof scores, b: keyof typeof scores) => {
    const ta = Math.max(0, scores[a] || 0);
    const tb = Math.max(0, scores[b] || 0);
    const sum = ta + tb;
    if (sum === 0) return 50; // neutral center at first visit
    const dominant = Math.max(ta, tb);
    return Math.round((dominant / sum) * 100);
  };

  const Axis = ({ a, b }: { a: keyof typeof scores; b: keyof typeof scores }) => (
    <div className="mbti-axis">
      <div className="mbti-axis-head"><span>{a}</span><span className="grow" /><span>{b}</span></div>
      <div className="mbti-axis-bar"><div className="mbti-axis-fill" style={{ width: pairPct(a, b) + "%" }} /></div>
    </div>
  );

  if (!mounted) return null;
  if (!visible) return null;

  return (
    <div className={`mbti-hud ${blink ? "mbti-aura" : ""}`} aria-live="polite" aria-label={`MBTI ${type}`} suppressHydrationWarning style={{ right: rightOffset }}>
      <div className="mbti-chip" data-text={type} title={compact ? 'Klik: rozbalit HUD' : 'Klik: zbalit HUD'} onClick={() => setCompact((v: boolean) => !v)}>{type}</div>
      {!compact && (
        <div className="mbti-panel">
          <Axis a="E" b="I" />
          <Axis a="S" b="N" />
          <Axis a="T" b="F" />
          <Axis a="P" b="J" />
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={reset} aria-label="Resetovat MBTI na nulu">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
