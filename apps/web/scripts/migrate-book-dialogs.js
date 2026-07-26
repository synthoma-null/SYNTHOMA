/* eslint-disable no-console -- This CLI reports its migration audit to stdout. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const speakers = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/speakers.json'), 'utf8'));
const byClass = new Map(speakers.map((speaker) => [speaker.cssClass, speaker]));
const apply = process.argv.includes('--apply');
const roots = [
  path.join(ROOT, 'public/books/SYNTHOMA-NULL'),
  path.join(ROOT, 'src/content/protected/SYNTHOMA-NULL'),
  path.join(ROOT, 'public/books/SYNTHOMA-KONEC_PODPORY'),
  path.join(ROOT, 'public/books/SYNTHOMA-NEON-0'),
];

const files = roots.flatMap((root) => fs.readdirSync(root)
  .filter((name) => name.endsWith('.html') && name !== 'SYNTHOMA.html')
  .map((name) => path.join(root, name)));

const report = {
  chapters: files.length,
  changedChapters: 0,
  dialogs: 0,
  speakers: new Set(),
  explicitTones: 0,
  fallbackTones: 0,
  unknownClasses: new Set(),
};

function cleanText(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function inferTone(text, fallback) {
  if (!text) return { tone: fallback, source: 'fallback' };
  if (/\?|\b(co|proč|jak|kde|kdy)\b/i.test(text)) return { tone: 'nejistě, věcně', source: 'inferred' };
  if (/!/.test(text) || (text.length > 8 && text === text.toLocaleUpperCase('cs'))) return { tone: 'ostře, rozhodně', source: 'inferred' };
  if (/…|\.\.\./.test(text)) return { tone: 'tiše, nejistě', source: 'inferred' };
  return { tone: fallback, source: 'fallback' };
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function setAttribute(attributes, name, value) {
  const pattern = new RegExp(`\\s${name}=(['"])[\\s\\S]*?\\1`, 'i');
  const replacement = ` ${name}="${escapeAttribute(value)}"`;
  return pattern.test(attributes) ? attributes.replace(pattern, replacement) : `${attributes}${replacement}`;
}

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  let changed = false;
  const output = source.replace(/<p(\s[^<>]*?class=(['"])([^'"]*)\2[^<>]*?)>([\s\S]*?)<\/p>/gi,
    (whole, attributes, quote, classValue, content) => {
      const classes = classValue.split(/\s+/).filter(Boolean);
      const dialogClasses = classes.filter((name) => /^(dialog|kp-dialog)/.test(name) && name !== 'dialog-line');
      if (!dialogClasses.length) return whole;

      for (const name of dialogClasses) {
        if (!byClass.has(name)) report.unknownClasses.add(name);
      }
      const speaker = dialogClasses
        .filter((name) => name !== 'dialog')
        .map((name) => byClass.get(name))
        .find(Boolean) ?? byClass.get('dialog');
      if (!speaker) return whole;

      report.dialogs += 1;
      report.speakers.add(speaker.id);
      const existingTone = attributes.match(/\sdata-tone=(['"])(.*?)\1/i)?.[2];
      const inferred = existingTone
        ? { tone: existingTone, source: attributes.match(/\sdata-tone-source=(['"])(.*?)\1/i)?.[2] ?? 'explicit' }
        : inferTone(cleanText(content), speaker.defaultTone);
      if (inferred.source === 'fallback') report.fallbackTones += 1;
      else report.explicitTones += 1;

      const nextClasses = [...new Set([...classes, 'dialog-line'])].join(' ');
      let nextAttributes = attributes.replace(/class=(['"])[^'"]*\1/i, `class="${nextClasses}"`);
      nextAttributes = setAttribute(nextAttributes, 'data-speaker', speaker.id);
      nextAttributes = setAttribute(nextAttributes, 'data-tone', inferred.tone);
      nextAttributes = setAttribute(nextAttributes, 'data-tone-source', inferred.source);
      nextAttributes = setAttribute(nextAttributes, 'tabindex', '0');
      nextAttributes = setAttribute(nextAttributes, 'role', 'button');
      nextAttributes = setAttribute(nextAttributes, 'aria-label', `Dialog: ${speaker.name}. Tón: ${inferred.tone}.`);
      const next = `<p${nextAttributes}>${content}</p>`;
      if (next !== whole) changed = true;
      return next;
    });
  if (changed) {
    report.changedChapters += 1;
    if (apply) fs.writeFileSync(file, output, 'utf8');
  }
}

console.log(`Mode: ${apply ? 'apply' : 'audit'}`);
console.log(`Počet kapitol: ${report.chapters}`);
console.log(`Počet upravených kapitol: ${report.changedChapters}`);
console.log(`Počet dialogů: ${report.dialogs}`);
console.log(`Počet rozpoznaných speakerů: ${report.speakers.size}`);
console.log(`Počet explicitních tónů: ${report.explicitTones}`);
console.log(`Počet fallback tónů: ${report.fallbackTones}`);
console.log(`Neznámé dialogové třídy: ${[...report.unknownClasses].sort().join(', ') || '0'}`);
process.exitCode = report.unknownClasses.size ? 1 : 0;
