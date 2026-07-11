'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useLang } from '../../src/lib/LangContext';

export default function IdentityPanelClient() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const restoreFocusRef = useRef(true);

  useEffect(() => {
    const toggle = () => {
      restoreFocusRef.current = true;
      setOpen((value) => !value);
    };
    const close = (event: Event) => {
      const detail = (event as CustomEvent<{ restoreFocus?: boolean }>).detail;
      restoreFocusRef.current = detail?.restoreFocus !== false;
      setOpen(false);
    };
    document.addEventListener('synthoma:identity-toggle', toggle);
    document.addEventListener('synthoma:identity-close', close);
    document.addEventListener('synthoma:control-panel-open', close);
    document.addEventListener('synthoma:audio-open', close);
    return () => {
      document.removeEventListener('synthoma:identity-toggle', toggle);
      document.removeEventListener('synthoma:identity-close', close);
      document.removeEventListener('synthoma:control-panel-open', close);
      document.removeEventListener('synthoma:audio-open', close);
    };
  }, []);

  useEffect(() => {
    const trigger = document.querySelector<HTMLButtonElement>('[data-cyklus-command="identity"]');
    trigger?.setAttribute('aria-expanded', String(open));
    trigger?.setAttribute('aria-pressed', String(open));
    if (open) {
      setTimeout(() => popupRef.current?.querySelector<HTMLElement>('button, a, [tabindex="0"]')?.focus(), 0);
    } else if (wasOpenRef.current && restoreFocusRef.current) {
      setTimeout(() => trigger?.focus(), 0);
    }
    wasOpenRef.current = open;
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        restoreFocusRef.current = true;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        restoreFocusRef.current = true;
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const label = status === 'loading' ? '···' : session ? (session.user?.name ?? 'SUBJEKT') : t('id.default');

  return (
    <div className="id-panel-root" ref={panelRef}>
      <Link className="id-panel-home" href="/" aria-label="Zpět na hlavní stránku" tabIndex={0}>⌂</Link>
      <button className="id-panel-home" id="toggle-panel-btn" type="button" aria-expanded="false" aria-controls="control-panel" aria-label="Ovládací panel" tabIndex={0}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
      <button
        className={`id-panel-btn${open ? ' active' : ''}`}
        aria-expanded={open}
        aria-controls="id-panel-popup"
        aria-label={t('id.aria.btn')}
        onClick={() => setOpen(v => !v)}
      >
        <span className="id-panel-icon">{session ? '◉' : '○'}</span>
        <span className="id-panel-label">{label}</span>
      </button>

      <div
        id="id-panel-popup"
        ref={popupRef}
        className={`id-panel-popup${open ? ' visible' : ''}`}
        role="region"
        aria-label={t('id.aria.panel')}
        aria-hidden={!open}
      >
        {session ? (
          <>
            <div className="id-panel-log">
              <span className="id-panel-log-prefix">LOG [SUBJEKT]:</span>
              <span className="id-panel-log-msg">&#8222;{t('id.log.verified')}&#8220;</span>
            </div>
            <p className="id-panel-name">{session.user?.name ?? 'subjekt'}</p>
            <p className="id-panel-email">{session.user?.email ?? ''}</p>
            <div className="id-panel-links">
              <button
                className="id-panel-link btn btn-sm"
                onClick={() => {
                  setOpen(false);
                  document.dispatchEvent(new CustomEvent('synthoma:open-profile'));
                }}
              >
                {t('id.profile')}
              </button>
              {(session.user as { role?: string })?.role === 'admin' && (
                <Link className="id-panel-link btn btn-sm id-panel-admin" href="/admin" onClick={() => setOpen(false)}>
                  {t('id.admin')}
                </Link>
              )}
              <button
                className="id-panel-link btn btn-sm id-panel-signout"
                onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }}
              >
                {t('id.signout')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="id-panel-log">
              <span className="id-panel-log-prefix">LOG [AUTH_GATE]:</span>
              <span className="id-panel-log-msg">&#8222;{t('id.log.unrecognised')}&#8220;</span>
            </div>
            <div className="id-panel-links">
              <Link className="id-panel-link btn btn-sm" href="/login" onClick={() => setOpen(false)}>
                {t('id.login')}
              </Link>
              <Link className="id-panel-link btn btn-sm" href="/register" onClick={() => setOpen(false)}>
                {t('id.register')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
