import fs from 'node:fs';
import path from 'node:path';
import { CYKLUS_CARD_ART_IDS } from '../cyklusCardPresentation';

describe('Cyklus card poster assets', () => {
  it('contains one optimized WebP for every registered poster ID', () => {
    expect(CYKLUS_CARD_ART_IDS).toHaveLength(66);
    expect(new Set(CYKLUS_CARD_ART_IDS).size).toBe(CYKLUS_CARD_ART_IDS.length);

    for (const id of CYKLUS_CARD_ART_IDS) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', 'cards', 'cyklus', `${id}.webp`))).toBe(true);
    }
  });
});
