'use client';

import type { ArchiveCard, ArchiveCardVisibility } from '../../lib/synthoma/archive/archiveTypes';
import { useLang } from '../../lib/LangContext';

export interface ArchiveRecordCardProps {
  card: ArchiveCard;
  visibility: ArchiveCardVisibility;
  isOpen?: boolean;
  onOpen?: (id: string) => void;
}

export default function ArchiveRecordCard({ card, visibility, isOpen, onOpen }: ArchiveRecordCardProps) {
  const { t } = useLang();
  const isInteractive = true;
  const isLocked = visibility !== 'full';
  const accent = card.display?.accent;

  const classes = [
    'archive-record-card',
    'os-surface',
    isInteractive ? 'archive-record-card--interactive' : '',
    visibility === 'teaser' ? 'archive-record-card--teaser' : '',
    isLocked ? 'archive-record-card--locked' : '',
    visibility === 'full' ? 'archive-record-card--full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = accent ? ({ '--card-accent': accent } as React.CSSProperties) : undefined;

  const icon = isLocked ? '🔒' : (card.display?.icon ?? '◇');
  const stateLabel = isLocked ? t('archive.card.state.locked') : t('archive.card.available');

  const content = (
    <>
      <span className="archive-record-card__header">
        {icon && <span className="archive-record-card__icon">{icon}</span>}
        <span className="archive-record-card__title">{card.title}</span>
        <span className="archive-record-card__category">{card.category}</span>
        <span className={`archive-record-card__badge${isLocked ? ' archive-record-card__badge--locked' : ''}`}>{stateLabel}</span>
        {isLocked && <span className="archive-record-card__lock" aria-hidden="true">🔒</span>}
      </span>
      <span className="archive-record-card__teaser">{card.teaser}</span>
    </>
  );

  return (
    <button
      className={classes}
      type="button"
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen ?? false}
      aria-label={`${t('action.open')} ${t('archive.detail.aria').toLocaleLowerCase()} ${card.title}, ${stateLabel}`}
      onClick={() => onOpen?.(card.id)}
    >
      {content}
    </button>
  );
}
