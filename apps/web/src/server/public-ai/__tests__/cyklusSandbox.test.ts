/** @jest-environment node */

import { CYKLUS_CARDS } from '../../../game/cyklus/cyklusCards';
import type { CyklusEffect } from '../../../game/cyklus/cyklusTypes';
import { applyPublicCyklusChoice, createPublicCyklusState, publicCardView } from '../cyklusSandbox';
import { openPublicCyklusState, PublicTokenError, sealPublicCyklusState } from '../cyklusToken';
import { chooseCyklus, startCyklusRun } from '../gameHandlers';
import { resetPublicRateLimitsForTests } from '../rateLimit';
import { resolveCardPublicVisibility } from '../visibility';

describe('public Cyklus sandbox', () => {
  beforeAll(() => { process.env.AI_STATE_TOKEN_SECRET = 'test-only-public-cyklus-secret-with-32-bytes'; });
  beforeEach(resetPublicRateLimitsForTests);

  it('plays a deterministic public-only run to the 12 turn horizon', () => {
    const play = () => {
      let state = createPublicCyklusState('phase-5-7-contract');
      const cards: string[] = [];
      for (let turn = 0; turn < 12 && state.status === 'playing'; turn += 1) {
        const card = publicCardView(state, 'cs');
        expect(card).not.toBeNull();
        cards.push(card!.id);
        const applied = applyPublicCyklusChoice(state, turn % 2 === 0 ? 'yes' : 'no');
        expect(applied).not.toBeNull();
        state = applied!.state;
      }
      return { state, cards };
    };
    const first = play();
    const second = play();
    expect(first.state.status).toBe('completed');
    expect(first.state.history).toHaveLength(12);
    expect(second.cards).toEqual(first.cards);
    expect(second.state.stats).toEqual(first.state.stats);
  });

  it('round-trips and rejects a modified opaque state token', async () => {
    const state = createPublicCyklusState('token-contract');
    const token = await sealPublicCyklusState({ state, locale: 'cs' });
    await expect(openPublicCyklusState(token)).resolves.toMatchObject({ locale: 'cs', state: { seed: 'token-contract' } });
    const parts = token.split('.');
    const ciphertext = parts[2]!;
    const index = Math.floor(ciphertext.length / 2);
    parts[2] = `${ciphertext.slice(0, index)}${ciphertext[index] === 'a' ? 'b' : 'a'}${ciphertext.slice(index + 1)}`;
    const changed = parts.join('.');
    await expect(openPublicCyklusState(changed)).rejects.toMatchObject<Partial<PublicTokenError>>({ code: 'INVALID_STATE_TOKEN' });
  });

  it('expires old tokens with a readable code', async () => {
    const now = Date.now();
    const spy = jest.spyOn(Date, 'now').mockReturnValue(now);
    const token = await sealPublicCyklusState({ state: createPublicCyklusState('expiry-contract'), locale: 'cs' });
    spy.mockReturnValue(now + 61 * 60_000);
    await expect(openPublicCyklusState(token)).rejects.toMatchObject<Partial<PublicTokenError>>({ code: 'RUN_EXPIRED' });
    spy.mockRestore();
  });

  it('requires a dedicated sufficiently long production token secret', async () => {
    const environment = process.env as Record<string, string | undefined>;
    const originalAiSecret = environment.AI_STATE_TOKEN_SECRET;
    const originalAuthSecret = environment.AUTH_SECRET;
    const originalNodeEnv = environment.NODE_ENV;
    try {
      environment.NODE_ENV = 'production';
      delete environment.AI_STATE_TOKEN_SECRET;
      environment.AUTH_SECRET = 'auth-secret-must-not-sign-public-ai-state';

      await expect(sealPublicCyklusState({ state: createPublicCyklusState('secret-contract'), locale: 'cs' }))
        .rejects.toThrow('AI_STATE_TOKEN_SECRET is required');

      environment.AI_STATE_TOKEN_SECRET = 'too-short';
      await expect(sealPublicCyklusState({ state: createPublicCyklusState('secret-length-contract'), locale: 'cs' }))
        .rejects.toThrow('at least 32 characters');

      environment.AI_STATE_TOKEN_SECRET = environment.AUTH_SECRET;
      await expect(sealPublicCyklusState({ state: createPublicCyklusState('secret-isolation-contract'), locale: 'cs' }))
        .rejects.toThrow('must differ from authentication secrets');
    } finally {
      if (originalAiSecret === undefined) delete environment.AI_STATE_TOKEN_SECRET;
      else environment.AI_STATE_TOKEN_SECRET = originalAiSecret;
      if (originalAuthSecret === undefined) delete environment.AUTH_SECRET;
      else environment.AUTH_SECRET = originalAuthSecret;
      environment.NODE_ENV = originalNodeEnv;
    }
  });

  it('can collapse through the real effect engine', () => {
    const candidate = Object.values(CYKLUS_CARDS).find((card) =>
      resolveCardPublicVisibility(card) === 'publicFull' && (['yes', 'no'] as const).some((choice) => card[choice].effects.some((effect) => effect.type === 'stat' && effect.amount > 0)),
    )!;
    const choice = (['yes', 'no'] as const).find((direction) => candidate[direction].effects.some((effect) => effect.type === 'stat' && effect.amount > 0))!;
    const effect = candidate[choice].effects.find(
      (item): item is Extract<CyklusEffect, { type: 'stat' }> => item.type === 'stat' && item.amount > 0,
    )!;
    const state = createPublicCyklusState('collapse-contract');
    state.currentCardId = candidate.id;
    state.stats[effect.key] = 99;
    expect(applyPublicCyklusChoice(state, choice)?.state.status).toBe('dead');
  });

  it('plays the complete stateless HTTP contract and rejects invalid choices', async () => {
    const start = await startCyklusRun(new Request('http://localhost/api/public/v1/cyklus/run', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': 'test-agent' },
      body: JSON.stringify({ locale: 'cs', seed: 'http-contract' }),
    }));
    expect(start.headers.get('cache-control')).toBe('private, no-store');
    expect(start.headers.get('etag')).toBeNull();
    let payload = await start.json();
    expect(payload).toMatchObject({ schemaVersion: '1', engineVersion: '1.0.0', run: { turn: 1, maxTurns: 12, status: 'active' } });
    expect(payload.card.choices.map((choice: { id: string }) => choice.id)).toEqual(['yes', 'no']);

    const invalid = await chooseCyklus(new Request('http://localhost/api/public/v1/cyklus/choice', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': 'invalid-agent' },
      body: JSON.stringify({ stateToken: payload.stateToken, choiceId: 'maybe' }),
    }));
    expect(await invalid.json()).toMatchObject({ error: { code: 'INVALID_CHOICE', status: 400 } });

    for (let turn = 0; turn < 12; turn += 1) {
      const response = await chooseCyklus(new Request('http://localhost/api/public/v1/cyklus/choice', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': 'test-agent' },
        body: JSON.stringify({ stateToken: payload.stateToken, choiceId: turn % 2 === 0 ? 'yes' : 'no' }),
      }));
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe('private, no-store');
      payload = await response.json();
      if (payload.run.status !== 'active') break;
    }
    expect(payload.run.status).toBe('completed');
    expect(payload.summary.decisions).toHaveLength(12);
    expect(payload.stateToken).toBeNull();
    expect(JSON.stringify(payload)).not.toMatch(/userId|mnemBalance|entitlements|sessionId/);
  });
});
