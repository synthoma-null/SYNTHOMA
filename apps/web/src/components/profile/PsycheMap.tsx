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

const PROCESS_LABELS = {
  NI: 'VNITŘNÍ VIZE',
  FE: 'EMPATICKÁ ODEZVA',
  TI: 'VNITŘNÍ ANALÝZA',
  SE: 'SMYSLOVÝ KONTAKT',
} as const;

const PROCESS_SUMMARIES = {
  NI: 'Subjekt hledá vzorec dřív, než připustí, že některé věci žádný nemají.',
  FE: 'Subjekt nejprve vyhodnocuje dopad na ostatní a teprve potom cenu pro sebe.',
  TI: 'Subjekt dává přednost rozboru před okamžitou úlevou. Emoce budou zpracovány v pracovní době.',
  SE: 'Subjekt reaguje na přítomný okamžik dřív, než ho archiv stihne přejmenovat.',
} as const;

function displayTone(value: string): string {
  return value.replace(/_/g, ' ').toLocaleUpperCase('cs-CZ');
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
  const processes = ([['NI', psyche.ni], ['FE', psyche.fe], ['TI', psyche.ti], ['SE', psyche.se]] as const)
    .slice()
    .sort((left, right) => right[1] - left[1]);
  const dominant = processes[0]!;
  const secondary = processes[1]!;
  return (
    <section className="psyche-map">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [SOVEREIGN_PSYCHE_MAP]:</span>
        <span className="psyche-log-msg">&#8222;{t('psyche.log')}&#8220;</span>
      </div>

      <div className="psyche-imprint" aria-labelledby="psyche-imprint-title">
        <div className="profile-section-heading">
          <span>PSYCHE // INTERPRETATION</span>
          <h2 id="psyche-imprint-title">Psychický otisk</h2>
        </div>
        <dl className="psyche-imprint__signals">
          <div><dt>DOMINANTNÍ PROCES</dt><dd>{dominant[0]}{' // '}{PROCESS_LABELS[dominant[0]]}</dd></div>
          <div><dt>SEKUNDÁRNÍ ODEZVA</dt><dd>{secondary[0]}{' // '}{PROCESS_LABELS[secondary[0]]}</dd></div>
          <div><dt>OBRANNÝ MODUL</dt><dd>{displayTone(psyche.tone)}</dd></div>
          <div><dt>NESTABILITA OTISKU</dt><dd>{Math.max(0, Math.min(100, psyche.shadow))} %</dd></div>
        </dl>
        <p className="psyche-imprint__summary">{PROCESS_SUMMARIES[dominant[0]]} Strategie: {psyche.strategy}; tolerance rizika: {psyche.risk}.</p>
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
