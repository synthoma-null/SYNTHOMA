'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useArchiveSnapshot } from '../../lib/synthoma/archive/useArchiveSnapshot';
import { resolveArchiveCardVisibility } from '../../lib/synthoma/archive/resolveArchiveLock';
import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';
import type { WhisperData } from '../whispers/WhisperCard';
import ArchiveDetailDialog from './ArchiveDetailDialog';
import ArchiveRecordCard from './ArchiveRecordCard';
import { useAccess } from '../access/AccessProvider';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';
import ArchiveBookGrid from './ArchiveBookGrid';
import type { LibraryCatalog } from '../../lib/synthoma/library/libraryTypes';
import { getArchiveCategoryLabel } from '../../lib/synthoma/archive/archiveCategoryLabel';
import { normalizeArchiveCards } from '../../lib/synthoma/archive/normalizeArchiveEntries';
import type { ArchiveCardData } from '../../../app/archive/ArchiveClient';

const WhisperCard = dynamic(() => import('../whispers/WhisperCard'), { ssr: false });
const WhisperForm = dynamic(() => import('../whispers/WhisperForm'), { ssr: false });
const WhisperSubmitPanel = dynamic(() => import('../whispers/WhisperSubmitPanel'), { ssr: false });
const ContentPurchaseDialog = dynamic(() => import('../access/ContentPurchaseDialog'));
const CyklusCardCollection = dynamic(() => import('./CyklusCardCollection'), {
  loading: () => <p className="synthoma-archive__empty">Načítám sbírku karet…</p>,
});

export interface SynthomaArchiveProps {
  initialCards: ArchiveCard[];
  library?: LibraryCatalog | undefined;
}

const WHISPER_FILTERS = ['all', 'unsent', 'memory', 'fear', 'regret', 'wish', 'warning', 'log'] as const;
const WHISPER_SORTS = ['random', 'resonance', 'new'] as const;

