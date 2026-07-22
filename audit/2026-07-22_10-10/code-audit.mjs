import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = 'C:/SYNTHOMA';
const web = path.join(root, 'apps/web');
const out = path.join(root, 'audit/2026-07-22_10-10');
const requireFromWeb = createRequire(path.join(web, 'package.json'));
const ts = requireFromWeb('typescript');
const postcss = requireFromWeb('postcss');
const slash = (value) => value.replaceAll('\\', '/');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const tracked = git('ls-files', '-z').split('\0').filter(Boolean).map(slash);
const codeExtensions = new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs']);
const productionCode = tracked.filter((p) => p.startsWith('apps/web/') && codeExtensions.has(path.extname(p)) && !/(^|\/)(__tests__|tests?)(\/|$)|\.(test|spec)\./.test(p) && !p.includes('/synthoma_cyklus_cards_patch_v17/'));
const allCode = tracked.filter((p) => p.startsWith('apps/web/') && codeExtensions.has(path.extname(p)));

const sourceByPath = new Map();
for (const p of allCode) {
  try { sourceByPath.set(p, await fs.readFile(path.join(root, p), 'utf8')); } catch {}
}

const productionSet = new Set(productionCode);
function resolveImport(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = slash(path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier)));
  const candidates = [base, ...['.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.css'].map((ext) => `${base}${ext}`), ...['.ts','.tsx','.js','.jsx','.mjs','.cjs'].map((ext) => `${base}/index${ext}`)];
  return candidates.find((candidate) => tracked.includes(candidate)) ?? null;
}

function packageName(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) return null;
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

