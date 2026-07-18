'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SynthomaCommandIcon from './SynthomaCommandIcon';
import { useHeader } from './HeaderContext';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';

const SECTORS = [
  { href: '/', labelKey: 'shell.node', icon: 'home' as const },
  { href: '/books', labelKey: 'shell.library', icon: 'library' as const },
  { href: '/archive', labelKey: 'shell.archive', icon: 'archive' as const },
  { href: '/cyklus', labelKey: 'shell.cyklus', icon: 'cyklus' as const },
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
  const { t } = useLang();
  const active = SECTORS.find((sector) => isActive(pathname, sector.href));
  const quiet = mode === 'reader' || mode === 'utility';
  const label = active ? t(active.labelKey as TKey) : t('shell.system');

  return (
    <header className={`synthoma-command-header synthoma-command-header--${mode}`} data-testid="synthoma-command-header">
      <Link className="synthoma-command-header__brand" href="/" aria-label={t('shell.brand.aria')}>SYNTHOMA</Link>
      <div className="synthoma-command-header__status" aria-label={`${t('shell.active.aria')}: ${label}`}>
        {status ? (
          <div className="synthoma-command-header__slot-status" data-testid="command-header-slot-status">{status}</div>
        ) : (
          <><span aria-hidden="true">SYS</span><strong>{label}</strong><span className="synthoma-command-header__pulse" aria-hidden="true" /></>
        )}
      </div>
      {!quiet && (
        <nav className="synthoma-command-header__sectors" aria-label={t('shell.sectors.aria')}>
          {SECTORS.map((sector) => (
            <Link key={sector.href} href={sector.href} aria-current={isActive(pathname, sector.href) ? 'page' : undefined}>
              {t(sector.labelKey as TKey)}
            </Link>
          ))}
        </nav>
      )}
      <nav className="synthoma-command-header__commands" aria-label={t('shell.controls.aria')}>
        {actions && <span className="synthoma-command-header__slot-actions" data-testid="command-header-slot-actions">{actions}</span>}
        <button className="os-command" type="button" data-synthoma-command="identity" aria-label={t('shell.identity')} aria-controls="id-panel-popup" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('identity'); document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')); }}><SynthomaCommandIcon name="identity" /></button>
        <button id="toggle-panel-btn" className="os-command" type="button" data-synthoma-command="settings" aria-label={t('shell.settings')} aria-controls="control-panel" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('settings'); document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle')); }}><SynthomaCommandIcon name="settings" /></button>
        <button id="toggle-audio-panel-btn" className="os-command" type="button" data-synthoma-command="audio" data-audio-state="paused" aria-label={t('shell.audio.paused')} aria-controls="synthoma-audio-panel" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('audio'); document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')); }}><SynthomaCommandIcon name="audio" /></button>
      </nav>
    </header>
  );
}
