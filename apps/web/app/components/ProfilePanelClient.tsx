'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import ProfileDashboard from '../../src/components/profile/ProfileDashboard';

export default function ProfilePanelClient() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Listen for custom event from IdentityPanelClient
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('synthoma:open-profile', handler);
    return () => document.removeEventListener('synthoma:open-profile', handler);
  }, []);

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
        aria-label="Profil subjektu"
        aria-hidden={open ? undefined : 'true'}
      >
        <div className="profile-panel-header">
          <span className="profile-panel-title">◉ PROFIL SUBJEKTU</span>
          <button
            className="profile-panel-close btn btn-sm"
            aria-label="Zavřít profil"
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
