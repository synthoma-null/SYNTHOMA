'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { getSpeaker, getSpeakerCssProperties } from '../../content/speakers';
import { useUiLayer } from '../ui-layer/UiLayerProvider';

interface ActiveDialog {
  speakerId: string;
  tone: string;
  left: number;
  top: number;
}

export default function ReaderDialogController({ rootId }: { rootId: string }) {
  const [active, setActive] = useState<ActiveDialog | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const restoreElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeDialog = useCallback(() => setActive(null), []);
  const restoreFocus = useCallback(() => restoreElementRef.current?.focus(), []);
  const { closeLayer } = useUiLayer({
    id: 'reader-dialog-status',
    type: 'reader-speaker',
    open: Boolean(active),
    onClose: closeDialog,
    restoreFocus,
  });

  useEffect(() => {
    if (active) return;
    activeElementRef.current?.classList.remove('dialog-line--active');
    activeElementRef.current?.removeAttribute('aria-describedby');
    activeElementRef.current = null;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const dialogs = Array.from(root.querySelectorAll<HTMLElement>('.dialog-line[data-speaker]'));
    for (const dialog of dialogs) {
      const speaker = getSpeaker(dialog.dataset.speaker);
      if (!speaker) continue;
      dialog.classList.add(`dialog--${speaker.id}`);
      dialog.tabIndex = 0;
      dialog.setAttribute('role', 'button');
      dialog.setAttribute('aria-label', `Dialog: ${speaker.name}. Tón: ${dialog.dataset.tone || speaker.defaultTone}.`);
      const properties = getSpeakerCssProperties(speaker);
      Object.entries(properties).forEach(([property, value]) => dialog.style.setProperty(property, value));
    }

    const open = (dialog: HTMLElement) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) return;
      const speaker = getSpeaker(dialog.dataset.speaker);
      if (!speaker) return;
      if (activeElementRef.current === dialog) {
        closeLayer();
        return;
      }
      activeElementRef.current?.classList.remove('dialog-line--active');
      activeElementRef.current?.removeAttribute('aria-describedby');
      activeElementRef.current = dialog;
      restoreElementRef.current = dialog;
      dialog.classList.add('dialog-line--active');
      dialog.setAttribute('aria-describedby', 'reader-dialog-status');
      const rect = dialog.getBoundingClientRect();
      setActive({
        speakerId: speaker.id,
        tone: dialog.dataset.tone || speaker.defaultTone,
        left: Math.min(window.innerWidth - 340, Math.max(16, rect.left + 20)),
        top: Math.min(window.innerHeight - 150, rect.bottom + 8),
      });
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.dialog-line[data-speaker]') : null;
      if (target && root.contains(target)) open(target);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.dialog-line[data-speaker]') : null;
      if (target && root.contains(target) && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        open(target);
      }
    };
    const onOutside = (event: MouseEvent) => {
      if (!activeElementRef.current) return;
      const target = event.target;
      if (target instanceof Node && (activeElementRef.current.contains(target) || document.getElementById('reader-dialog-status')?.contains(target))) return;
      closeLayer();
    };

    root.addEventListener('click', onClick);
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('click', onClick);
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeLayer, rootId]);

  if (!active) return null;
  const speaker = getSpeaker(active.speakerId);
  if (!speaker) return null;
  const style = {
    ...getSpeakerCssProperties(speaker),
    left: `${active.left}px`,
    top: `${active.top}px`,
  } as CSSProperties;

  return createPortal(
    <div
      id="reader-dialog-status"
      className="reader-dialog-status"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-dialog-status-title"
      style={style}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Zavřít informaci o dialogu"
        onClick={closeLayer}
      >
        ×
      </button>
      <span className="reader-dialog-status__eyebrow">MLUVČÍ</span>
      <strong id="reader-dialog-status-title">{speaker.name}</strong>
      <span>{active.tone}</span>
    </div>,
    document.body,
  );
}
