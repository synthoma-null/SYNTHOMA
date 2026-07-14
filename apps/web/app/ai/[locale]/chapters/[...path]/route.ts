import { chapterMarkdownRoute } from '../../../../../src/server/public-ai/markdownHandlers';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, context: { params: Promise<{ locale: string; path: string[] }> }) {
  const params = await context.params;
  return chapterMarkdownRoute(params.locale, params.path);
}
