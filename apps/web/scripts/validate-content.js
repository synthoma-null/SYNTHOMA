#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');

function loadTypeScriptModule(filename, cache = new Map()) {
  const resolved = path.resolve(filename);
  if (cache.has(resolved)) return cache.get(resolved).exports;

  const source = fs.readFileSync(resolved, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: resolved,
  }).outputText;

  const module = { exports: {} };
  cache.set(resolved, module);
  const localRequire = (request) => {
    if (!request.startsWith('.')) return require(request);
    const base = path.resolve(path.dirname(resolved), request);
    const candidates = [base, `${base}.ts`, `${base}.js`, `${base}.json`, path.join(base, 'index.ts')];
    const target = candidates.find((candidate) => fs.existsSync(candidate));
    if (!target) throw new Error(`Cannot resolve ${request} from ${resolved}`);
    if (target.endsWith('.ts')) return loadTypeScriptModule(target, cache);
    return require(target);
  };

  const execute = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  execute(localRequire, module, module.exports, resolved, path.dirname(resolved));
  return module.exports;
}

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function validate() {
  const catalogModule = loadTypeScriptModule(path.join(ROOT, 'src', 'content', 'catalog.ts'));
  const manifestModule = loadTypeScriptModule(path.join(ROOT, 'src', 'content', 'booksManifest.ts'));
  const catalog = catalogModule.CONTENT_CATALOG;
  const chapters = catalogModule.CHAPTER_CATALOG;
  const packages = manifestModule.PACKAGES;
  const books = readJson('public/books/manifest.json');
  const archiveCs = readJson('public/data/archiveCards.json');
  const archiveEn = readJson('public/data/archiveCards_en.json');

  if (!Array.isArray(catalog) || !catalog.length) fail('Canonical catalog is empty.');
  if (!Array.isArray(chapters) || !chapters.length) fail('Chapter catalog is empty.');

  for (const key of duplicateValues(catalog.map((entry) => `${entry.type}:${entry.id}`))) {
    fail(`Duplicate catalog key: ${key}`);
  }

  const catalogKeys = new Set(catalog.map((entry) => `${entry.type}:${entry.id}`));
  const chapterIds = new Set(chapters.map((chapter) => chapter.id));
  const packageIds = new Set(packages.map((item) => item.id));

  for (const entry of catalog) {
    if (!entry.id || !entry.type || !entry.title) fail(`Incomplete catalog entry: ${JSON.stringify(entry)}`);
    if (!['published', 'unavailable'].includes(entry.availability)) {
      fail(`Invalid availability for ${entry.type}:${entry.id}`);
    }
    if (entry.availability === 'published' && entry.accessPolicy === 'entitlement') {
      if (entry.type !== 'package' && (!Number.isInteger(entry.mnemCost) || entry.mnemCost <= 0)) {
        fail(`Purchasable ${entry.type}:${entry.id} needs a positive integer MNEM price.`);
      }
    }
    if (entry.mnemCost != null && (!Number.isInteger(entry.mnemCost) || entry.mnemCost < 0)) {
      fail(`Invalid MNEM price for ${entry.type}:${entry.id}: ${entry.mnemCost}`);
    }
    for (const packageId of entry.packageIds || []) {
      if (!packageIds.has(packageId)) fail(`${entry.type}:${entry.id} references unknown package ${packageId}.`);
    }
    if (entry.prerequisiteChapterId && !chapterIds.has(entry.prerequisiteChapterId)) {
      fail(`${entry.type}:${entry.id} references unknown prerequisite ${entry.prerequisiteChapterId}.`);
    }
  }

  for (const item of packages) {
    for (const chapterId of item.chapterIds) {
      if (!chapterIds.has(chapterId)) fail(`Package ${item.id} references unknown chapter ${chapterId}.`);
      const chapter = chapters.find((candidate) => candidate.id === chapterId);
      if (chapter && !chapter.packageIds.includes(item.id)) {
        fail(`Package mapping is not reciprocal: ${item.id} -> ${chapterId}.`);
      }
    }
  }

  const publicChapters = (books.collections || []).flatMap((collection) => collection.chapters || []);
  for (const id of duplicateValues(publicChapters.map((chapter) => chapter.id))) {
    fail(`Duplicate public manifest chapter ID: ${id}`);
  }
  for (const order of duplicateValues(publicChapters.map((chapter) => chapter.chapterOrder))) {
    fail(`Duplicate public manifest chapter order: ${order}`);
  }

  if (publicChapters.length !== chapters.length) {
    fail(`Public manifest has ${publicChapters.length} chapters; canonical catalog has ${chapters.length}.`);
  }

  for (const publicChapter of publicChapters) {
    if (!publicChapter.id) {
      fail(`Public manifest chapter lacks stable ID: ${publicChapter.title || publicChapter.path}`);
      continue;
    }
    const chapter = chapters.find((candidate) => candidate.id === publicChapter.id);
    if (!chapter) {
      fail(`Public manifest references unknown chapter ${publicChapter.id}.`);
      continue;
    }
    if (chapter.order !== publicChapter.chapterOrder) {
      fail(`Order mismatch for ${chapter.id}: catalog=${chapter.order}, manifest=${publicChapter.chapterOrder}.`);
    }
    const expectedFree = chapter.availability === 'published' && chapter.accessPolicy === 'free';
    if (publicChapter.free !== expectedFree) {
      fail(`Access mismatch for ${chapter.id}: manifest free=${publicChapter.free}, catalog free=${expectedFree}.`);
    }
    const expectedStatus = chapter.availability === 'published' ? 'final' : 'draft';
    if (publicChapter.status !== expectedStatus) {
      fail(`Status mismatch for ${chapter.id}: manifest=${publicChapter.status}, catalog=${expectedStatus}.`);
    }
  }

  for (const chapter of chapters) {
    if (chapter.availability !== 'published') continue;
    if (!chapter.sourcePath) {
      fail(`Published chapter ${chapter.id} has no source path.`);
      continue;
    }
    const sourcePath = path.join(ROOT, chapter.sourcePath);
    if (!fs.existsSync(sourcePath)) fail(`Published chapter ${chapter.id} is missing ${chapter.sourcePath}.`);
  }

  const csIds = archiveCs.cards.map((card) => card.id);
  const enIds = archiveEn.cards.map((card) => card.id);
  for (const id of duplicateValues(csIds)) fail(`Duplicate Czech archive ID: ${id}`);
  for (const id of duplicateValues(enIds)) fail(`Duplicate English archive ID: ${id}`);
  for (const id of csIds) if (!enIds.includes(id)) fail(`Archive record ${id} is missing in English locale.`);
  for (const id of enIds) if (!csIds.includes(id)) fail(`Archive record ${id} is missing in Czech locale.`);

  const archiveIds = new Set(csIds);
  for (const card of [...archiveCs.cards, ...archiveEn.cards]) {
    for (const relatedId of card.related || []) {
      if (!archiveIds.has(relatedId)) fail(`Archive record ${card.id} references unknown related record ${relatedId}.`);
    }
    const catalogEntry = catalog.find(
      (entry) => entry.type === 'archive_record' && entry.id === card.id,
    );
    if (!catalogEntry) fail(`Archive record ${card.id} is missing from canonical catalog.`);
  }

  const aliases = new Map();
  for (const chapter of chapters) {
    for (const alias of chapter.aliases || []) {
      const normalized = alias.toLowerCase();
      if (aliases.has(normalized) && aliases.get(normalized) !== chapter.id) {
        fail(`Chapter alias ${alias} points to multiple canonical IDs.`);
      }
      aliases.set(normalized, chapter.id);
      if (catalogModule.resolveChapterId(alias) !== chapter.id) {
        fail(`Chapter alias ${alias} does not resolve to ${chapter.id}.`);
      }
    }
  }

  if (catalogModule.resolveChapterId('0-11-orgie-1') !== '0-11-orgie') {
    fail('Historical 0-11 chapter alias is not preserved.');
  }
  if (!catalogKeys.has('chapter:0-11-orgie')) fail('Canonical chapter 0-11-orgie is missing.');

  for (const warning of warnings) console.warn(`[content:warn] ${warning}`);
  for (const error of errors) console.error(`[content:error] ${error}`);

  if (errors.length) {
    console.error(`Content validation failed with ${errors.length} error(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Content validation passed: ${catalog.length} entries, ${chapters.length} chapters.`);
}

try {
  validate();
} catch (error) {
  console.error('[content:error] Validator crashed:', error);
  process.exitCode = 1;
}
