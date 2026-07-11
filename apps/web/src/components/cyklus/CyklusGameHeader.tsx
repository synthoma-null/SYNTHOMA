'use client';

import Link from 'next/link';
import { SECTOR_LABELS, type CyklusRunState } from '../../game/cyklus/cyklusTypes';

function CommandIcon({ name }: { name: 'home' | 'identity' | 'settings' | 'audio' | 'skip' }) {
  if (name === 'home') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6"/></svg>;
  }
  if (name === 'identity') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 0 0-7 7v2"/><path d="M19 10a7 7 0 0 0-7-7M8 20c1.2-2.2 1.6-4.6 1.3-7.2A2.7 2.7 0 0 1 12 10a2.7 2.7 0 0 1 2.7 2.8c-.3 3 .2 5.6 1.5 7.7"/><path d="M5 15c.4 2.2-.1 4-1.2 5.5M19 15c-.4 2.2.1 4 1.2 5.5M12 14v7"/></svg>;
  }
  if (name === 'settings') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2.9 2.9-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1-2.9-2.9.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2.9-2.9.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1 2.9 2.9-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
  }
  if (name === 'audio') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14M19 5v14M8 7l7 5-7 5Z"/></svg>;
}

function closeCompetingPanels(panel: 'identity' | 'settings' | 'audio') {
  if (panel !== 'identity') document.dispatchEvent(new CustomEvent('synthoma:identity-close', { detail: { restoreFocus: false } }));
  if (panel !== 'settings') document.dispatchEvent(new CustomEvent('synthoma:control-panel-close', { detail: { restoreFocus: false } }));
  if (panel !== 'audio') document.dispatchEvent(new CustomEvent('synthoma:audio-close', { detail: { restoreFocus: false } }));
}

export interface CyklusGameHeaderProps {
  state: CyklusRunState;
  showTutorialSkip: boolean;
  onTutorialSkip: () => void;
}

export default function CyklusGameHeader({ state, showTutorialSkip, onTutorialSkip }: CyklusGameHeaderProps) {
  const cycle = `C${String(state.cycle).padStart(2, '0')}`;
  const progress = `${String(state.choiceInCycle).padStart(2, '0')}/12`;

  return (
    <header className={`cyklus-header cyklus-game-header${showTutorialSkip ? ' cyklus-game-header--with-skip' : ''}`} data-testid="cyklus-gameplay-header">
      <div className="cyklus-game-header__left">
        <Link className="cyklus-header__action" href="/" aria-label="Domů" title="Domů">
          <CommandIcon name="home" />
        </Link>
      </div>

      <div className="cyklus-game-header__status" aria-label={`${SECTOR_LABELS[state.sector]}, cyklus ${state.cycle}, postup ${state.choiceInCycle} z 12`}>
        <span className="cyklus-sector" title={SECTOR_LABELS[state.sector]}>{SECTOR_LABELS[state.sector]}</span>
        <span aria-hidden="true">·</span>
        <span className="cyklus-cycle">{cycle}</span>
        <span aria-hidden="true">·</span>
        <span className="cyklus-progress">{progress}</span>
      </div>

      <nav className="cyklus-game-header__actions" aria-label="Ovládání Cyklu">
        <button
          className="cyklus-header__action"
          type="button"
          data-cyklus-command="identity"
          aria-label="Identita"
          aria-controls="id-panel-popup"
          aria-expanded="false"
          aria-pressed="false"
          title="Identita"
          onClick={() => {
            closeCompetingPanels('identity');
            document.dispatchEvent(new CustomEvent('synthoma:identity-toggle'));
          }}
        >
          <CommandIcon name="identity" />
        </button>
        <button
          id="toggle-panel-btn"
          className="cyklus-header__action"
          type="button"
          data-cyklus-command="settings"
          aria-label="Ovládací panel"
          aria-controls="control-panel"
          aria-expanded="false"
          aria-pressed="false"
          title="Ovládací panel"
          onClick={() => closeCompetingPanels('settings')}
        >
          <CommandIcon name="settings" />
        </button>
        <button
          id="toggle-audio-panel-btn"
          className="cyklus-header__action cyklus-header__action--audio"
          type="button"
          data-cyklus-command="audio"
          data-audio-state="paused"
          aria-label="Hudba: pozastaveno"
          aria-controls="synthoma-audio-panel"
          aria-expanded="false"
          aria-pressed="false"
          title="Hudba"
          onClick={() => {
            closeCompetingPanels('audio');
            document.dispatchEvent(new CustomEvent('synthoma:audio-toggle'));
          }}
        >
          <CommandIcon name="audio" />
          <span className="cyklus-audio-state" aria-hidden="true"><i /><i /><i /></span>
        </button>
        {showTutorialSkip && (
          <button className="cyklus-header__action cyklus-header__skip" type="button" onClick={onTutorialSkip} aria-label="Přeskočit tutorial" title="Přeskočit tutorial">
            <CommandIcon name="skip" />
          </button>
        )}
      </nav>
    </header>
  );
}
