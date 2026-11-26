/**
 * The MITRE ATLAS row check (#93, #99): every ATLAS mapping row must cite an
 * id the registry holds, under the registry's name for it.
 *
 * Fixtures are in-memory; the last test only reads the shipped registry and
 * entries. Nothing here writes a tracked data file, so it is safe under
 * `node --test`'s parallel suites.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { checkAtlasRows, normaliseName, isDraftRow } = require('./atlas-rows.js');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const registry = {
  version: '2099.01',
  controls: [
    { control_id: 'AML.T0051', title: 'LLM Prompt Injection', kind: 'technique' },
    { control_id: 'AML.T0051.000', title: 'LLM Prompt Injection: Direct', kind: 'technique' },
    { control_id: 'AML.T0040', title: "AI Model's Inference API Access", kind: 'technique' },
    { control_id: 'AML.T0057', title: 'LLM Data Leakage', kind: 'technique', source_status: 'absent-from-atlas-2099.01' },
  ],
};

const row = (control_id, control_name, notes = '') => ({ framework: 'MITRE ATLAS', control_id, control_name, notes });
const run = (mappings) => checkAtlasRows(registry, [{ id: 'X01', mappings }]);

test('a row naming its id exactly as the registry does passes', () => {
  const r = run([row('AML.T0051', 'LLM Prompt Injection'), row('AML.T0051.000', 'LLM Prompt Injection: Direct')]);
  assert.equal(r.rows, 2);
  assert.deepEqual(r.violations, []);
});

test('case, whitespace and typographic quotes are the only differences forgiven', () => {
  assert.deepEqual(run([row('AML.T0051', '  llm   prompt\tINJECTION ')]).violations, []);
  assert.deepEqual(run([row('AML.T0040', 'AI Model’s Inference API Access')]).violations, []);
  assert.equal(normaliseName('“A”'), normaliseName('"a"'));
  // Punctuation, the legacy "ML" spelling and the bare half of a sub-technique
  // name are all different names.
  for (const name of ['LLM Prompt-Injection', 'ML Prompt Injection', 'Direct']) {
    const id = name === 'Direct' ? 'AML.T0051.000' : 'AML.T0051';
    const [v] = run([row(id, name)]).violations;
    assert.equal(v?.kind, 'name-mismatch', `"${name}" was accepted for ${id}`);
  }
});

test('a name that belongs to a different id is a mismatch, and says what the registry calls the id', () => {
  const [v] = run([row('AML.T0040', 'LLM Prompt Injection')]).violations;
  assert.equal(v.kind, 'name-mismatch');
  assert.equal(v.registry_title, "AI Model's Inference API Access");
  assert.equal(v.entry, 'X01');
  assert.equal(v.draft, false);
});

test('an id the registry does not hold is unknown; one it holds only with a source_status is not in the release', () => {
  const r = run([row('AML.T9999', 'Anything'), row('AML.T0057', 'LLM Data Leakage')]);
  assert.deepEqual(r.violations.map((v) => v.kind), ['unknown-id', 'not-in-release']);
  assert.equal(r.violations[1].source_status, 'absent-from-atlas-2099.01');
});

test('the #108 DRAFT marker in the notes flags a row as awaiting review', () => {
  const notes = 'Something — **DRAFT — not an ATLAS technique name; retarget pending SME review (#93)**';
  assert.equal(isDraftRow({ notes }), true);
  assert.equal(isDraftRow({ notes: 'Drafting a reply' }), false);
  const [v] = run([row('AML.T0040', 'Output Manipulation', notes)]).violations;
  assert.equal(v.draft, true);
});

test('rows for other frameworks are ignored', () => {
  const r = checkAtlasRows(registry, [{ id: 'X01', mappings: [{ framework: 'CWE/CVE', control_id: 'AML.T9999', control_name: 'x' }] }]);
  assert.equal(r.rows, 0);
  assert.deepEqual(r.violations, []);
});

test('validate.js wires the check in and fails only on non-DRAFT unknown ids and name mismatches', () => {
  const src = readFileSync(path.join(ROOT, 'scripts', 'validate.js'), 'utf8');
  assert.match(src, /require\('\.\/atlas-rows\.js'\)/);
  assert.match(src, /checkAtlasMappings\(\);/);
  assert.match(src, /!x\.draft && x\.kind !== 'not-in-release'/);
});

test('the shipped rows: no non-DRAFT row cites an unknown id or a name other than the registry name', () => {
  // Reads tracked files; never writes them.
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'data', 'frameworks', 'mitre-atlas.json'), 'utf8'));
  const { readdirSync } = require('node:fs');
  const dir = path.join(ROOT, 'data', 'entries');
  const entries = readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(path.join(dir, f), 'utf8')));
  const hard = checkAtlasRows(reg, entries).violations.filter((v) => !v.draft && v.kind !== 'not-in-release');
  assert.deepEqual(hard.map((v) => `${v.entry} ${v.control_id} ${v.control_name}`), []);
});
