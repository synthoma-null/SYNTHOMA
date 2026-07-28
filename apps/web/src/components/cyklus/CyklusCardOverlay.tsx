'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useUiLayer } from '../ui-layer/UiLayerProvider';

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface CyklusCardOverlayProps {
  label: string;
  variant: 'outcome' | 'forecast' | 'summary' | 'sector' | 'warning';
  onClose: () => void;
  panelClassName?: string;
  children: ReactNode;
}

export default function CyklusCardOverlay({ label, variant, onClose, panelClassName = '', children }: CyklusCardOverlayProps) {
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { closeLayer } = useUiLayer({
    id: `cyklus-overlay:${variant}`,
    type: 'fullscreen-overlay',
    open: true,
    onClose,
    restoreFocus: () => returnFocusRef.current?.focus({ preventScroll: true }),
  });

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const primary = panel?.querySelector<HTMLElement>('[data-card-overlay-primary]');
    const first = primary ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const firstItem = focusable[0]!;
      const lastItem = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const target = returnFocusRef.current;
      if (target?.isConnected) target.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>('.cyklus-card')?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className={`cyklus-no-select cyklus-card-overlay cyklus-card-overlay--${variant}`} data-testid={`cyklus-card-overlay-${variant}`}>
      <button className="cyklus-card-overlay__backdrop" type="button" tabIndex={-1} aria-label={`Zavřít: ${label}`} onClick={closeLayer} />
      <section
        ref={panelRef}
        className={`cyklus-card-overlay__surface cyklus-card-overlay__panel ${panelClassName}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-card-overlay-surface="fill-card"
      >
        {children}
      </section>
    </div>
  );
}
