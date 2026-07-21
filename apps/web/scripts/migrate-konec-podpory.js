#!/usr/bin/env node

/*
 * One-time, idempotent migration/verification for SYNTHOMA: KONEC PODPORY.
 * The first run extracts chapter CSS and normalizes structural markup. Later
 * runs only verify the migrated sources, so literary text is never regenerated.
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const ROOT = path.resolve(__dirname, '..');
const BOOK_DIR = path.join(ROOT, 'public', 'books', 'SYNTHOMA-KONEC_PODPORY');
const STYLESHEET = path.join(BOOK_DIR, 'konec-podpory.css');
const STYLESHEET_HREF = '/books/SYNTHOMA-KONEC_PODPORY/konec-podpory.css';

const CHAPTERS = [
  ['00', 'SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html', 'kp-00-podporovano'],
  ['01', 'SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html', 'kp-01-oznameni'],
  ['02', 'SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html', 'kp-02-volny-pad'],
  ['03', 'SYNTHOMA_KONEC_PODPORY_03_PODPORA.html', 'kp-03-podpora'],
  ['04', 'SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html', 'kp-04-komfortni-zona'],
  ['05', 'SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html', 'kp-05-objizdka'],
  ['06', 'SYNTHOMA_KONEC_PODPORY_06_PECE.html', 'kp-06-pece'],
  ['07', 'SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html', 'kp-07-zasilka'],
  ['08', 'SYNTHOMA_KONEC_PODPORY_08_DOMOV.html', 'kp-08-domov'],
  ['09', 'SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html', 'kp-09-neopravneny-uzivatel'],
  ['10', 'SYNTHOMA_KONEC_PODPORY_10_TICHO.html', 'kp-10-ticho'],
  ['11', 'SYNTHOMA_KONEC_PODPORY_11_BETA.html', 'kp-11-beta'],
  ['12', 'SYNTHOMA_KONEC_PODPORY_12_TOVA.html', 'kp-12-tova'],
  ['13', 'SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html', 'kp-13-kontinuita'],
  ['14', 'SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html', 'kp-14-reklamace'],
  ['15', 'SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html', 'kp-15-migrace'],
  ['16', 'SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html', 'kp-16-rucni-rezim'],
  ['17', 'SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html', 'kp-17-zadna-odpoved'],
  ['18', 'SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html', 'kp-18-konec-podpory'],
];

const NEXT_ROUTES = new Map(CHAPTERS.slice(0, -1).map((chapter, index) => [
  chapter[0],
  `/chapter/${CHAPTERS[index + 1][2]}`,
]));
NEXT_ROUTES.set('18', '/chapter/kp-00-podporovano');

const INLINE_STYLE_CLASSES = new Map([
  ['color:var(--kp-green)', 'kp-inline-text--success'],
  ['color:var(--kp-red)', 'kp-inline-text--danger'],
  ['--power:17%;--power-color:var(--kp-red)', 'kp-power-fill--fuel-reserve'],
  ['--power:12%;--power-color:var(--kp-green)', 'kp-power-fill--support-lines'],
  ['--power:9%;--power-color:var(--kp-yellow)', 'kp-power-fill--crisis-control'],
  ['--power:68%;--power-color:var(--kp-blue)', 'kp-power-fill--clinical-archive'],
  ['--power:88%;--power-color:var(--kp-blue)', 'kp-power-fill--legacy-archive'],
  ['--r:-1deg', 'kp-label-card--boris'],
  ['--r:1.4deg', 'kp-label-card--mina'],
  ['--r:-0.6deg', 'kp-label-card--juros'],
  ['--r:0.8deg', 'kp-label-card--tova'],
  ['--r:-1.3deg', 'kp-label-card--vanta'],
  ['--r:1deg', 'kp-label-card--milo'],
  ['--r:0deg;max-width:26rem;margin:2remauto', 'kp-label-card--consent'],
  ['--i:0', 'kp-drone-dot--delay-00'],
  ['--i:1', 'kp-drone-dot--delay-01'],
  ['--i:2', 'kp-drone-dot--delay-02'],
  ['--i:3', 'kp-drone-dot--delay-03'],
  ['--i:4', 'kp-drone-dot--delay-04'],
  ['--i:5', 'kp-drone-dot--delay-05'],
  ['--i:6', 'kp-drone-dot--delay-06'],
  ['--i:7', 'kp-drone-dot--delay-07'],
  ['--i:8', 'kp-drone-dot--delay-08'],
  ['--i:9', 'kp-drone-dot--delay-09'],
  ['--i:10', 'kp-drone-dot--delay-10'],
  ['--i:11', 'kp-drone-dot--delay-11'],
  ['--h:1rem', 'kp-ambient-path__level--low'],
  ['--h:3.5rem', 'kp-ambient-path__level--high'],
  ['--h:0.4rem', 'kp-ambient-path__level--critical'],
  ['--h:2.2rem', 'kp-ambient-path__level--medium'],
  ['--h:4.5rem', 'kp-ambient-path__level--peak'],
  ['--h:1.4rem', 'kp-ambient-path__level--reduced'],
  ['width:46%', 'kp-cooling-bar__fill--critical'],
]);

function normalizeStyle(value) {
  return value.replace(/\s+/g, '').replace(/;$/, '');
}

function addClass(attributes, className) {
  if (/\bclass=(['"])/i.test(attributes)) {
    return attributes.replace(/\bclass=(['"])(.*?)\1/i, (_match, quote, names) =>
      `class=${quote}${names} ${className}${quote}`,
    );
  }
  return `${attributes} class="${className}"`;
}

function replaceInlineStyles(source, filename) {
  return source.replace(/<([a-z][a-z0-9-]*)([^>]*?)\sstyle="([^"]*)"([^>]*)>/gi,
    (_match, tag, before, style, after) => {
      const className = INLINE_STYLE_CLASSES.get(normalizeStyle(style));
      if (!className) throw new Error(`${filename}: unmapped inline style: ${style}`);
      return `<${tag}${addClass(`${before}${after}`, className)}>`;
    });
}

function splitSelectors(value) {
  const selectors = [];
  let current = '';
  let depth = 0;
  let quote = '';
  for (const character of value) {
    if (quote) {
      current += character;
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      current += character;
    } else if (character === '(' || character === '[') {
      depth += 1;
      current += character;
    } else if (character === ')' || character === ']') {
      depth -= 1;
      current += character;
    } else if (character === ',' && depth === 0) {
      selectors.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }
  if (current.trim()) selectors.push(current.trim());
  return selectors;
}

function scopeSelector(selector, scope) {
  if (/^:root\b/.test(selector)) return selector.replace(/^:root\b/, scope);
  if (/^html\s+body\b/.test(selector)) return selector.replace(/^html\s+body\b/, scope);
  if (/^html\b/.test(selector)) return selector.replace(/^html\b/, scope);
  if (/^body\b/.test(selector)) return selector.replace(/^body\b/, scope);
  if (/^\.kp-chapter\b/.test(selector)) return selector.replace(/^\.kp-chapter\b/, scope);
  return `${scope} ${selector}`;
}

function scopeRoot(root, scope) {
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    rule.selector = splitSelectors(rule.selector).map((selector) => scopeSelector(selector, scope)).join(',\n');
  });
}

function renameKeyframes(root, chapter) {
  const names = new Map();
  root.walkAtRules(/keyframes$/i, (rule) => {
    const suffix = rule.params.replace(/^kp[-]?/i, '').replace(/[^a-z0-9-]+/gi, '-');
    const name = `kpBook-${chapter}-${suffix}`;
    names.set(rule.params, name);
    rule.params = name;
  });
  root.walkDecls(/^animation(?:-name)?$/i, (declaration) => {
    for (const [oldName, newName] of names) {
      declaration.value = declaration.value.replace(
        new RegExp(`(^|[^a-zA-Z0-9_-])${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-zA-Z0-9_-])`, 'g'),
        `$1${newName}`,
      );
    }
  });
}

function normalizeRule(rule) {
  return rule.toString().replace(/\s+/g, ' ').trim();
}

function dedupeSharedComponentRules(chapterRoots) {
  const occurrences = new Map();
  const selectorCounts = new Map();
  for (const { chapter, root } of chapterRoots) {
    const counts = new Map();
    for (const node of root.nodes) {
      if (node.type !== 'rule') continue;
      counts.set(node.selector, (counts.get(node.selector) ?? 0) + 1);
      const key = normalizeRule(node);
      const list = occurrences.get(key) ?? [];
      list.push({ chapter, node });
      occurrences.set(key, list);
    }
    selectorCounts.set(chapter, counts);
  }

  const shared = [];
  for (const list of occurrences.values()) {
    if (list.length < 6) continue;
    const selector = list[0].node.selector;
    if (!/^(?:\.kp-|\.dialog)/.test(selector)) continue;
    if (list.some(({ chapter }) => selectorCounts.get(chapter).get(selector) !== 1)) continue;
    const chapters = list.map(({ chapter }) => chapter);
    const scope = `:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]):is(${chapters.map((chapter) => `[data-chapter="${chapter}"]`).join(', ')})`;
    const node = list[0].node.clone();
    node.selector = splitSelectors(node.selector).map((selector) => scopeSelector(selector, scope)).join(',\n');
    shared.push(node);
    for (const entry of list) entry.node.remove();
  }
  return shared;
}

function readableText(source) {
  return source
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeBody(source, chapter) {
  return source.replace(/<body\b([^>]*)>/i, (_match, attributes) => {
    const classMatch = attributes.match(/\bclass=(['"])(.*?)\1/i);
    const classes = new Set((classMatch?.[2] ?? '').split(/\s+/).filter(Boolean));
    classes.add('kp-chapter');
    classes.add(`kp-chapter--${chapter}`);
    const cleaned = attributes
      .replace(/\s*\bclass=(['"])(.*?)\1/i, '')
      .replace(/\s*\bdata-book=(['"])(.*?)\1/i, '')
      .replace(/\s*\bdata-chapter=(['"])(.*?)\1/i, '')
      .trim();
    return `<body class="${[...classes].join(' ')}" data-book="konec-podpory" data-chapter="${chapter}"${cleaned ? ` ${cleaned}` : ''}>`;
  });
}

function normalizeHeading(source, filename) {
  const h1Count = (source.match(/<h1\b/gi) ?? []).length;
  if (h1Count === 1) return source;
  if (h1Count !== 0) throw new Error(`${filename}: expected zero or one h1, found ${h1Count}`);
  const replaced = source.replace(
    /<p\b([^>]*\bclass=(['"])[^'"]*\bkp-title\b[^'"]*\2[^>]*)>([\s\S]*?)<\/p>/i,
    '<h1$1>$3</h1>',
  );
  if (replaced === source) throw new Error(`${filename}: primary kp-title was not found`);
  return replaced;
}

function normalizeLinks(source, chapter) {
  const route = NEXT_ROUTES.get(chapter);
  if (!route) throw new Error(`Missing next route for chapter ${chapter}`);
  return source.replace(/(<a\b[^>]*\bclass=(['"])[^'"]*\bchoice-link\b[^'"]*\2[^>]*\bhref=)(['"])(.*?)\3/gi,
    (_match, prefix, classQuote, hrefQuote) => `${prefix}${hrefQuote}${route}${hrefQuote}`,
  );
}

function ensureStylesheetLink(source) {
  if (source.includes(STYLESHEET_HREF)) return source;
  return source.replace(
    /(<link\s+rel="stylesheet"\s+href="\/styles\.css"\s*\/?>)/i,
    `$1\n<link rel="stylesheet" href="${STYLESHEET_HREF}" />`,
  );
}

function removeRedundantGlitchToggle(source) {
  // mbti.js already owns the fx-glitch interaction used by chapter 00.
  return source.replace(/<script src="\/books\/glitch-toggle\.js" defer><\/script>\r?\n?/i, '');
}

function compactStylesheetScopes(css) {
  return css
    .replace(
      /:is\(body\[data-book="konec-podpory"\]\[data-chapter="(\d{2})"\], \.chapter-content\[data-book="konec-podpory"\]\[data-chapter="\1"\]\)/g,
      '.kp-chapter[data-book="konec-podpory"][data-chapter="$1"]',
    )
    .replace(
      /:is\(body\[data-book="konec-podpory"\], \.chapter-content\[data-book="konec-podpory"\]\)/g,
      '.kp-chapter[data-book="konec-podpory"]',
    );
}

function scopeUnscopedBookRules(css) {
  const root = postcss.parse(css, { from: undefined });
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    if (rule.selector.includes('data-book="konec-podpory"')) return;
    const scope = '.kp-chapter[data-book="konec-podpory"]';
    rule.selector = splitSelectors(rule.selector).map((selector) => scopeSelector(selector, scope)).join(',\n');
  });
  return root.toString();
}

function verifyMigratedSources() {
  const errors = [];
  for (const [chapter, filename] of CHAPTERS) {
    const source = fs.readFileSync(path.join(BOOK_DIR, filename), 'utf8');
    if (/<style\b|\sstyle\s*=/i.test(source)) errors.push(`${filename}: embedded style remains`);
    if (!source.includes(`data-book="konec-podpory"`) || !source.includes(`data-chapter="${chapter}"`)) {
      errors.push(`${filename}: normalized body metadata is missing`);
    }
    if ((source.match(/<h1\b/gi) ?? []).length !== 1) errors.push(`${filename}: does not contain exactly one h1`);
    if (!source.includes(STYLESHEET_HREF)) errors.push(`${filename}: external stylesheet link is missing`);
  }
  if (!fs.existsSync(STYLESHEET)) errors.push('konec-podpory.css is missing');
  if (errors.length) throw new Error(errors.join('\n'));
}

function migrate() {
  const chapters = CHAPTERS.map(([chapter, filename]) => {
    const source = fs.readFileSync(path.join(BOOK_DIR, filename), 'utf8');
    const match = source.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i);
    return { chapter, filename, source, css: match?.[1] ?? null };
  });

  const hasEmbeddedStyles = chapters.some((chapter) => chapter.css !== null);
  if (!hasEmbeddedStyles) {
    for (const chapter of chapters) {
      const normalized = normalizeLinks(removeRedundantGlitchToggle(chapter.source), chapter.chapter);
      if (normalized !== chapter.source) {
        fs.writeFileSync(path.join(BOOK_DIR, chapter.filename), normalized, 'utf8');
      }
    }
    const currentCss = fs.readFileSync(STYLESHEET, 'utf8');
    const compactCss = scopeUnscopedBookRules(compactStylesheetScopes(currentCss));
    if (compactCss !== currentCss) fs.writeFileSync(STYLESHEET, compactCss, 'utf8');
    verifyMigratedSources();
    console.log('KONEC PODPORY migration already applied; 19 chapters verified.');
    return;
  }
  if (chapters.some((chapter) => chapter.css === null)) {
    throw new Error('Refusing partial migration: some chapters have embedded CSS and others do not.');
  }

  const chapterRoots = chapters.map(({ chapter, css }) => {
    const root = postcss.parse(css, { from: undefined });
    renameKeyframes(root, chapter);
    return { chapter, root };
  });
  const sharedRules = dedupeSharedComponentRules(chapterRoots);
  for (const { chapter, root } of chapterRoots) {
    const scope = `:is(body[data-book="konec-podpory"][data-chapter="${chapter}"], .chapter-content[data-book="konec-podpory"][data-chapter="${chapter}"])`;
    scopeRoot(root, scope);
  }

  const baseCss = `/* SYNTHOMA: KONEC PODPORY - book-scoped presentation */
:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) {
  --kp-bg: #03080b;
  --kp-text: #d8f6ff;
  --kp-cyan: #00eaff;
  --kp-blue: #4b8cff;
  --kp-yellow: #f6ff00;
  --kp-red: #ff4057;
  --kp-green: #69ff9f;
  --kp-white: #f5fbff;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  overflow-wrap: break-word;
}

:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *,
:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *::before,
:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *::after {
  box-sizing: border-box;
}

:is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) :where(img, svg, video, canvas) {
  max-width: 100%;
}

/* Semantic replacements for source inline values. */
[data-book="konec-podpory"] .kp-inline-text--success { color: var(--kp-green); }
[data-book="konec-podpory"] .kp-inline-text--danger { color: var(--kp-red); }
[data-book="konec-podpory"] .kp-power-fill--fuel-reserve { --power: 17%; --power-color: var(--kp-red); }
[data-book="konec-podpory"] .kp-power-fill--support-lines { --power: 12%; --power-color: var(--kp-green); }
[data-book="konec-podpory"] .kp-power-fill--crisis-control { --power: 9%; --power-color: var(--kp-yellow); }
[data-book="konec-podpory"] .kp-power-fill--clinical-archive { --power: 68%; --power-color: var(--kp-blue); }
[data-book="konec-podpory"] .kp-power-fill--legacy-archive { --power: 88%; --power-color: var(--kp-blue); }
[data-book="konec-podpory"] .kp-label-card--boris { --r: -1deg; }
[data-book="konec-podpory"] .kp-label-card--mina { --r: 1.4deg; }
[data-book="konec-podpory"] .kp-label-card--juros { --r: -0.6deg; }
[data-book="konec-podpory"] .kp-label-card--tova { --r: 0.8deg; }
[data-book="konec-podpory"] .kp-label-card--vanta { --r: -1.3deg; }
[data-book="konec-podpory"] .kp-label-card--milo { --r: 1deg; }
[data-book="konec-podpory"] .kp-label-card--consent { --r: 0deg; max-width: 26rem; margin: 2rem auto; }
${Array.from({ length: 12 }, (_, index) => `[data-book="konec-podpory"] .kp-drone-dot--delay-${String(index).padStart(2, '0')} { --i: ${index}; }`).join('\n')}
[data-book="konec-podpory"] .kp-ambient-path__level--low { --h: 1rem; }
[data-book="konec-podpory"] .kp-ambient-path__level--high { --h: 3.5rem; }
[data-book="konec-podpory"] .kp-ambient-path__level--critical { --h: 0.4rem; }
[data-book="konec-podpory"] .kp-ambient-path__level--medium { --h: 2.2rem; }
[data-book="konec-podpory"] .kp-ambient-path__level--peak { --h: 4.5rem; }
[data-book="konec-podpory"] .kp-ambient-path__level--reduced { --h: 1.4rem; }
[data-book="konec-podpory"] .kp-cooling-bar__fill--critical { width: 46%; }
`;

  const sharedCss = sharedRules.length
    ? `\n/* Shared components deduplicated from six or more chapters. */\n${postcss.root({ nodes: sharedRules }).toString()}\n`
    : '';
  const chapterCss = chapterRoots.map(({ chapter, root }) =>
    `\n/* Chapter ${chapter} */\n${root.toString().trim()}\n`,
  ).join('');
  const safetyCss = `
