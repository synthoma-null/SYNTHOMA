'use client';

import { useEffect, useCallback } from 'react';

interface CyklusBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function CyklusBottomSheet({ open, onClose, title, children }: CyklusBottomSheetProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="cyklus-bottom-sheet__backdrop" onClick={onClose} role="presentation">
      <div
        className="cyklus-bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className="cyklus-bottom-sheet__header">
          <span className="cyklus-bottom-sheet__title">{title}</span>
          <button type="button" className="cyklus-bottom-sheet__close" onClick={onClose} aria-label="Zavřít">✕</button>
        </div>
        <div className="cyklus-bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
}
