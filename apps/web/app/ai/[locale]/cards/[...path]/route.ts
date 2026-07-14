import { cardMarkdown } from '../../../../../src/server/public-ai/cardHandlers';
import { resolvePublicLocale } from '../../../../../src/server/public-ai/config';
import { getPublicCard } from '../../../../../src/server/public-ai/contentService';
import { publicMarkdown } from '../../../../../src/server/public-ai/response';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, context: { params: Promise<{ locale: string; path: string[] }> }) {
  const params = await context.params;
  const locale = resolvePublicLocale(params.locale);
  if (!locale || params.path.length !== 1 || !params.path[0]?.endsWith('.md')) return publicMarkdown('# Not found\n', 404);
  const card = getPublicCard(params.path[0].slice(0, -3), locale);
  return card ? publicMarkdown(cardMarkdown(card)) : publicMarkdown('# Unknown card\n', 404);
}
