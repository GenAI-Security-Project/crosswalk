/**
 * generate.test.mjs — the generator must be deterministic, and its output must
 * be the thing that is committed.
 *
 * generate.js produces every file in data/entries/ and the three webapp data
 * bundles. It once sat broken on main for several commits with all CI green,
 * because no job ran it. CI now does; this covers the properties CI's
 * `git diff --exit-code` cannot express on its own.
 *
 * These tests re-run the generator. Its output is deterministic, so a clean
 * tree stays clean — and if it does not, that is the failure being reported.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES = path.join(ROOT, 'data', 'entries');
const BUNDLES = ['data.js', 'incidents.js', 'backlinks.js', 'frameworks-registry.js']
  .map((f) => path.join(ROOT, 'docs', f));

const runGenerate = () =>
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'generate.js')], {
    cwd: ROOT, maxBuffer: 256 * 1024 * 1024, encoding: 'utf8',
  });

/** Hash every generated artefact, EOL-normalised so Windows checkouts agree. */
function fingerprint() {
  const h = crypto.createHash('sha256');
  const files = fs.readdirSync(ENTRIES).filter((f) => f.endsWith('.json')).sort()
    .map((f) => path.join(ENTRIES, f))
    .concat(BUNDLES.filter((f) => fs.existsSync(f)));
  for (const f of files) {
    h.update(path.basename(f));
    h.update(fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
  }
  return h.digest('hex');
}

test('generating twice produces byte-identical output', () => {
  // Any timestamp, random id or Object key-order dependence in the generator
  // shows up here as a diff on every run — which is how a repository ends up
  // with permanently dirty generated files that everyone learns to ignore.
  runGenerate();
  const first = fingerprint();
  runGenerate();
  assert.equal(fingerprint(), first, 'generate.js is not deterministic');
});

test('committed entries match a fresh generation', () => {
  const before = fingerprint();
  runGenerate();
  assert.equal(fingerprint(), before,
    'data/entries or docs/*.js differ from what generate.js produces — regenerate and commit');
});

test('every entry declares an id, name, source list and severity', () => {
  const files = fs.readdirSync(ENTRIES).filter((f) => f.endsWith('.json'));
  assert.ok(files.length > 0);
  for (const f of files) {
    const e = JSON.parse(fs.readFileSync(path.join(ENTRIES, f), 'utf8'));
    assert.match(e.id, /^(LLM|ASI|DSGAI|AST)\d{2}$/, `${f} has id "${e.id}"`);
    assert.equal(`${e.id}.json`, f, `${f} does not match its own id`);
    assert.ok(e.name && e.name.length > 1, `${f} has no name`);
    assert.ok(e.source_list, `${f} has no source_list`);
    assert.match(e.severity, /^(Critical|High|Medium|Low)$/, `${f} severity "${e.severity}"`);
  }
});

test('no mapping is missing a framework or a control id', () => {
  for (const f of fs.readdirSync(ENTRIES).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(ENTRIES, f), 'utf8'));
    (e.mappings || []).forEach((m, i) => {
      assert.ok(m.framework, `${f} mapping[${i}] has no framework`);
      assert.ok(m.control_id, `${f} mapping[${i}] has no control_id`);
    });
  }
});

test('no mapping claims a confidence without a named reviewer', () => {
  // The single rule the whole schema-v2 migration exists to enforce. It is
  // checked by validate.js too; duplicating it here means `node --test` alone
  // is enough to catch an entry file edited by hand.
  const offenders = [];
  for (const f of fs.readdirSync(ENTRIES).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(ENTRIES, f), 'utf8'));
    for (const m of e.mappings || []) {
      if (m.confidence && m.confidence !== 'unreviewed' && !(m.reviewed_by || []).length) {
        offenders.push(`${e.id}/${m.framework}:${m.control_id}`);
      }
    }
  }
  assert.deepEqual(offenders.slice(0, 5), [], `${offenders.length} unreviewed row(s) claim confidence`);
});

test('DRAFT never survives into a stored enum field', () => {
  // The Markdown templates carry the literal word DRAFT in the relationship,
  // rationale and confidence columns. generate.js is supposed to resolve those
  // to `unreviewed` rather than store them, so a stored "DRAFT" means the
  // template leaked into the data layer.
  const leaked = [];
  for (const f of fs.readdirSync(ENTRIES).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(ENTRIES, f), 'utf8'));
    for (const m of e.mappings || []) {
      for (const k of ['relationship', 'rationale_type', 'confidence']) {
        if (typeof m[k] === 'string' && /^draft$/i.test(m[k].trim())) {
          leaked.push(`${e.id}/${m.framework}:${m.control_id}.${k}`);
        }
      }
    }
  }
  assert.deepEqual(leaked.slice(0, 5), [], `${leaked.length} field(s) stored the literal "DRAFT"`);
});

test('webapp bundles carry no build timestamp', () => {
  // docs/ is served straight from main and CI diffs these files against a
  // fresh generation. A `// Generated: <date>` header made that diff fail on
  // every day but the one the bundle was committed — so the header must
  // describe the data, never the run.
  for (const f of BUNDLES.filter((b) => fs.existsSync(b))) {
    const header = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.startsWith('//'));
    for (const line of header) {
      assert.doesNotMatch(line, /Generated:/i, `${path.basename(f)} header names a run: ${line}`);
      assert.doesNotMatch(line, /\d{4}-\d{2}-\d{2}/, `${path.basename(f)} header carries a date: ${line}`);
    }
  }
});

test('webapp bundles stay in step with the entry files', () => {
  const src = fs.readFileSync(path.join(ROOT, 'docs', 'data.js'), 'utf8');
  const start = src.indexOf('[');
  const end = src.lastIndexOf(']');
  const bundled = JSON.parse(src.slice(start, end + 1));
  const onDisk = fs.readdirSync(ENTRIES).filter((f) => f.endsWith('.json')).length;
  assert.equal(bundled.length, onDisk, 'docs/data.js and data/entries hold different entry counts');
});
