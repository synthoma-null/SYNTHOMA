'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProfileDashboard from '../../src/components/profile/ProfileDashboard';
import { useLang } from '../../src/lib/LangContext';

export default function ProfilePanelClient() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  // Listen for custom event from IdentityPanelClient or LoginForm
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('synthoma:open-profile', handler);
    return () => document.removeEventListener('synthoma:open-profile', handler);
  }, []);

  // Auto-open after redirect from /login (?login=1) once session is ready
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') !== '1') return;
      setOpen(true);
      // Clean URL without adding to history
      params.delete('login');
      const newSearch = params.toString();
      router.replace(window.location.pathname + (newSearch ? `?${newSearch}` : ''));
    } catch {}
  }, [status, session, router]);

  // Only render for logged-in users
  if (status === 'loading' || !session?.user) return null;

  const userId = (session.user as { id?: string }).id ?? '';
  const nickname = session.user.name ?? '';

  return (
    <div
      id="profile-panel-root"
      className={`profile-panel-root${open ? ' open' : ''}`}
      ref={panelRef}
    >
      {/* Backdrop */}
      {open && (
        <div
          className="profile-panel-backdrop"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Panel */}
      <div
        id="profile-panel-popup"
        className={`profile-panel-popup${open ? ' visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('profile.panel.aria')}
        aria-hidden={open ? undefined : 'true'}
      >
        <div className="profile-panel-header">
          <span className="profile-panel-title">{t('profile.panel.title')}</span>
          <button
            className="profile-panel-close btn btn-sm"
            aria-label={t('profile.panel.close')}
            onClick={close}
          >
            ✕
          </button>
        </div>

        <div className="profile-panel-body">
          {open && (
            <ProfileDashboard
              userId={userId}
              nickname={nickname}
              mode="popup"
              onClose={close}
            />
          )}
        </div>
      </div>
    </div>
  );
}
