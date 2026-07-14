import { PUBLIC_CONTENT_VERSION, PUBLIC_CYKLUS_ENGINE_VERSION, PUBLIC_SCHEMA_VERSION, PUBLIC_SITE_URL } from './config';

const localeParameter = { name: 'locale', in: 'query', schema: { type: 'string', enum: ['cs', 'en'], default: 'cs' } };
const listParameters = [
  localeParameter,
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 } },
  { name: 'cursor', in: 'query', schema: { type: 'string' } },
];
const jsonResponse = { description: 'Versioned public response', content: { 'application/json': { schema: { type: 'object' } } } };
const publicGet = (summary: string, list = false) => ({
  summary, operationId: summary.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
  parameters: list ? listParameters : [localeParameter], responses: { '200': jsonResponse, '400': { $ref: '#/components/responses/Error' }, '429': { $ref: '#/components/responses/RateLimited' } },
});

export const publicOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'SYNTHOMA Public AI API', version: PUBLIC_SCHEMA_VERSION,
    description: `Read-only public lore and an isolated stateless Cyklus sandbox. Content ${PUBLIC_CONTENT_VERSION}; engine ${PUBLIC_CYKLUS_ENGINE_VERSION}. No account data or production progression.`,
  },
  servers: [{ url: PUBLIC_SITE_URL }],
  security: [],
  tags: [
    { name: 'Lore', description: 'Public and metadata-only canonical content.' },
    { name: 'Cards', description: 'Public Cyklus card registry views.' },
    { name: 'Cyklus', description: 'Anonymous stateless gameplay.' },
  ],
  paths: {
    '/api/public/v1/site': { get: { ...publicGet('Get Synthoma overview'), tags: ['Lore'] } },
    '/api/public/v1/author': { get: { ...publicGet('Get public author profile'), tags: ['Lore'] } },
    '/api/public/v1/books': { get: { ...publicGet('List public books'), tags: ['Lore'] } },
    '/api/public/v1/books/{id}': { get: { ...publicGet('Get public book'), tags: ['Lore'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, localeParameter] } },
    '/api/public/v1/chapters': { get: { ...publicGet('List chapter metadata', true), tags: ['Lore'] } },
    '/api/public/v1/chapters/{id}': { get: { ...publicGet('Get public chapter'), tags: ['Lore'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, localeParameter] } },
    '/api/public/v1/archive': { get: { ...publicGet('List public archive records', true), tags: ['Lore'] } },
    '/api/public/v1/archive/{id}': { get: { ...publicGet('Get public archive record'), tags: ['Lore'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, localeParameter] } },
    '/api/public/v1/cards': { get: { ...publicGet('List public Cyklus cards', true), tags: ['Cards'] } },
    '/api/public/v1/cards/{id}': { get: { ...publicGet('Get public Cyklus card'), tags: ['Cards'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, localeParameter] } },
    '/api/public/v1/cyklus/rules': { get: { ...publicGet('Get public Cyklus rules'), tags: ['Cyklus'] } },
    '/api/public/v1/cyklus/run': { post: {
      tags: ['Cyklus'], summary: 'Start stateless Cyklus run', operationId: 'start_cyklus_run',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StartRunRequest' } } } },
      responses: { '200': jsonResponse, '400': { $ref: '#/components/responses/Error' }, '413': { $ref: '#/components/responses/Error' }, '429': { $ref: '#/components/responses/RateLimited' } },
    } },
    '/api/public/v1/cyklus/choice': { post: {
      tags: ['Cyklus'], summary: 'Choose in stateless Cyklus run', operationId: 'choose_cyklus',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChoiceRequest' } } } },
      responses: { '200': jsonResponse, '400': { $ref: '#/components/responses/Error' }, '410': { $ref: '#/components/responses/Error' }, '429': { $ref: '#/components/responses/RateLimited' } },
    } },
  },
  components: {
    schemas: {
      StartRunRequest: { type: 'object', additionalProperties: false, properties: { locale: { type: 'string', enum: ['cs', 'en'], default: 'cs' }, seed: { type: 'string', minLength: 1, maxLength: 128 } } },
      ChoiceRequest: { type: 'object', additionalProperties: false, required: ['stateToken', 'choiceId'], properties: { stateToken: { type: 'string' }, choiceId: { type: 'string', enum: ['yes', 'no'] } } },
      Error: { type: 'object', required: ['error'], properties: { error: { type: 'object', required: ['code', 'message', 'status'], properties: { code: { type: 'string' }, message: { type: 'string' }, status: { type: 'integer' } } } } },
    },
    responses: {
      Error: { description: 'JSON error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      RateLimited: { description: 'Rate limited', headers: { 'Retry-After': { schema: { type: 'integer' } } }, content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  },
} as const;

function yamlScalar(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(String(value));
}

function yamlNode(value: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value) && value.length === 0) return `${pad}[]`;
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) return `${pad}{}`;
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' && item !== null
    ? `${pad}-\n${yamlNode(item, indent + 2)}`
    : `${pad}- ${yamlScalar(item)}`).join('\n');
  if (typeof value === 'object' && value !== null) return Object.entries(value).map(([key, item]) => {
    const safeKey = /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(key);
    return typeof item === 'object' && item !== null
      ? `${pad}${safeKey}:\n${yamlNode(item, indent + 2)}`
      : `${pad}${safeKey}: ${yamlScalar(item)}`;
  }).join('\n');
  return `${pad}${yamlScalar(value)}`;
}

export function publicOpenApiYaml(): string {
  return `${yamlNode(publicOpenApi)}\n`;
}
