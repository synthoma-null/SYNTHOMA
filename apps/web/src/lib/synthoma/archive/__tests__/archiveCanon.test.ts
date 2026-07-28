import archiveCs from '../../../../../public/data/archiveCards.json';
import archiveEn from '../../../../../public/data/archiveCards_en.json';

type ArchiveRecord = (typeof archiveCs.cards)[number];

const byId = (cards: ArchiveRecord[]) => new Map(cards.map((card) => [card.id, card]));
const csById = byId(archiveCs.cards);
const enById = byId(archiveEn.cards as ArchiveRecord[]);

function recordText(card: ArchiveRecord | undefined): string {
  return JSON.stringify(card ?? {}).toLocaleLowerCase();
}

describe('Archive canon', () => {
  it('keeps the Czech and English record sets aligned', () => {
    expect([...csById.keys()].sort()).toEqual([...enById.keys()].sort());
  });

  it('describes Felix Vanta as male in both locales', () => {
    const cs = recordText(csById.get('kp-vanta'));
    const en = recordText(enById.get('kp-vanta'));

    expect(cs).toContain('felix vanta');
    expect(cs).toContain('pozorovatel');
    expect(cs).not.toMatch(/pozorovatelka|její|žena/);
    expect(en).toContain('felix vanta');
    expect(en).toContain('male observer');
    expect(en).not.toMatch(/\bshe\b|\bher\b|female|woman/);
  });

  it('does not place Felix Vanta or Mína in NEON-0', () => {
    for (const cards of [archiveCs.cards, archiveEn.cards]) {
      const neonRecords = cards.filter((card) => card.sourceBook === 'neon-0');
      expect(neonRecords.some((card) => /felix|vanta|mína|mina/i.test(recordText(card)))).toBe(false);
    }
  });

  it('keeps Glitchena autonomous rather than an adult Glitchka', () => {
    expect(recordText(csById.get('glitchena'))).toContain('není dospělá glitchka');
    expect(recordText(enById.get('glitchena'))).toContain('not an adult glitchka');
  });

  it('labels disputed identities and reconstructions as uncertain', () => {
    expect(recordText(csById.get('null-1'))).toMatch(/původ zůstává sporný/);
    expect(recordText(csById.get('n0-pacient-1024'))).toMatch(/nepotvrzují, že jde o thomase/);
    expect(recordText(csById.get('kp-sara'))).toMatch(/rekonstrukci|nepotvrzuje/);
    expect(recordText(enById.get('null-1'))).toMatch(/origin remains disputed/);
    expect(recordText(enById.get('n0-pacient-1024'))).toMatch(/do not confirm that he is thomas/);
    expect(recordText(enById.get('kp-sara'))).toMatch(/reconstruction|does not prove/);
  });

  it('keeps related record links valid in both locales', () => {
    for (const cards of [archiveCs.cards, archiveEn.cards]) {
      const ids = new Set(cards.map((card) => card.id));
      const missing = cards.flatMap((card) =>
        (card.related ?? []).filter((relatedId) => !ids.has(relatedId)).map((relatedId) => `${card.id}:${relatedId}`),
      );
      expect(missing).toEqual([]);
    }
  });
});
