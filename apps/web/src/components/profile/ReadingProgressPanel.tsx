'use client';

import { useEffect, useState } from 'react';
import { useLang } from '../../lib/LangContext';

interface Progress {
  id: string;
  collection: string;
  chapterId: string;
  chapterTitle: string | null;
  progressPercent: number;
  completed: boolean;
  readMs: number;
  updatedAt: string;
}

export default function ReadingProgressPanel() {
  const { t } = useLang();
  const [items, setItems] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me/progress')
      .then((r) => r.json())
      .then((d: { progress: Progress[] }) => { setItems(d.progress ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalMs = items.reduce((s, i) => s + i.readMs, 0);
  const totalMin = Math.round(totalMs / 60000);
  const completed = items.filter((i) => i.completed).length;

  return (
    <section className="progress-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [READING_ARCHIVE]:</span>
        <span className="psyche-log-msg">&#8222;{t('reading.log')}&#8220;</span>
      </div>

      <dl className="progress-stats">
        <div className="progress-stat"><dt>{t('reading.stat.completed')}</dt><dd>{completed}</dd></div>
        <div className="progress-stat"><dt>{t('reading.stat.tracked')}</dt><dd>{items.length}</dd></div>
        <div className="progress-stat"><dt>{t('reading.stat.time')}</dt><dd>{totalMin} min</dd></div>
      </dl>

      {loading && <p className="progress-loading">{t('reading.loading')}</p>}

      <ul className="progress-list">
        {items.map((item) => (
          <li key={item.id} className={`progress-item${item.completed ? ' completed' : ''}`}>
            <div className="progress-item-header">
              <span className="progress-item-title">{item.chapterTitle ?? item.chapterId}</span>
              {item.completed && <span className="progress-item-badge">{t('reading.completed.badge')}</span>}
            </div>
            <div className="progress-track" aria-label={`${item.progressPercent}%`}>
              <div className="progress-fill" style={{ width: `${item.progressPercent}%` }} />
            </div>
            <span className="progress-pct">{item.progressPercent}%</span>
          </li>
        ))}
        {!loading && items.length === 0 && (
          <li className="progress-empty">{t('reading.empty')}</li>
        )}
      </ul>
    </section>
  );
}
