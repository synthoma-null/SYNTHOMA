#!/usr/bin/env node
//
// Validator for effect usage in book HTML chapters.
// Checks semantic correctness, motion budget, and speaker rules.
//

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BOOKS_DIR = path.join(ROOT, 'public', 'books');
const STYLES_DIR = path.join(ROOT, 'src', 'styles');
const MOTION_BUDGET = 24;
const MAX_CONCURRENT_REVEALS = 3;
const INTERNAL_DOCUMENTS = new Set(['SYNTHOMA.html', 'efekty.html']);
const PERSISTENT_MOTION_CLASSES = new Set(['fx-wave', 'fx-rainbow']);
const REVEAL_MOTION_CLASSES = new Set([
  'fx-flicker', 'fx-scanline', 'fx-glitch', 'fx-memory-bleed', 'fx-identity-split',
  'fx-support-expired', 'fx-denied', 'fx-observer', 'null-memory-leak',
  'null-static-noise', 'kp-support-expired', 'kp-queue-delay', 'kp-signal-dropout',
  'kp-mechanical-pulse', 'n0-neon-ignition', 'n0-prototype-instability',
  'n0-observer-presence'
]);

// Load all class selectors defined in project CSS.
const CSS_CLASS_RE = /\.([A-Za-z0-9_-]+)/g;
function loadCssClasses(dir) {
  const classes = new Set();
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    if (!d) continue;
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.isFile() && p.toLowerCase().endsWith('.css')) {
        try {
          const text = fs.readFileSync(p, 'utf-8');
          let m;
          while ((m = CSS_CLASS_RE.exec(text)) !== null) classes.add(m[1]);
        } catch {}
      }
    }
  }
  return classes;
}

const CSS_CLASSES = loadCssClasses(STYLES_DIR);
const KNOWN_FX = new Set([
  'halo','datastream','echo-ghost','memory-leak','overheat','neon-blood','glitchy','glitching',
  'redacted','bios-warning','static-noise','quantum-blur','scramble-title','dialog','dialogN',
  'dialogS','dialogG','dialogD','dialogGlitchena'
]);
for (const c of CSS_CLASSES) {
  if (c.startsWith('fx-') || c.startsWith('n0-') || c.startsWith('kp-') || c.startsWith('null-')) {
    KNOWN_FX.add(c);
  }
}

function walk(dir) {
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    if (!d) continue;
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.isFile() && p.toLowerCase().endsWith('.html')) files.push(p);
    }
  }
  return files;
}

function extractClassValues(html) {
  const out = [];
  const re = /class\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const classes = m[1].split(/\s+/).filter(Boolean);
    out.push({ raw: m[0], classes, index: m.index });
  }
  return out;
}

function extractTagContext(html, idx) {
  const start = Math.max(0, html.lastIndexOf('<', idx));
  const end = html.indexOf('>', idx) + 1;
  return html.slice(start, end);
}

function decodeHtmlText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)));
}

