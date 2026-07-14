import { archiveEntryApi } from '../../../../../../src/server/public-ai/apiHandlers';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return archiveEntryApi(request, (await context.params).id);
}
