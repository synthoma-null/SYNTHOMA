'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LangSwitcher from '../../src/components/LangSwitcher';
import { useUiPreferences } from '../../src/hooks/useUiPreferences';
import { useLang } from '../../src/lib/LangContext';
import { applyUiPreferencePreset, getEffectiveMotionMode, getMatchingUiPreferencePreset, resetUiPreferences, updateUiPreferences, type MotionMode, type ReaderLineHeight, type ReaderWidth, type TextEffectsMode, type TypewriterSpeed, type UiPreferencePresetId } from '../../src/lib/uiPreferences';
import ThemeShopClient from './ThemeShopClient';
import ControlCenterAudio from './ControlCenterAudio';
import PwaSettings from '../../src/components/pwa/PwaSettings';

type TabId = 'display' | 'motion' | 'reading' | 'sound' | 'app';

const TEXT = {
  cs: {
    title: 'OVLÁDACÍ CENTRUM', close: 'Zavřít nastavení', done: 'Hotovo', reset: 'Obnovit výchozí',
    display: 'Vzhled', motion: 'Pohyb', reading: 'Čtení', sound: 'Zvuk', app: 'Aplikace', language: 'Jazyk', theme: 'Motiv',
    font: 'Velikost textu', opacity: 'PRŮHLEDNOST ČTECÍ PLOCHY', glass: 'Skleněný efekt', blur: 'Rozostření skla',
    motionMode: 'Režim pohybu', background: 'Pohyblivé pozadí', glitch: 'Glitch textu', noise: 'Šum', scanlines: 'Řádkování obrazovky', textEffects: 'Textové efekty',
    typewriter: 'Rychlost psaní', focus: 'Režim soustředění', tts: 'Čtení nahlas', readerWidth: 'Šířka textu', readerLineHeight: 'Řádkování', effectIntensity: 'Intenzita efektů',
    confirmTitle: 'Obnovit výchozí nastavení?', confirmBody: 'Motiv, pohyb, čtení i zvuk se vrátí do výchozího stavu.', cancel: 'Zrušit', confirm: 'Obnovit',
    presets: 'Předvolby', custom: 'VLASTNÍ', presetConfirm: 'Nahradit vlastní úpravy?', presetBody: 'Vybraná předvolba změní pouze uvedená nastavení.', apply: 'Použít', effective: 'Efektivní stav', systemReason: 'Určuje systémové nastavení omezení pohybu.', directReason: 'Určuje ručně zvolený režim.', context: 'PRO TUTO OBRAZOVKU',
  },
  en: {
    title: 'CONTROL CENTER', close: 'Close settings', done: 'Done', reset: 'Restore defaults',
    display: 'Display', motion: 'Motion', reading: 'Reading', sound: 'Sound', app: 'Application', language: 'Language', theme: 'Theme',
    font: 'Text size', opacity: 'Reader surface opacity', glass: 'Glass effect', blur: 'Glass blur',
    motionMode: 'Motion mode', background: 'Moving background', glitch: 'Text glitch', noise: 'Noise', scanlines: 'Scanlines', textEffects: 'Text effects',
    typewriter: 'Typing speed', focus: 'Focus mode', tts: 'Read aloud', readerWidth: 'Text width', readerLineHeight: 'Line spacing', effectIntensity: 'Effect intensity',
    confirmTitle: 'Restore default settings?', confirmBody: 'Theme, motion, reading and sound return to their default state.', cancel: 'Cancel', confirm: 'Restore',
    presets: 'Presets', custom: 'CUSTOM', presetConfirm: 'Replace custom changes?', presetBody: 'The selected preset changes only the listed preferences.', apply: 'Apply', effective: 'Effective state', systemReason: 'Determined by the system reduced-motion setting.', directReason: 'Determined by the selected motion mode.', context: 'FOR THIS SCREEN',
  },
} as const;