const importsByFile = new Map();
const inbound = new Map(productionCode.map((p) => [p, []]));
const externalUsage = new Map();
for (const p of productionCode) {
  const source = sourceByPath.get(p) ?? '';
  const sf = ts.createSourceFile(p, source, ts.ScriptTarget.Latest, true, p.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const imports = [];
  const visit = (node) => {
    let specifier = null;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) specifier = node.moduleSpecifier.text;
    if (ts.isCallExpression(node) && node.arguments.length && ts.isStringLiteral(node.arguments[0])) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require')) specifier = node.arguments[0].text;
    }
    if (specifier) {
      const resolved = resolveImport(p, specifier);
      const pkg = packageName(specifier);
      imports.push({ specifier, resolved, package: pkg });
      if (resolved && productionSet.has(resolved)) inbound.get(resolved)?.push(p);
      if (pkg) externalUsage.set(pkg, (externalUsage.get(pkg) ?? 0) + 1);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  importsByFile.set(p, imports);
}

const entryPattern = /apps\/web\/(app\/(page|layout|route|error|loading|not-found|default|template|manifest|robots|sitemap|opengraph-image)\.(ts|tsx|js|jsx)$|app\/.*\/(page|layout|route|error|loading|not-found|default|template|opengraph-image)\.(ts|tsx|js|jsx)$|scripts\/|middleware\.|next\.config|prisma\.config|auth\.)/;
const orphanCandidates = productionCode
  .filter((p) => (inbound.get(p)?.length ?? 0) === 0 && !entryPattern.test(p))
  .map((p) => ({ path: p, lines: (sourceByPath.get(p)?.split(/\r?\n/).length ?? 0), caveat: 'No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.' }));

const graph = new Map(productionCode.map((p) => [p, (importsByFile.get(p) ?? []).map((item) => item.resolved).filter((item) => item && productionSet.has(item))]));
const cycles = [];
const visiting = new Set();
const visited = new Set();
function dfs(node, stack) {
  if (visiting.has(node)) {
    const index = stack.indexOf(node);
    const cycle = [...stack.slice(index), node];
    const key = [...new Set(cycle)].sort().join('|');
    if (!cycles.some((item) => item.key === key)) cycles.push({ key, cycle });
    return;
  }
  if (visited.has(node)) return;
  visiting.add(node);
  for (const next of graph.get(node) ?? []) dfs(next, [...stack, node]);
  visiting.delete(node);
  visited.add(node);
}
for (const p of productionCode) dfs(p, []);

const packageJson = JSON.parse(await fs.readFile(path.join(web, 'package.json'), 'utf8'));
const declaredPackages = { ...packageJson.dependencies, ...packageJson.devDependencies };
const packageAudit = Object.entries(declaredPackages).map(([name, version]) => ({ name, version, importCount: externalUsage.get(name) ?? 0, recommendation: externalUsage.has(name) ? 'keep/review runtime role' : 'verify unused before removal' }));

function routeFromFile(p) {
  const relative = p.replace(/^apps\/web\/app\/?/, '');
  const segments = relative.split('/');
  segments.pop();
  return '/' + segments.filter((segment) => !/^\(.+\)$/.test(segment)).join('/');
}
const routeRows = [];
for (const p of tracked.filter((item) => /^apps\/web\/app\/.+\/(page|route)\.(ts|tsx|js|jsx)$|^apps\/web\/app\/(page|route)\.(ts|tsx|js|jsx)$/.test(item))) {
  const source = sourceByPath.get(p) ?? await fs.readFile(path.join(root, p), 'utf8');
  const isHandler = /\/route\./.test(p);
  const methods = isHandler ? [...source.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/g)].map((m) => m[1]).join('|') || 'UNKNOWN' : 'PAGE';
  const route = routeFromFile(p) || '/';
  const auth = /\bauth\s*\(|requireAdmin|session\?\.user|Unauthorized|status:\s*401|status:\s*403/.test(source) ? 'guard-or-session-detected' : route.startsWith('/api/me') || route.startsWith('/api/admin') ? 'expected; inspect' : 'public-or-unspecified';
  const dynamic = source.match(/export const dynamic\s*=\s*['"]([^'"]+)/)?.[1] ?? '';
  const revalidate = source.match(/export const revalidate\s*=\s*([^;\n]+)/)?.[1]?.trim() ?? '';
  routeRows.push({ route, kind: isHandler ? 'route-handler' : 'page', methods, auth, dynamic, revalidate, source: p, liveStatus: '', notes: '' });
}

const cssFiles = tracked.filter((p) => p.endsWith('.css'));
const nonCssCorpus = tracked.filter((p) => !p.endsWith('.css') && /\.(ts|tsx|js|jsx|mjs|cjs|html|md|json)$/.test(p)).map((p) => sourceByPath.get(p) ?? '').join('\n');
const cssStats = [];
const selectorRecords = [];
const classDefinitions = new Map();
const variableDefinitions = new Map();
const variableUses = new Map();
let importantTotal = 0;
for (const p of cssFiles) {
  const source = await fs.readFile(path.join(root, p), 'utf8');
  let rootNode;
  try { rootNode = postcss.parse(source, { from: p }); } catch (error) {
    cssStats.push({ path: p, bytes: Buffer.byteLength(source), lines: source.split(/\r?\n/).length, parseError: String(error) });
    continue;
  }
  let rules = 0, declarations = 0, important = 0, mediaQueries = 0, keyframes = 0;
  rootNode.walkRules((rule) => {
    rules += 1;
    const props = [];
    rule.walkDecls((decl) => {
      declarations += 1;
      if (decl.important) { important += 1; importantTotal += 1; }
      props.push({ property: decl.prop, value: decl.value, important: decl.important, line: decl.source?.start?.line ?? 0 });
      if (decl.prop.startsWith('--')) {
        const defs = variableDefinitions.get(decl.prop) ?? [];
        defs.push({ path: p, line: decl.source?.start?.line ?? 0, value: decl.value });
        variableDefinitions.set(decl.prop, defs);
      }
      for (const match of decl.value.matchAll(/var\((--[\w-]+)/g)) variableUses.set(match[1], (variableUses.get(match[1]) ?? 0) + 1);
    });
    for (const selector of rule.selectors ?? [rule.selector]) {
      const normalized = selector.replace(/\s+/g, ' ').trim();
      selectorRecords.push({ selector: normalized, path: p, line: rule.source?.start?.line ?? 0, declarations: props });
      for (const match of normalized.matchAll(/\.([A-Za-z_][\w-]*)/g)) {
        const defs = classDefinitions.get(match[1]) ?? [];
        defs.push({ path: p, line: rule.source?.start?.line ?? 0, selector: normalized });
        classDefinitions.set(match[1], defs);
      }
    }
  });
  rootNode.walkAtRules((at) => { if (at.name === 'media' || at.name === 'container') mediaQueries += 1; if (at.name.includes('keyframes')) keyframes += 1; });
  cssStats.push({ path: p, bytes: Buffer.byteLength(source), lines: source.split(/\r?\n/).length, rules, declarations, important, mediaQueries, keyframes, parseError: '' });
}

const selectorsByName = new Map();
for (const record of selectorRecords) {
  const items = selectorsByName.get(record.selector) ?? [];
  items.push(record);
  selectorsByName.set(record.selector, items);
}
const duplicateSelectors = [...selectorsByName.entries()].filter(([, records]) => records.length > 1).map(([selector, records]) => ({ selector, occurrences: records.length, locations: records.map(({ path: p, line }) => `${p}:${line}`) })).sort((a,b) => b.occurrences - a.occurrences);
const conflicts = [];
for (const [selector, records] of selectorsByName) {
  const valuesByProperty = new Map();
  for (const record of records) for (const decl of record.declarations) {
    const values = valuesByProperty.get(decl.property) ?? new Map();
    const locations = values.get(decl.value) ?? [];
    locations.push(`${record.path}:${decl.line}`);
    values.set(decl.value, locations);
    valuesByProperty.set(decl.property, values);
  }
  for (const [property, values] of valuesByProperty) if (values.size > 1) conflicts.push({ selector, property, values: Object.fromEntries(values) });
}
const unusedClasses = [...classDefinitions.entries()].filter(([name]) => !new RegExp(`(?:class(?:Name)?\\s*=|[\"'\\s.])${name}(?:[\"'\\s:]|$)`).test(nonCssCorpus)).map(([name, locations]) => ({ name, locations, caveat: 'No static literal consumer; dynamic composition and chapter HTML runtime may still apply.' }));
const unusedVariables = [...variableDefinitions.entries()].filter(([name]) => !variableUses.has(name)).map(([name, definitions]) => ({ name, definitions }));
const undefinedVariables = [...variableUses.entries()].filter(([name]) => !variableDefinitions.has(name)).map(([name, uses]) => ({ name, uses }));

const inlineStyles = [];
for (const p of tracked.filter((item) => /\.(tsx|jsx|html)$/.test(item))) {
  const source = sourceByPath.get(p) ?? await fs.readFile(path.join(root, p), 'utf8');
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/\bstyle\s*=/.test(line)) inlineStyles.push({ path: p, line: index + 1, dynamic: /var\(--|transform|translate|rotate|scale|progress|opacity|height|width/.test(line), excerpt: line.trim().slice(0, 220) });
  });
}

const literalLinks = [];
for (const p of tracked.filter((item) => /\.(ts|tsx|js|jsx|html|md)$/.test(item))) {
  const source = sourceByPath.get(p) ?? await fs.readFile(path.join(root, p), 'utf8');
  for (const match of source.matchAll(/(?:href\s*=\s*["']|href:\s*["']|url\s*:\s*["'])(\/[^"'#?}]*)/g)) literalLinks.push({ path: p, target: match[1], line: source.slice(0, match.index).split('\n').length });
}

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const routeHeaders = ['route','kind','methods','auth','dynamic','revalidate','source','liveStatus','notes'];
await fs.writeFile(path.join(out, '09-route-matrix.csv'), [routeHeaders.map(csvCell).join(','), ...routeRows.sort((a,b) => a.route.localeCompare(b.route)).map((row) => routeHeaders.map((h) => csvCell(row[h])).join(','))].join('\r\n') + '\r\n');
await fs.writeFile(path.join(out, 'code-audit-data.json'), JSON.stringify({ productionFiles: productionCode.length, cycles: cycles.map((item) => item.cycle), orphanCandidates, packageAudit, externalUsage: Object.fromEntries([...externalUsage.entries()].sort()), largestModules: productionCode.map((p) => ({ path: p, lines: (sourceByPath.get(p) ?? '').split(/\r?\n/).length })).sort((a,b) => b.lines - a.lines).slice(0, 100), literalLinks }, null, 2));
await fs.writeFile(path.join(out, 'css-audit-data.json'), JSON.stringify({ cssFiles: cssStats.length, importantTotal, stats: cssStats.sort((a,b) => b.bytes - a.bytes), duplicateSelectors, conflicts, unusedClasses, variables: { defined: variableDefinitions.size, used: variableUses.size, unusedDefinitions: unusedVariables, undefinedUses: undefinedVariables }, inlineStyles }, null, 2));
console.log(JSON.stringify({ productionFiles: productionCode.length, cycles: cycles.length, orphanCandidates: orphanCandidates.length, routes: routeRows.length, cssFiles: cssStats.length, duplicateSelectors: duplicateSelectors.length, conflicts: conflicts.length, unusedClasses: unusedClasses.length, importantTotal, inlineStyles: inlineStyles.length, literalLinks: literalLinks.length }, null, 2));
