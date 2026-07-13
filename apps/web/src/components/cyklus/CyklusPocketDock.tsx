'use client';

import { getComboHint } from '../../game/cyklus/cyklusEngine';
import { getPocketAmbientText, getPocketItems, getPrimaryMoodItem, MOOD_LABELS } from '../../game/cyklus/cyklusItemMood';
import type { CyklusRunState } from '../../game/cyklus/cyklusTypes';
import { PocketIcon } from './CyklusBottomNav';

const ITEM_ACTIVATION_HINTS: Record<string, string> = {
  rubber_seal: 'Vazba +8, připraví krizovou ochranu vazby.',
  mirror_shard: 'Aktivuje zrcadlový efekt, za 3 tahy přijde zrcadlová karta.',
  archive_key: 'Paměť −12, přesune subjekt do sektoru Archiv.',
  soft_bug: 'Vazba +8, Kontrola −6, za 4 tahy přijde následná karta.',
  warm_token: 'Za 3 tahy otevře přístup k tržišti žetonů.',
};

const ACTIVATABLE_ITEMS = new Set(['rubber_seal', 'mirror_shard', 'archive_key', 'soft_bug', 'warm_token']);

interface CyklusPocketDockProps {
  state: CyklusRunState;
  open: boolean;
  highlighted: boolean | undefined;
  confirmActivateId: string | null;
  onToggle: () => void;
  onConfirmActivate: (itemId: string | null) => void;
  onActivate: (itemId: string) => void;
}

export default function CyklusPocketDock({
  state,
  open,
  highlighted,
  confirmActivateId,
  onToggle,
  onConfirmActivate,
  onActivate,
}: CyklusPocketDockProps) {
  const panelId = 'cyklus-pocket-panel';
  const mood = state.inventory.length > 0 ? getPrimaryMoodItem(state)?.mood ?? 'quiet' : null;

  return (
    <section
      className={`cyklus-pocket cyklus-pocket--standalone${highlighted ? ' cyklus-pocket--highlight' : ''}${mood ? ` cyklus-pocket--mood-${mood}` : ''}`}
      aria-label="Kapsa"
      data-cyklus-pocket-dock
    >
      <button
        className="cyklus-pocket__toggle cyklus-pocket-trigger"
        type="button"
        onClick={onToggle}
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={`KAPSA, ${state.inventory.length} předmětů`}
      >
        <span className="cyklus-pocket-trigger__icon"><PocketIcon /></span>
        <span className="cyklus-pocket-trigger__label cyklus-footer__label">KAPSA</span>
        <span className="cyklus-pocket-trigger__count cyklus-pocket__count">{state.inventory.length}</span>
      </button>
      <div id={panelId} className="cyklus-pocket__panel" hidden={!open}>
        {state.inventory.length === 0 ? (
          <div className="cyklus-pocket__empty">Kapsa je prázdná. Nic tu nečeká.</div>
        ) : (
          <>
            {getPocketAmbientText(state) && <div className="cyklus-pocket__ambient">{getPocketAmbientText(state)}</div>}
            {getComboHint(state) && <div className="cyklus-pocket__combo-hint">{getComboHint(state)}</div>}
            <div className="cyklus-pocket__items">
              {getPocketItems(state).map((item) => {
                const activatable = ACTIVATABLE_ITEMS.has(item.id);
                const canActivate = activatable && state.lastItemActivationCycle < state.cycle;
                const isConfirming = confirmActivateId === item.id;
                return (
                  <div key={item.id} className={`cyklus-pocket__item cyklus-pocket__item--${item.mood}`}>
                    <span className="cyklus-pocket__item-name">{item.title}</span>
                    <span className="cyklus-pocket__item-mood">{MOOD_LABELS[item.mood]}</span>
                    <span className="cyklus-pocket__item-text">{item.moodText}</span>
                    {activatable && ITEM_ACTIVATION_HINTS[item.id] && <span className="cyklus-pocket__item-hint">{ITEM_ACTIVATION_HINTS[item.id]}</span>}
                    {activatable && (
                      isConfirming ? (
                        <div className="cyklus-pocket__confirm">
                          <button type="button" className="cyklus-pocket__activate" onClick={() => { onActivate(item.id); onConfirmActivate(null); }}>Potvrdit</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="cyklus-pocket__activate"
                          disabled={!canActivate}
                          onClick={() => canActivate && onConfirmActivate(item.id)}
                        >
                          {canActivate ? 'Aktivovat' : 'Aktivováno'}
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
