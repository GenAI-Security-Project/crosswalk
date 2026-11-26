/**
 * T-AIBOM01 — the AIBOM index (data/exports/aibom-index.json) and the
 * applicability profiles (data/aibom-applicability.json).
 *
 * Guards what an AIBOM tool relies on: the shape, that the committed file is
 * current, that review status is never upgraded, that licence-restricted
 * control text is never shipped, and that every link resolves. Builds in
 * memory or into a temp dir only — tests run in parallel, and none may write
 * a tracked file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { build, render, run, reviewStatus, OPEN_LICENSES, OUT_REL } = require('./export-aibom-index.js');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const schema = (name) =>
  ajv.compile(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'schemas', name), 'utf8')));
const report = (v) => (v.errors || []).slice(0, 10).map((e) => `${e.instancePath || '/'} ${e.message}`).join('\n');

const index = build(ROOT);

test('the index matches its schema', () => {
  const validate = schema('aibom-index.schema.json');
  assert.ok(validate(index), report(validate));
});

test('the committed index is current and the build is deterministic', () => {
  const committed = fs.readFileSync(path.join(ROOT, OUT_REL), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(render(build(ROOT)), committed, `run \`node scripts/export-aibom-index.js\``);
  assert.equal(render(build(ROOT)), render(build(ROOT)));
  assert.equal(run({ root: ROOT, check: true }), false);
});

test('review status is derived, never upgraded', () => {
  assert.equal(reviewStatus({ reviewed_by: ['A. Reviewer'], notes: 'DRAFT — x' }), 'reviewed');
  assert.equal(reviewStatus({ reviewed_by: [], notes: 'DRAFT — SME review required' }), 'draft');
  assert.equal(reviewStatus({ reviewed_by: [], notes: 'Applies to … **DRAFT — pending SME review (#93)**' }), 'draft');
  assert.equal(reviewStatus({ reviewed_by: [], notes: 'Some authored note' }), 'unreviewed');
  assert.equal(reviewStatus({}), 'unreviewed');
  for (const l of index.links) {
    if (l.review_status === 'reviewed') assert.ok(l.reviewed_by.length, `${l.entry} ${l.control_id}`);
    else assert.equal(l.reviewed_by.length, 0, `${l.entry} ${l.control_id}`);
  }
});

test('the counts in meta agree with the arrays', () => {
  const c = index.meta.counts;
  assert.equal(c.entries, index.entries.length);
  assert.equal(c.frameworks, index.frameworks.length);
  assert.equal(c.controls, index.controls.length);
  assert.equal(c.links, index.links.length);
  const sum = c.links_by_review_status.reviewed + c.links_by_review_status.unreviewed + c.links_by_review_status.draft;
  assert.equal(sum, index.links.length);
});

test('licence-restricted registries ship no control text', () => {
  const fw = new Map(index.frameworks.map((f) => [f.id, f]));
  for (const f of index.frameworks) assert.equal(f.redistributable, OPEN_LICENSES.has(f.license), f.id);
  for (const ctl of index.controls) {
    if (!fw.get(ctl.framework_id).redistributable) {
      assert.equal(ctl.title, undefined, `${ctl.framework_id} ${ctl.control_id} title`);
      assert.equal(ctl.description, undefined, `${ctl.framework_id} ${ctl.control_id} description`);
    }
  }
  // The restricted set is not empty: the check above is not vacuous.
  assert.ok(index.frameworks.some((f) => !f.redistributable));
});

test('every link resolves to an entry, a framework and a cited control', () => {
  const entries = new Set(index.entries.map((e) => e.id));
  const frameworks = new Set(index.frameworks.map((f) => f.id));
  const controls = new Set(index.controls.map((c) => `${c.framework_id}\u0000${c.control_id}`));
  for (const l of index.links) {
    assert.ok(entries.has(l.entry), l.entry);
    assert.ok(frameworks.has(l.framework_id), l.framework_id);
    assert.ok(controls.has(`${l.framework_id}\u0000${l.control_id}`), `${l.framework_id} ${l.control_id}`);
  }
  assert.deepEqual(index.meta.unresolved_frameworks, []);
});

test('a temp-copy build reflects a newly reviewed row', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aibom-index-'));
  try {
    fs.cpSync(path.join(ROOT, 'data', 'frameworks'), path.join(tmp, 'data', 'frameworks'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'data', 'entries'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(tmp, 'package.json'));
    const llm01 = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entries', 'LLM01.json'), 'utf8'));
    const row = llm01.mappings.find((m) => !(m.reviewed_by || []).length);
    row.reviewed_by = ['A. Reviewer'];
    fs.writeFileSync(path.join(tmp, 'data', 'entries', 'LLM01.json'), JSON.stringify(llm01));
    const t = build(tmp);
    const link = t.links.find((l) => l.control_id === row.control_id && l.reviewed_by.includes('A. Reviewer'));
    assert.ok(link);
    assert.equal(link.review_status, 'reviewed');
    assert.equal(t.entries.length, 1);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('the applicability profiles match their schema and stay DRAFT-labelled until reviewed', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'aibom-applicability.json'), 'utf8'));
  const validate = schema('aibom-applicability.schema.json');
  assert.ok(validate(doc), report(validate));
  const lists = new Set(index.source_lists.map((s) => s.id));
  for (const p of doc.profiles) for (const s of p.source_lists) assert.ok(lists.has(s), `${p.id}: ${s}`);
  const fws = new Set(index.frameworks.map((f) => f.id));
  for (const id of doc.default_frameworks.framework_ids) assert.ok(fws.has(id), id);
  // Only llm applies without the user saying so.
  for (const p of doc.profiles) if (p.id !== 'llm') assert.deepEqual(p.default_for_tasks, [], p.id);
});
