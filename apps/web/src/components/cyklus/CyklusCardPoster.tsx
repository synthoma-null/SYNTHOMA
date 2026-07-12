import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CardPresentation } from '../../game/cyklus/cyklusTypes';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const BUTTON_ZOOM_SCALE = 2;

interface PosterTransform {
  scale: number;
  x: number;
  y: number;
}

interface PointerPosition {
  x: number;
  y: number;
}

interface PinchStart {
  distance: number;
  scale: number;
  contentX: number;
  contentY: number;
}

interface PanStart {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
}

const COMPLETE_VIEW: PosterTransform = { scale: MIN_SCALE, x: 0, y: 0 };

function distanceBetween(first: PointerPosition, second: PointerPosition) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function midpoint(first: PointerPosition, second: PointerPosition) {
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

export default function CyklusCardPoster({
  presentation,
  cardTitle,
  fullscreen = false,
  onReveal,
}: {
  presentation: CardPresentation;
  cardTitle: string;
  fullscreen?: boolean;
  onReveal: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointersRef = useRef(new Map<number, PointerPosition>());
  const pinchRef = useRef<PinchStart | null>(null);
  const panRef = useRef<PanStart | null>(null);
  const transformRef = useRef<PosterTransform>(COMPLETE_VIEW);
  const [transform, setTransform] = useState<PosterTransform>(COMPLETE_VIEW);
  const [activePointerCount, setActivePointerCount] = useState(0);
  const instructionId = useId();

  const commitTransform = useCallback((next: PosterTransform) => {
    transformRef.current = next;
    setTransform(next);
  }, []);

  const clampTranslation = useCallback((scale: number, x: number, y: number): PosterTransform => {
    if (scale <= MIN_SCALE) return COMPLETE_VIEW;
    const viewport = viewportRef.current;
    if (!viewport) return { scale, x, y };

    const viewportRect = viewport.getBoundingClientRect();
    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;
    const image = imageRef.current;
    let containedWidth = viewportWidth;
    let containedHeight = viewportHeight;

    if (image?.naturalWidth && image.naturalHeight && viewportWidth > 0 && viewportHeight > 0) {
      const containRatio = Math.min(viewportWidth / image.naturalWidth, viewportHeight / image.naturalHeight);
      containedWidth = image.naturalWidth * containRatio;
      containedHeight = image.naturalHeight * containRatio;
    }

    const maxX = Math.max(0, (containedWidth * scale - viewportWidth) / 2);
    const maxY = Math.max(0, (containedHeight * scale - viewportHeight) / 2);
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const clearPointers = useCallback(() => {
    pointersRef.current.clear();
    pinchRef.current = null;
    panRef.current = null;
    setActivePointerCount(0);
  }, []);

  const resetView = useCallback(() => {
    clearPointers();
    commitTransform(COMPLETE_VIEW);
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [clearPointers, commitTransform]);

  useEffect(() => {
    resetView();
  }, [cardTitle, presentation.artSrc, resetView]);

  useEffect(() => () => {
    pointersRef.current.clear();
    pinchRef.current = null;
    panRef.current = null;
  }, []);

  const beginPinch = useCallback(() => {
    const viewport = viewportRef.current;
    const points = [...pointersRef.current.values()];
    if (!viewport || points.length < 2) return;
    const first = points[0]!;
    const second = points[1]!;
    const center = midpoint(first, second);
    const rect = viewport.getBoundingClientRect();
    const current = transformRef.current;
    pinchRef.current = {
      distance: Math.max(1, distanceBetween(first, second)),
      scale: current.scale,
      contentX: (center.x - rect.left - rect.width / 2 - current.x) / current.scale,
      contentY: (center.y - rect.top - rect.height / 2 - current.y) / current.scale,
    };
    panRef.current = null;
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!fullscreen) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setActivePointerCount(pointersRef.current.size);
    if (pointersRef.current.size >= 2) {
      beginPinch();
    } else if (transformRef.current.scale > MIN_SCALE) {
      panRef.current = {
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        x: transformRef.current.x,
        y: transformRef.current.y,
      };
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!fullscreen || !pointersRef.current.has(event.pointerId)) return;
    event.preventDefault();
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size >= 2) {
      if (!pinchRef.current) beginPinch();
      const pinch = pinchRef.current;
      const viewport = viewportRef.current;
      const points = [...pointersRef.current.values()];
      if (!pinch || !viewport || points.length < 2) return;
      const first = points[0]!;
      const second = points[1]!;
      const center = midpoint(first, second);
      const rect = viewport.getBoundingClientRect();
      const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinch.scale * distanceBetween(first, second) / pinch.distance));
      const nextX = center.x - rect.left - rect.width / 2 - pinch.contentX * nextScale;
      const nextY = center.y - rect.top - rect.height / 2 - pinch.contentY * nextScale;
      commitTransform(clampTranslation(nextScale, nextX, nextY));
      return;
    }

    const pan = panRef.current;
    if (!pan || pan.pointerId !== event.pointerId || transformRef.current.scale <= MIN_SCALE) return;
    commitTransform(clampTranslation(
      transformRef.current.scale,
      pan.x + event.clientX - pan.pointerX,
      pan.y + event.clientY - pan.pointerY,
    ));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!fullscreen) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pointersRef.current.delete(event.pointerId);
    setActivePointerCount(pointersRef.current.size);
    pinchRef.current = null;
    const remaining = [...pointersRef.current.entries()][0];
    if (remaining && transformRef.current.scale > MIN_SCALE) {
      panRef.current = {
        pointerId: remaining[0],
        pointerX: remaining[1].x,
        pointerY: remaining[1].y,
        x: transformRef.current.x,
        y: transformRef.current.y,
      };
    } else {
      panRef.current = null;
    }
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!fullscreen) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    clearPointers();
  };

  if (!presentation.artSrc) return null;

  const zoomed = transform.scale > MIN_SCALE;

  return (
    <section
      className={`cyklus-card-art${fullscreen ? ' cyklus-card-art--fullscreen' : ''}${zoomed ? ' cyklus-card-art--zoomed' : ''}`}
      data-poster-mode={fullscreen ? 'mobile-fullscreen' : 'card-contained'}
      data-zoom-mode={zoomed ? 'zoomed' : 'complete'}
    >
      <div
        ref={viewportRef}
        className="cyklus-card-art__viewport"
        role="region"
        aria-label={`Obrazová strana karty ${cardTitle}`}
        aria-describedby={instructionId}
        tabIndex={0}
        data-desktop-mode="contain"
        data-mobile-mode={zoomed ? 'transform-zoom' : 'contain'}
        data-scale={transform.scale}
        data-translate-x={transform.x}
        data-translate-y={transform.y}
        data-active-pointers={activePointerCount}
        onPointerDown={fullscreen ? handlePointerDown : undefined}
        onPointerMove={fullscreen ? handlePointerMove : undefined}
        onPointerUp={fullscreen ? handlePointerUp : undefined}
        onPointerCancel={fullscreen ? handlePointerCancel : undefined}
      >
        <span id={instructionId} className="sr-only">Obraz lze přiblížit dvěma prsty nebo tlačítkem Zvětšit.</span>
        <div
          className="cyklus-card-art__transform-layer"
          style={{
            '--poster-scale': transform.scale,
            '--poster-x': `${transform.x}px`,
            '--poster-y': `${transform.y}px`,
          } as React.CSSProperties}
        >
          <img
            ref={imageRef}
            className="cyklus-card-art__image"
            src={presentation.artSrc}
            alt={presentation.artAlt ?? `Obrazový záznam: ${cardTitle}`}
            loading="eager"
            decoding="async"
            draggable={false}
            onLoad={() => commitTransform(clampTranslation(transformRef.current.scale, transformRef.current.x, transformRef.current.y))}
            style={{ '--card-art-position': presentation.focalPoint ?? 'center' } as React.CSSProperties}
          />
        </div>
      </div>
      <footer className="cyklus-card-art__footer">
        <button
          className="cyklus-card-art__zoom"
          type="button"
          aria-pressed={zoomed}
          onClick={() => {
            clearPointers();
            commitTransform(zoomed ? COMPLETE_VIEW : clampTranslation(BUTTON_ZOOM_SCALE, 0, 0));
          }}
        >
          {zoomed ? 'CELÁ KARTA' : 'ZVĚTŠIT'}
        </button>
        <button
          className="cyklus-card-art__reveal"
          type="button"
          onClick={() => {
            resetView();
            onReveal();
          }}
        >
          {presentation.revealLabel ?? 'OTEVŘÍT ZÁZNAM'}
        </button>
      </footer>
    </section>
  );
}
