/** @jest-environment node */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { SPEAKER_REGISTRY } from '../speakers';

const roots = [
  'public/books/SYNTHOMA-NULL',
  'src/content/protected/SYNTHOMA-NULL',
  'public/books/SYNTHOMA-KONEC_PODPORY',
];

describe('book dialog migration', () => {
  it('assigns every known dialog a speaker, tone and keyboard contract', () => {
    const knownClasses = new Set(SPEAKER_REGISTRY.map((speaker) => speaker.cssClass));
    const unknown = new Set<string>();
    let chapters = 0;
    let dialogs = 0;

    for (const root of roots) {
      const directory = path.join(process.cwd(), root);
      for (const filename of readdirSync(directory).filter((name) => name.endsWith('.html') && name !== 'SYNTHOMA.html')) {
        chapters += 1;
        const source = readFileSync(path.join(directory, filename), 'utf8');
        for (const match of source.matchAll(/<p\s+([^>]*class="([^"]*(?:dialog|kp-dialog)[^"]*)"[^>]*)>/gi)) {
          const attributes = match[1] ?? '';
          const classes = (match[2] ?? '').split(/\s+/).filter((name) => /^(dialog|kp-dialog)/.test(name) && name !== 'dialog-line');
          classes.filter((name) => !knownClasses.has(name)).forEach((name) => unknown.add(name));
          dialogs += 1;
          expect(attributes).toContain('dialog-line');
          expect(attributes).toMatch(/data-speaker="[^"]+"/);
          expect(attributes).toMatch(/data-tone="[^"]+"/);
          expect(attributes).toContain('tabindex="0"');
          expect(attributes).toContain('role="button"');
        }
      }
    }

    expect(chapters).toBe(37);
    expect(dialogs).toBe(6770);
    expect([...unknown]).toEqual([]);
  });
});
