import { PUBLIC_CYKLUS_ENGINE_VERSION, PUBLIC_SCHEMA_VERSION } from './config';
import { publicJson } from './response';

const resources = {
  site: '/api/public/v1/site',
  author: '/api/public/v1/author',
  chapters: '/api/public/v1/chapters',
  archive: '/api/public/v1/archive',
  cards: '/api/public/v1/cards',
  cyklus: '/api/public/v1/cyklus',
} as const;

export const publicApiIndex = {
  name: 'SYNTHOMA Public API',
  version: PUBLIC_SCHEMA_VERSION,
  documentation: '/ai/api',
  openapi: '/api/public/openapi.json',
  llms: '/llms.txt',
  resources,
} as const;

export const publicV1Index = {
  name: 'SYNTHOMA Public API v1',
  version: PUBLIC_SCHEMA_VERSION,
  documentation: '/ai/api',
  parent: '/api/public',
  resources,
} as const;

export const publicCyklusIndex = {
  name: 'SYNTHOMA Cyklus',
  engineVersion: PUBLIC_CYKLUS_ENGINE_VERSION,
  rules: '/api/public/v1/cyklus/rules',
  start: { method: 'POST', href: '/api/public/v1/cyklus/run' },
  choose: { method: 'POST', href: '/api/public/v1/cyklus/choice' },
  documentation: '/ai/api',
} as const;

export function apiDiscovery(request: Request): Response {
  return publicJson(request, publicApiIndex);
}

export function apiV1Discovery(request: Request): Response {
  return publicJson(request, publicV1Index);
}

export function cyklusDiscovery(request: Request): Response {
  return publicJson(request, publicCyklusIndex);
}
