'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUiLayer } from '../ui-layer/UiLayerProvider';
import { isIntroCompleteForDocument } from '../../lib/intro';
import { getConsent, saveConsent } from '../../lib/consent';
import { useLang } from '../../lib/LangContext';

type Prefs = {
  preferences: boolean;
  analytics: boolean;
  readerTrace: boolean;
};

export default function CookieConsent() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ preferences: true, analytics: false, readerTrace: false });

  useEffect(() => {
    if (!getConsent()) {
      setShow(true);
    }
  }, []);

  const accept = (state: Prefs) => {
    saveConsent(state);
    setShow(false);
    setDetail(false);
  };

  const visible = show && pathname !== '/landing-intro' && (pathname !== '/' || isIntroCompleteForDocument());
  useUiLayer({ id: 'cookie-consent', type: 'consent', open: visible, onClose: () => setShow(false), restoreFocus: () => previousFocus.current?.focus() });
  useEffect(() => {
    if (!visible) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.querySelector<HTMLElement>('button, input')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]') ?? []);
      const first = elements[0]; const last = elements.at(-1);
      if (!panel.current?.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.removeEventListener('keydown', trap); previousFocus.current?.focus(); };
  }, [visible, detail]);
  if (!visible) return null;

  return (
    <div className="cc-overlay cc-overlay--compact" role="dialog" aria-modal="true" aria-label={t('cc.aria')}>
      <div ref={panel} className="cc-panel os-surface--glass">
        {!detail ? (
          <>
            <p className="cc-body">
              {lang === 'en' ? 'Choose whether to save your preferences, reading trace and analytics. Optional storage is up to you.' : 'Vyber si ukládání nastavení, čtenářské stopy a analytiky. Volitelné ukládání je na tobě.'}
            </p>
            <div className="cc-actions">
              <button
                className="cc-btn cc-btn-primary"
                onClick={() => accept({ preferences: true, analytics: true, readerTrace: true })}
              >
                {t('cc.accept.all')}
              </button>
              <button
                className="cc-btn cc-btn-secondary"
                onClick={() => accept({ preferences: false, analytics: false, readerTrace: false })}
              >
                {t('cc.accept.necessary')}
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(true)}
              >
                {t('cc.configure')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cc-categories">
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.necessary')}</span>
                  <span className="cc-cat-badge cc-always">{t('cc.cat.always')}</span>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.necessary.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.preferences')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.preferences}
                      aria-label={t('cc.cat.preferences')}
                      onChange={e => setPrefs(p => ({ ...p, preferences: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.preferences.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.analytics')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      aria-label={t('cc.cat.analytics')}
                      onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.analytics.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.reader')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.readerTrace}
                      aria-label={t('cc.cat.reader')}
                      onChange={e => setPrefs(p => ({ ...p, readerTrace: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.reader.desc')}</p>
              </div>
            </div>
            <div className="cc-actions">
              <button className="cc-btn cc-btn-primary" onClick={() => accept(prefs)}>
                {t('cc.save')}
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(false)}
              >
                {t('cc.back')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
