'use client';

import Link from 'next/link';
import { useHeader } from '../synthoma-os/HeaderContext';
import SynthomaCommandIcon from '../synthoma-os/SynthomaCommandIcon';
import { useLang } from '../../lib/LangContext';

function closeCompetingPanels(panel: 'identity' | 'settings' | 'audio') {
  if (panel !== 'identity') document.dispatchEvent(new CustomEvent('synthoma:identity-close', { detail: { restoreFocus: false } }));
  if (panel !== 'settings') document.dispatchEvent(new CustomEvent('synthoma:control-panel-close', { detail: { restoreFocus: false } }));
  if (panel !== 'audio') document.dispatchEvent(new CustomEvent('synthoma:audio-close', { detail: { restoreFocus: false } }));
}

export default function CyklusCommandRail() {
  const { status, actions } = useHeader();
  const { lang, t } = useLang();
  const railLabel = lang === 'en' ? 'Cyklus controls' : 'Ovládání Cyklu';

  return (
    <header className="cyklus-game-header" data-testid="cyklus-command-rail" aria-label={railLabel}>
      <Link className="cyklus-game-header__brand" href="/" aria-label={t('shell.brand.aria')}>SYNTHOMA</Link>
      <div className="cyklus-game-header__status" data-testid="cyklus-command-rail-status">{status}</div>
      <nav className="cyklus-game-header__commands" aria-label={railLabel}>
        {actions}
        <button className="os-command" type="button" data-cyklus-command="identity" aria-label={t('shell.identity')} aria-controls="id-panel-popup" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('identity'); document.dispatchEvent(new CustomEvent('synthoma:identity-toggle')); }}><SynthomaCommandIcon name="identity" /></button>
        <button id="toggle-panel-btn" className="os-command" type="button" data-cyklus-command="settings" aria-label={t('shell.settings')} aria-controls="control-panel" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('settings'); document.dispatchEvent(new CustomEvent('synthoma:control-panel-toggle')); }}><SynthomaCommandIcon name="settings" /></button>
        <button id="toggle-audio-panel-btn" className="os-command" type="button" data-cyklus-command="audio" data-audio-state="paused" aria-label={t('shell.audio.paused')} aria-controls="synthoma-audio-panel" aria-expanded="false" aria-pressed="false" onClick={() => { closeCompetingPanels('audio'); document.dispatchEvent(new CustomEvent('synthoma:audio-toggle')); }}><SynthomaCommandIcon name="audio" /></button>
      </nav>
    </header>
  );
}
