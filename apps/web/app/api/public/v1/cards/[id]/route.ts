import { cardApi } from '../../../../../../src/server/public-ai/cardHandlers';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return cardApi(request, (await context.params).id);
}
