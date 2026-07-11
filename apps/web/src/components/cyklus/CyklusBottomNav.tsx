'use client';

interface CyklusBottomNavProps {
  pocketCount: number;
  onPocket: () => void;
  onBuild: () => void;
  onArchive: () => void;
  onVoid: () => void;
  active?: 'pocket' | 'build' | 'archive' | 'void' | null;
  dimmed?: boolean;
}

export function PocketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h16v11H4z" />
      <path d="M7 7.5V5h10v2.5M8.5 12h7M10 15h4" />
    </svg>
  );
}

export default function CyklusBottomNav({ pocketCount, onPocket, onBuild, onArchive, onVoid, active = null, dimmed }: CyklusBottomNavProps) {
  return (
    <nav className={`cyklus-bottom-nav ${dimmed ? 'cyklus-bottom-nav--dimmed' : ''}`} aria-label="Navigace">
      <button type="button" className={`cyklus-bottom-nav__btn cyklus-pocket-trigger ${active === 'pocket' ? 'is-active' : ''}`} onClick={onPocket} aria-label={`KAPSA, ${pocketCount} předmětů`} aria-haspopup="dialog" aria-pressed={active === 'pocket'}>
        <span className="cyklus-pocket-trigger__icon cyklus-bottom-nav__icon"><PocketIcon /></span>
        <span className="cyklus-pocket-trigger__label cyklus-bottom-nav__label">KAPSA</span>
        <span className="cyklus-pocket-trigger__count cyklus-bottom-nav__badge">{pocketCount}</span>
      </button>
      <button type="button" className={`cyklus-bottom-nav__btn ${active === 'build' ? 'is-active' : ''}`} onClick={onBuild} aria-haspopup="dialog" aria-pressed={active === 'build'}>
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">◇</span>
        <span className="cyklus-bottom-nav__label">BUILD</span>
      </button>
      <button type="button" className={`cyklus-bottom-nav__btn ${active === 'archive' ? 'is-active' : ''}`} onClick={onArchive} aria-haspopup="dialog" aria-pressed={active === 'archive'}>
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">⌁</span>
        <span className="cyklus-bottom-nav__label">ARCHIV</span>
      </button>
      <button type="button" className={`cyklus-bottom-nav__btn ${active === 'void' ? 'is-active' : ''}`} onClick={onVoid} aria-haspopup="dialog" aria-pressed={active === 'void'}>
        <span className="cyklus-bottom-nav__icon" aria-hidden="true">○</span>
        <span className="cyklus-bottom-nav__label">PRÁZDN0TA</span>
      </button>
    </nav>
  );
}
