'use client';

import { useEffect, useId, useRef } from 'react';
import type { ArchiveCard, ArchiveCardVisibility } from '../../lib/synthoma/archive/archiveTypes';
import type { ContentAccess } from '../../content/catalog';
import { useLang } from '../../lib/LangContext';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ArchiveDetailDialogProps {
  card: ArchiveCard;
  mode: ArchiveCardVisibility;
  relatedCards: ArchiveCard[];
  onClose: () => void;
  access?: ContentAccess | undefined;
  onPurchase?: (() => void) | undefined;
}

export default function ArchiveDetailDialog({ card, mode, relatedCards, onClose, access, onPurchase }: ArchiveDetailDialogProps) {
  const { t } = useLang();
  const isLocked = mode !== 'full';
  const isFull = mode === 'full';
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.body.classList.add('synthoma-dialog-lock');
    window.addEventListener('keydown', handleKeyDown);
    window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('synthoma-dialog-lock');
    };
  }, [onClose]);

  return (
    <div
      className="synthoma-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={dialogRef} className="synthoma-detail-dialog os-surface archive-detail-dialog">
        <button ref={closeRef} className="synthoma-detail-dialog__close" onClick={onClose} aria-label={t('archive.detail.close')} type="button">
          <span aria-hidden="true">×</span><span className="synthoma-detail-dialog__close-label">{t('action.close')}</span>
        </button>
        <div className="archive-detail-dialog__body">
          <header className="archive-detail-dialog__header" style={card.display?.accent ? ({ '--card-accent': card.display.accent } as React.CSSProperties) : undefined}>
            {card.display?.icon && <span className="archive-detail-dialog__icon">{isLocked ? '⬡' : card.display.icon}</span>}
            <h2 id={titleId} className="archive-detail-dialog__title">{card.title}</h2>
            <span className="archive-detail-dialog__category">{card.category}</span>
          </header>

          <p className="archive-detail-dialog__teaser">{card.teaser}</p>

          {isLocked ? (
            <div className="archive-detail-dialog__locked">
              <p>{t('archive.detail.locked')}</p>
              {card.access?.reason && <p className="archive-detail-dialog__reason">{card.access.reason}</p>}
              {access?.canPurchase && onPurchase ? (
                <button className="btn" type="button" onClick={onPurchase}>
                  ODEMKNOUT ZA {access.mnemCost} MNEM
                </button>
              ) : null}
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

          {isFull && relatedCards.length > 0 && (
            <section className="archive-detail-dialog__related" aria-label="Související záznamy">
              <h3 className="archive-detail-dialog__related-title">{t('archive.detail.related')}</h3>
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