export default function SynthomaArchive({ initialCards, library }: SynthomaArchiveProps) {
  const { t, lang } = useLang();
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [whisperFilter, setWhisperFilter] = useState<string>('all');
  const [whisperSort, setWhisperSort] = useState<string>('random');
  const [showWhisperForm, setShowWhisperForm] = useState(false);
  const [enCards, setEnCards] = useState<ArchiveCard[] | null>(null);
  const [purchaseCardId, setPurchaseCardId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'records' | 'collection'>('records');
  const [bookFilter, setBookFilter] = useState<'all' | 'synthoma-null' | 'konec-podpory' | 'neon-0'>('all');
  const { resolve: resolveAccess, getCachedAccess } = useAccess();
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const snapshot = useArchiveSnapshot(enCards ?? initialCards, whisperFilter, whisperSort);
  const cards = useMemo(() => enCards ?? initialCards, [enCards, initialCards]);

  useEffect(() => {
    if (!cards.length) return;
    void resolveAccess(cards.map((card) => ({ contentType: 'archive_record', contentId: card.id })));
  }, [cards, resolveAccess]);

  const whisperData = useMemo<WhisperData[]>(() => {
    return snapshot.whispers.map((w) => ({
      id: w.id,
      type: w.type,
      text: w.text,
      publicMode: w.publicMode,
      resonanceCount: w.resonanceCount,
      displayCount: w.displayCount,
      boostedUntil: w.boostedUntil,
      resonated: w.resonated ?? false,
      chapterId: w.chapterId,
    }));
  }, [snapshot.whispers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lang !== 'en') {
      setEnCards(null);
      return;
    }
    fetch('/data/archiveCards_en.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (Array.isArray(json?.cards)) {
          setEnCards(normalizeArchiveCards(json.cards as ArchiveCardData[]));
        }
      })
      .catch(() => {});
  }, [lang]);

  const openRecord = useCallback((id: string) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenCardId(id);
  }, []);

  const closeRecord = useCallback(() => {
    setOpenCardId(null);
    window.setTimeout(() => returnFocusRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  const whisperFilterLabel = (filter: (typeof WHISPER_FILTERS)[number]): string => {
    if (filter === 'all') return t('archive.whispers.filter.all').toLocaleUpperCase();
    return t(`archive.whispers.filter.${filter}` as TKey);
  };

  const displayCards = useMemo(() => {
    return cards
      .filter((card) => bookFilter === 'all' || (card.sourceBook ?? 'synthoma-null') === bookFilter)
      .map((card) => {
        const access = getCachedAccess('archive_record', card.id);
        return {
          card,
          access,
          visibility: resolveArchiveCardVisibility(card, access, Boolean(access)),
        };
      })
      .sort((a, b) => (a.card.order ?? 999) - (b.card.order ?? 999));
  }, [bookFilter, cards, getCachedAccess]);

  const completedChapters = snapshot.progress.filter((p) => p.completed);
  const currentChapter = snapshot.progress.find((p) => !p.completed && p.progressPercent && p.progressPercent > 0);
  const groupedCards = useMemo(() => {
    const groups = new Map<string, typeof displayCards>();
    for (const entry of displayCards) {
      const group = groups.get(entry.card.category) ?? [];
      group.push(entry);
      groups.set(entry.card.category, group);
    }
    return [...groups.entries()];
  }, [displayCards]);

  const dialogEntry = useMemo(() => displayCards.find((entry) => entry.card.id === openCardId), [displayCards, openCardId]);
  const relatedCards = useMemo(() => {
    if (!dialogEntry?.card.related) return [];
    return dialogEntry.card.related
      .map((id) => cards.find((c) => c.id === id))
      .filter((c): c is ArchiveCard => !!c);
  }, [dialogEntry, cards]);

  return (
    <main className="synthoma-archive" id="main-content">
      <div className="synthoma-archive__content">
        <header className="synthoma-archive__header">
          <span className="os-status__code">{t('archive.code')}</span>
          <h1 className="synthoma-archive__title">{t('archive.title')}</h1>
        </header>

        {snapshot.error ? (
          <div className="archive-sync-warning" role="status">
            <span>{snapshot.error}</span>
            <button className="os-command" type="button" onClick={snapshot.reload}>ZKUSIT ZNOVU</button>
          </div>
        ) : null}

        {library ? <ArchiveBookGrid collections={library.collections} locale={lang} /> : null}

        <section className="synthoma-archive__overview" aria-label={t('archive.overview.aria')}>
          <div className="synthoma-archive__count os-surface" data-testid="archive-stat-card">
            <span className="os-status__code">{t('archive.count.chapters')}</span>
            <span className="synthoma-archive__value">{completedChapters.length}</span>
          </div>
          <div className="synthoma-archive__count os-surface" data-testid="archive-stat-card">
            <span className="os-status__code">{t('archive.count.records')}</span>
            <span className="synthoma-archive__value">{displayCards.length}</span>
          </div>
          <div className="synthoma-archive__count os-surface" data-testid="archive-stat-card">
            <span className="os-status__code">{t('archive.count.findings')}</span>
            <span className="synthoma-archive__value">{snapshot.cyklus.findings.length}</span>
          </div>
          <div className="synthoma-archive__count os-surface" data-testid="archive-stat-card">
            <span className="os-status__code">{t('archive.count.whispers')}</span>
            <span className="synthoma-archive__value">{snapshot.whispers.length}</span>
          </div>
        </section>

        <div className="synthoma-archive__tabs" role="tablist" aria-label={t('archive.tabs.aria')}>
          <button id="archive-tab-records" className={`os-command ${activeView === 'records' ? 'os-command--active' : ''}`} type="button" role="tab" aria-selected={activeView === 'records'} aria-controls="archive-panel-records" onClick={() => setActiveView('records')}>{t('archive.tab.records')}</button>
          <button id="archive-tab-collection" className={`os-command ${activeView === 'collection' ? 'os-command--active' : ''}`} type="button" role="tab" aria-selected={activeView === 'collection'} aria-controls="archive-panel-collection" onClick={() => setActiveView('collection')}>{t('archive.tab.collection')}</button>
        </div>

        <div id="archive-panel-records" className="synthoma-archive__panel" role="tabpanel" aria-labelledby="archive-tab-records" hidden={activeView !== 'records'}>
        <section className="synthoma-archive__section archive-memory-section" data-testid="archive-memory-card" aria-label={t('archive.reading.aria')}>
          <h2 className="synthoma-archive__section-title">{t('archive.reading.title')}</h2>
          <div className="archive-reading-card os-surface">
            {currentChapter ? (
              <p className="synthoma-archive__status-line">
                {t('archive.reading.current')}: <Link href={`/chapter/${encodeURIComponent(currentChapter.chapterId)}`}>{currentChapter.chapterTitle || currentChapter.chapterId}</Link>
              </p>
            ) : (
              <p className="synthoma-archive__status-line">{t('archive.reading.none')}</p>
            )}
          </div>
          {completedChapters.length > 0 ? (
            <ul className="synthoma-archive__chapter-list">
              {completedChapters.map((ch) => (
                <li key={ch.chapterId}>
                  <Link href={`/chapter/${encodeURIComponent(ch.chapterId)}`}>{ch.chapterTitle || ch.chapterId}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="synthoma-archive__empty">{t('archive.reading.completed.none')}</p>
          )}
        </section>

        <section className="synthoma-archive__section" aria-label={t('archive.records.aria')}>
          <h2 className="synthoma-archive__section-title">{t('archive.records.title')}</h2>
          <div className="synthoma-archive__book-filters" role="group" aria-label={lang === 'en' ? 'Filter records by book' : 'Filtrovat záznamy podle knihy'}>
            {([
              ['all', lang === 'en' ? 'ALL' : 'VŠE'],
              ['neon-0', 'NEON-0'],
              ['synthoma-null', 'SYNTHOMA-NULL'],
              ['konec-podpory', 'KONEC PODPORY'],
            ] as const).map(([id, label]) => (
              <button key={id} className={`os-command ${bookFilter === id ? 'os-command--active' : ''}`} type="button" aria-pressed={bookFilter === id} onClick={() => setBookFilter(id)}>{label}</button>
            ))}
          </div>
          <div className="synthoma-archive__categories">
            {groupedCards.map(([category, entries]) => (
              <section key={category} className="synthoma-archive__category" data-testid="archive-category" aria-labelledby={`archive-category-${category}`}>
                <h3 id={`archive-category-${category}`} className="synthoma-archive__category-title">{getArchiveCategoryLabel(category, lang)}</h3>
                <ul className="synthoma-archive__records" role="list">
                  {entries.map((entry) => (
                    <li key={entry.card.id} className="archive-record-card__item">
                      <ArchiveRecordCard
                        card={entry.card}
                        visibility={entry.visibility}
                        isOpen={openCardId === entry.card.id}
                        onOpen={openRecord}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="synthoma-archive__section" aria-label={t('archive.cyklus.aria')}>
          <h2 className="synthoma-archive__section-title">{t('archive.cyklus.title')}</h2>
          {snapshot.cyklus.findings.length > 0 ? (
            <ul className="synthoma-archive__findings">
              {snapshot.cyklus.findings.map((f) => (
                <li key={f.id} className="synthoma-archive__finding" data-testid="archive-finding-card">
                  <strong>{f.title}</strong>
                  <p>{f.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="synthoma-archive__empty">{t('archive.cyklus.none')}</p>
          )}
          {snapshot.cyklus.activeRun && (
            <p className="synthoma-archive__status-line">
              <Link href="/cyklus">{t('archive.cyklus.active')}</Link>
            </p>
          )}
        </section>

        <section className="synthoma-archive__section archive-channel-panel" aria-label={t('archive.whispers.aria')}>
          <h2 className="synthoma-archive__section-title">{t('archive.whispers.channel')}</h2>
          <div className="synthoma-archive__filters">
            {WHISPER_FILTERS.map((f) => (
              <button
                key={f}
                className={`os-command ${whisperFilter === f ? 'os-command--active' : ''}`}
                type="button"
                onClick={() => setWhisperFilter(f)}
              >
                {whisperFilterLabel(f)}
              </button>
            ))}
          </div>
          <div className="synthoma-archive__filters">
            {WHISPER_SORTS.map((s) => (
              <button
                key={s}
                className={`os-command ${whisperSort === s ? 'os-command--active' : ''}`}
                type="button"
                onClick={() => setWhisperSort(s)}
              >
                {s === 'random' ? t('archive.whispers.sort.random').toLocaleUpperCase() : s === 'resonance' ? t('archive.whispers.sort.resonance').toLocaleUpperCase() : t('archive.whispers.sort.new').toLocaleUpperCase()}
              </button>
            ))}
          </div>
          <div className="synthoma-archive__whispers" role="list">
            {whisperData.length === 0 ? (
              <p className="synthoma-archive__empty">{t('archive.whispers.none')}</p>
            ) : (
              whisperData.map((w) => (
                <WhisperCard key={w.id} whisper={w} />
              ))
            )}
          </div>
          {!showWhisperForm ? (
            <button className="os-command" type="button" onClick={() => setShowWhisperForm(true)}>
              {t('archive.whispers.leave')}
            </button>
          ) : (
            <WhisperForm onSuccess={() => setShowWhisperForm(false)} />
          )}
          <WhisperSubmitPanel placement="archive" compact />
        </section>
        </div>

        <div id="archive-panel-collection" className="synthoma-archive__panel" role="tabpanel" aria-labelledby="archive-tab-collection" hidden={activeView !== 'collection'}>
          <CyklusCardCollection />
        </div>
      </div>

      {dialogEntry && (
        <ArchiveDetailDialog
          card={dialogEntry.card}
          mode={dialogEntry.visibility}
          relatedCards={relatedCards}
          onClose={closeRecord}
          access={dialogEntry.access}
          onPurchase={() => setPurchaseCardId(dialogEntry.card.id)}
        />
      )}
      {purchaseCardId ? (() => {
        const card = cards.find((candidate) => candidate.id === purchaseCardId);
        return card ? (
          <ContentPurchaseDialog
            contentType="archive_record"
            contentId={card.id}
            title={card.title}
            onClose={() => setPurchaseCardId(null)}
            onPurchased={() => setPurchaseCardId(null)}
          />
        ) : null;
      })() : null}
    </main>
  );
}
