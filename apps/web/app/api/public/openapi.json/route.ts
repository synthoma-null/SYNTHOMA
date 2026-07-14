import { publicOpenApi } from '../../../../src/server/public-ai/openapi';
import { enforcePublicRateLimit } from '../../../../src/server/public-ai/rateLimit';
import { publicJson, publicOptions } from '../../../../src/server/public-ai/response';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  return enforcePublicRateLimit(request, 'read') ?? publicJson(request, publicOpenApi);
}
export const OPTIONS = publicOptions;
