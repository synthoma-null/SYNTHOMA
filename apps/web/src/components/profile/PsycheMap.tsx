'use client';

import { useLang } from '../../lib/LangContext';

interface Psyche {
  ni: number; fe: number; ti: number; se: number;
  joy: number; trust: number; fear: number; surprise: number;
  sadness: number; disgust: number; anger: number; anticipation: number;
  shadow: number; tone: string; initiative: string; risk: string; tempo: string; strategy: string;
}

interface Props {
  psyche: Psyche;
  detailed?: boolean;
}

function Bar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="psyche-bar-row">
      <span className="psyche-bar-label">{label}</span>
      <div className="psyche-bar-track" aria-label={`${label}: ${value}`}>
        <div className="psyche-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="psyche-bar-value">{value}</span>
    </div>
  );
}

export default function PsycheMap({ psyche, detailed }: Props) {
  const { t } = useLang();
  return (
    <section className="psyche-map">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [SOVEREIGN_PSYCHE_MAP]:</span>
        <span className="psyche-log-msg">&#8222;{t('psyche.log')}&#8220;</span>
      </div>

      <div className="psyche-section">
        <h2 className="psyche-section-title">{t('psyche.cognitive')}</h2>
        <Bar label={t('psyche.ni')} value={psyche.ni} />
        <Bar label={t('psyche.fe')} value={psyche.fe} />
        <Bar label={t('psyche.ti')} value={psyche.ti} />
        <Bar label={t('psyche.se')} value={psyche.se} />
      </div>

      {detailed && (
        <>
          <div className="psyche-section">
            <h2 className="psyche-section-title">{t('psyche.emotion')}</h2>
            <Bar label={t('psyche.joy')} value={psyche.joy} />
            <Bar label={t('psyche.trust')} value={psyche.trust} />
            <Bar label={t('psyche.fear')} value={psyche.fear} />
            <Bar label={t('psyche.surprise')} value={psyche.surprise} />
            <Bar label={t('psyche.sadness')} value={psyche.sadness} />
            <Bar label={t('psyche.disgust')} value={psyche.disgust} />
            <Bar label={t('psyche.anger')} value={psyche.anger} />
            <Bar label={t('psyche.anticipation')} value={psyche.anticipation} />
          </div>

          <div className="psyche-section">
            <h2 className="psyche-section-title">{t('psyche.meta')}</h2>
            <dl className="psyche-meta">
              <div className="psyche-meta-row"><dt>{t('psyche.shadow')}</dt><dd>{psyche.shadow}</dd></div>
              <div className="psyche-meta-row"><dt>{t('psyche.tone')}</dt><dd>{psyche.tone}</dd></div>
              <div className="psyche-meta-row"><dt>{t('psyche.initiative')}</dt><dd>{psyche.initiative}</dd></div>
              <div className="psyche-meta-row"><dt>{t('psyche.risk')}</dt><dd>{psyche.risk}</dd></div>
              <div className="psyche-meta-row"><dt>{t('psyche.tempo')}</dt><dd>{psyche.tempo}</dd></div>
              <div className="psyche-meta-row"><dt>{t('psyche.strategy')}</dt><dd>{psyche.strategy}</dd></div>
            </dl>
          </div>
        </>
      )}
    </section>
  );
}
