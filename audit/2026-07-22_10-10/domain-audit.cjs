const fs = require('node:fs');
const path = require('node:path');

const root = 'C:/SYNTHOMA/apps/web';
const out = 'C:/SYNTHOMA/audit/2026-07-22_10-10';
const { loadTypeScriptModule } = require(path.join(root, 'scripts/validate-content.js'));
const catalog = loadTypeScriptModule(path.join(root, 'src/content/catalog.ts'));
const ts = require(path.join(root, 'node_modules/typescript'));

function loadTsEnhanced(filename, cache = new Map()) {
  const resolved = path.resolve(filename);
  if (cache.has(resolved)) return cache.get(resolved).exports;
  const source = fs.readFileSync(resolved, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true },
    fileName: resolved,
  }).outputText;
  const module = { exports: {} };
  cache.set(resolved, module);
  const localRequire = (request) => {
    if (!request.startsWith('.')) return require(request);
    const base = path.resolve(path.dirname(resolved), request);
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.json`, path.join(base, 'index.ts'), path.join(base, 'index.tsx'), path.join(base, 'index.js')];
    const target = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!target) throw new Error(`Cannot resolve ${request} from ${resolved}`);
    if (/\.tsx?$/.test(target)) return loadTsEnhanced(target, cache);
    return require(target);
  };
  new Function('require', 'module', 'exports', '__filename', '__dirname', output)(localRequire, module, module.exports, resolved, path.dirname(resolved));
  return module.exports;
}

const walk = (directory, result = []) => {
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, result);
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
};
const relative = (filename) => path.relative(root, filename).replaceAll('\\', '/');

const chapterFiles = [
  ...walk(path.join(root, 'public/books')),
  ...walk(path.join(root, 'src/content/protected')),
].filter((filename) => filename.endsWith('.html'));

const htmlAudit = chapterFiles.map((filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const ids = [...source.matchAll(/\bid=["']([^"']+)/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const text = source.replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-zA-Z#0-9]+;/g, ' ');
  return {
    path: relative(filename),
    bytes: Buffer.byteLength(source),
    words: text.trim().split(/\s+/).filter(Boolean).length,
    lang: source.match(/<html[^>]*\blang=["']([^"']+)/i)?.[1] ?? '',
    title: source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '',
    h1: (source.match(/<h1\b/gi) ?? []).length,
    h2: (source.match(/<h2\b/gi) ?? []).length,
    inlineStyles: (source.match(/\bstyle\s*=/gi) ?? []).length,
    scriptTags: (source.match(/<script\b/gi) ?? []).length,
    externalScripts: [...source.matchAll(/<script[^>]*\bsrc=["']([^"']+)/gi)].map((match) => match[1]),
    stylesheets: [...source.matchAll(/<link[^>]*\bhref=["']([^"']+\.css[^"']*)/gi)].map((match) => match[1]),
    choices: (source.match(/class=["'][^"']*\bchoice\b/gi) ?? []).length,
    dialogs: (source.match(/class=["'][^"']*\bdialog[A-Za-z0-9_-]*\b/gi) ?? []).length,
    buttons: (source.match(/<button\b/gi) ?? []).length,
    anchors: (source.match(/<a\b/gi) ?? []).length,
    images: (source.match(/<img\b/gi) ?? []).length,
    imagesWithoutAlt: [...source.matchAll(/<img\b[^>]*>/gi)].filter((match) => !/\balt\s*=/.test(match[0])).length,
    duplicateIds,
    suspiciousEncoding: /Ã.|Ä.|Å.|â(?:€|™|œ|ž|†|‡|ˆ|‰|Š|‹|Œ|Ž|“|”|•|–|—)|ď¸|đź/.test(source),
  };
});

const chapterCatalog = [...catalog.CHAPTER_CATALOG];
const bookCollections = [...catalog.BOOK_COLLECTIONS];
const catalogSources = new Set(chapterCatalog.map((chapter) => chapter.sourcePath).filter(Boolean));
const orphanHtml = htmlAudit.filter((item) => !catalogSources.has(item.path)).map((item) => item.path);
const missingSources = chapterCatalog.filter((chapter) => chapter.sourcePath && !fs.existsSync(path.join(root, chapter.sourcePath))).map((chapter) => ({ id: chapter.id, sourcePath: chapter.sourcePath }));
const duplicateChapterFiles = [];
for (const chapter of chapterCatalog) {
  if (!chapter.filenameEn || !chapter.sourcePath) continue;
  const cs = path.join(root, chapter.sourcePath);
  const en = path.join(path.dirname(cs), chapter.filenameEn);
  if (fs.existsSync(cs) && fs.existsSync(en) && fs.readFileSync(cs).equals(fs.readFileSync(en))) duplicateChapterFiles.push({ id: chapter.id, cs: relative(cs), en: relative(en) });
}

const archivePaths = ['public/data/archiveCards.json', 'public/data/archiveCards_en.json'];
const archive = archivePaths.map((p) => {
  const data = JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  const cards = data.cards ?? [];
  return {
    path: p,
    count: cards.length,
    ids: cards.map((card) => card.id),
    categories: Object.fromEntries([...new Set(cards.map((card) => card.category ?? card.type ?? 'unknown'))].map((category) => [category, cards.filter((card) => (card.category ?? card.type ?? 'unknown') === category).length])),
    missingTitle: cards.filter((card) => !card.title).map((card) => card.id),
    missingDescription: cards.filter((card) => !card.description && !card.text && !card.body).map((card) => card.id),
    accents: cards.map((card) => ({ id: card.id, accent: card.display?.accent })).filter((item) => item.accent),
    invalidRelated: cards.flatMap((card) => (card.related ?? []).filter((id) => !cards.some((candidate) => candidate.id === id)).map((id) => ({ card: card.id, related: id }))),
  };
});

let cyklus = { loadError: null };
try {
  const cardsModule = loadTsEnhanced(path.join(root, 'src/game/cyklus/content/index.ts'));
  const cardIndexModule = loadTsEnhanced(path.join(root, 'src/game/cyklus/cards/index.ts'));
  const typesModule = loadTsEnhanced(path.join(root, 'src/game/cyklus/cyklusTypes.ts'));
  const registry = cardsModule.CYKLUS_CARDS ?? {};
  const cards = Object.values(registry);
  const cardOrder = cardIndexModule.CYKLUS_CARD_ORDER ?? [];
  const webpDirectory = path.join(root, 'public/cards/cyklus');
  const artFiles = fs.existsSync(webpDirectory) ? fs.readdirSync(webpDirectory).filter((name) => name.endsWith('.webp')) : [];
  cyklus = {
    loadError: null,
    cards: cards.length,
    uniqueCardIds: new Set(cards.map((card) => card.id)).size,
    missingPackId: cards.filter((card) => !card.packId).map((card) => card.id),
    missingRole: cards.filter((card) => !card.role).map((card) => card.id),
    missingTone: cards.filter((card) => !card.tone).map((card) => card.id),
    missingChoices: cards.filter((card) => !card.yes || !card.no).map((card) => card.id),
    roles: Object.fromEntries([...new Set(cards.map((card) => card.role ?? 'missing'))].map((role) => [role, cards.filter((card) => (card.role ?? 'missing') === role).length])),
    tones: Object.fromEntries([...new Set(cards.flatMap((card) => card.tone ?? ['missing']))].map((tone) => [tone, cards.filter((card) => (card.tone ?? []).includes(tone)).length])),
    typeExports: Object.keys(typesModule).length,
    orderedIds: cardOrder.length,
    artFiles: artFiles.length,
    cardsWithArt: cards.filter((card) => card.presentation?.artSrc).length,
    missingArtFiles: cards.filter((card) => card.presentation?.artSrc && !fs.existsSync(path.join(root, 'public', card.presentation.artSrc.replace(/^\//, '')))).map((card) => ({ id: card.id, artSrc: card.presentation.artSrc })),
    orphanArtFiles: artFiles.filter((name) => !cards.some((card) => card.presentation?.artSrc?.endsWith(`/${name}`))),
  };
} catch (error) {
  cyklus = { loadError: String(error) };
}

const publicCardFiles = walk(path.join(root, 'public/cards')).filter((filename) => /\.(png|jpe?g|webp|avif|gif)$/i.test(filename));
const allTrackedText = [
  ...walk(path.join(root, 'app')),
  ...walk(path.join(root, 'src')),
  ...walk(path.join(root, 'scripts')),
].filter((filename) => /\.(ts|tsx|js|jsx|json|css|md)$/i.test(filename)).map((filename) => {
  try { return fs.readFileSync(filename, 'utf8'); } catch { return ''; }
}).join('\n');
const cardAssetUsage = publicCardFiles.map((filename) => {
  const rel = relative(filename);
  const publicUrl = '/' + rel.replace(/^public\//, '');
  const basename = path.basename(filename);
  const count = allTrackedText.split(publicUrl).length - 1 + allTrackedText.split(basename).length - 1;
  return { path: rel, bytes: fs.statSync(filename).size, referenceCount: count, recommendation: count ? 'referenced' : 'review source/master or unused asset' };
});

const reader = {
  chapterFiles: htmlAudit.length,
  totalWords: htmlAudit.reduce((sum, item) => sum + item.words, 0),
  inlineStyles: htmlAudit.reduce((sum, item) => sum + item.inlineStyles, 0),
  scripts: htmlAudit.reduce((sum, item) => sum + item.scriptTags, 0),
  choices: htmlAudit.reduce((sum, item) => sum + item.choices, 0),
  dialogs: htmlAudit.reduce((sum, item) => sum + item.dialogs, 0),
  imagesWithoutAlt: htmlAudit.reduce((sum, item) => sum + item.imagesWithoutAlt, 0),
  duplicateIdFiles: htmlAudit.filter((item) => item.duplicateIds.length).map((item) => ({ path: item.path, ids: item.duplicateIds })),
  suspiciousEncodingFiles: htmlAudit.filter((item) => item.suspiciousEncoding).map((item) => item.path),
  emptyOrVeryShort: htmlAudit.filter((item) => item.words < 100).map((item) => ({ path: item.path, words: item.words })),
  missingLang: htmlAudit.filter((item) => !item.lang).map((item) => item.path),
};

const report = {
  catalog: {
    entries: catalog.CONTENT_CATALOG.length,
    chapters: chapterCatalog.length,
    collections: bookCollections.map((collection) => ({ slug: collection.slug, title: collection.title, chapters: chapterCatalog.filter((chapter) => chapter.collection === collection.slug).length, published: chapterCatalog.filter((chapter) => chapter.collection === collection.slug && chapter.availability === 'published').length, free: chapterCatalog.filter((chapter) => chapter.collection === collection.slug && chapter.accessPolicy === 'free').length })),
    contentTypes: Object.fromEntries([...new Set(catalog.CONTENT_CATALOG.map((entry) => entry.type))].map((type) => [type, catalog.CONTENT_CATALOG.filter((entry) => entry.type === type).length])),
    missingSources,
    orphanHtml,
    exactLocaleDuplicates: duplicateChapterFiles,
  },
  reader,
  htmlAudit,
  archive,
  cyklus,
  cardAssets: { files: cardAssetUsage.length, bytes: cardAssetUsage.reduce((sum, item) => sum + item.bytes, 0), unreferenced: cardAssetUsage.filter((item) => item.referenceCount === 0), all: cardAssetUsage },
};
fs.writeFileSync(path.join(out, 'domain-audit-data.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ catalog: report.catalog, reader, archive: archive.map(({ path, count, categories, missingTitle, missingDescription, invalidRelated }) => ({ path, count, categories, missingTitle, missingDescription, invalidRelated })), cyklus, cardAssets: { files: report.cardAssets.files, bytes: report.cardAssets.bytes, unreferenced: report.cardAssets.unreferenced.length } }, null, 2));
