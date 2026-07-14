import { absolutePublicUrl, type PublicLocale } from './config';
import { getPublicCard, getPublicCards, type PublicCardDocument } from './contentService';
import { localeFromRequest, paginate, publicEnvelope, publicError, publicJson } from './response';

function cardData(card: PublicCardDocument) {
  return {
    cardId: card.id,
    sourceLocale: card.sourceLocale,
    title: card.title,
    category: card.category,
    tags: card.tags,
    visibility: card.visibility,
    scene: card.scene,
    choices: card.choices,
    posterUrl: card.posterUrl,
    posterAlt: card.posterAlt,
  };
}

function requestLocale(request: Request): PublicLocale | null {
  return localeFromRequest(request);
}

export function cardsApi(request: Request): Response {
  const locale = requestLocale(request);
  if (!locale) return publicError(request, 400, 'UNSUPPORTED_LOCALE', 'Supported locales are cs and en.');
  const page = paginate(request, getPublicCards(locale).map(cardData));
  if (!page) return publicError(request, 400, 'INVALID_CURSOR', 'The pagination cursor is invalid.');
  return publicJson(request, publicEnvelope({
    id: 'cyklus-cards', locale, title: 'Cyklus cards', canonicalUrl: absolutePublicUrl('/cards'), visibility: 'publicFull',
    data: page,
    links: { self: request.url, human: absolutePublicUrl('/cards'), markdown: absolutePublicUrl(`/ai/${locale}/cards/index.md`) },
  }));
}

export function cardApi(request: Request, id: string): Response {
  const locale = requestLocale(request);
  if (!locale) return publicError(request, 400, 'UNSUPPORTED_LOCALE', 'Supported locales are cs and en.');
  const card = getPublicCard(id, locale);
  if (!card) return publicError(request, 404, 'NOT_FOUND', 'Unknown or hidden Cyklus card.');
  return publicJson(request, publicEnvelope({
    id: card.id, locale, title: card.title, canonicalUrl: card.canonicalUrl, visibility: card.visibility, updatedAt: card.updatedAt,
    data: cardData(card),
    links: {
      self: absolutePublicUrl(`/api/public/v1/cards/${card.id}?locale=${locale}`), human: card.canonicalUrl,
      markdown: absolutePublicUrl(`/ai/${locale}/cards/${card.id}.md`), collection: absolutePublicUrl(`/api/public/v1/cards?locale=${locale}`),
    },
  }));
}

function cardFrontMatter(card: PublicCardDocument): string {
  return [
    '---', `id: ${JSON.stringify(card.id)}`, `locale: ${JSON.stringify(card.locale)}`,
    `sourceLocale: ${JSON.stringify(card.sourceLocale)}`, `status: ${JSON.stringify(card.visibility)}`,
    `canonical: ${JSON.stringify(card.canonicalUrl)}`, `updatedAt: ${JSON.stringify(card.updatedAt)}`, '---', '',
  ].join('\n');
}

export function cardMarkdown(card: PublicCardDocument): string {
  const metadata = `- Category: ${card.category}\n- Tags: ${card.tags.join(', ') || 'none'}\n- Visibility: ${card.visibility}`;
  if (card.visibility !== 'publicFull') {
    return `${cardFrontMatter(card)}# ${card.title}\n\n${metadata}\n\nFull card text and poster are not public.\n`;
  }
  return `${cardFrontMatter(card)}# ${card.title}\n\n${metadata}\n\n${card.scene ?? ''}\n\n## Choices\n\n${card.choices.map((choice) => `- \`${choice.id}\`: ${choice.label}`).join('\n')}\n${card.posterUrl ? `\nPoster: ${card.posterUrl}\n` : ''}`;
}

export function cardsMarkdown(locale: PublicLocale): string {
  const cards = getPublicCards(locale);
  return `# Cyklus cards\n\n- Locale: ${locale}\n- Canonical: ${absolutePublicUrl('/cards')}\n- Source: canonical Cyklus registry\n\n${cards.map((card) => `- [${card.title}](${absolutePublicUrl(`/ai/${locale}/cards/${card.id}.md`)}) - ${card.visibility}`).join('\n')}\n`;
}
