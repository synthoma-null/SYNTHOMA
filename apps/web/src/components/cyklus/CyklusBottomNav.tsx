'use client';

interface CyklusBottomNavProps {
  pocketCount: number;
  onPocket: () => void;
  onBuild: () => void;
  onArchive: () => void;
  onVoid: () => void;
  dimmed?: boolean;
}

export default function CyklusBottomNav({ pocketCount, onPocket, onBuild, onArchive, onVoid, dimmed }: CyklusBottomNavProps) {
  return (
    <nav className={`cyklus-bottom-nav ${dimmed ? 'cyklus-bottom-nav--dimmed' : ''}`} aria-label="Navigace">
      <button type="button" className="cyklus-bottom-nav__btn" onClick={onPocket} aria-haspopup="dialog">
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">▤</span>
        <span className="cyklus-bottom-nav__label">KAPSA</span>
        {pocketCount > 0 && <span className="cyklus-bottom-nav__badge">{pocketCount}</span>}
      </button>
      <button type="button" className="cyklus-bottom-nav__btn" onClick={onBuild} aria-haspopup="dialog">
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">◇</span>
        <span className="cyklus-bottom-nav__label">BUILD</span>
      </button>
      <button type="button" className="cyklus-bottom-nav__btn" onClick={onArchive} aria-haspopup="dialog">
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">⌁</span>
        <span className="cyklus-bottom-nav__label">ARCHIV</span>
      </button>
      <button type="button" className="cyklus-bottom-nav__btn" onClick={onVoid} aria-haspopup="dialog">
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">○</span>
        <span className="cyklus-bottom-nav__label">PRÁZDN0TA</span>
      </button>
    </nav>
  );
}
