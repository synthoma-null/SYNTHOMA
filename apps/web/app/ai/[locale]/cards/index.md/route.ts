import { resolvePublicLocale } from '../../../../../src/server/public-ai/config';
import { cardsMarkdown } from '../../../../../src/server/public-ai/cardHandlers';
import { publicMarkdown } from '../../../../../src/server/public-ai/response';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  const locale = resolvePublicLocale((await context.params).locale);
  return locale ? publicMarkdown(cardsMarkdown(locale)) : publicMarkdown('# Unsupported locale\n', 404);
}
