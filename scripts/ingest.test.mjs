/**
 * ingest.test.mjs — the framework ingest path, exercised through its CLI.
 *
 * ingest-framework.mjs is how a new framework registry enters the project. It
 * is the one script whose job is to accept outside data, so the property that
 * matters is that it rejects: a malformed source must fail loudly rather than
 * land a half-formed registry in data/frameworks/.
 *
 * Every test uses --validate, so nothing here writes to data/frameworks/.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'ingest-framework.mjs');

function run(args) {
  return execFileSync(process.execPath, [SCRIPT, ...args], {
    cwd: ROOT, maxBuffer: 32 * 1024 * 1024, encoding: 'utf8',
  });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crosswalk-ingest-'));
const write = (name, body) => {
  const p = path.join(tmp, name);
  fs.writeFileSync(p, body, 'utf8');
  return p;
};

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const VALID = {
  id: 'test-framework',
  name: 'Test Framework',
  short_name: 'TF',
  version: '1.0',
  url: 'https://example.org/test-framework',
  license: 'CC BY 4.0',
  publisher: 'Test Publisher',
  category: 'ai-governance',
  last_synced: '2026-08-28',
  source_sha: null,
  controls: [
    { control_id: 'TF-1', title: 'First control', description: 'Does a thing', kind: 'control' },
    { control_id: 'TF-2', title: 'Second control', description: 'Does another', kind: 'control' },
  ],
};

test('--list names every framework already registered', () => {
  const out = run(['--list']);
  const names = fs.readdirSync(path.join(ROOT, 'data', 'frameworks'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'frameworks', f), 'utf8')));
  const missing = names.filter((r) => !out.includes(r.id) && !out.includes(r.name));
  assert.deepEqual(missing.map((r) => r.id), [], 'registered frameworks missing from --list');
});

test('a well-formed JSON source validates', () => {
  const p = write('valid.json', JSON.stringify(VALID, null, 2));
  const out = run([p, '--validate']);
  assert.match(out, /valid|ok|pass/i, `unexpected output:\n${out}`);
});

test('a source with no controls is rejected', () => {
  const p = write('empty.json', JSON.stringify({ ...VALID, controls: [] }, null, 2));
  assert.throws(() => run([p, '--validate']), 'an empty control set was accepted');
});

test('a source missing a required top-level field is rejected', () => {
  const { name, ...noName } = VALID;
  const p = write('no-name.json', JSON.stringify(noName, null, 2));
  assert.throws(() => run([p, '--validate']), 'a registry with no name was accepted');
});

test('a control with no control_id is rejected', () => {
  const p = write('bad-control.json', JSON.stringify({
    ...VALID,
    controls: [{ title: 'Nameless', description: 'x', kind: 'control' }],
  }, null, 2));
  assert.throws(() => run([p, '--validate']), 'a control with no id was accepted');
});

test('a CSV source is parsed into controls', () => {
  const p = write('tf.csv', [
    'control_id,title,description,parent,function',
    'TF-1,First control,Does a thing,,Govern',
    'TF-2,"Second, with a comma","Description, quoted",TF-1,Govern',
  ].join('\n'));
  const out = run([p, '--validate']);
  assert.match(out, /valid|ok|pass|2/i, `unexpected output:\n${out}`);
});

test('a non-existent source fails instead of writing an empty registry', () => {
  assert.throws(() => run([path.join(tmp, 'does-not-exist.json'), '--validate']));
});

test('--validate leaves data/frameworks untouched', () => {
  const dir = path.join(ROOT, 'data', 'frameworks');
  const before = fs.readdirSync(dir).sort().join(',');
  const p = write('valid2.json', JSON.stringify(VALID, null, 2));
  try { run([p, '--validate']); } catch { /* the assertion below is the point */ }
  assert.equal(fs.readdirSync(dir).sort().join(','), before, '--validate wrote to data/frameworks');
});
