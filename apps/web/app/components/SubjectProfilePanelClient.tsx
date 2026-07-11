'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileDashboard from '../../src/components/profile/ProfileDashboard';
import { useLang } from '../../src/lib/LangContext';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function SubjectProfilePanelClient() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const isCyklusGameplay = pathname === '/cyklus';
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const restoreFocusRef = useRef(true);

  const rememberTrigger = useCallback(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.matches('[data-cyklus-command="identity"], .id-panel-btn')) {
      returnFocusRef.current = active;
    } else {
      returnFocusRef.current = document.querySelector<HTMLElement>('[data-cyklus-command="identity"], .id-panel-btn');
    }
  }, []);

  const openPanel = useCallback(() => {
    rememberTrigger();
    restoreFocusRef.current = true;
    document.dispatchEvent(new CustomEvent('synthoma:control-panel-close', { detail: { restoreFocus: false } }));
    document.dispatchEvent(new CustomEvent('synthoma:audio-close', { detail: { restoreFocus: false } }));
    setOpen(true);
  }, [rememberTrigger]);

  const closePanel = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    const toggle = () => (open ? closePanel() : openPanel());
    const openProfile = () => openPanel();
    const close = (event: Event) => {
      const detail = (event as CustomEvent<{ restoreFocus?: boolean }>).detail;
      closePanel(detail?.restoreFocus !== false);
    };
    const closeForCompetingPanel = () => closePanel(false);

    document.addEventListener('synthoma:identity-toggle', toggle);
    document.addEventListener('synthoma:open-profile', openProfile);
    document.addEventListener('synthoma:identity-close', close);
    document.addEventListener('synthoma:control-panel-open', closeForCompetingPanel);
    document.addEventListener('synthoma:audio-open', closeForCompetingPanel);
    return () => {
      document.removeEventListener('synthoma:identity-toggle', toggle);
      document.removeEventListener('synthoma:open-profile', openProfile);
      document.removeEventListener('synthoma:identity-close', close);
      document.removeEventListener('synthoma:control-panel-open', closeForCompetingPanel);
      document.removeEventListener('synthoma:audio-open', closeForCompetingPanel);
    };
  }, [closePanel, open, openPanel]);

  useEffect(() => {
    const triggers = document.querySelectorAll<HTMLElement>('[data-cyklus-command="identity"], .id-panel-btn');
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-pressed', String(open));
    });
    if (open) setTimeout(() => closeRef.current?.focus(), 0);
    else if (wasOpenRef.current && restoreFocusRef.current) setTimeout(() => returnFocusRef.current?.focus(), 0);
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closePanel, open]);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') !== '1') return;
      openPanel();
      params.delete('login');
      const search = params.toString();
      router.replace(window.location.pathname + (search ? `?${search}` : ''));
    } catch {}
  }, [openPanel, router, session, status]);

  const label = status === 'loading' ? '...' : session?.user?.name ?? t('id.default');
  const userId = (session?.user as { id?: string } | undefined)?.id ?? '';

  return (
    <div className={`id-panel-root${isCyklusGameplay ? ' id-panel-root--cyklus' : ''}`}>
      {!isCyklusGameplay && (
        <>
          <Link className="id-panel-home" href="/" aria-label="Zpět na hlavní stránku">⌂</Link>
          <button className="id-panel-home" id="toggle-panel-btn" type="button" aria-expanded="false" aria-pressed="false" aria-controls="control-panel" aria-label="Ovládací panel">
            <span aria-hidden="true">⚙</span>
          </button>
          <button className={`id-panel-btn${open ? ' active' : ''}`} type="button" aria-expanded={open} aria-pressed={open} aria-controls="id-panel-popup" aria-label={t('id.aria.btn')} onClick={() => (open ? closePanel() : openPanel())}>
            <span className="id-panel-icon" aria-hidden="true">{session ? '◉' : '○'}</span>
            <span className="id-panel-label">{label}</span>
          </button>
        </>
      )}

      <div id="profile-panel-root" className={`profile-panel-root${open ? ' open' : ''}`}>
        {open && <button className="profile-panel-backdrop" type="button" tabIndex={-1} aria-label="Zavřít profil kliknutím mimo panel" onClick={() => closePanel()} />}
        <div id="id-panel-popup" ref={dialogRef} className={`profile-panel-popup${open ? ' visible' : ''}`} role="dialog" aria-modal="true" aria-label={t('profile.panel.aria')} aria-hidden={open ? undefined : true}>
          <div className="profile-panel-header">
            <span className="profile-panel-title">{t('profile.panel.title')}</span>
            <button ref={closeRef} className="profile-panel-close btn btn-sm" type="button" aria-label={t('profile.panel.close')} onClick={() => closePanel()}>×</button>
          </div>
          <div className="profile-panel-body">
            {open && status === 'authenticated' && session?.user ? (
              <ProfileDashboard userId={userId} nickname={session.user.name ?? ''} mode="popup" onClose={() => closePanel()} />
            ) : open && status !== 'loading' ? (
              <section className="subject-auth-gate" aria-labelledby="subject-auth-title">
                <span className="subject-auth-gate__code">AUTH_GATE // 401</span>
                <h2 id="subject-auth-title">IDENTITA NEROZPOZNÁNA</h2>
                <p>Systém neví, kdo jsi. Tentokrát to není metafora.</p>
                <div className="subject-auth-gate__actions">
                  <Link className="btn" href="/login" onClick={() => closePanel(false)}>{t('id.login')}</Link>
                  <Link className="btn" href="/register" onClick={() => closePanel(false)}>{t('id.register')}</Link>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
