'use client';

import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import { useUiLayer } from '../ui-layer/UiLayerProvider';

export interface LibraryCoverDialogProps {
  collection: LibraryCollection;
  onClose: () => void;
  onEnter?: (() => void) | undefined;
}

export default function LibraryCoverDialog({ collection, onClose, onEnter }: LibraryCoverDialogProps) {
  const { closeLayer } = useUiLayer({
    id: `library-cover:${collection.slug}`,
    type: 'library-dialog',
    open: true,
    onClose,
  });

  return (
    <div
      className="synthoma-detail-overlay library-cover-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Přebal: ${collection.title}`}
      onClick={(e) => { if (e.target === e.currentTarget) closeLayer(); }}
      style={collection.cover ? { '--cover-image': `url(${collection.cover})` } as React.CSSProperties : undefined}
    >
      <div className="synthoma-detail-dialog os-surface library-cover-dialog">
        <button className="synthoma-detail-dialog__close" onClick={closeLayer} aria-label="Zavřít přebal" type="button">✕</button>
        <div className="library-cover-dialog__body">
          {collection.cover ? (
            <img className="library-cover-dialog__cover" src={collection.cover} alt="" loading="lazy" decoding="async" />
          ) : (
            <div className="library-cover-dialog__cover library-cover-dialog__cover--placeholder" aria-hidden="true" />
          )}
          <div className="library-cover-dialog__info">
            <h2 className="library-cover-dialog__title">{collection.title}</h2>
            <p className="library-cover-dialog__status">{collection.availableCount} / {collection.totalCount} kapitol</p>
            <ol className="library-cover-dialog__chapters" aria-label="Seznam kapitol">
              {collection.chapters.map((ch) => (
                <li key={ch.id} className="library-cover-dialog__chapter">
                  <span className="library-cover-dialog__chapter-index">{String(ch.order).padStart(2, '0')}</span>
                  <span className="library-cover-dialog__chapter-title">{ch.title}</span>
                  {ch.summary ? <span className="library-cover-dialog__chapter-summary">{ch.summary}</span> : null}
                </li>
              ))}
            </ol>
            {onEnter && (
              <button className="os-command" type="button" onClick={onEnter}>
                VSTOUPIT DO SBÍRKY
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
