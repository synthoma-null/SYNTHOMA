import type { SwipeCard } from '../../game/cyklus/cyklusTypes';

type Props = {
  card: SwipeCard;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function CyklusCardScene({ card }: Props) {
  const html = card.sceneHtml ?? `<p class="text">${escapeHtml(card.scene)}</p>`;
  const sceneFx = ['cyklus-card-scene', ...(card.sceneFx ?? [])].join(' ');

  return (
    <div
      className={sceneFx}
      aria-label={card.scene}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
