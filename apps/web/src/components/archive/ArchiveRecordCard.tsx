'use client';

import type { ArchiveCard, ArchiveCardVisibility } from '../../lib/synthoma/archive/archiveTypes';

export interface ArchiveRecordCardProps {
  card: ArchiveCard;
  visibility: ArchiveCardVisibility;
  isOpen?: boolean;
  onOpen?: (id: string) => void;
}

export default function ArchiveRecordCard({ card, visibility, isOpen, onOpen }: ArchiveRecordCardProps) {
  const isInteractive = visibility === 'full' || visibility === 'teaser';
  const isLocked = visibility === 'hidden';
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

  const icon = isLocked ? '⬡' : (card.display?.icon ?? '⬡');

  const content = (
    <>
      <span className="archive-record-card__header">
        {icon && <span className="archive-record-card__icon">{icon}</span>}
        <span className="archive-record-card__title">{card.title}</span>
        <span className="archive-record-card__category">{card.category}</span>
        {isLocked && <span className="archive-record-card__lock">⬡</span>}
      </span>
      <span className="archive-record-card__teaser">{card.teaser}</span>
    </>
  );

  if (!isInteractive) {
    return (
      <article className={classes} style={style} aria-label={`${card.title} — ${card.category}`}>
        {content}
      </article>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen ?? false}
      aria-label={`Otevřít záznam ${card.title}`}
      onClick={() => onOpen?.(card.id)}
    >
      {content}
    </button>
  );
}
