'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
} from 'react';

export interface UiLayer {
  id: string;
  type: string;
  close: () => void;
  restoreFocus?: (() => void) | undefined;
  modal?: boolean | undefined;
}

interface RegisteredLayer extends UiLayer {
  openedAt: string;
}

interface UiLayerContextValue {
  register: (layer: UiLayer) => () => void;
  close: (id: string) => void;
}

interface SynthomaHistoryState {
  synthomaUiLayer?: {
    id: string;
    depth: number;
  };
  synthomaUiLayerDismissed?: {
    url: string;
  };
  [key: string]: unknown;
}

const UiLayerContext = createContext<UiLayerContextValue | null>(null);
const HISTORY_KEY = 'synthomaUiLayer';
const BODY_LOCK_CLASS = 'synthoma-ui-layer-lock';

function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function stateWithoutLayer(state: unknown): SynthomaHistoryState {
  const next = { ...((state && typeof state === 'object' ? state : {}) as SynthomaHistoryState) };
  delete next[HISTORY_KEY];
  delete next.synthomaUiLayerDismissed;
  return next;
}

export default function UiLayerProvider({ children }: PropsWithChildren) {
  const stackRef = useRef<RegisteredLayer[]>([]);
  const dismissedEntryRef = useRef<string | null>(null);

  const syncBodyLock = useCallback(() => {
    document.body.classList.toggle(
      BODY_LOCK_CLASS,
      stackRef.current.some((layer) => layer.modal !== false),
    );
  }, []);

  const writeMarker = useCallback((mode: 'push' | 'replace') => {
    const top = stackRef.current.at(-1);
    if (!top) return;
    const state: SynthomaHistoryState = {
      ...stateWithoutLayer(window.history.state),
      [HISTORY_KEY]: { id: top.id, depth: stackRef.current.length },
    };
    window.history[mode === 'push' ? 'pushState' : 'replaceState'](state, '', window.location.href);
  }, []);

  const restoreLayerFocus = useCallback((layer: RegisteredLayer) => {
    window.requestAnimationFrame(() => layer.restoreFocus?.());
  }, []);

  const markCurrentEntryDismissed = useCallback(() => {
    const url = currentUrl();
    dismissedEntryRef.current = url;
    window.history.replaceState(
      {
        ...stateWithoutLayer(window.history.state),
        synthomaUiLayerDismissed: { url },
      },
      '',
      window.location.href,
    );
  }, []);

  const removeLayer = useCallback((id: string, source: 'manual' | 'unmount') => {
    const index = stackRef.current.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const wasTop = index === stackRef.current.length - 1;
    const [removed] = stackRef.current.splice(index, 1);
    syncBodyLock();

    if (!wasTop) {
      if (stackRef.current.length > 0) writeMarker('replace');
      return;
    }

    if (stackRef.current.length > 0) {
      writeMarker('replace');
    } else if ((window.history.state as SynthomaHistoryState | null)?.[HISTORY_KEY]) {
      markCurrentEntryDismissed();
    } else {
      window.history.replaceState(stateWithoutLayer(window.history.state), '', window.location.href);
    }

    if (source === 'manual' && removed) restoreLayerFocus(removed);
  }, [markCurrentEntryDismissed, restoreLayerFocus, syncBodyLock, writeMarker]);

  const close = useCallback((id: string) => {
    const top = stackRef.current.at(-1);
    if (!top || top.id !== id) return;
    stackRef.current.pop();
    syncBodyLock();

    if (stackRef.current.length > 0) {
      writeMarker('replace');
    } else if ((window.history.state as SynthomaHistoryState | null)?.[HISTORY_KEY]) {
      markCurrentEntryDismissed();
    }

    top.close();
    restoreLayerFocus(top);
  }, [markCurrentEntryDismissed, restoreLayerFocus, syncBodyLock, writeMarker]);

  const register = useCallback((layer: UiLayer) => {
    const existing = stackRef.current.find((candidate) => candidate.id === layer.id);
    if (existing) {
      existing.close = layer.close;
      existing.restoreFocus = layer.restoreFocus;
      existing.modal = layer.modal;
      return () => removeLayer(layer.id, 'unmount');
    }

    const registered: RegisteredLayer = { ...layer, openedAt: currentUrl() };
    const firstLayer = stackRef.current.length === 0;
    const canReuseDismissedEntry = firstLayer
      && Boolean((window.history.state as SynthomaHistoryState | null)?.synthomaUiLayerDismissed);
    if (canReuseDismissedEntry) dismissedEntryRef.current = null;
    stackRef.current.push(registered);
    syncBodyLock();
    writeMarker(firstLayer && !canReuseDismissedEntry ? 'push' : 'replace');

    return () => removeLayer(layer.id, 'unmount');
  }, [removeLayer, syncBodyLock, writeMarker]);

  useEffect(() => {
    const onPopState = () => {
      const top = stackRef.current.pop();
      if (!top) {
        const dismissedUrl = dismissedEntryRef.current;
        if (dismissedUrl && currentUrl() === dismissedUrl) {
          dismissedEntryRef.current = null;
          window.history.back();
        }
        return;
      }

      syncBodyLock();
      top.close();
      restoreLayerFocus(top);

      if (stackRef.current.length > 0) {
        writeMarker('push');
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const top = stackRef.current.at(-1);
      if (!top) return;
      event.preventDefault();
      event.stopPropagation();
      close(top.id);
    };

    window.addEventListener('popstate', onPopState);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.classList.remove(BODY_LOCK_CLASS);
    };
  }, [close, restoreLayerFocus, syncBodyLock, writeMarker]);

  const value = useMemo<UiLayerContextValue>(() => ({ register, close }), [close, register]);
  return <UiLayerContext.Provider value={value}>{children}</UiLayerContext.Provider>;
}

interface UseUiLayerOptions {
  id: string;
  type: string;
  open: boolean;
  onClose: () => void;
  restoreFocus?: (() => void) | undefined;
  modal?: boolean | undefined;
}

export function useUiLayer({
  id,
  type,
  open,
  onClose,
  restoreFocus,
  modal = true,
}: UseUiLayerOptions): { closeLayer: () => void } {
  const manager = useContext(UiLayerContext);
  const closeRef = useRef(onClose);
  const restoreFocusRef = useRef(restoreFocus);
  closeRef.current = onClose;
  restoreFocusRef.current = restoreFocus;

  useEffect(() => {
    if (!open || !manager) return;
    return manager.register({
      id,
      type,
      modal,
      close: () => closeRef.current(),
      restoreFocus: () => restoreFocusRef.current?.(),
    });
  }, [id, manager, modal, open, type]);

  useEffect(() => {
    if (!open || manager) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [manager, open]);

  const closeLayer = useCallback(() => {
    if (manager) manager.close(id);
    else closeRef.current();
  }, [id, manager]);

  return { closeLayer };
}
