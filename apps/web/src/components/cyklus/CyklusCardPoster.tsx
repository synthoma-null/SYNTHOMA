import { useEffect, useRef, useState } from 'react';
import type { CardPresentation } from '../../game/cyklus/cyklusTypes';

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
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [presentation.artSrc]);

  if (!presentation.artSrc) return null;

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
        tabIndex={0}
        data-desktop-mode="contain"
        data-mobile-mode={zoomed ? 'zoom-scroll' : 'contain'}
      >
        <img
          className="cyklus-card-art__image"
          src={presentation.artSrc}
          alt={presentation.artAlt ?? `Obrazový záznam: ${cardTitle}`}
          loading="eager"
          decoding="async"
          draggable={false}
          style={{ '--card-art-position': presentation.focalPoint ?? 'center' } as React.CSSProperties}
        />
      </div>
      <footer className="cyklus-card-art__footer">
        <button
          className="cyklus-card-art__zoom"
          type="button"
          aria-pressed={zoomed}
          onClick={() => {
            setZoomed((value) => !value);
            if (viewportRef.current) viewportRef.current.scrollTop = 0;
          }}
        >
          {zoomed ? 'CELÁ KARTA' : 'ZVĚTŠIT'}
        </button>
        <button className="cyklus-card-art__reveal" type="button" onClick={onReveal}>
          {presentation.revealLabel ?? 'OTEVŘÍT ZÁZNAM'}
        </button>
      </footer>
    </section>
  );
}
