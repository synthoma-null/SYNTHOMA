'use client';

import { useEffect } from 'react';
import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';

export interface ArchiveDetailDialogProps {
  card: ArchiveCard;
  isLocked: boolean;
  relatedCards: ArchiveCard[];
  onClose: () => void;
}

export default function ArchiveDetailDialog({ card, isLocked, relatedCards, onClose }: ArchiveDetailDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="synthoma-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Záznam: ${card.title}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="synthoma-detail-dialog os-surface archive-detail-dialog">
        <button className="synthoma-detail-dialog__close" onClick={onClose} aria-label="Zavřít záznam" type="button">✕</button>
        <div className="archive-detail-dialog__body">
          <header className="archive-detail-dialog__header" style={card.display?.accent ? ({ '--card-accent': card.display.accent } as React.CSSProperties) : undefined}>
            {card.display?.icon && <span className="archive-detail-dialog__icon">{isLocked ? '⬡' : card.display.icon}</span>}
            <h2 className="archive-detail-dialog__title">{card.title}</h2>
            <span className="archive-detail-dialog__category">{card.category}</span>
          </header>

          <p className="archive-detail-dialog__teaser">{card.teaser}</p>

          {isLocked ? (
            <div className="archive-detail-dialog__locked">
              <p>Záznam je uzamčen. Dokonči požadovanou kapitolu nebo získej dostatek mnem, aby Archiv pustil další vrstvu.</p>
              {card.access?.reason && <p className="archive-detail-dialog__reason">{card.access.reason}</p>}
            </div>
          ) : (
            <>
              {card.quote && <blockquote className="archive-detail-dialog__quote">{card.quote}</blockquote>}
              <div className="archive-detail-dialog__content">
                {card.body.map((p, idx) => (
                  <p key={idx} className="text">{p}</p>
                ))}
              </div>
              {Array.isArray(card.tags) && card.tags.length > 0 && (
                <div className="archive-detail-dialog__tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="archive-detail-dialog__tag">{tag}</span>
                  ))}
                </div>
              )}
            </>
          )}

          {relatedCards.length > 0 && (
            <section className="archive-detail-dialog__related" aria-label="Související záznamy">
              <h3 className="archive-detail-dialog__related-title">SOUVISEJÍCÍ ZÁZNAMY</h3>
              <ul className="archive-detail-dialog__related-list">
                {relatedCards.map((related) => (
                  <li key={related.id} className="archive-detail-dialog__related-item">
                    <span className="archive-detail-dialog__related-icon">{related.display?.icon ?? '⬡'}</span>
                    <span className="archive-detail-dialog__related-title-text">{related.title}</span>
                    <span className="archive-detail-dialog__related-teaser">{related.teaser}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
