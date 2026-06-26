'use client';

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
  return (
    <section className="psyche-map">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [SOVEREIGN_PSYCHE_MAP]:</span>
        <span className="psyche-log-msg">&#8222;Psychometrická mapa subjektu načtena.&#8220;</span>
      </div>

      <div className="psyche-section">
        <h2 className="psyche-section-title">KOGNITIVNÍ FUNKCE</h2>
        <Bar label="Ni  Intuice" value={psyche.ni} />
        <Bar label="Fe  Empatie" value={psyche.fe} />
        <Bar label="Ti  Analýza" value={psyche.ti} />
        <Bar label="Se  Vnímání" value={psyche.se} />
      </div>

      {detailed && (
        <>
          <div className="psyche-section">
            <h2 className="psyche-section-title">EMOČNÍ ENERGIE</h2>
            <Bar label="Radost" value={psyche.joy} />
            <Bar label="Důvěra" value={psyche.trust} />
            <Bar label="Strach" value={psyche.fear} />
            <Bar label="Překvapení" value={psyche.surprise} />
            <Bar label="Smutek" value={psyche.sadness} />
            <Bar label="Odpor" value={psyche.disgust} />
            <Bar label="Hněv" value={psyche.anger} />
            <Bar label="Očekávání" value={psyche.anticipation} />
          </div>

          <div className="psyche-section">
            <h2 className="psyche-section-title">META HODNOTY</h2>
            <dl className="psyche-meta">
              <div className="psyche-meta-row"><dt>Stín</dt><dd>{psyche.shadow}</dd></div>
              <div className="psyche-meta-row"><dt>Tón</dt><dd>{psyche.tone}</dd></div>
              <div className="psyche-meta-row"><dt>Iniciativa</dt><dd>{psyche.initiative}</dd></div>
              <div className="psyche-meta-row"><dt>Riziko</dt><dd>{psyche.risk}</dd></div>
              <div className="psyche-meta-row"><dt>Tempo</dt><dd>{psyche.tempo}</dd></div>
              <div className="psyche-meta-row"><dt>Strategie</dt><dd>{psyche.strategy}</dd></div>
            </dl>
          </div>
        </>
      )}
    </section>
  );
}