@media (max-width: 480px) {
  :is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) :where(.kp-terminal, .kp-panel, .kp-card, .kp-profile) {
    max-width: 100%;
    overflow-wrap: anywhere;
  }
}

@media (prefers-reduced-motion: reduce) {
  :is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *,
  :is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *::before,
  :is(body[data-book="konec-podpory"], .chapter-content[data-book="konec-podpory"]) *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;
  fs.writeFileSync(
    STYLESHEET,
    scopeUnscopedBookRules(compactStylesheetScopes(`${baseCss}${sharedCss}${chapterCss}${safetyCss}`)),
    'utf8',
  );

  for (const chapter of chapters) {
    const beforeText = readableText(chapter.source);
    let source = chapter.source.replace(/\s*<style\b[^>]*>[\s\S]*?<\/style>\s*/i, '\n');
    source = ensureStylesheetLink(source);
    source = removeRedundantGlitchToggle(source);
    source = replaceInlineStyles(source, chapter.filename);
    source = normalizeBody(source, chapter.chapter);
    source = normalizeHeading(source, chapter.filename);
    source = normalizeLinks(source, chapter.chapter);
    if (readableText(source) !== beforeText) {
      throw new Error(`${chapter.filename}: literary text changed during migration`);
    }
    fs.writeFileSync(path.join(BOOK_DIR, chapter.filename), source, 'utf8');
  }

  verifyMigratedSources();
  console.log(`Migrated 19 chapters; extracted CSS with ${sharedRules.length} shared component rules.`);
}

migrate();
