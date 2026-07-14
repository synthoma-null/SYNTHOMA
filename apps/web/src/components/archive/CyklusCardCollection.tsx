'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import CyklusCardPoster from '../cyklus/CyklusCardPoster';
import CyklusPortalScope from '../cyklus/CyklusPortalScope';
import { loadDiscovery, mergeDiscovery, saveDiscovery, saveDiscoveryWithSync } from '../../game/cyklus/cyklusDiscovery';
import { loadServerCyklusRun } from '../../game/cyklus/cyklusStorage';
import { getCyklusCardArtworkCatalog } from '../../game/cyklus/cyklusCardCollection';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';

type CollectionFilter = 'all' | 'discovered' | 'unknown';

function formatDate(timestamp: number, lang: 'cs' | 'en'): string {
  return new Date(timestamp).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB', { dateStyle: 'medium' });
}

export default function CyklusCardCollection() {
  const { t, lang } = useLang();
  const { data: session } = useSession();
  const [discovery, setDiscovery] = useState(() => loadDiscovery());
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [category, setCategory] = useState<string>('all');
  const [viewerCardId, setViewerCardId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);
  const [syncNonce, setSyncNonce] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const refresh = () => setDiscovery(loadDiscovery());
    window.addEventListener('storage', refresh);
    window.addEventListener('synthoma:cyklus-card-discovery', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('synthoma:cyklus-card-discovery', refresh);
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    let cancelled = false;
    setSyncError(false);
    void loadServerCyklusRun().then((server) => {
      if (cancelled) return;
      if (!server?.discovery) {
        setSyncError(true);
        return;
      }
      const local = loadDiscovery();
      const merged = mergeDiscovery(server.discovery, local);
      saveDiscovery(merged);
      setDiscovery(merged);
      if (JSON.stringify(merged) !== JSON.stringify(server.discovery)) void saveDiscoveryWithSync(merged);
    });
    return () => { cancelled = true; };
  }, [session?.user?.id, syncNonce]);

  const cards = useMemo(() => getCyklusCardArtworkCatalog(discovery), [discovery]);
  const categories = useMemo(() => [...new Set(cards.map((card) => card.category))].sort(), [cards]);
  const visibleCards = useMemo(() => cards.filter((card) => {
    if (filter === 'discovered' && !card.discovered) return false;
    if (filter === 'unknown' && card.discovered) return false;
    return category === 'all' || card.category === category;
  }), [cards, category, filter]);
  const discoveredCount = cards.filter((card) => card.discovered).length;
  const viewerCard = cards.find((card) => card.cardId === viewerCardId && card.discovered) ?? null;

  useEffect(() => {
    if (!viewerCard) return;
    document.body.classList.add('cyklus-poster-lock');
    return () => document.body.classList.remove('cyklus-poster-lock');
  }, [viewerCard]);

  const closeViewer = useCallback(() => {
    setViewerCardId(null);
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  const openCard = (cardId: string, discovered: boolean, trigger: HTMLButtonElement) => {
    setNotice(null);
    if (!discovered) {
      setNotice(t('archive.collection.unknown.log'));
      return;
    }
    triggerRef.current = trigger;
    setViewerCardId(cardId);
  };
  const categoryLabel = (value: string) => t(`archive.collection.category.${value}` as TKey);

  return (
    <section className="cyklus-card-collection" aria-labelledby="cyklus-card-collection-title">
      <header className="cyklus-card-collection__header">
        <div>
          <span className="os-status__code">{t('archive.collection.code')}</span>
          <h2 id="cyklus-card-collection-title">{t('archive.collection.title')}</h2>
        </div>
        <p className="cyklus-card-collection__progress" aria-live="polite">{discoveredCount} / {cards.length} {t('status.discovered')}</p>
      </header>

      <div className="synthoma-archive__filters" role="group" aria-label={t('archive.collection.filter.aria')}>
        {(['all', 'discovered', 'unknown'] as const).map((value) => (
          <button key={value} className={`os-command ${filter === value ? 'os-command--active' : ''}`} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {value === 'all' ? t('archive.collection.filter.all') : value === 'discovered' ? t('archive.collection.filter.discovered') : t('archive.collection.filter.unknown')}
          </button>
        ))}
      </div>

      <label className="cyklus-card-collection__category">
        <span>{t('archive.collection.category')}</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">{t('archive.collection.filter.all')}</option>
          {categories.map((value) => <option key={value} value={value}>{categoryLabel(value)}</option>)}
        </select>
      </label>

      {discoveredCount === 0 ? <p className="cyklus-card-collection__empty">{t('archive.collection.empty')}</p> : null}
      {syncError ? (
        <div className="cyklus-card-collection__notice" role="alert">
          <p>{t('archive.collection.sync.error')}</p>
          <button className="os-command" type="button" onClick={() => setSyncNonce((value) => value + 1)}>{t('archive.collection.sync.retry')}</button>
        </div>
      ) : null}
      {notice ? <p className="cyklus-card-collection__notice" role="status">{notice}</p> : null}

      <ul className="cyklus-card-collection__grid" role="list">
        {visibleCards.map((card, index) => (
          <li key={card.cardId}>
            <button
              className={`cyklus-collection-card${card.discovered ? ' cyklus-collection-card--discovered' : ' cyklus-collection-card--unknown'}`}
              type="button"
              data-card-id={card.cardId}
              aria-label={card.discovered ? `${card.title}, ${t('status.discovered')}` : `${t('archive.collection.trace')} ${String(index + 1).padStart(3, '0')}, ${t('status.unknown')}`}
              onClick={(event) => openCard(card.cardId, card.discovered, event.currentTarget)}
            >
              <span className="cyklus-collection-card__art">
                {card.discovered ? <img src={card.presentation.artSrc} alt={card.presentation.artAlt ?? card.title} loading="lazy" decoding="async" draggable={false} /> : <span className="cyklus-collection-card__scan" role="img" aria-label={t('archive.collection.unknown.alt')} />}
              </span>
              <span className="cyklus-collection-card__body">
                <strong>{card.discovered ? card.title : `${t('archive.collection.trace')} ${String(index + 1).padStart(3, '0')}`}</strong>
                <span>{card.discovered ? categoryLabel(card.category) : t('status.unknown')}</span>
                <span className="cyklus-collection-card__badge">{card.discovered ? t('status.discovered') : t('status.unknown')}</span>
                {card.discovered && card.firstSeenAt ? <time dateTime={new Date(card.firstSeenAt).toISOString()}>{t('archive.collection.firstSeen')}: {formatDate(card.firstSeenAt, lang)}</time> : null}
                {card.discovered && card.seenCount ? <small>{t('archive.collection.seenCount')}: {card.seenCount}</small> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {viewerCard && typeof document !== 'undefined' ? createPortal(
        <CyklusPortalScope>
          <CyklusCardPoster presentation={viewerCard.presentation} cardTitle={viewerCard.title} fullscreen onReveal={() => {}} hideRevealAction onClose={closeViewer} />
        </CyklusPortalScope>,
        document.body,
      ) : null}
    </section>
  );
}
