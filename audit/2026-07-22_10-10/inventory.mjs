import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = 'C:/SYNTHOMA';
const auditRoot = 'audit/2026-07-22_10-10';
const outDir = path.join(root, auditRoot);
const requireFromWeb = createRequire(path.join(root, 'apps/web/package.json'));
let sharp;
try {
  sharp = requireFromWeb('sharp');
} catch {
  sharp = null;
}

const slash = (value) => value.replaceAll('\\', '/');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const splitZero = (value) => value.split('\0').filter(Boolean).map(slash);
const tracked = new Set(splitZero(git('ls-files', '-z')));
const ignored = new Set(splitZero(git('ls-files', '--others', '--ignored', '--exclude-standard', '-z')));

const files = [];
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    const relative = slash(path.relative(root, absolute));
    if (entry.isDirectory()) {
      if (relative === '.git' || relative === auditRoot) continue;
      await walk(absolute);
    } else if (entry.isFile()) {
      const stat = await fs.stat(absolute);
      files.push({ absolute, path: relative, sizeBytes: stat.size, mtime: stat.mtime.toISOString() });
    }
  }
}
await walk(root);

const generatedPattern = /(^|\/)(node_modules|\.next|\.out|\.swc|coverage|dist|build|\.cache)(\/|$)|tsconfig\.tsbuildinfo$|\/public\/(sw\.js|workbox-[^/]+\.js|pwa\/icons\/)/i;
const dependencyPattern = /(^|\/)node_modules(\/|$)/;
const buildPattern = /(^|\/)(\.next|\.out|\.swc|coverage|dist|build|\.cache)(\/|$)/;
const sourcePattern = /(^|\/)(app|src|scripts|prisma|docs|public\/data|public\/books)(\/|$)|(^|\/)(README|CONTRIBUTING|CHANGELOG|package|tsconfig|next\.config|middleware|auth|prisma\.config)/i;
const textExtensions = new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.md','.txt','.css','.scss','.html','.xml','.yml','.yaml','.toml','.sql','.prisma','.sh','.ps1','.csv']);
const imageExtensions = new Set(['.png','.jpg','.jpeg','.webp','.avif','.gif']);
const hashEligible = (p) => !dependencyPattern.test(p) && !buildPattern.test(p) && !p.startsWith('audit/');

const lastChanges = new Map();
try {
  let currentDate = '';
  const history = git('log', '--all', '--format=@@%aI', '--name-only', '--no-renames').split(/\r?\n/);
  for (const line of history) {
    if (line.startsWith('@@')) currentDate = line.slice(2, 12);
    else if (line && currentDate) {
      const p = slash(line);
      if (!lastChanges.has(p)) lastChanges.set(p, currentDate);
    }
  }
} catch {
  // History metadata is useful but not required for the rest of the inventory.
}

const textBodies = [];
for (const file of files) {
  const ext = path.extname(file.path).toLowerCase();
  if (tracked.has(file.path) && textExtensions.has(ext) && file.sizeBytes <= 2_000_000) {
    try {
      textBodies.push({ path: file.path, body: await fs.readFile(file.absolute, 'utf8') });
    } catch {}
  }
}

const tokenCounts = new Map();
for (const { body } of textBodies) {
  const tokens = body.match(/[A-Za-z0-9_@.+-]+(?:\.[A-Za-z0-9_-]+)*/g) ?? [];
  for (const token of tokens) tokenCounts.set(token.toLowerCase(), (tokenCounts.get(token.toLowerCase()) ?? 0) + 1);
}

const hashGroups = new Map();
for (const file of files) {
  if (!hashEligible(file.path)) continue;
  try {
    const digest = createHash('sha256').update(await fs.readFile(file.absolute)).digest('hex');
    file.sha256 = digest;
    const key = `${file.sizeBytes}:${digest}`;
    const group = hashGroups.get(key) ?? [];
    group.push(file.path);
    hashGroups.set(key, group);
  } catch {}
}

const duplicateGroups = [...hashGroups.entries()]
  .filter(([, paths]) => paths.length > 1)
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
  .map(([key, paths], index) => ({ id: `DUP-${String(index + 1).padStart(4, '0')}`, key, paths }));
const duplicateByPath = new Map();
for (const group of duplicateGroups) for (const p of group.paths) duplicateByPath.set(p, group.id);

