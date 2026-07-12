'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SynthomaMediaLayer from '../synthoma-os/SynthomaMediaLayer';
import { useArchiveSnapshot } from '../../lib/synthoma/archive/useArchiveSnapshot';
import { resolveArchiveCardVisibility } from '../../lib/synthoma/archive/resolveArchiveLock';
import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';
import type { WhisperData } from '../whispers/WhisperCard';

const WhisperCard = dynamic(() => import('../whispers/WhisperCard'), { ssr: false });
const WhisperForm = dynamic(() => import('../whispers/WhisperForm'), { ssr: false });
const WhisperSubmitPanel = dynamic(() => import('../whispers/WhisperSubmitPanel'), { ssr: false });

export interface SynthomaArchiveProps {
  initialCards: ArchiveCard[];
}

const WHISPER_FILTERS = ['all', 'unsent', 'memory', 'fear', 'regret', 'wish', 'warning', 'log'] as const;
const WHISPER_SORTS = ['random', 'resonance', 'new'] as const;

export default function SynthomaArchive({ initialCards }: SynthomaArchiveProps) {
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [whisperFilter, setWhisperFilter] = useState<string>('all');
  const [whisperSort, setWhisperSort] = useState<string>('random');
  const [showWhisperForm, setShowWhisperForm] = useState(false);
  const [enCards, setEnCards] = useState<ArchiveCard[] | null>(null);

  const snapshot = useArchiveSnapshot(enCards ?? initialCards, whisperFilter, whisperSort);
  const cards = useMemo(() => enCards ?? initialCards, [enCards, initialCards]);

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
    fetch('/data/archiveCards_en.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (Array.isArray(json?.cards)) {
          setEnCards(json.cards as ArchiveCard[]);
        }
      })
      .catch(() => {});
  }, []);

  const completedChapterIds = useMemo(() => {
    return new Set(snapshot.progress.filter((p) => p.completed).map((p) => p.chapterId));
  }, [snapshot.progress]);

  const visibleCards = useMemo(() => {
    return cards
      .map((card) => ({
        card,
        visibility: resolveArchiveCardVisibility(card, completedChapterIds, snapshot.profile.mnemBalance, !snapshot.loading),
      }))
      .filter((entry) => entry.visibility !== 'hidden')
      .sort((a, b) => (a.card.order ?? 999) - (b.card.order ?? 999));
  }, [cards, completedChapterIds, snapshot.profile.mnemBalance, snapshot.loading]);

  const completedChapters = snapshot.progress.filter((p) => p.completed);
  const currentChapter = snapshot.progress.find((p) => !p.completed && p.progressPercent && p.progressPercent > 0);

  return (
    <main className="synthoma-archive" id="main-content">
      <SynthomaMediaLayer src="/video/SYNTHOMA10.webm" className="synthoma-archive__media" />
      <div className="synthoma-archive__content">
        <header className="synthoma-archive__header">
          <span className="os-status__code">ARCHIVE // SUBJECT MEMORY</span>
          <h1 className="synthoma-archive__title">Co systém uchoval z tebe</h1>
        </header>

        <section className="synthoma-archive__overview os-surface" aria-label="Přehled stopy subjektu">
          <div className="synthoma-archive__count">
            <span className="os-status__code">DOČTENÉ KAPITOLY</span>
            <span className="synthoma-archive__value">{completedChapters.length}</span>
          </div>
          <div className="synthoma-archive__count">
            <span className="os-status__code">ZÁZNAMY ARCHIVU</span>
            <span className="synthoma-archive__value">{visibleCards.length}</span>
          </div>
          <div className="synthoma-archive__count">
            <span className="os-status__code">NÁLEZY CYKLUS</span>
            <span className="synthoma-archive__value">{snapshot.cyklus.findings.length}</span>
          </div>
          <div className="synthoma-archive__count">
            <span className="os-status__code">ŠPOTY</span>
            <span className="synthoma-archive__value">{snapshot.whispers.length}</span>
          </div>
        </section>

        <section className="synthoma-archive__section" aria-label="Paměť čtení">
          <h2 className="synthoma-archive__section-title">PAMĚŤ ČTENÍ</h2>
          {currentChapter ? (
            <p className="synthoma-archive__status-line">
              Aktuální stopa: <Link href={`/chapter/${encodeURIComponent(currentChapter.chapterId)}`}>{currentChapter.chapterTitle || currentChapter.chapterId}</Link>
            </p>
          ) : (
            <p className="synthoma-archive__status-line">Žádná aktivní stopa.</p>
          )}
          {completedChapters.length > 0 ? (
            <ul className="synthoma-archive__chapter-list">
              {completedChapters.map((ch) => (
                <li key={ch.chapterId}>
                  <Link href={`/chapter/${encodeURIComponent(ch.chapterId)}`}>{ch.chapterTitle || ch.chapterId}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="synthoma-archive__empty">Zatím žádná dokončená kapitola.</p>
          )}
        </section>

        <section className="synthoma-archive__section" aria-label="Záznamy">
          <h2 className="synthoma-archive__section-title">RECOVERED RECORDS</h2>
          <div className="synthoma-archive__records" role="list">
            {visibleCards.map((entry) => {
              const { card, visibility } = entry;
              const isOpen = openCardId === card.id;
              const isLocked = visibility === 'teaser';
              return (
                <article
                  key={card.id}
                  className={[
                    'archive-record-card',
                    'os-surface',
                    isOpen ? 'archive-record-card--open' : '',
                    isLocked ? 'archive-record-card--locked' : '',
                  ].join(' ').trim()}
                  role="listitem"
                  style={card.display?.accent ? ({ '--card-accent': card.display.accent } as React.CSSProperties) : undefined}
                >
                  <button
                    className="archive-record-card__toggle"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => !isLocked && setOpenCardId(isOpen ? null : card.id)}
                    aria-disabled={isLocked}
                  >
                    {card.display?.icon && <span className="archive-record-card__icon">{isLocked ? '⬡' : card.display.icon}</span>}
                    <span className="archive-record-card__title">{card.title}</span>
                    {isLocked && <span className="archive-record-card__lock">⬡</span>}
                  </button>
                  <p className="archive-record-card__teaser">{card.teaser}</p>
                  {!isLocked && isOpen && (
                    <div className="archive-record-card__body">
                      {card.quote && <blockquote className="archive-record-card__quote">{card.quote}</blockquote>}
                      {card.body.map((p, idx) => (
                        <p key={idx} className="text">{p}</p>
                      ))}
                      {Array.isArray(card.tags) && card.tags.length > 0 && (
                        <div className="archive-record-card__tags">
                          {card.tags.map((tag) => (
                            <span key={tag} className="archive-record-card__tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="synthoma-archive__section" aria-label="Paměť Cyklus">
          <h2 className="synthoma-archive__section-title">CYKLUS MEMORY</h2>
          {snapshot.cyklus.findings.length > 0 ? (
            <ul className="synthoma-archive__findings">
              {snapshot.cyklus.findings.map((f) => (
                <li key={f.id} className="synthoma-archive__finding">
                  <strong>{f.title}</strong>
                  <p>{f.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="synthoma-archive__empty">Zatím žádné diagnostické nálezy.</p>
          )}
          {snapshot.cyklus.activeRun && (
            <p className="synthoma-archive__status-line">
              <Link href="/cyklus">Aktivní cyklus</Link>
            </p>
          )}
        </section>

        <section className="synthoma-archive__section" aria-label="Šepoty">
          <h2 className="synthoma-archive__section-title">WHISPER CHANNEL</h2>
          <div className="synthoma-archive__filters">
            {WHISPER_FILTERS.map((f) => (
              <button
                key={f}
                className={`os-command ${whisperFilter === f ? 'os-command--active' : ''}`}
                type="button"
                onClick={() => setWhisperFilter(f)}
              >
                {f === 'all' ? 'VŠE' : f.toUpperCase()}
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
                {s === 'random' ? 'NÁHODNĚ' : s === 'resonance' ? 'REZONANCE' : 'NOVÉ'}
              </button>
            ))}
          </div>
          <div className="synthoma-archive__whispers" role="list">
            {whisperData.length === 0 ? (
              <p className="synthoma-archive__empty">Žádné šepoty v kanálu.</p>
            ) : (
              whisperData.map((w) => (
                <WhisperCard key={w.id} whisper={w} />
              ))
            )}
          </div>
          {!showWhisperForm ? (
            <button className="os-command" type="button" onClick={() => setShowWhisperForm(true)}>
              ZANECH ŠEPOT
            </button>
          ) : (
            <WhisperForm onSuccess={() => setShowWhisperForm(false)} />
          )}
          <WhisperSubmitPanel placement="archive" compact />
        </section>
      </div>
    </main>
  );
}
