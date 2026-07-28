'use client';

import { useEffect, useId, useRef } from 'react';
import { useUiLayer } from '../ui-layer/UiLayerProvider';

interface CyklusBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export default function CyklusBottomSheet({ open, onClose, title, children, id }: CyklusBottomSheetProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const layerId = id ?? `cyklus-bottom-sheet:${titleId}`;
  const { closeLayer } = useUiLayer({
    id: layerId,
    type: 'bottom-sheet',
    open,
    onClose,
  });

  useEffect(() => {
    if (!open) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    return () => {
      returnFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div id={id} className="cyklus-no-select cyklus-bottom-sheet__backdrop">
      <button className="cyklus-bottom-sheet__dismiss" type="button" onClick={closeLayer} aria-label={`Zavřít ${title}`} />
      <div
        ref={dialogRef}
        className="cyklus-bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="cyklus-bottom-sheet__header">
          <span className="cyklus-bottom-sheet__title" id={titleId}>{title}</span>
          <button type="button" className="cyklus-bottom-sheet__close" onClick={closeLayer} aria-label="Zavřít">✕</button>
        </div>
        <div className="cyklus-bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
}
