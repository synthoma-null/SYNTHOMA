import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.join(dir, '09-route-matrix.csv');
const text = await fs.readFile(matrixPath, 'utf8');

function parseCsv(input) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quoted && ch === '"' && input[i + 1] === '"') { value += '"'; i += 1; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(value); value = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && input[i + 1] === '\n') i += 1;
      row.push(value); value = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else value += ch;
  }
  const [headers, ...body] = rows;
  return { headers, rows: body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))) };
}

function materialize(route) {
  let value = route;
  value = value.replace('/api/auth/[...nextauth]', '/api/auth/session');
  value = value.replaceAll('[locale]', 'cs');
  value = value.replaceAll('[chapterId]', '0-0-null');
  value = value.replaceAll('[contentType]', 'chapter');
  value = value.replaceAll('[contentId]', '0-0-null');
  value = value.replaceAll('[sessionId]', 'audit-invalid-session');
  value = value.replaceAll('[token]', 'audit-invalid-token');
  value = value.replaceAll('[provider]', 'credentials');
  if (value.includes('/chapter/[id]')) value = value.replace('[id]', '0-0-null');
  else if (value.includes('/cards/[id]')) value = value.replace('[id]', 't-ai');
  else value = value.replaceAll('[id]', 'audit-invalid-id');
  value = value.replace(/\[\.\.\.[^\]]+\]/g, 'audit-path');
  return value.includes('[') ? null : value;
}

const parsed = parseCsv(text);
const results = [];
for (const row of parsed.rows) {
  const methods = row.Methods || '';
  if (!(methods.includes('GET') || methods.includes('PAGE'))) {
    results.push({ route: row.Route, target: '', status: 'SKIP', reason: 'no GET/PAGE method' });
    continue;
  }
  const target = materialize(row.Route);
  if (!target) {
    results.push({ route: row.Route, target: '', status: 'SKIP', reason: 'unresolved dynamic segment' });
    continue;
  }
  try {
    const response = await fetch(`http://127.0.0.1:3210${target}`, { redirect: 'manual', headers: { 'user-agent': 'SYNTHOMA-forensic-audit/1.0' } });
    results.push({ route: row.Route, target, status: response.status, contentType: response.headers.get('content-type') ?? '', location: response.headers.get('location') ?? '' });
    if (row.HTTP === 'not sampled') row.HTTP = String(response.status);
    row.Anonymous = /^2|^3|^404|^401|^403|^409/.test(String(response.status)) ? `sampled: ${response.status}` : `FAIL: ${response.status}`;
    row.Network = `GET ${target}: ${response.status}`;
  } catch (error) {
    results.push({ route: row.Route, target, status: 'ERROR', reason: String(error) });
    row.Network = `ERROR: ${String(error)}`;
  }
}

const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
await fs.writeFile(matrixPath, `${parsed.headers.map(quote).join(',')}\n${parsed.rows.map((row) => parsed.headers.map((header) => quote(row[header])).join(',')).join('\n')}\n`, 'utf8');
await fs.writeFile(path.join(dir, 'all-route-runtime-data.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2), 'utf8');
const checked = results.filter((item) => typeof item.status === 'number');
console.log(JSON.stringify({ checked: checked.length, skipped: results.length - checked.length, statusCounts: Object.fromEntries([...new Set(checked.map((item) => item.status))].sort().map((status) => [status, checked.filter((item) => item.status === status).length])), failures: checked.filter((item) => item.status >= 500) }, null, 2));
