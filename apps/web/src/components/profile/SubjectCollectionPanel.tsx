'use client';

import { useMemo } from 'react';
import { loadLocalSubjectProfile } from '../../game/cyklus/cyklusLocalProfile';
import ReadingProgressPanel from './ReadingProgressPanel';
import type { OwnershipHistoryItem } from './MnemHistoryPanel';

interface Props {
  ownership: OwnershipHistoryItem[];
  readingCount: number;
}

export default function SubjectCollectionPanel({ ownership, readingCount }: Props) {
  const localProfile = useMemo(() => loadLocalSubjectProfile(), []);
  const artifacts = ownership.filter((item) => item.contentType === 'artifact');
  const fragments = ownership.filter((item) => item.contentType === 'fragment');
  const collectibleOwnership = ownership.filter((item) => !['chapter', 'package'].includes(item.contentType));

  return (
    <div className="profile-collection">
      <section aria-labelledby="profile-collection-title">
        <div className="profile-section-heading">
          <span>COLLECTION // DISCOVERED</span>
          <h2 id="profile-collection-title">Sbírka subjektu</h2>
          <p>Objevy z tohoto zařízení a trvalé záznamy účtu na jednom místě.</p>
        </div>
        <dl className="profile-collection__metrics">
          <div><dt>Obrázkové karty</dt><dd>{localProfile.discoveredCards}</dd></div>
          <div><dt>Fragmenty</dt><dd>{Math.max(localProfile.discoveredFragments, fragments.length, readingCount)}</dd></div>
          <div><dt>Artefakty</dt><dd>{artifacts.length}</dd></div>
          <div><dt>Evidované položky</dt><dd>{collectibleOwnership.length}</dd></div>
        </dl>
        {collectibleOwnership.length ? (
          <ul className="profile-collection__items">
            {collectibleOwnership.map((item) => (
              <li key={`${item.contentType}:${item.contentId}`}>
                <strong>{item.title}</strong>
                <span>{item.contentType}{' // '}{item.source}</span>
              </li>
            ))}
          </ul>
        ) : <p className="profile-empty">Trvalá sbírka je zatím prázdná. Lokální objevy se přesto počítají.</p>}
      </section>
      <section aria-labelledby="profile-reading-title">
        <div className="profile-section-heading"><span>COLLECTION // READING</span><h2 id="profile-reading-title">Čtenářské fragmenty</h2></div>
        <ReadingProgressPanel />
      </section>
    </div>
  );
}
