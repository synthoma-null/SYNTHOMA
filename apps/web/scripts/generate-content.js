#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GENERATED_START = '// <content:generated-chapters>';
const GENERATED_END = '// </content:generated-chapters>';

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function optionalMetadata(chapter, key) {
  const value = chapter.metadata?.[key];
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function publicChapterTitle(title) {
  return title.replace(/^0-(?=∞|\d)/, '0 - ');
}

function publicCollection(collection) {
  return {
    slug: collection.slug,
    publicId: collection.publicId,
    title: collection.title,
    shortTitle: collection.shortTitle,
    description: collection.description,
    ...(collection.cover ? { cover: collection.cover } : {}),
    ...(collection.stylesheet ? { stylesheet: collection.stylesheet } : {}),
    language: collection.language,
    order: collection.order,
    status: collection.status,
  };
}

function legacyChapter(chapter) {
  return {
    id: chapter.id,
    title: chapter.title,
    collection: chapter.collection,
    filename: chapter.filename,
    ...(chapter.filenameEn ? { filename_en: chapter.filenameEn } : {}),
    access: chapter.accessPolicy === 'free' ? 'free' : 'paid',
    mnemCost: chapter.mnemCost ?? 0,
    order: chapter.order ?? 0,
    packageIds: chapter.packageIds,
    ...(optionalMetadata(chapter, 'teaser') ? { teaser: optionalMetadata(chapter, 'teaser') } : {}),
    ...(optionalMetadata(chapter, 'teaserEn') ? { teaser_en: optionalMetadata(chapter, 'teaserEn') } : {}),
    ...(optionalMetadata(chapter, 'unlocks') ? { unlocks: optionalMetadata(chapter, 'unlocks') } : {}),
    ...(optionalMetadata(chapter, 'unlocksEn') ? { unlocks_en: optionalMetadata(chapter, 'unlocksEn') } : {}),
    ...(optionalMetadata(chapter, 'estimatedMinutes')
      ? { estimatedMinutes: optionalMetadata(chapter, 'estimatedMinutes') }
      : {}),
  };
}

function replaceGeneratedChapterBlock(source, chapters) {
  const start = source.indexOf(GENERATED_START);
  const end = source.indexOf(GENERATED_END);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('booksManifest.ts is missing generated chapter markers.');
  }
  const generated = `${GENERATED_START}\nexport const CHAPTERS: Chapter[] = ${JSON.stringify(
    chapters.filter((chapter) => chapter.availability === 'published').map(legacyChapter),
    null,
    2,
  )};\n${GENERATED_END}`;
  return `${source.slice(0, start)}${generated}${source.slice(end + GENERATED_END.length)}`;
}

function buildGeneratedOutputs(catalogModule) {
  const chapters = [...catalogModule.CHAPTER_CATALOG];
  const collections = [...catalogModule.BOOK_COLLECTIONS];
  const booksManifest = {
    collections: collections.map((collection) => ({
      ...publicCollection(collection),
      chapters: chapters.filter((chapter) => chapter.collection === collection.slug).map((chapter) => ({
        title: publicChapterTitle(chapter.title),
        path: chapter.publicPath,
        free: chapter.availability === 'published' && chapter.accessPolicy === 'free',
        ...(chapter.track ? { track: chapter.track } : {}),
        ...(chapter.backgroundVideo ? { backgroundVideo: chapter.backgroundVideo } : {}),
        id: chapter.id,
        chapterOrder: chapter.order ?? 0,
        ...(chapter.summary ? { summary: chapter.summary } : {}),
        status: chapter.status,
      })),
    })),
  };
  const libraryCatalog = {
    collections: collections.map((collection) => {
      const collectionChapters = chapters.filter((chapter) => chapter.collection === collection.slug);
      return {
      ...publicCollection(collection),
      chapters: collectionChapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        path: chapter.publicPath,
        filename: chapter.filename,
        collectionSlug: chapter.collection,
        order: chapter.order ?? 0,
        access: chapter.availability === 'unavailable'
          ? 'unavailable'
          : chapter.accessPolicy === 'free' ? 'free' : 'locked',
        mnemCost: chapter.mnemCost,
        packageIds: chapter.packageIds,
        ...(chapter.backgroundVideo ? { backgroundVideo: chapter.backgroundVideo } : {}),
        ...(chapter.track ? { track: chapter.track } : {}),
        ...(chapter.summary ? { summary: chapter.summary } : {}),
        status: chapter.status,
        ...(typeof chapter.metadata?.estimatedMinutes === 'number'
          ? { estimatedMinutes: chapter.metadata.estimatedMinutes }
          : {}),
        ...(typeof chapter.metadata?.teaser === 'string' ? { teaser: chapter.metadata.teaser } : {}),
        ...(typeof chapter.metadata?.unlocks === 'string' ? { unlocks: chapter.metadata.unlocks } : {}),
      })),
      availableCount: collectionChapters.filter((chapter) => chapter.accessPolicy === 'free').length,
      totalCount: collectionChapters.length,
    };
    }),
  };
  const readerChapterIndex = chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    collection: chapter.collection,
    filename: chapter.filename,
    ...(chapter.filenameEn ? { filenameEn: chapter.filenameEn } : {}),
    path: chapter.publicPath,
    route: chapter.route,
    order: chapter.order ?? 0,
    availability: chapter.availability,
    accessPolicy: chapter.accessPolicy,
    mnemCost: chapter.mnemCost,
    ...(chapter.track ? { track: chapter.track } : {}),
    ...(chapter.backgroundVideo ? { backgroundVideo: chapter.backgroundVideo } : {}),
  }));
  const contentValidationIndex = catalogModule.CONTENT_CATALOG.map((entry) => ({
    key: `${entry.type}:${entry.id}`,
    availability: entry.availability,
    accessPolicy: entry.accessPolicy,
    mnemCost: entry.mnemCost,
    packageIds: entry.packageIds,
    ...(entry.sourcePath ? { sourcePath: entry.sourcePath } : {}),
    ...(entry.prerequisiteChapterId ? { prerequisiteChapterId: entry.prerequisiteChapterId } : {}),
  }));
  const booksManifestSource = fs.readFileSync(
    path.join(ROOT, 'src', 'content', 'booksManifest.ts'),
    'utf8',
  );

  return new Map([
    ['public/books/manifest.json', serializeJson(booksManifest)],
    ['src/content/generated/libraryCatalog.json', serializeJson(libraryCatalog)],
    ['src/content/generated/readerChapterIndex.json', serializeJson(readerChapterIndex)],
    ['src/content/generated/contentValidationIndex.json', serializeJson(contentValidationIndex)],
    ['src/content/booksManifest.ts', replaceGeneratedChapterBlock(booksManifestSource, chapters)],
  ]);
}

function writeGeneratedOutputs(outputs) {
  let changed = 0;
  for (const [relativePath, content] of outputs) {
    const filename = path.join(ROOT, relativePath);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    const current = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : null;
    if (current === content) continue;
    fs.writeFileSync(filename, content, 'utf8');
    changed += 1;
  }
  return changed;
}

module.exports = { buildGeneratedOutputs, writeGeneratedOutputs };

if (require.main === module) {
  const { loadTypeScriptModule } = require('./validate-content');
  const catalogModule = loadTypeScriptModule(path.join(ROOT, 'src', 'content', 'catalog.ts'));
  const changed = writeGeneratedOutputs(buildGeneratedOutputs(catalogModule));
  console.log(`Content generation complete: ${changed} file(s) updated.`);
}
