import { useEffect, useRef } from 'react';
import type { CardPresentation } from '../../game/cyklus/cyklusTypes';

export default function CyklusCardPoster({
  presentation,
  cardTitle,
  onReveal,
}: {
  presentation: CardPresentation;
  cardTitle: string;
  onReveal: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [presentation.artSrc]);

  if (!presentation.artSrc) return null;

  return (
    <section className="cyklus-card-art" data-poster-mode="responsive">
      <div
        ref={viewportRef}
        className="cyklus-card-art__viewport"
        role="region"
        aria-label={`Obrazová strana karty ${cardTitle}`}
        tabIndex={0}
        data-desktop-mode="contain"
        data-mobile-mode="scroll"
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
        <button className="cyklus-card-art__reveal" type="button" onClick={onReveal}>
          {presentation.revealLabel ?? 'OTEVŘÍT ZÁZNAM'}
        </button>
      </footer>
    </section>
  );
}
