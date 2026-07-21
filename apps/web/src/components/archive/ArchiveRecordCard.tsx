'use client';

import type { ArchiveCard, ArchiveCardVisibility } from '../../lib/synthoma/archive/archiveTypes';
import { getArchiveCategoryLabel } from '../../lib/synthoma/archive/archiveCategoryLabel';
import { useLang } from '../../lib/LangContext';
import { getSpeaker, getSpeakerCssProperties } from '../../content/speakers';

export interface ArchiveRecordCardProps {
  card: ArchiveCard;
  visibility: ArchiveCardVisibility;
  isOpen?: boolean;
  onOpen?: (id: string) => void;
}

export default function ArchiveRecordCard({ card, visibility, isOpen, onOpen }: ArchiveRecordCardProps) {
  const { t, lang } = useLang();
  const isInteractive = true;
  const isLocked = visibility !== 'full';
  const speaker = getSpeaker(card.speakerId);
  const accent = speaker?.color ?? card.display?.accent;

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

  const style = accent ? ({
    ...(speaker ? getSpeakerCssProperties(speaker) : {}),
    '--card-accent': accent,
  } as React.CSSProperties) : undefined;

  const icon = isLocked ? '\u{1F512}' : (card.display?.icon ?? '\u25C7');
  const stateLabel = isLocked ? t('archive.card.state.locked') : t('archive.card.available');

  const content = (
    <>
      <span className="archive-record-card__header">
        {icon && <span className="archive-record-card__icon">{icon}</span>}
        <span className="archive-record-card__title">{card.title}</span>
        <span className="archive-record-card__category">{getArchiveCategoryLabel(card.category, lang)}</span>
        <span className="archive-record-card__source">{card.sourceBook === 'konec-podpory' ? 'KONEC PODPORY' : 'SYNTHOMA-NULL'}</span>
        <span className={`archive-record-card__badge${isLocked ? ' archive-record-card__badge--locked' : ''}`}>{stateLabel}</span>
      </span>
      <span className="archive-record-card__teaser">{card.teaser}</span>
    </>
  );

  return (
    <button
      className={classes}
      data-testid={isLocked ? 'archive-card-locked' : 'archive-card'}
      data-archive-category={card.category}
      data-source-book={card.sourceBook ?? 'synthoma-null'}
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
