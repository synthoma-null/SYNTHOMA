import { PUBLIC_CONTENT_UPDATED_AT } from '../../../../src/server/public-ai/config';
import { publicOpenApiYaml } from '../../../../src/server/public-ai/openapi';
import { enforcePublicRateLimit } from '../../../../src/server/public-ai/rateLimit';
import { publicOptions } from '../../../../src/server/public-ai/response';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  const limited = enforcePublicRateLimit(request, 'read');
  if (limited) return limited;
  return new Response(publicOpenApiYaml(), { headers: {
    'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300, s-maxage=3600',
    'Content-Type': 'application/yaml; charset=utf-8', 'Last-Modified': new Date(PUBLIC_CONTENT_UPDATED_AT).toUTCString(),
  } });
}
export const OPTIONS = publicOptions;
