#!/usr/bin/env node
/*
  Simple validator for book HTML files.
  - Scans public/books/**/*.html
  - Validates <p class="choice"> elements and their data-tags attributes
  - Rules:
    * data-tags must exist and be non-empty
    * Each token separated by comma must be either a single MBTI letter (I,E,N,S,F,T,J,P)
      or a letter followed by +int/-int (e.g., N+2, S-1)
  - Prints a summary and exits with code 1 if any errors were found
*/

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

function main() {
  const files = walk(BOOKS_DIR);
  let totalErrors = 0;
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
  if (totalErrors) {
    console.log(`\nFound ${totalErrors} error(s) in data-tags.`);
    process.exit(1);
  } else {
    console.log('All books look clean.');
  }
}

main();
