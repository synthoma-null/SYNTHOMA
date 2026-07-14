'use client';

import CyklusBottomSheet from './CyklusBottomSheet';
import { PocketIcon } from './CyklusBottomNav';
import { CyklusPocketContents, type CyklusPocketDockProps } from './CyklusPocketDock';

type CyklusMobileUtilityDockProps = Omit<CyklusPocketDockProps, 'highlighted'>;

export default function CyklusMobileUtilityDock({
  state,
  open,
  confirmActivateId,
  onToggle,
  onClose,
  onConfirmActivate,
  onActivate,
}: CyklusMobileUtilityDockProps) {
  const panelId = 'cyklus-mobile-pocket-panel';

  return (
    <div
      className="cyklus-mobile-utility-dock cyklus-no-select"
      role="toolbar"
      aria-label="Herní utility"
      data-cyklus-mobile-utility-dock
    >
      <button
        className="cyklus-mobile-utility-dock__pocket cyklus-pocket-trigger cyklus-no-select"
        type="button"
        onClick={onToggle}
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={`KAPSA, ${state.inventory.length} předmětů`}
      >
        <span className="cyklus-pocket-trigger__icon"><PocketIcon /></span>
        <span className="cyklus-pocket-trigger__label">KAPSA</span>
        <span className="cyklus-pocket-trigger__count">{state.inventory.length}</span>
      </button>
      {open ? (
        <CyklusBottomSheet id={panelId} open onClose={onClose} title={`KAPSA · ${state.inventory.length}`}>
          <CyklusPocketContents
            state={state}
            confirmActivateId={confirmActivateId}
            onConfirmActivate={onConfirmActivate}
            onActivate={onActivate}
          />
        </CyklusBottomSheet>
      ) : (
        <span id={panelId} hidden />
      )}
    </div>
  );
}
