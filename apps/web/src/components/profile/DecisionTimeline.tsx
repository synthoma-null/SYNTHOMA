'use client';

export interface RecentDecision {
  id: string;
  collection: string;
  chapterId: string;
  chapterTitle: string;
  choiceId: string | null;
  choiceText: string;
  nextBlockId: string | null;
  functionDelta: unknown;
  emotionDelta: unknown;
  tone: string | null;
  createdAt: string;
}

interface Props {
  decisions: RecentDecision[];
}

const DELTA_LABELS: Record<string, string> = {
  ni: 'NI',
  fe: 'FE',
  ti: 'TI',
  se: 'SE',
  joy: 'radost',
  trust: 'důvěra',
  fear: 'strach',
  surprise: 'překvapení',
  sadness: 'smutek',
  disgust: 'odpor',
  anger: 'hněv',
  anticipation: 'očekávání',
};

function deltaEntries(value: unknown): Array<[string, number]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] !== 0)
    .slice(0, 4);
}

function formatDeltas(decision: RecentDecision): string {
  const deltas = [...deltaEntries(decision.functionDelta), ...deltaEntries(decision.emotionDelta)].slice(0, 4);
  if (!deltas.length) return 'Otisk se nezměnil měřitelným způsobem.';
  return deltas
    .map(([key, value]) => `${DELTA_LABELS[key.toLowerCase()] ?? key.toUpperCase()} ${value > 0 ? '+' : ''}${value}`)
    .join(' / ');
}

function formatRelativeDate(value: string): string {
  const timestamp = new Date(value).getTime();
  const elapsedMinutes = Math.round((timestamp - Date.now()) / 60000);
  if (!Number.isFinite(timestamp)) return 'čas nezjištěn';
  if (Math.abs(elapsedMinutes) < 60) return new Intl.RelativeTimeFormat('cs-CZ', { numeric: 'auto' }).format(elapsedMinutes, 'minute');
  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (Math.abs(elapsedHours) < 24) return new Intl.RelativeTimeFormat('cs-CZ', { numeric: 'auto' }).format(elapsedHours, 'hour');
  return new Date(value).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function DecisionTimeline({ decisions }: Props) {
  return (
    <section className="profile-decisions" aria-labelledby="profile-decisions-title">
      <div className="profile-section-heading">
        <span>CHOICE TRACE // RECENT</span>
        <h2 id="profile-decisions-title">Poslední rozhodnutí</h2>
        <p>Jen volba a její měřitelná stopa. Původní obsah zůstává tam, kde vznikl.</p>
      </div>
      {decisions.length ? (
        <ol className="profile-decision-timeline">
          {decisions.map((decision) => (
            <li key={decision.id}>
              <div className="profile-decision-timeline__marker" aria-hidden="true" />
              <div className="profile-decision-timeline__body">
                <span>KARTA</span>
                <strong>{decision.chapterTitle}</strong>
                <dl>
                  <div><dt>VOLBA</dt><dd>{decision.choiceText || decision.choiceId || 'Bez čitelného záznamu'}</dd></div>
                  <div><dt>NÁSLEDEK</dt><dd>{formatDeltas(decision)}</dd></div>
                </dl>
                <time dateTime={decision.createdAt}>{formatRelativeDate(decision.createdAt)}</time>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="profile-empty">Žádná rozhodnutí. Systém zatím nemá co vytrhnout z kontextu.</p>}
    </section>
  );
}