const imageFingerprints = [];
if (sharp) {
  for (const file of files) {
    const ext = path.extname(file.path).toLowerCase();
    if (!imageExtensions.has(ext) || !hashEligible(file.path) || file.sizeBytes > 30_000_000) continue;
    try {
      const instance = sharp(file.absolute, { animated: false });
      const metadata = await instance.metadata();
      const raw = await instance.clone().resize(16, 16, { fit: 'fill' }).greyscale().raw().toBuffer();
      const average = raw.reduce((sum, value) => sum + value, 0) / raw.length;
      let bits = '';
      for (const value of raw) bits += value >= average ? '1' : '0';
      imageFingerprints.push({ path: file.path, width: metadata.width ?? 0, height: metadata.height ?? 0, bits });
    } catch {}
  }
}

const hamming = (a, b) => {
  let distance = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) if (a[i] !== b[i]) distance += 1;
  return distance + Math.abs(a.length - b.length);
};
const nearPairs = [];
for (let i = 0; i < imageFingerprints.length; i += 1) {
  for (let j = i + 1; j < imageFingerprints.length; j += 1) {
    const a = imageFingerprints[i];
    const b = imageFingerprints[j];
    if (duplicateByPath.get(a.path) && duplicateByPath.get(a.path) === duplicateByPath.get(b.path)) continue;
    const ratioA = a.height ? a.width / a.height : 0;
    const ratioB = b.height ? b.width / b.height : 0;
    if (Math.abs(ratioA - ratioB) > 0.03) continue;
    const distance = hamming(a.bits, b.bits);
    if (distance <= 10) nearPairs.push({ a: a.path, b: b.path, distance, dimensionsA: `${a.width}x${a.height}`, dimensionsB: `${b.width}x${b.height}` });
  }
}

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = (headers, rows) => [headers.map(csvCell).join(','), ...rows.map((row) => headers.map((h) => csvCell(row[h])).join(','))].join('\r\n') + '\r\n';

const inventoryRows = files.sort((a, b) => a.path.localeCompare(b.path)).map((file) => {
  const ext = path.extname(file.path).toLowerCase() || '[none]';
  const isTracked = tracked.has(file.path);
  const isIgnored = ignored.has(file.path) || dependencyPattern.test(file.path) || buildPattern.test(file.path);
  const generated = generatedPattern.test(file.path);
  const basename = path.basename(file.path).toLowerCase();
  const referenceCount = isTracked ? Math.max(0, (tokenCounts.get(basename) ?? 0) - 1) : 0;
  const conventionReferenced = /(^|\/)(page|layout|route|loading|error|not-found|default|template|manifest|robots|sitemap)\.(ts|tsx|js|jsx)$/.test(file.path);
  const referenced = conventionReferenced ? 'yes-convention' : referenceCount > 0 ? 'yes' : isTracked ? 'not-found' : 'not-scanned';
  let sourceOfTruth = 'no';
  if (isTracked && !generated && sourcePattern.test(file.path)) sourceOfTruth = 'likely';
  if (/public\/data\/(SYNTHOMA-MANIFEST\.txt|styl\.md|oblouk\.md|efekty\.md)$/.test(file.path)) sourceOfTruth = 'declared-content-guidance';
  if (/contentRegistry|books\/manifest\.json|prisma\/schema\.prisma|package-lock\.json/.test(file.path)) sourceOfTruth = 'authoritative-candidate';
  let recommendation = 'keep';
  let confidence = 'medium';
  let notes = '';
  if (dependencyPattern.test(file.path)) { recommendation = 'A: regenerable dependency install'; confidence = 'high'; notes = 'Ignored local dependency artifact.'; }
  else if (buildPattern.test(file.path) || /tsconfig\.tsbuildinfo$/.test(file.path)) { recommendation = 'A: regenerable build/cache artifact'; confidence = 'high'; notes = 'Do not commit; safe to recreate through normal commands.'; }
  else if (duplicateByPath.has(file.path)) { recommendation = 'B: exact duplicate; review ownership before deletion'; confidence = 'high'; notes = duplicateByPath.get(file.path); }
  else if (isTracked && referenced === 'not-found' && !sourcePattern.test(file.path)) { recommendation = 'C: inspect for dead/unreferenced use'; confidence = 'low'; notes = 'Lexical reference scan found no consumer; convention or runtime lookup may still apply.'; }
  else if (sourceOfTruth !== 'no') { recommendation = 'D: retain as active/source-of-truth candidate'; confidence = 'medium'; }
  else if (isTracked) { recommendation = 'D: retain unless a focused ownership audit proves it obsolete'; confidence = 'medium'; notes = 'Tracked project file with no high-confidence deletion evidence.'; }
  return {
    path: file.path,
    extension: ext,
    sizeBytes: file.sizeBytes,
    tracked: isTracked,
    ignored: isIgnored,
    generated,
    sourceOfTruth,
    referenced,
    referenceCount,
    exactDuplicateGroup: duplicateByPath.get(file.path) ?? '',
    suspectedNearDuplicate: nearPairs.some((pair) => pair.a === file.path || pair.b === file.path),
    lastGitChange: lastChanges.get(file.path) ?? '',
    recommendation,
    confidence,
    notes,
  };
});

