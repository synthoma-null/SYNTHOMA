'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import SubjectHeader from './SubjectHeader';
import PsycheMap from './PsycheMap';
import ReadingProgressPanel from './ReadingProgressPanel';
import MnemAccessPanel from './MnemAccessPanel';
import PrivacyPanel from './PrivacyPanel';
import RunDashboard from '../run/RunDashboard';

export interface ProfileData {
  user: {
    id: string;
    nickname: string;
    email: string;
    role: string;
    createdAt: string;
    lastLoginAt: string | null;
    profile: {
      displayName: string | null;
      bio: string | null;
      title: string;
      publicProfile: boolean;
      showPsycheMap: boolean;
      showProgress: boolean;
      showChoices: boolean;
    } | null;
    settings: {
      theme: string;
      animations: boolean;
      glass: boolean;
      typewriterSpeed: string;
      fontScale: number;
      audioEnabled: boolean;
      ttsEnabled: boolean;
    } | null;
    psyche: {
      ni: number; fe: number; ti: number; se: number;
      joy: number; trust: number; fear: number; surprise: number;
      sadness: number; disgust: number; anger: number; anticipation: number;
      shadow: number; tone: string; initiative: string; risk: string; tempo: string; strategy: string;
    } | null;
    _count: { choices: number; reading: number };
  };
  mnemBalance: number;
}

interface Props {
  userId: string;
  nickname: string;
  mode?: 'standalone' | 'popup';
  onClose?: () => void;
}

