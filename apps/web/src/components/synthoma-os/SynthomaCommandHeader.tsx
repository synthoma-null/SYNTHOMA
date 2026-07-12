'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SynthomaCommandIcon from './SynthomaCommandIcon';
import { useHeader } from './HeaderContext';

const SECTORS = [
  { href: '/', label: 'UZEL', icon: 'home' as const },
  { href: '/books', label: 'KNIHOVNA', icon: 'library' as const },
  { href: '/archive', label: 'ARCHIV', icon: 'archive' as const },
  { href: '/cyklus', label: 'CYKLUS', icon: 'cyklus' as const },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function closeCompetingPanels(panel: 'identity' | 'settings' | 'audio') {
  if (panel !== 'identity') document.dispatchEvent(new CustomEvent('synthoma:identity-close', { detail: { restoreFocus: false } }));
  if (panel !== 'settings') document.dispatchEvent(new CustomEvent('synthoma:control-panel-close', { detail: { restoreFocus: false } }));
  if (panel !== 'audio') document.dispatchEvent(new CustomEvent('synthoma:audio-close', { detail: { restoreFocus: false } }));
}

export default function SynthomaCommandHeader() {
  const pathname = usePathname() ?? '/';
  const { mode, status, actions } = useHeader();
  const active = SECTORS.find((sector) => isActive(pathname, sector.href));
  const quiet = mode === 'reader' || mode === 'utility';
  const label = active?.label ?? 'SYSTÉM';

  return (
    <header className={`synthoma-command-header synthoma-command-header--${mode}`} data-testid="synthoma-command-header">
      <Link className="synthoma-command-header__brand" href="/" aria-label="SYNTHOMA, hlavní uzel">SYNTHOMA</Link>
      <div className="synthoma-command-header__status" aria-label={`Aktivní sektor: ${label}`}>
        {status ? (
          <div className="synthoma-command-header__slot-status" data-testid="command-header-slot-status">{status}</div>
        ) : (
          <><span aria-hidden="true">SYS</span><strong>{label}</strong><span className="synthoma-command-header__pulse" aria-hidden="true" /></>
        )}
      </div>
      {!quiet && (
        <nav className="synthoma-command-header__sectors" aria-label="Hlavní sektory">
          {SECTORS.map((sector) => (
            <Link key={sector.href} href={sector.href} aria-current={isActive(pathname, sector.href) ? 'page' : undefined}>
              {sector.label}
            </Link>
          ))}
        </nav>
      )}
      <nav className="synthoma-command-header__commands" aria-label="Globální ovládání">
        {actions && <span className="synthoma-command-header__slot-actions" data-testid="command-header-slot-actions">{actions}</span>}
        <button className="os-command" type="button" data-synthoma-command="identity" aria-label="Identita" aria-controls="id-panel-popup" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('identity'); document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')); }}><SynthomaCommandIcon name="identity" /></button>
        <button id="toggle-panel-btn" className="os-command" type="button" data-synthoma-command="settings" aria-label="Nastavení" aria-controls="control-panel" aria-expanded="false" aria-pressed="false" onClick={() => closeCompetingPanels('settings')}><SynthomaCommandIcon name="settings" /></button>
        <button id="toggle-audio-panel-btn" className="os-command" type="button" data-synthoma-command="audio" data-audio-state="paused" aria-label="Hudba: pozastaveno" aria-controls="synthoma-audio-panel" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('audio'); document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')); }}><SynthomaCommandIcon name="audio" /></button>
      </nav>
    </header>
  );
}