function emojiGraphemes(text) {
  const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
  return Array.from(segmenter.segment(text), ({ segment }) => segment)
    .filter((segment) => /\p{Extended_Pictographic}|\p{Regional_Indicator}|[0-9#*]\uFE0F?\u20E3/u.test(segment));
}

function hasExactlyTwoTerminalEmojis(text) {
  const normalized = text.trim().replace(/["'“”’»]+$/u, '').trimEnd();
  const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(normalized), ({ segment }) => segment)
    .filter((segment) => !/^\s+$/u.test(segment));
  const isEmoji = (segment) => /\p{Extended_Pictographic}|\p{Regional_Indicator}|[0-9#*]\uFE0F?\u20E3/u.test(segment);
  const emoji = emojiGraphemes(normalized);
  return emoji.length === 2
    && segments.length >= 2
    && isEmoji(segments[segments.length - 1])
    && isEmoji(segments[segments.length - 2]);
}

function validateEmojiGraphemeContract() {
  const passing = [
    'Text 🦊🫧',
    'Text 🦊✌️',
    'Text 🦊👩‍💻',
    'Text 🦊🇨🇿',
    'Text 🦊1️⃣',
    'Text 🦊 ⚡“',
  ];
  const failing = ['Text 🦊', 'Text 🦊🫧✨', 'Text 🦊🫧 after'];
  return passing.every(hasExactlyTwoTerminalEmojis) && failing.every((value) => !hasExactlyTwoTerminalEmojis(value));
}

function findGlitchkaLines(html) {
  const lines = [];
  const paragraphRe = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = paragraphRe.exec(html)) !== null) {
    const attributes = match[1];
    const classMatch = attributes.match(/class\s*=\s*["']([^"']+)["']/i);
    const classes = classMatch ? classMatch[1].split(/\s+/) : [];
    const speakerMatch = attributes.match(/data-speaker\s*=\s*["']([^"']+)["']/i);
    const speaker = speakerMatch ? speakerMatch[1].toLowerCase() : '';
    if (classes.includes('dialogG') || classes.includes('dialogGlitchka') || speaker.startsWith('glitchka')) {
      lines.push(decodeHtmlText(match[2]).replace(/\s+/g, ' ').trim());
    }
  }
  return lines;
}

function validateFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const classAttrs = extractClassValues(html);
  const errors = [];
  const warnings = [];
  let persistentMotionNodes = 0;
  let revealMotionNodes = 0;

  for (const item of classAttrs) {
    const { classes, raw, index } = item;
    const tag = extractTagContext(html, index);

    // Unknown effect class
    for (const c of classes) {
      if (c.startsWith('fx-')) {
        if (!KNOWN_FX.has(c)) {
          errors.push(`${rel}: unknown effect class '.${c}' in ${tag}`);
        }
      }
      if (PERSISTENT_MOTION_CLASSES.has(c)) persistentMotionNodes++;
      if (REVEAL_MOTION_CLASSES.has(c)) revealMotionNodes++;
    }

    // echo-ghost must have data-echo
    if (classes.includes('echo-ghost')) {
      if (!/data-echo\s*=/.test(tag)) {
        errors.push(`${rel}: .echo-ghost missing data-echo in ${tag}`);
      }
    }

    if (classes.includes('fx-glitch') && !/data-glitch\s*=/.test(tag)) {
      errors.push(`${rel}: .fx-glitch missing data-glitch in ${tag}`);
    }

    // critical level should not be on long paragraphs
    if (classes.includes('critical') || /data-fx-level\s*=\s*["']critical["']/.test(tag)) {
      const innerStart = html.indexOf('>', index) + 1;
      const innerEnd = html.indexOf('<', innerStart);
      const innerText = html.slice(innerStart, innerEnd);
      if (innerText.length > 120) {
        warnings.push(`${rel}: .critical / data-fx-level="critical" on long text (${innerText.length} chars)`);
      }
    }

  }

  for (const line of findGlitchkaLines(html)) {
    if (!hasExactlyTwoTerminalEmojis(line)) {
      errors.push(`${rel}: Glitchka line must end with exactly two emoji graphemes: "${line.slice(0, 100)}"`);
    }
  }

  const concurrentMotionNodes = persistentMotionNodes + Math.min(revealMotionNodes, MAX_CONCURRENT_REVEALS);
  if (concurrentMotionNodes > MOTION_BUDGET) {
    warnings.push(`${rel}: concurrent motion budget exceeded (${concurrentMotionNodes} > ${MOTION_BUDGET}; persistent=${persistentMotionNodes}, revealable=${revealMotionNodes})`);
  }

  return { errors, warnings, concurrentMotionNodes, persistentMotionNodes, revealMotionNodes };
}

function main() {
  if (!validateEmojiGraphemeContract()) {
    console.error('ERROR: Unicode emoji grapheme contract failed');
    process.exit(1);
  }

  const files = walk(BOOKS_DIR).filter((file) => !INTERNAL_DOCUMENTS.has(path.basename(file)));
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalMotion = 0;

  for (const f of files) {
    const r = validateFile(f);
    totalErrors += r.errors.length;
    totalWarnings += r.warnings.length;
    totalMotion += r.concurrentMotionNodes;
    for (const e of r.errors) console.error('ERROR:', e);
    for (const w of r.warnings) console.warn('WARN:', w);
  }

  console.log(`\nValidated ${files.length} chapters.`);
  console.log(`Errors: ${totalErrors}, Warnings: ${totalWarnings}, Total concurrent motion nodes: ${totalMotion}`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
