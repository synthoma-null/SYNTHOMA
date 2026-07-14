import { llmsFull } from '../../src/server/public-ai/llms';
import { publicMarkdown } from '../../src/server/public-ai/response';
export const dynamic = 'force-dynamic';
export async function GET() { return publicMarkdown(await llmsFull()); }
