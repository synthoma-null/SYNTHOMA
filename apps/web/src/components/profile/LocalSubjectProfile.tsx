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
  const hasData = profile.state === 'local-active';

  return (
    <section className="local-subject-profile" data-profile-state={profile.state} aria-labelledby="local-subject-title">
      <header className="local-subject-profile__header">
        <span>SUBJECT // LOCAL</span>
        <h2 id="local-subject-title">LOKÁLNÍ SUBJEKT</h2>
        <strong>ULOŽENO V TOMTO ZAŘÍZENÍ</strong>
        <p>Rozhodnutí z Cyklusu zůstávají v tomto prohlížeči. Přihlášení je potřeba až pro synchronizaci mezi zařízeními.</p>
      </header>

      {!hasData ? (
        <div className="profile-data-notice profile-data-notice--action" role="status">
          <div>
            <strong>ZATÍM BEZ DAT</strong>
            <span>První rozhodnutí se sem uloží po spuštění Cyklusu.</span>
          </div>
          <Link className="btn" href="/cyklus">SPUSTIT CYKLUS</Link>
        </div>
      ) : null}

      {hasData ? (
        <dl className="local-subject-profile__metrics">
          <div><dt>Rozhodnutí</dt><dd>{profile.decisions.length}</dd></div>
          <div><dt>Dokončené běhy</dt><dd>{profile.completedRuns}</dd></div>
          <div><dt>Poslední cyklus</dt><dd>{profile.lastCycle || '—'}</dd></div>
          <div><dt>Objevené karty</dt><dd>{profile.discoveredCards}</dd></div>
          <div><dt>Fragmenty</dt><dd>{profile.discoveredFragments}</dd></div>
        </dl>
      ) : null}

      {hasData && profile.stats ? (
        <section className="local-subject-profile__section" aria-labelledby="local-stats-title">
          <h3 id="local-stats-title">POSLEDNÍ STAV</h3>
          <dl className="local-subject-profile__stats">
            {STAT_KEYS.map((key) => <div key={key}><dt>{STAT_LABELS[key]}</dt><dd>{profile.stats?.[key]}</dd></div>)}
          </dl>
        </section>
      ) : null}

      {hasData && profile.psyche ? (
        <section className="local-subject-profile__section" aria-labelledby="local-psyche-title">
          <h3 id="local-psyche-title">PSYCHICKÝ OTISK</h3>
          <p><strong>{profile.psyche.dominantLabel}</strong> · {profile.psyche.archetype} · stabilita {profile.psyche.stability}</p>
          <p>Poslední aktivita: {formatDate(profile.lastActivityAt)}</p>
        </section>
      ) : null}

      {profile.latestDecisions.length ? (
        <section className="local-subject-profile__section" aria-labelledby="local-decisions-title">
          <h3 id="local-decisions-title">POSLEDNÍ VOLBY</h3>
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
        </section>
      ) : null}

      <footer className="local-subject-profile__footer">
        <p>Přihlášením zapnete synchronizaci profilu.</p>
        <div className="local-subject-profile__actions">
          {hasData ? <Link className="btn btn-outline" href="/cyklus">POKRAČOVAT V CYKLU</Link> : null}
          <Link className="btn" href="/login">PŘIHLÁSIT SE</Link>
        </div>
      </footer>
    </section>
  );
}
