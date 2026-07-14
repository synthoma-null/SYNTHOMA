'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { loadLocalSubjectProfile } from '../../game/cyklus/cyklusLocalProfile';
import { STAT_LABELS, type StatKey } from '../../game/cyklus/cyklusTypes';

const STAT_KEYS: StatKey[] = ['energy', 'memory', 'bond', 'control'];

function formatDate(timestamp: number | null): string {
  return timestamp ? new Date(timestamp).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }) : 'ZATÍM BEZ ZÁZNAMU';
}

export default function LocalSubjectProfile() {
  const profile = useMemo(() => loadLocalSubjectProfile(), []);

  return (
    <section className="local-subject-profile" data-profile-state={profile.state} aria-labelledby="local-subject-title">
      <header className="local-subject-profile__header">
        <span>SUBJECT // LOCAL</span>
        <h2 id="local-subject-title">LOKÁLNÍ SUBJEKT</h2>
        <strong>NEOVĚŘENÝ ZÁZNAM</strong>
        <p>Tento profil existuje pouze v tomto zařízení.<br />Systém si vás pamatuje, dokud mu paměť nesmažete.</p>
      </header>

      {profile.state === 'local-empty' ? (
        <div className="profile-data-notice" role="status">
          <strong>LOCAL EMPTY</strong>
          <span>Cyklus zatím nezaznamenal žádné rozhodnutí. Překvapivě čistý spis.</span>
        </div>
      ) : null}

      <dl className="local-subject-profile__metrics">
        <div><dt>Rozhodnutí</dt><dd>{profile.decisions.length}</dd></div>
        <div><dt>Dokončené běhy</dt><dd>{profile.completedRuns}</dd></div>
        <div><dt>Poslední cyklus</dt><dd>{profile.lastCycle || '—'}</dd></div>
        <div><dt>Objevené karty</dt><dd>{profile.discoveredCards}</dd></div>
        <div><dt>Objevené fragmenty</dt><dd>{profile.discoveredFragments}</dd></div>
        <div><dt>MNEM</dt><dd>NEPŘIPOJENO</dd></div>
      </dl>

      <section className="local-subject-profile__section" aria-labelledby="local-stats-title">
        <h3 id="local-stats-title">POSLEDNÍ STAV</h3>
        {profile.stats ? (
          <dl className="local-subject-profile__stats">
            {STAT_KEYS.map((key) => <div key={key}><dt>{STAT_LABELS[key]}</dt><dd>{profile.stats?.[key]}</dd></div>)}
          </dl>
        ) : <p>ZATÍM BEZ ZÁZNAMU</p>}
      </section>

      <section className="local-subject-profile__section" aria-labelledby="local-psyche-title">
        <h3 id="local-psyche-title">ZÁKLADNÍ PSYCHICKÝ OTISK</h3>
        {profile.psyche ? <p><strong>{profile.psyche.dominantLabel}</strong> · {profile.psyche.archetype} · stabilita {profile.psyche.stability}</p> : <p>Na výpočet zatím není dost rozhodnutí.</p>}
        <p>Poslední aktivita: {formatDate(profile.lastActivityAt)}</p>
      </section>

      <section className="local-subject-profile__section" aria-labelledby="local-decisions-title">
        <h3 id="local-decisions-title">POSLEDNÍ ZAZNAMENANÉ VOLBY</h3>
        {profile.latestDecisions.length ? (
          <ol className="local-subject-profile__decisions">
            {profile.latestDecisions.map((decision) => (
              <li key={`${decision.runId}-${decision.timestamp}-${decision.cardId}`}>
                <strong>{decision.cardTitle}</strong>
                <span>{decision.choiceLabel}</span>
                <time dateTime={new Date(decision.timestamp).toISOString()}>{formatDate(decision.timestamp)}</time>
                <small>{STAT_KEYS.map((key) => `${STAT_LABELS[key]} ${decision.resultingStats[key]}`).join(' · ')}</small>
              </li>
            ))}
          </ol>
        ) : <p>ZATÍM BEZ ZÁZNAMU</p>}
      </section>

      <footer className="local-subject-profile__footer">
        <p>Přihlášením lze další postup synchronizovat.</p>
        <Link className="btn" href="/login">PŘIHLÁSIT SE</Link>
      </footer>
    </section>
  );
}