const TABS = [
  { key: 'overview', label: 'PŘEHLED' },
  { key: 'psyche', label: 'PSYCHÉ' },
  { key: 'cycle', label: 'CYKLUS' },
  { key: 'archive', label: 'ARCHIV' },
  { key: 'access', label: 'PŘÍSTUP' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function formatDate(value: string | null): string {
  if (!value) return 'Bez záznamu';
  return new Date(value).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' });
}

function LoadingSkeleton() {
  return (
    <div className="profile-skeleton" aria-label="Načítání profilu" aria-busy="true">
      <span /><span /><span /><span />
    </div>
  );
}

export default function ProfileDashboard({ userId, nickname, mode = 'standalone', onClose }: Props) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch('/api/me/profile', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Profile request failed');
        return response.json();
      })
      .then((profile: ProfileData) => {
        setData(profile);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setLoading(false);
        setError(true);
      });
    return () => controller.abort();
  }, [retry, userId]);

  const selectTab = useCallback((index: number) => {
    const tab = TABS[index];
    if (!tab) return;
    setActiveTab(tab.key);
    tabRefs.current[index]?.focus();
  }, []);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab((index + 1) % TABS.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab((index - 1 + TABS.length) % TABS.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(TABS.length - 1);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !data) {
    return (
      <div className="profile-error" role="alert">
        <p>Profil subjektu se nepodařilo načíst.</p>
        <button className="btn" type="button" onClick={() => setRetry((value) => value + 1)}>ZKUSIT ZNOVU</button>
      </div>
    );
  }

  const psyche = data.user.psyche;
  const cognitive = psyche ? ([['NI', psyche.ni], ['FE', psyche.fe], ['TI', psyche.ti], ['SE', psyche.se]] as const) : [];
  const strongest = cognitive.reduce<(typeof cognitive)[number] | null>((best, item) => (!best || item[1] > best[1] ? item : best), null);

  const content = (
    <div className="subject-dossier">
      <SubjectHeader
        nickname={nickname || data.user.nickname}
        title={data.user.profile?.title ?? 'Subjekt bez klasifikace'}
        createdAt={data.user.createdAt}
        choiceCount={data.user._count.choices}
        readingCount={data.user._count.reading}
        mnemBalance={data.mnemBalance}
      />

      <div className="subject-dossier__main">
        <div className="subject-dossier__topbar">
          <div>
            <span>SUBJECT DOSSIER // VERIFIED</span>
            <strong>{TABS.find((tab) => tab.key === activeTab)?.label}</strong>
          </div>
          {mode === 'standalone' && <Link href="/" className="btn profile-back-btn">ZPĚT</Link>}
        </div>

        <div className="profile-tabs" role="tablist" aria-label="Sekce profilu subjektu">
          {TABS.map((tab, index) => (
            <button
              key={tab.key}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`profile-tab-${tab.key}`}
              className={`profile-tab${activeTab === tab.key ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`profile-panel-${tab.key}`}
              tabIndex={activeTab === tab.key ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{tab.label}
            </button>
          ))}
        </div>

        <div id={`profile-panel-${activeTab}`} className="profile-content" role="tabpanel" aria-labelledby={`profile-tab-${activeTab}`} tabIndex={0}>
          {activeTab === 'overview' && (
            <section className="profile-overview" aria-labelledby="profile-overview-title">
              <div className="profile-section-heading">
                <span>STATUS // ACTIVE RECORD</span>
                <h2 id="profile-overview-title">Přehled subjektu</h2>
                <p>Identita drží pohromadě. Systém to vede jako úspěch.</p>
              </div>
              <dl className="profile-overview__metrics">
                <div><dt>MNEM balance</dt><dd>{data.mnemBalance}</dd></div>
                <div><dt>Rozhodnutí</dt><dd>{data.user._count.choices}</dd></div>
                <div><dt>Fragmenty</dt><dd>{data.user._count.reading}</dd></div>
                <div><dt>První synchronizace</dt><dd>{formatDate(data.user.createdAt)}</dd></div>
              </dl>
              <div className="profile-overview__summaries">
                <section>
                  <span>PSYCHICKÝ OTISK</span>
                  <h3>{psyche ? `${strongest?.[0] ?? '—'} // ${psyche.tone}` : 'Bez dostatku dat'}</h3>
                  <p>{psyche ? `Dominantní stopa ${strongest?.[0] ?? 'není určena'}, shadow ${psyche.shadow}. Detail zůstává v sekci Psyché.` : 'Archiv zatím nemá dost rozhodnutí pro čitelný otisk.'}</p>
                </section>
                <section>
                  <span>STAV CYKLU</span>
                  <h3>{data.user._count.choices} zaznamenaných voleb</h3>
                  <p>Podrobný stav běhů a progrese je dostupný v sekci Cyklus.</p>
                </section>
              </div>
            </section>
          )}
          {activeTab === 'psyche' && (psyche ? <PsycheMap psyche={psyche} detailed /> : <p className="profile-empty">Psychický otisk zatím není dostupný.</p>)}
          {activeTab === 'cycle' && <RunDashboard />}
          {activeTab === 'archive' && (
            <div className="profile-archive">
              <section aria-labelledby="profile-reading-title">
                <div className="profile-section-heading"><span>ARCHIV // ČTENÍ</span><h2 id="profile-reading-title">Čtenářské fragmenty</h2></div>
                <ReadingProgressPanel />
              </section>
              <section aria-labelledby="profile-mnem-title">
                <div className="profile-section-heading"><span>ARCHIV // MNEM</span><h2 id="profile-mnem-title">Přístupové stopy</h2></div>
                <MnemAccessPanel mnemBalance={data.mnemBalance} />
              </section>
            </div>
          )}
          {activeTab === 'access' && (
            <div className="profile-access">
              <section aria-labelledby="profile-access-title">
                <div className="profile-section-heading"><span>AUTH // VERIFIED</span><h2 id="profile-access-title">Přístup k účtu</h2></div>
                <dl className="profile-access__facts">
                  <div><dt>E-mail</dt><dd>{data.user.email}</dd></div>
                  <div><dt>Role</dt><dd>{data.user.role}</dd></div>
                  <div><dt>Vytvořeno</dt><dd>{formatDate(data.user.createdAt)}</dd></div>
                  <div><dt>Poslední přihlášení</dt><dd>{formatDate(data.user.lastLoginAt)}</dd></div>
                </dl>
                <div className="profile-access__actions">
                  {data.user.role === 'admin' && <Link className="btn" href="/admin" onClick={() => onClose?.()}>ADMIN</Link>}
                  <button className="btn" type="button" onClick={() => { onClose?.(); void signOut({ callbackUrl: '/' }); }}>ODHLÁSIT</button>
                </div>
              </section>
              <section aria-labelledby="profile-privacy-title">
                <div className="profile-section-heading"><span>DATA // CONTROL</span><h2 id="profile-privacy-title">Soukromí a data</h2></div>
                <PrivacyPanel profile={data.user.profile} />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return mode === 'popup' ? <div className="profile-popup-inner">{content}</div> : <main className="profile-page">{content}</main>;
}