const headers = ['path','extension','sizeBytes','tracked','ignored','generated','sourceOfTruth','referenced','referenceCount','exactDuplicateGroup','suspectedNearDuplicate','lastGitChange','recommendation','confidence','notes'];
await fs.writeFile(path.join(outDir, '03-file-inventory.csv'), csv(headers, inventoryRows));

const duplicateRows = duplicateGroups.flatMap((group) => group.paths.map((p) => ({
  group: group.id,
  sha256: group.key.split(':').slice(1).join(':'),
  sizeBytes: group.key.split(':')[0],
  count: group.paths.length,
  path: p,
})));
await fs.writeFile(path.join(outDir, '05-exact-duplicates.csv'), csv(['group','sha256','sizeBytes','count','path'], duplicateRows));

const deletionRows = inventoryRows.filter((row) => /^[A-D]:/.test(row.recommendation));
const deletionAuditRows = deletionRows.map((row) => {
  const category = row.recommendation.slice(0, 1);
  return {
    ...row,
    category,
    possibleDynamicReference: row.referenced === 'not-found' && row.tracked ? 'yes; convention/runtime lookup not excluded' : 'no evidence',
    regenerable: category === 'A' ? 'yes' : row.generated ? 'likely; verify generator' : 'no/unknown',
    restoreMethod: category === 'A' ? 'reinstall dependencies or rerun the documented build/generator' : row.tracked ? 'git restore from the audited commit' : 'restore from local backup/recreate source artifact',
    deletionRisk: category === 'A' ? 'low after stopping running processes' : category === 'B' ? 'medium until canonical owner and references are confirmed' : category === 'C' ? 'medium/high; author decision required' : 'high; retain',
  };
});
const deletionHeaders = [...headers, 'category', 'possibleDynamicReference', 'regenerable', 'restoreMethod', 'deletionRisk'];
await fs.writeFile(path.join(outDir, '04-deletion-candidates.csv'), csv(deletionHeaders, deletionAuditRows));
await fs.writeFile(path.join(outDir, 'near-duplicate-data.json'), JSON.stringify({ sharpAvailable: Boolean(sharp), imageCount: imageFingerprints.length, pairs: nearPairs }, null, 2));

const byExtension = new Map();
const byTop = new Map();
let totalBytes = 0;
for (const file of files) {
  totalBytes += file.sizeBytes;
  const ext = path.extname(file.path).toLowerCase() || '[none]';
  const extData = byExtension.get(ext) ?? { count: 0, bytes: 0 };
  extData.count += 1; extData.bytes += file.sizeBytes; byExtension.set(ext, extData);
  const top = file.path.split('/')[0];
  const topData = byTop.get(top) ?? { count: 0, bytes: 0 };
  topData.count += 1; topData.bytes += file.sizeBytes; byTop.set(top, topData);
}
const summary = {
  generatedAt: new Date().toISOString(),
  root,
  files: files.length,
  tracked: inventoryRows.filter((row) => row.tracked).length,
  ignored: inventoryRows.filter((row) => row.ignored).length,
  generated: inventoryRows.filter((row) => row.generated).length,
  totalBytes,
  duplicateGroups: duplicateGroups.length,
  duplicateFiles: duplicateRows.length,
  nearDuplicatePairs: nearPairs.length,
  sharpAvailable: Boolean(sharp),
  byExtension: Object.fromEntries([...byExtension.entries()].sort((a,b) => b[1].bytes - a[1].bytes)),
  byTop: Object.fromEntries([...byTop.entries()].sort((a,b) => b[1].bytes - a[1].bytes)),
  largestFiles: files.slice().sort((a,b) => b.sizeBytes - a.sizeBytes).slice(0, 100).map(({ path: p, sizeBytes }) => ({ path: p, sizeBytes })),
};
await fs.writeFile(path.join(outDir, 'inventory-summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ files: summary.files, tracked: summary.tracked, ignored: summary.ignored, totalBytes: summary.totalBytes, duplicateGroups: summary.duplicateGroups, nearDuplicatePairs: summary.nearDuplicatePairs, sharpAvailable: summary.sharpAvailable }, null, 2));
