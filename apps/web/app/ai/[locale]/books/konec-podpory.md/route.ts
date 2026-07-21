import { bookMarkdownRoute } from '../../../../../src/server/public-ai/markdownHandlers';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  return bookMarkdownRoute((await context.params).locale, 'konec-podpory');
}
