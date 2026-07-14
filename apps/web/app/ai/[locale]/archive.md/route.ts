import { archiveMarkdownRoute } from '../../../../src/server/public-ai/markdownHandlers';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  return archiveMarkdownRoute((await context.params).locale);
}
