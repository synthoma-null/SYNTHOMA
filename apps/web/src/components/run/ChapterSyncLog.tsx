'use client';

import { useEffect, useState } from 'react';

export interface SyncDelta {
  stabilityBefore: number;
  stabilityAfter: number;
  pressureBefore: number;
  pressureAfter: number;
  shadowBefore: number;
  shadowAfter: number;
  dominantReaction?: string;
  entityDeltas?: { entity: string; metric: string; delta: number }[];
  newArtifact?: string;
  newMissions?: string[];
  recommendedFragment?: string;
}

interface Props {
  chapterId: string;
  chapterTitle: string;
  delta: SyncDelta;
  onClose: () => void;
}

function DeltaValue({ before, after, label }: { before: number; after: number; label: string }) {
  const diff = after - before;
  const sign = diff > 0 ? '+' : '';
  const cls = diff > 0 ? 'sync-delta--up' : diff < 0 ? 'sync-delta--down' : 'sync-delta--neutral';
  return (
    <div className="sync-row">
      <span className="sync-row-label">{label}</span>
      <span className="sync-row-values">
        {before} → {after}
        {diff !== 0 && (
          <span className={`sync-delta ${cls}`}> ({sign}{diff})</span>
        )}
      </span>
    </div>
  );
}

const ENTITY_LABELS: Record<string, string> = {
  glitchka: 'Glitchka',
  sarkasma: 'Sarkasma',
  tai: 'T-AI',
  archive: 'Archiv',
  shadow: 'Stín',
};

export default function ChapterSyncLog({ chapterId, chapterTitle, delta, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`sync-overlay${visible ? ' sync-overlay--visible' : ''}`} onClick={handleClose}>
      <div className="sync-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sync-header">
          <span className="sync-log-prefix">LOG [CHAPTER_SYNC]:</span>
          <span className="sync-chapter-title">{chapterTitle}</span>
        </div>

        <p className="sync-completed">Kapitola dokončena.</p>

        <div className="sync-deltas">
          <DeltaValue before={delta.stabilityBefore} after={delta.stabilityAfter} label="Stabilita identity" />
          <DeltaValue before={delta.pressureBefore} after={delta.pressureAfter} label="Tlak paměti" />
          <DeltaValue before={delta.shadowBefore} after={delta.shadowAfter} label="Stín" />
        </div>

        {delta.dominantReaction && (
          <div className="sync-reaction">
            <span className="sync-row-label">Dominantní reakce:</span>
            <span className="sync-reaction-value">{delta.dominantReaction}</span>
          </div>
        )}

        {delta.entityDeltas && delta.entityDeltas.length > 0 && (
          <div className="sync-entities">
            {delta.entityDeltas.map((ed, i) => (
              <div key={i} className="sync-row">
                <span className="sync-row-label">
                  {ENTITY_LABELS[ed.entity] ?? ed.entity}: {ed.metric}
                </span>
                <span className={`sync-delta ${ed.delta >= 0 ? 'sync-delta--up' : 'sync-delta--down'}`}>
                  {ed.delta >= 0 ? '+' : ''}{ed.delta}
                </span>
              </div>
            ))}
          </div>
        )}

        {delta.newArtifact && (
          <div className="sync-new-artifact">
            <span className="sync-log-prefix">LOG [ARTIFACT_AVAILABLE]:</span>
            <span className="sync-artifact-name">{delta.newArtifact}</span>
          </div>
        )}

        {delta.newMissions && delta.newMissions.length > 0 && (
          <div className="sync-new-missions">
            <span className="sync-log-prefix">LOG [MISSION_ACTIVATED]:</span>
            {delta.newMissions.map((m, i) => (
              <span key={i} className="sync-mission-name">{m}</span>
            ))}
          </div>
        )}

        {delta.recommendedFragment && (
          <div className="sync-recommended">
            <span className="sync-row-label">Doporučený fragment:</span>
            <span className="sync-recommended-value">&#8222;{delta.recommendedFragment}&#8220;</span>
          </div>
        )}

        <button className="btn sync-close-btn" onClick={handleClose}>
          ZAVŘÍT LOG
        </button>
      </div>
    </div>
  );
}
