#!/usr/bin/env node
//
// Validator for book HTML files and manifest integrity.
// - Scans public/books/ for .html files recursively
// - Validates <p class="choice"> elements and their data-tags attributes
// - Validates manifest.json: checks that all referenced chapter, audio, and video files exist
// - Rules:
//   - data-tags must exist and be non-empty
//   - Each token separated by comma must be either a single MBTI letter (I,E,N,S,F,T,J,P)
//     or a letter followed by +int/-int (e.g., N+2, S-1)
// - Prints a summary and exits with code 1 if any errors were found
//

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BOOKS_DIR = path.join(ROOT, 'public', 'books');

const MBTI = new Set(['I','E','N','S','F','T','J','P']);

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
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

/** @param {string} html */
function findChoices(html) {
  // Cheap parser: find <p ... class="...choice..." ... data-tags="...">
  // We will use a global regex to find p tags and then inspect attributes.
  const results = [];
  const reP = /<p\b[^>]*class=["'][^"']*\bchoice\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = reP.exec(html)) !== null) {
    const full = m[0];
    results.push(full);
  }
  return results;
}

/** @param {string} pTag */
function extractDataTags(pTag) {
  const m = pTag.match(/data-tags\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].trim() : '';
}

/** @param {string} value */
function validateTags(value) {
  const errors = [];
  if (!value) {
    errors.push('missing data-tags');
    return errors;
  }
  const parts = value.split(',').map(s => s.trim()).filter(Boolean);
  if (!parts.length) {
    errors.push('empty data-tags list');
    return errors;
  }
  for (const token of parts) {
    const up = token.toUpperCase();
    // Allow plain letter or letter+/-int
    if (MBTI.has(up)) continue;
    const m = up.match(/^([IENSFTJP])([+-]\d+)$/);
    if (!m) {
      errors.push(`invalid token: '${token}'`);
      continue;
    }
    const letter = m[1];
    if (!MBTI.has(letter)) errors.push(`invalid letter in token: '${token}'`);
  }
  return errors;
}

/** Validate manifest.json: check that all referenced files exist on disk */
function validateManifest() {
  const manifestPath = path.join(ROOT, 'public', 'books', 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.error(`Cannot read manifest: ${e.message}`);
    return { errors: 1, warnings: 0 };
  }

  let errors = 0;
  let warnings = 0;
  const publicDir = path.join(ROOT, 'public');

  for (const collection of manifest.collections || []) {
    for (const chapter of collection.chapters || []) {
      const isDraft = chapter.status === 'draft';
      const label = isDraft ? 'WARN' : 'ERROR';

      // Check chapter HTML file
      if (chapter.path) {
        const relativeBookPath = chapter.path.replace(/^\/?books\//, '');
        const filePath = chapter.free === false
          ? path.join(ROOT, 'src', 'content', 'protected', relativeBookPath)
          : path.join(publicDir, chapter.path);
        if (!fs.existsSync(filePath)) {
          const msg = `  [${label}] MISSING chapter: ${chapter.path} (title: "${chapter.title}")`;
          if (isDraft) { console.warn(msg); warnings++; }
          else { console.error(msg); errors++; }
        }
      }

      // Check audio track
      if (chapter.track) {
        const trackPath = path.join(publicDir, chapter.track);
        if (!fs.existsSync(trackPath)) {
          const msg = `  [${label}] MISSING audio: ${chapter.track} (chapter: "${chapter.title}")`;
          if (isDraft) { console.warn(msg); warnings++; }
          else { console.error(msg); errors++; }
        }
      }

      // Check background video (skip empty strings)
      if (chapter.backgroundVideo) {
        const videoPath = path.join(publicDir, chapter.backgroundVideo);
        if (!fs.existsSync(videoPath)) {
          const msg = `  [${label}] MISSING video: ${chapter.backgroundVideo} (chapter: "${chapter.title}")`;
          if (isDraft) { console.warn(msg); warnings++; }
          else { console.error(msg); errors++; }
        }
      }
    }
  }

  return { errors, warnings };
}

function main() {
  let totalErrors = 0;
  let totalWarnings = 0;

  // 1. Validate manifest file references
  console.log('--- Manifest validation ---');
  const manifestResult = validateManifest();
  totalErrors += manifestResult.errors;
  totalWarnings += manifestResult.warnings;
  if (manifestResult.errors) {
    console.log(`  ${manifestResult.errors} error(s) (final chapters missing).`);
  }
  if (manifestResult.warnings) {
    console.log(`  ${manifestResult.warnings} warning(s) (draft chapters not yet written).`);
  }
  if (!manifestResult.errors && !manifestResult.warnings) {
    console.log('All manifest references OK.');
  }

  // 2. Validate data-tags in chapter HTML files
  console.log('\n--- Choice data-tags validation ---');
  const files = walk(BOOKS_DIR);
  for (const file of files) {
    let html = '';
    try { html = fs.readFileSync(file, 'utf8'); } catch { continue; }
    const choices = findChoices(html);
    /** @type {string[]} */
    const fileErrors = [];
    choices.forEach((p, idx) => {
      const tags = extractDataTags(p);
      const errs = validateTags(tags);
      if (errs.length) {
        fileErrors.push(`  - choice#${idx + 1}: ${errs.join('; ')} (data-tags="${tags}")`);
      }
    });
    if (fileErrors.length) {
      totalErrors += fileErrors.length;
      console.log(`\n${path.relative(ROOT, file)}:`);
      fileErrors.forEach(e => console.log(e));
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  if (totalErrors) {
    console.log(`ERRORS: ${totalErrors}`);
  }
  if (totalWarnings) {
    console.log(`WARNINGS: ${totalWarnings}`);
  }
  if (!totalErrors && !totalWarnings) {
    console.log('All books look clean.');
  }

  // Exit 1 only on actual errors, not warnings
  if (totalErrors) {
    process.exit(1);
  }
}

main();
