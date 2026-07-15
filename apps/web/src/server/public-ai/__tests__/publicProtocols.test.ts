/** @jest-environment node */

import robots from '../../../../app/robots';
import sitemap from '../../../../app/sitemap';
import { llmsFull, llmsIndex } from '../llms';
import { publicOpenApi, publicOpenApiYaml } from '../openapi';

describe('public AI discovery protocols', () => {
  it('allows public AI crawlers and disallows private routes', () => {
    const value = robots();
    const rules = Array.isArray(value.rules) ? value.rules : [value.rules];
    for (const agent of ['*', 'OAI-SearchBot', 'GPTBot']) {
      const rule = rules.find((entry) => entry.userAgent === agent);
      expect(rule?.allow).toEqual(expect.arrayContaining(['/api/public/', '/ai/', '/cards']));
      expect(rule?.disallow).toEqual(expect.arrayContaining(['/api/me', '/api/auth', '/profile', '/admin']));
    }
    expect(value.sitemap).toBe('https://www.synthoma.cz/sitemap.xml');
  });

  it('generates the sitemap from public chapter, Archive and card registries', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(expect.arrayContaining([
      'https://www.synthoma.cz/books', 'https://www.synthoma.cz/chapter/0-0-null',
      'https://www.synthoma.cz/archive', 'https://www.synthoma.cz/cards',
      'https://www.synthoma.cz/cards/acid_filter',
      'https://www.synthoma.cz/ai/api', 'https://www.synthoma.cz/ai-policy',
    ]));
    expect(urls.some((url) => url.includes('tutorial_00_welcome'))).toBe(false);
    expect(urls.some((url) => url.includes('/profile'))).toBe(false);
  });

  it('publishes curated and full LLM manifests without paid chapters or private data', async () => {
    const [index, full] = await Promise.all([llmsIndex(), llmsFull()]);
    expect(index).toContain('# SYNTHOMA');
    expect(index).toContain('/api/public/openapi.json');
    expect(index).toContain('/api/public/v1/cyklus/rules');
    expect(index).toContain('/api/public/v1/cyklus/run');
    expect(index).toContain('/api/public/v1/cyklus/choice');
    expect(index).toContain('/ai/api');
    expect(full).toContain('## Free chapters');
    expect(full).not.toContain('### 0-4 [DEFRAGMENTATION]');
    for (const term of ['mnemBalance', 'userId', 'sessionId', 'Purchase']) expect(full).not.toContain(term);
  });

  it('documents every runtime public endpoint in valid JSON and YAML-shaped OpenAPI', () => {
    expect(publicOpenApi.openapi).toBe('3.1.0');
    expect(Object.keys(publicOpenApi.paths)).toEqual(expect.arrayContaining([
      '/api/public/v1/site', '/api/public/v1/author', '/api/public/v1/books',
      '/api/public', '/api/public/v1', '/api/public/v1/cyklus',
      '/api/public/v1/chapters', '/api/public/v1/archive', '/api/public/v1/cards',
      '/api/public/v1/cyklus/rules', '/api/public/v1/cyklus/run', '/api/public/v1/cyklus/choice',
    ]));
    expect(JSON.parse(JSON.stringify(publicOpenApi))).toMatchObject({ security: [], info: { version: '1' } });
    expect(publicOpenApi.paths['/api/public/v1/cyklus/rules'].get.operationId).toBe('get_cyklus_rules');
    expect(publicOpenApi.paths['/api/public/v1/cyklus/run'].post.operationId).toBe('start_cyklus_run');
    expect(publicOpenApi.paths['/api/public/v1/cyklus/choice'].post.operationId).toBe('choose_cyklus');
    expect(publicOpenApi.paths['/api/public/v1/cyklus/run'].post.requestBody.content['application/json'].example).toEqual({ locale: 'cs', seed: 'agent-example' });
    expect(publicOpenApi.paths['/api/public/v1/cyklus/choice'].post.requestBody.content['application/json'].example).toMatchObject({ choiceId: 'yes' });
    const yaml = publicOpenApiYaml();
    expect(yaml).toContain('openapi: "3.1.0"');
    expect(yaml).toContain('security:\n  []');
    expect(yaml).toContain('"/api/public/v1/cyklus/choice":');
  });
});
