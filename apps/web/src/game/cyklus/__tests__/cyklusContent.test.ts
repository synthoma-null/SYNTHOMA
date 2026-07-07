import { CYKLUS_CONTENT_PACKS, CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS, getCardsByPack, brutalBlackboxPack, sandboxAbsurdPack, romanceResiduumPack, tollDvanactnikPack, detectiveEchoCasePack, sarkasmaTherapyPack, glitchkaChatPack } from '../content';
import { CYKLUS_FINDINGS } from '../cyklusFindings';
import { createCyklusRun, getCardPool } from '../cyklusEngine';

describe('Cyklus content packs', () => {
  it('every card has packId, role and tone', () => {
    const packCards = CYKLUS_CONTENT_PACKS.flatMap((pack) => Object.values(pack.cards ?? {}));
    const missingTone = packCards
      .filter((card) => !card.tone || card.tone.length === 0)
      .map((card) => card.id);
    const missingRole = packCards
      .filter((card) => !card.role)
      .map((card) => card.id);
    const missingPackId = packCards
      .filter((card) => !card.packId)
      .map((card) => card.id);
    expect(missingPackId).toEqual([]);
    expect(missingRole).toEqual([]);
    expect(missingTone).toEqual([]);
  });

  it('every pack has an entry card', () => {
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (!pack.cards) continue;
      const cards = Object.values(pack.cards);
      expect(cards.some((c) => c.role === 'entry')).toBe(true);
    }
  });

  it('every pack has a resolution or echo card', () => {
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (!pack.cards) continue;
      const cards = Object.values(pack.cards);
      expect(cards.some((c) => c.role === 'resolution' || c.role === 'echo')).toBe(true);
    }
  });

  it('every item in a thematic pack is obtainable or used by a card', () => {
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (pack.id === 'base' || !pack.items) continue;
      const cards = Object.values(pack.cards ?? {});
      for (const itemId of Object.keys(pack.items)) {
        const obtainable = cards.some((c) =>
          [...c.yes.effects, ...c.no.effects].some((e) => e.type === 'item' && e.itemId === itemId)
        );
        const used = cards.some((c) => c.tags.includes(itemId) || c.id === itemId);
        expect(obtainable || used).toBe(true);
      }
    }
  });

  it('every imprint in a thematic pack is obtainable', () => {
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (pack.id === 'base' || !pack.imprints) continue;
      const cards = Object.values(pack.cards ?? {});
      for (const imprintId of Object.keys(pack.imprints)) {
        const obtainable = cards.some((c) =>
          [...c.yes.effects, ...c.no.effects].some((e) => e.type === 'imprint' && e.imprintId === imprintId)
        );
        expect(obtainable).toBe(true);
      }
    }
  });

  it('every unlockPool has at least one card', () => {
    const pools = new Set<string>();
    for (const pack of CYKLUS_CONTENT_PACKS) {
      for (const card of Object.values(pack.cards ?? {})) {
        for (const cond of card.conditions ?? []) {
          if (cond.type === 'unlockedPool' && cond.poolId) pools.add(cond.poolId);
        }
      }
    }
    for (const poolId of pools) {
      const hasCard = Object.values(CYKLUS_CARDS).some(
        (c) => c.conditions?.some((cond) => cond.type === 'unlockedPool' && cond.poolId === poolId)
      );
      expect(hasCard).toBe(true);
    }
  });

  it('Glitchka replicas in sandbox_absurd have exactly two emoji', () => {
    const sandbox = getCardsByPack('sandbox_absurd');
    for (const card of Object.values(sandbox)) {
      if (!card.tags.includes('glitchka')) continue;
      const resultTexts = [card.yes.resultText, card.no.resultText];
      for (const text of resultTexts) {
        const emoji = (text.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}]/gu) ?? []).length;
        if (emoji > 0) {
          expect(emoji).toBe(2);
        }
      }
    }
  });

  it('desire_orgie pack does not use glitchka relation as Glitchena proxy', () => {
    const desire = getCardsByPack('desire_orgie');
    for (const card of Object.values(desire)) {
      const effects = [...card.yes.effects, ...card.no.effects];
      for (const effect of effects) {
        expect(
          effect.type === 'entityRelation' &&
          effect.entity === 'glitchka' &&
          card.tags.includes('glitchena')
        ).toBe(false);
      }
    }
  });

  it('desire_orgie pack does not contain explicit sexual acts', () => {
    const forbidden = [
      'sex', 'penis', 'vagina', 'intercourse', 'orgasm', 'masturbation', 'fuck', 'suck', 'lick',
      'kouření', 'sexuální akt', 'soulož', 'masturb', 'orgasmus', 'penis', 'vagina', 'semeno',
    ];
    const desire = getCardsByPack('desire_orgie');
    for (const card of Object.values(desire)) {
      const text = `${card.title} ${card.scene} ${card.yes.resultText} ${card.no.resultText}`.toLowerCase();
      for (const word of forbidden) {
        expect(text).not.toContain(word);
      }
    }
  });

  it('no pack is entirely thin/stat-only', () => {
    const shallowTypes = new Set(['stat', 'profile', 'noImmediateEffect']);
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (!pack.cards) continue;
      const cards = Object.values(pack.cards);
      if (cards.length === 0) continue;
      const deep = cards.some((c) =>
        [...c.yes.effects, ...c.no.effects].some((e) => !shallowTypes.has(e.type))
      );
      expect(deep).toBe(true);
    }
  });

  it('all pack findings are registered in CYKLUS_FINDINGS', () => {
    const registered = new Set(CYKLUS_FINDINGS.map((f) => f.id));
    for (const pack of CYKLUS_CONTENT_PACKS) {
      for (const findingId of pack.findings ?? []) {
        expect(registered).toContain(findingId);
      }
    }
  });

  it('content aggregates are not empty', () => {
    expect(Object.keys(CYKLUS_CARDS).length).toBeGreaterThan(0);
    expect(Object.keys(CYKLUS_ITEMS).length).toBeGreaterThan(0);
    expect(Object.keys(CYKLUS_IMPRINTS).length).toBeGreaterThan(0);
  });

  it('thematic pack cards become reachable when their pool is unlocked', () => {
    for (const pack of CYKLUS_CONTENT_PACKS) {
      if (pack.id === 'base') continue;
      const poolId = pack.unlocksPools?.[0];
      if (!poolId) continue;
      const state = createCyklusRun(true);
      const unlocked = { ...state, unlockedPools: [...state.unlockedPools, poolId] };
      const pool = getCardPool(unlocked);
      const packCardIds = Object.keys(pack.cards ?? {});
      const reachable = packCardIds.filter((id) => pool.some((c) => c.id === id));
      expect(reachable.length).toBeGreaterThan(0);
    }
  });

  it('brutal_blackbox pack has entry, escalation, bill, resolution and echo roles', () => {
    const cards = Object.values(brutalBlackboxPack.cards ?? {});
    const roles = new Set(cards.map((card) => card.role));

    expect(roles.has('entry')).toBe(true);
    expect(roles.has('escalation')).toBe(true);
    expect(roles.has('bill')).toBe(true);
    expect(roles.has('resolution')).toBe(true);
    expect(roles.has('echo')).toBe(true);
  });

  it('blackbox scheduled cards exist', () => {
    const cards = brutalBlackboxPack.cards ?? {};
    const ids = new Set(Object.keys(cards));

    for (const card of Object.values(cards)) {
      for (const outcome of [card.yes, card.no]) {
        for (const effect of outcome.effects) {
          if (effect.type === 'schedule') {
            expect(ids.has(effect.cardId)).toBe(true);
          }
        }
      }
    }
  });

  it('sandbox_absurd Glitchka spoken lines end with exactly two emoji', () => {
    const emojiRegex = /\p{Extended_Pictographic}/gu;

    for (const card of Object.values(sandboxAbsurdPack.cards ?? {})) {
      for (const text of [card.scene, card.yes.resultText, card.no.resultText]) {
        if (!text.includes('Glitchka') || !text.includes('„')) continue;

        const emojiCount = [...text.matchAll(emojiRegex)].length;
        expect(emojiCount).toBe(2);
      }
    }
  });

  it('sandbox_absurd items have trigger cards that exist', () => {
    const cards = sandboxAbsurdPack.cards ?? {};

    for (const item of Object.values(sandboxAbsurdPack.items ?? {})) {
      for (const cardId of item.triggerCards ?? []) {
        expect(cards[cardId]).toBeDefined();
      }
    }
  });

  it('romance_residuum has a dependency risk card', () => {
    const cards = Object.values(romanceResiduumPack.cards ?? {});
    expect(cards.some((card) => card.tags.includes('dependency'))).toBe(true);
  });

  it('romance_residuum items have reachable trigger cards', () => {
    const cards = romanceResiduumPack.cards ?? {};

    for (const item of Object.values(romanceResiduumPack.items ?? {})) {
      for (const cardId of item.triggerCards ?? []) {
        expect(cards[cardId]).toBeDefined();
      }
    }
  });

  it('toll_dvanactnik creates debt consequences after unpaid choices', () => {
    const cards = tollDvanactnikPack.cards ?? {};
    const debtCards = Object.values(cards).filter((card) =>
      card.tags.includes('debt') || card.conditions?.some((condition) =>
        condition.type === 'unlockedPool' && condition.poolId === 'toll_debt_pool'
      )
    );

    expect(debtCards.length).toBeGreaterThan(0);
  });

  it('toll_dvanactnik scheduled cards exist', () => {
    const cards = tollDvanactnikPack.cards ?? {};
    const ids = new Set(Object.keys(cards));

    for (const card of Object.values(cards)) {
      for (const outcome of [card.yes, card.no]) {
        for (const effect of outcome.effects) {
          if (effect.type === 'schedule') {
            expect(ids.has(effect.cardId)).toBe(true);
          }
        }
      }
    }
  });

  it('detective pack has at least one false conclusion and one open-case resolution', () => {
    const cards = Object.values(detectiveEchoCasePack.cards ?? {});

    expect(cards.some((card) => card.tags.includes('culprit'))).toBe(true);
    expect(cards.some((card) => card.tags.includes('truth') && card.tags.includes('stabilize'))).toBe(true);
  });

  it('detective scheduled cards exist', () => {
    const cards = detectiveEchoCasePack.cards ?? {};
    const ids = new Set(Object.keys(cards));

    for (const card of Object.values(cards)) {
      for (const outcome of [card.yes, card.no]) {
        for (const effect of outcome.effects) {
          if (effect.type === 'schedule') {
            expect(ids.has(effect.cardId)).toBe(true);
          }
        }
      }
    }
  });

  it('sarkasma therapy pack has a full therapy arc', () => {
    const cards = Object.values(sarkasmaTherapyPack.cards ?? {});
    const roles = new Set(cards.map((card) => card.role));

    expect(roles.has('entry')).toBe(true);
    expect(roles.has('object')).toBe(true);
    expect(roles.has('escalation')).toBe(true);
    expect(roles.has('bill')).toBe(true);
    expect(roles.has('resolution')).toBe(true);
    expect(roles.has('echo')).toBe(true);
  });

  it('sarkasma therapy includes overcut risk and repair', () => {
    const cards = Object.values(sarkasmaTherapyPack.cards ?? {});

    expect(cards.some((card) => card.tags.includes('overcut'))).toBe(true);
    expect(cards.some((card) => card.tags.includes('stabilize'))).toBe(true);
  });

  it('sarkasma therapy scheduled cards exist', () => {
    const cards = sarkasmaTherapyPack.cards ?? {};
    const ids = new Set(Object.keys(cards));

    for (const card of Object.values(cards)) {
      for (const outcome of [card.yes, card.no]) {
        for (const effect of outcome.effects) {
          if (effect.type === 'schedule') {
            expect(ids.has(effect.cardId)).toBe(true);
          }
        }
      }
    }
  });

  it('glitchka chat spoken Glitchka lines end with exactly two emoji', () => {
    const emojiRegex = /\p{Extended_Pictographic}/gu;

    for (const card of Object.values(glitchkaChatPack.cards ?? {})) {
      for (const text of [card.scene, card.yes.resultText, card.no.resultText]) {
        const quotes = [...text.matchAll(/„([^“]+)“/g)];

        for (const match of quotes) {
          const quote = match[1] ?? '';
          const emojiCount = [...quote.matchAll(emojiRegex)].length;
          expect(emojiCount).toBe(2);
        }
      }
    }
  });

  it('glitchka chat includes fake Glitchka risk and real Glitchka recognition', () => {
    const cards = Object.values(glitchkaChatPack.cards ?? {});

    expect(cards.some((card) => card.tags.includes('fake'))).toBe(true);
    expect(
      Object.values(glitchkaChatPack.imprints ?? {}).some((imprint) =>
        imprint.tags.includes('trust')
      )
    ).toBe(true);
  });

  it('glitchka chat item trigger cards exist', () => {
    const cards = glitchkaChatPack.cards ?? {};

    for (const item of Object.values(glitchkaChatPack.items ?? {})) {
      for (const cardId of item.triggerCards ?? []) {
        expect(cards[cardId]).toBeDefined();
      }
    }
  });
});
