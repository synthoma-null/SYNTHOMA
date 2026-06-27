'use client';

import { useEffect, useState } from 'react';
import { useLang } from '../../lib/LangContext';
import Link from 'next/link';
import SubjectHeader from './SubjectHeader';
import PsycheMap from './PsycheMap';
import ReadingProgressPanel from './ReadingProgressPanel';
import MnemAccessPanel from './MnemAccessPanel';
import SettingsPanel from './SettingsPanel';
import PrivacyPanel from './PrivacyPanel';
import RunDashboard from '../run/RunDashboard';

interface ProfileData {
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

export default function ProfileDashboard({ userId, nickname, mode = 'standalone', onClose }: Props) {
  const { t } = useLang();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'psyche' | 'cycle' | 'reading' | 'mnems' | 'settings' | 'privacy'>('overview');

  useEffect(() => {
    fetch('/api/me/profile')
      .then((r) => r.json())
      .then((d) => { setData(d as ProfileData); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="profile-loading">
        <span className="glitch" data-text={t('profile.loading')}>{t('profile.loading')}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profile-error">{t('profile.error')}</div>
    );
  }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'overview', label: t('profile.tab.overview') },
    { key: 'psyche', label: t('profile.tab.psyche') },
    { key: 'cycle', label: t('profile.tab.cycle') },
    { key: 'reading', label: t('profile.tab.reading') },
    { key: 'mnems', label: t('profile.tab.mnems') },
    { key: 'settings', label: t('profile.tab.settings') },
    { key: 'privacy', label: t('profile.tab.privacy') },
  ];

  const inner = (
    <>
      {mode === 'standalone' && (
        <div className="profile-nav-back">
          <Link href="/" className="btn profile-back-btn">{t('profile.back')}</Link>
        </div>
      )}
      <SubjectHeader
        nickname={nickname}
        title={data.user.profile?.title ?? t('subject.title.default')}
        createdAt={data.user.createdAt}
        choiceCount={data.user._count.choices}
        readingCount={data.user._count.reading}
        mnemBalance={data.mnemBalance}
      />

      <nav className="profile-tabs" aria-label={t('profile.tabs.aria')}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`profile-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="profile-content">
        {activeTab === 'overview' && data.user.psyche && (
          <PsycheMap psyche={data.user.psyche} />
        )}
        {activeTab === 'psyche' && data.user.psyche && (
          <PsycheMap psyche={data.user.psyche} detailed />
        )}
        {activeTab === 'cycle' && (
          <RunDashboard />
        )}
        {activeTab === 'reading' && (
          <ReadingProgressPanel />
        )}
        {activeTab === 'mnems' && (
          <MnemAccessPanel mnemBalance={data.mnemBalance} />
        )}
        {activeTab === 'settings' && (
          <SettingsPanel settings={data.user.settings} />
        )}
        {activeTab === 'privacy' && (
          <PrivacyPanel profile={data.user.profile} />
        )}
      </div>
    </>
  );

  if (mode === 'popup') {
    return <div className="profile-popup-inner">{inner}</div>;
  }

  return <main className="profile-page">{inner}</main>;
}
