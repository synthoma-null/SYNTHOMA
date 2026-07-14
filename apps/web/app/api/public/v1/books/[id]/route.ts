import { bookApi } from '../../../../../../src/server/public-ai/apiHandlers';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return bookApi(request, (await context.params).id);
}