const MOTION_OPTIONS: MotionMode[] = ['system', 'full', 'reduced', 'off'];
const TEXT_EFFECT_OPTIONS: TextEffectsMode[] = ['normal', 'reduced', 'off'];
const TYPEWRITER_OPTIONS: TypewriterSpeed[] = ['slow', 'normal', 'fast', 'instant'];
const READER_WIDTH_OPTIONS: ReaderWidth[] = ['narrow', 'standard', 'wide'];
const READER_LINE_HEIGHT_OPTIONS: ReaderLineHeight[] = ['compact', 'comfortable', 'airy'];
const PRESET_LABELS: Record<UiPreferencePresetId, { cs: string; en: string; detail: string }> = {
  canon: { cs: 'KANON', en: 'CANON', detail: 'SYSTEM / VIDEO / STANDARD' },
  focus: { cs: 'SOUSTŘEDĚNÍ', en: 'FOCUS', detail: 'STATIC / INSTANT / QUIET' },
  saver: { cs: 'ÚSPORNÝ', en: 'SAVER', detail: 'NO LOOPS / NO MEDIA' },
  calm: { cs: 'KLIDNÝ', en: 'CALM', detail: 'REDUCED / READABLE' },
};

function Toggle({ label, pressed, onChange }: { label: string; pressed: boolean; onChange: (next: boolean) => void }) {
  return <button className="control-center__toggle" type="button" aria-pressed={pressed} onClick={() => onChange(!pressed)}><span>{label}</span><span aria-hidden="true">{pressed ? 'ON' : 'OFF'}</span></button>;
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (next: T) => void }) {
  return <fieldset className="control-center__field"><legend>{label}</legend><div className="control-center__segments">{options.map((option) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div></fieldset>;
}

export default function ControlCenterClient() {
  const pathname = usePathname() ?? '/';
  const { lang } = useLang();
  const copy = TEXT[lang];
  const preferences = useUiPreferences();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>('display');
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<UiPreferencePresetId | null>(null);
  const [systemReduced, setSystemReduced] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const readingContext = pathname.startsWith('/chapter/') || pathname.startsWith('/reader');
  const matchingPreset = getMatchingUiPreferencePreset(preferences);
  const effectiveMotion = getEffectiveMotionMode(preferences, systemReduced);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const sync = () => setSystemReduced(media?.matches ?? false);
    sync();
    media?.addEventListener?.('change', sync);
    return () => media?.removeEventListener?.('change', sync);
  }, []);

  const close = (restoreFocus = true) => {
    setOpen(false);
    setConfirmReset(false);
    if (restoreFocus) requestAnimationFrame(() => restoreFocusRef.current?.focus());
  };

  useEffect(() => {
    const trigger = document.getElementById('toggle-panel-btn');
    const openPanel = () => {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      document.dispatchEvent(new CustomEvent('synthoma:control-panel-open'));
    };
    const togglePanel = () => open ? close() : openPanel();
    const closePanel = (event: Event) => close((event as CustomEvent<{ restoreFocus?: boolean }>).detail?.restoreFocus !== false);
    document.addEventListener('synthoma:control-panel-toggle', togglePanel);
    document.addEventListener('synthoma:control-panel-close', closePanel);
    trigger?.setAttribute('aria-expanded', String(open));
    if (open) requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener('synthoma:control-panel-toggle', togglePanel);
      document.removeEventListener('synthoma:control-panel-close', closePanel);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]') ?? []);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;

  const tabs: TabId[] = readingContext ? ['display', 'motion', 'reading', 'sound', 'app'] : ['display', 'motion', 'sound', 'app'];

  return <>
    <button className="control-center__backdrop is-visible" type="button" aria-label={copy.close} onClick={() => close()} />
    <div id="control-panel" ref={panelRef} className="control-panel control-center visible" role="dialog" aria-modal="true" aria-labelledby="control-center-title">
      <header className="control-center__header"><div><span className="control-center__kicker">SYS / CTRL</span><h2 id="control-center-title">{copy.title}</h2><p>SYNTHOMA OS // USER CHANNEL</p></div><button ref={closeRef} className="control-center__close" type="button" aria-label={copy.close} onClick={() => close()}>×</button></header>
      <section className="control-center__presets" aria-labelledby="control-presets-title"><div><h3 id="control-presets-title">{copy.presets}</h3><span>{matchingPreset ? PRESET_LABELS[matchingPreset][lang] : copy.custom}</span></div><div>{(Object.keys(PRESET_LABELS) as UiPreferencePresetId[]).map((id) => <button key={id} type="button" aria-pressed={matchingPreset === id} title={PRESET_LABELS[id].detail} onClick={() => { if (matchingPreset === null) setPendingPreset(id); else applyUiPreferencePreset(id); }}>{PRESET_LABELS[id][lang]}</button>)}</div></section>
      <div className="control-center__tabs" role="tablist" aria-label={copy.title}>{tabs.map((id) => <button key={id} id={`control-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls={`control-tabpanel-${id}`} onClick={() => setTab(id)}>{copy[id]}</button>)}</div>
      <div className="control-center__body">
        {tab === 'display' ? <section id="control-tabpanel-display" role="tabpanel" aria-labelledby="control-tab-display">
          <h3>{copy.language}</h3><LangSwitcher />
          <h3>{copy.theme}</h3><ThemeShopClient />
          <label className="control-center__range"><span>{copy.font}</span><input type="range" min="0.8" max="1.4" step="0.05" value={preferences.fontScale} aria-label={copy.font} aria-valuetext={`${Math.round(preferences.fontScale * 100)} %`} onChange={(event) => updateUiPreferences({ fontScale: Number(event.target.value) })} /><output>{Math.round(preferences.fontScale * 100)}%</output></label>
          <div className="control-center__font-steps" aria-label={copy.font}><button type="button" aria-label={`${copy.font} -`} onClick={() => updateUiPreferences({ fontScale: preferences.fontScale - 0.05 })}>−</button><button type="button" onClick={() => updateUiPreferences({ fontScale: 1 })}>100 %</button><button type="button" aria-label={`${copy.font} +`} onClick={() => updateUiPreferences({ fontScale: preferences.fontScale + 0.05 })}>+</button></div>
          <label className="control-center__range"><span>{copy.opacity}</span><input type="range" min="0.4" max="1" step="0.05" value={preferences.readerOpacity} aria-label={copy.opacity} aria-valuetext={`${Math.round(preferences.readerOpacity * 100)} %`} onChange={(event) => updateUiPreferences({ readerOpacity: Number(event.target.value) })} /><output>{Math.round(preferences.readerOpacity * 100)}%</output></label>
          <Toggle label={copy.glass} pressed={preferences.glassEnabled} onChange={(glassEnabled) => updateUiPreferences({ glassEnabled })} />
          <label className="control-center__range"><span>{copy.blur}</span><input type="range" min="0" max="24" step="1" value={preferences.glassBlur} disabled={!preferences.glassEnabled} aria-label={copy.blur} aria-valuetext={`${preferences.glassBlur} px`} onChange={(event) => updateUiPreferences({ glassBlur: Number(event.target.value) })} /><output>{preferences.glassBlur}px</output></label>
        </section> : null}
        {tab === 'motion' ? <section id="control-tabpanel-motion" role="tabpanel" aria-labelledby="control-tab-motion">
          <Segmented label={copy.motionMode} value={preferences.motionMode} options={MOTION_OPTIONS} onChange={(motionMode) => updateUiPreferences({ motionMode })} />
          <Toggle label={copy.background} pressed={preferences.backgroundMotion !== 'off'} onChange={(enabled) => updateUiPreferences({ backgroundMotion: enabled ? 'auto' : 'off' })} />
          <Toggle label={copy.glitch} pressed={preferences.glitchEffects} onChange={(glitchEffects) => updateUiPreferences({ glitchEffects })} />
          <Toggle label={copy.noise} pressed={preferences.noiseEffects} onChange={(noiseEffects) => updateUiPreferences({ noiseEffects })} />
          <Toggle label={copy.scanlines} pressed={preferences.scanlines} onChange={(scanlines) => updateUiPreferences({ scanlines })} />
          <Segmented label={copy.textEffects} value={preferences.textEffects} options={TEXT_EFFECT_OPTIONS} onChange={(textEffects) => updateUiPreferences({ textEffects })} />
          <p className="control-center__effective" aria-live="polite"><strong>{copy.effective}: {effectiveMotion.toUpperCase()}</strong><span>{preferences.motionMode === 'system' ? copy.systemReason : copy.directReason}</span></p>
        </section> : null}
        {tab === 'reading' && readingContext ? <section id="control-tabpanel-reading" role="tabpanel" aria-labelledby="control-tab-reading">
          <h3>{copy.context}</h3>
          <Segmented label={copy.readerWidth} value={preferences.readerWidth} options={READER_WIDTH_OPTIONS} onChange={(readerWidth) => updateUiPreferences({ readerWidth })} />
          <Segmented label={copy.readerLineHeight} value={preferences.readerLineHeight} options={READER_LINE_HEIGHT_OPTIONS} onChange={(readerLineHeight) => updateUiPreferences({ readerLineHeight })} />
          <label className="control-center__range"><span>{copy.effectIntensity}</span><input type="range" min="0" max="1" step="0.05" value={preferences.effectIntensity} aria-label={copy.effectIntensity} aria-valuetext={`${Math.round(preferences.effectIntensity * 100)} %`} onChange={(event) => updateUiPreferences({ effectIntensity: Number(event.target.value) })} /><output>{Math.round(preferences.effectIntensity * 100)}%</output></label>
          <Segmented label={copy.typewriter} value={preferences.typewriterSpeed} options={TYPEWRITER_OPTIONS} onChange={(typewriterSpeed) => updateUiPreferences({ typewriterSpeed })} />
          <Toggle label={copy.focus} pressed={preferences.focusMode} onChange={(focusMode) => updateUiPreferences({ focusMode })} />
          <Toggle label={copy.tts} pressed={preferences.ttsEnabled} onChange={(ttsEnabled) => updateUiPreferences({ ttsEnabled })} />
        </section> : null}
        {tab === 'sound' ? <section id="control-tabpanel-sound" role="tabpanel" aria-labelledby="control-tab-sound"><ControlCenterAudio /></section> : null}
        {tab === 'app' ? <section id="control-tabpanel-app" role="tabpanel" aria-labelledby="control-tab-app"><PwaSettings lang={lang} /></section> : null}
      </div>
      <footer className="control-center__footer"><button type="button" onClick={() => setConfirmReset(true)}>{copy.reset}</button><button type="button" className="control-center__done" onClick={() => close()}>{copy.done}</button></footer>
    </div>
    {confirmReset ? <div className="control-center__confirm" role="alertdialog" aria-modal="true" aria-labelledby="control-reset-title"><div><h2 id="control-reset-title">{copy.confirmTitle}</h2><p>{copy.confirmBody}</p><div><button type="button" onClick={() => setConfirmReset(false)}>{copy.cancel}</button><button type="button" onClick={() => { resetUiPreferences(); setConfirmReset(false); }}>{copy.confirm}</button></div></div></div> : null}
    {pendingPreset ? <div className="control-center__confirm" role="alertdialog" aria-modal="true" aria-labelledby="control-preset-title"><div><h2 id="control-preset-title">{copy.presetConfirm}</h2><p>{copy.presetBody}<br />{PRESET_LABELS[pendingPreset].detail}</p><div><button type="button" onClick={() => setPendingPreset(null)}>{copy.cancel}</button><button type="button" onClick={() => { applyUiPreferencePreset(pendingPreset); setPendingPreset(null); }}>{copy.apply}</button></div></div></div> : null}
  </>;
}
