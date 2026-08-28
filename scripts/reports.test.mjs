/**
 * reports.test.mjs — the report generators, exercised through their CLIs.
 *
 * compliance-report.js, incidents-report.js and state-report.js are scripts,
 * not modules: they parse argv and write files. Testing them through the CLI
 * checks what people and CI actually run, and needs no refactor to get there.
 *
 * Everything here uses --stdout, so no test writes into reports/.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(script, args) {
  return execFileSync(process.execPath, [path.join(ROOT, 'scripts', script), ...args], {
    cwd: ROOT,
    maxBuffer: 256 * 1024 * 1024,
    encoding: 'utf8',
  });
}

const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'incidents.json'), 'utf8'));
const stats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'stats.json'), 'utf8'));

/** Minimal RFC 4180 row splitter — enough to check quoting is honoured. */
function csvRows(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

// ── state-report.js ──────────────────────────────────────────────────────────

test('state-report --json agrees with data/stats.json', () => {
  // Two independent counters over the same data. When they disagree, one of
  // them is being used to publish a number that is not true.
  const r = JSON.parse(run('state-report.js', ['--json']));
  assert.equal(r.totals.incidents, stats.incidents.total);
  assert.equal(r.totals.entries, stats.entries.total);
  assert.equal(r.totals.mappings, stats.mappings.total);
  assert.equal(r.totals.frameworks, stats.frameworks.registries);
});

test('state-report incident breakdowns sum to the incident total', () => {
  const r = JSON.parse(run('state-report.js', ['--json']));
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  assert.equal(sum(r.incidents.by_category), r.totals.incidents);
  assert.equal(sum(r.incidents.by_severity), r.totals.incidents);
});

// ── incidents-report.js ──────────────────────────────────────────────────────

test('incidents CSV has one data row per incident and a stable header', () => {
  const rows = csvRows(run('incidents-report.js', ['--format', 'csv', '--stdout']));
  assert.ok(rows.length > 1, 'CSV has no data rows');
  assert.equal(rows[0][0].toLowerCase(), 'id', `unexpected first column: ${rows[0][0]}`);
  assert.equal(rows.length - 1, db.incidents.length);
});

test('incidents CSV survives the commas and quotes in real descriptions', () => {
  // Incident text is full of commas, quoted phrases and em dashes. An unquoted
  // field shifts every later column and the file still opens in Excel, wrong.
  const text = run('incidents-report.js', ['--format', 'csv', '--stdout']);
  const rows = csvRows(text);
  const width = rows[0].length;
  const ragged = rows.map((r, i) => [i, r.length]).filter(([, n]) => n !== width);
  assert.deepEqual(ragged.slice(0, 3), [], `${ragged.length} row(s) have the wrong column count`);
});

test('incidents --entry filters to incidents that name that entry', () => {
  const out = JSON.parse(run('incidents-report.js', ['--entry', 'LLM01', '--format', 'json', '--stdout']));
  const list = Array.isArray(out) ? out : out.incidents;
  assert.ok(list.length > 0, 'no incidents returned for LLM01');
  for (const inc of list) {
    assert.ok(inc.owasp_entries.includes('LLM01'), `${inc.id} does not name LLM01`);
  }
});

test('incidents --severity filters to that severity only', () => {
  const out = JSON.parse(run('incidents-report.js', ['--severity', 'Critical', '--format', 'json', '--stdout']));
  const list = Array.isArray(out) ? out : out.incidents;
  assert.ok(list.length > 0);
  for (const inc of list) assert.equal(inc.severity, 'Critical');
});

// ── compliance-report.js ─────────────────────────────────────────────────────

test('compliance --list-frameworks lists every mapped framework', () => {
  const out = run('compliance-report.js', ['--list-frameworks']);
  const entriesDir = path.join(ROOT, 'data', 'entries');
  const mapped = new Set();
  for (const f of fs.readdirSync(entriesDir).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(entriesDir, f), 'utf8'));
    for (const m of e.mappings || []) mapped.add(m.framework);
  }
  const missing = [...mapped].filter((f) => !out.includes(f));
  assert.deepEqual(missing, [], `not listed: ${missing.join(', ')}`);
});

test('compliance JSON summary agrees with the coverage array it ships', () => {
  // The summary block is what the markdown report and the webapp quote. It is
  // computed separately from the per-entry array, so the two can drift.
  const doc = JSON.parse(run('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'json', '--stdout',
  ]));
  const s = doc.summary;
  assert.equal(s.total_entries, doc.coverage.length);
  assert.equal(s.total_entries, stats.entries.total, 'report covers a different entry set than stats.json');
  assert.equal(s.covered_entries, doc.coverage.filter((e) => e.mapped).length);
  assert.equal(s.uncovered_entries, doc.coverage.filter((e) => !e.mapped).length);
  assert.equal(s.covered_entries + s.uncovered_entries, s.total_entries);
  assert.equal(s.unique_controls, doc.controls.length);
});

test('compliance coverage_rate is the rate it claims to be', () => {
  const doc = JSON.parse(run('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'json', '--stdout',
  ]));
  const s = doc.summary;
  const expected = Math.round((s.covered_entries / s.total_entries) * 1000) / 10;
  assert.equal(s.coverage_rate, expected);
});

test('compliance --severity narrows the report rather than widening it', () => {
  const all = JSON.parse(run('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'json', '--stdout',
  ]));
  const crit = JSON.parse(run('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--severity', 'Critical', '--format', 'json', '--stdout',
  ]));
  assert.ok(crit.coverage.length > 0, 'severity filter returned nothing at all');
  assert.ok(crit.coverage.length <= all.coverage.length,
    'a severity filter returned more entries than no filter');
  for (const e of crit.coverage) assert.equal(e.severity, 'Critical');
});

test('an unknown framework fails loudly instead of emitting an empty report', () => {
  assert.throws(
    () => run('compliance-report.js', ['--framework', 'Not A Real Framework', '--format', 'json', '--stdout']),
    'a typo in --framework should not produce a clean empty report',
  );
});
