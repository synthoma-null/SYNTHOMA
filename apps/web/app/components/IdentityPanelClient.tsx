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

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const label = status === 'loading' ? '···' : session ? (session.user?.name ?? 'SUBJEKT') : t('id.default');

  return (
    <div className="id-panel-root" ref={panelRef}>
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
        className={`id-panel-popup${open ? ' visible' : ''}`}
        role="region"
        aria-label={t('id.aria.panel')}
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
