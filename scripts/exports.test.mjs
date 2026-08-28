/**
 * exports.test.mjs — validate the machine-readable exports against schema.
 *
 * The crosswalk emits OSCAL and STIX for other tools to consume. Those
 * consumers fail on a missing member or a malformed id, and until now nothing
 * checked either: the exports were generated, written, and never read back.
 *
 * The schemas in data/schemas/ are deliberate subsets, written and owned here.
 * Passing proves the export has not lost its shape. It does not prove OSCAL or
 * STIX conformance — see data/schemas/README.md for why, and for how to run the
 * upstream validators when that is what you need.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schema = (name) =>
  ajv.compile(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'schemas', name), 'utf8')));

/** Run a repo script and parse its stdout as JSON. */
function emit(script, args) {
  const out = execFileSync(process.execPath, [path.join(ROOT, 'scripts', script), ...args], {
    cwd: ROOT,
    maxBuffer: 256 * 1024 * 1024,
    encoding: 'utf8',
  });
  return JSON.parse(out);
}

const report = (validate) =>
  (validate.errors || [])
    .slice(0, 10)
    .map((e) => `${e.instancePath || '/'} ${e.message}`)
    .join('\n');

// ── OSCAL component definition ───────────────────────────────────────────────

test('OSCAL component definition matches the structural subset', () => {
  const validate = schema('oscal-component-definition.subset.json');
  const doc = emit('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'oscal', '--stdout',
  ]);
  assert.ok(validate(doc), report(validate));
});

test('OSCAL component definition carries at least one implemented requirement', () => {
  const doc = emit('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'oscal', '--stdout',
  ]);
  const impls = doc['component-definition'].components.flatMap(
    (c) => c['control-implementations'] || [],
  );
  const reqs = impls.flatMap((i) => i['implemented-requirements'] || []);
  assert.ok(reqs.length > 0, 'export contains no implemented-requirements — the mapping was dropped');
});

// ── OSCAL catalog ────────────────────────────────────────────────────────────

test('OSCAL catalog matches the structural subset', () => {
  const validate = schema('oscal-catalog.subset.json');
  const doc = emit('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'oscal-catalog', '--stdout',
  ]);
  assert.ok(validate(doc), report(validate));
});

test('OSCAL catalog ids are OSCAL tokens, not raw control strings', () => {
  // The failure this catches: a framework whose control ids start with a digit
  // or contain a space is emitted verbatim and produces a catalog no OSCAL tool
  // will load. It is invisible in the JSON unless something checks.
  const doc = emit('compliance-report.js', [
    '--framework', 'NIST AI RMF 1.0', '--format', 'oscal-catalog', '--stdout',
  ]);
  const ids = [];
  const walk = (c) => {
    ids.push(c.id);
    (c.controls || []).forEach(walk);
  };
  for (const g of doc.catalog.groups || []) {
    ids.push(g.id);
    (g.controls || []).forEach(walk);
  }
  (doc.catalog.controls || []).forEach(walk);

  assert.ok(ids.length > 0, 'catalog has no controls');
  const bad = ids.filter((id) => !/^[A-Za-z_][A-Za-z0-9._~:-]*$/.test(id));
  assert.deepEqual(bad, [], `non-token ids: ${bad.slice(0, 5).join(', ')}`);
});

// ── STIX 2.1 ─────────────────────────────────────────────────────────────────

test('STIX bundle matches the structural subset', () => {
  const validate = schema('stix-bundle.subset.json');
  const doc = emit('incidents-report.js', ['--format', 'stix', '--stdout']);
  assert.ok(validate(doc), report(validate));
});

test('every STIX relationship points at an object in the same bundle', () => {
  // A dangling source_ref or target_ref is accepted by a shape check and
  // rejected by every real STIX consumer, so it needs its own assertion.
  const doc = emit('incidents-report.js', ['--format', 'stix', '--stdout']);
  const ids = new Set(doc.objects.map((o) => o.id));
  const dangling = [];
  for (const o of doc.objects) {
    if (o.type === 'relationship') {
      if (!ids.has(o.source_ref)) dangling.push(`${o.id} source_ref ${o.source_ref}`);
      if (!ids.has(o.target_ref)) dangling.push(`${o.id} target_ref ${o.target_ref}`);
    }
    for (const ref of o.object_refs || []) {
      if (!ids.has(ref)) dangling.push(`${o.id} object_ref ${ref}`);
    }
  }
  assert.deepEqual(dangling.slice(0, 5), [], `${dangling.length} dangling reference(s)`);
});

test('STIX ids are unique across the bundle', () => {
  const doc = emit('incidents-report.js', ['--format', 'stix', '--stdout']);
  const seen = new Set();
  const dupes = [];
  for (const o of doc.objects) {
    if (seen.has(o.id)) dupes.push(o.id);
    seen.add(o.id);
  }
  assert.deepEqual(dupes, [], `duplicate STIX ids: ${dupes.slice(0, 3).join(', ')}`);
});

test('STIX bundle covers every incident in the database', () => {
  const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'incidents.json'), 'utf8'));
  const doc = emit('incidents-report.js', ['--format', 'stix', '--stdout']);
  const reports = doc.objects.filter((o) => o.type === 'report');
  assert.equal(
    reports.length,
    db.incidents.length,
    'incident count and STIX report count disagree — the export is dropping records',
  );
});

// ── regression fence for the swapped control_id / control_name rows ──────────

/**
 * A known, tracked defect: in some mapping files the control identifier and the
 * requirement prose are in the wrong columns, so `control_id` holds a sentence.
 * The OSCAL exports no longer *break* on it — `oscalToken()` coerces the id and
 * preserves the original in a `source-control-id` prop — but the underlying data
 * is still wrong, and a reader following an id back to the framework cannot.
 *
 * This is the count as of 2026-08-28, per framework registry. It is a ceiling,
 * not a target: the test fails if any framework gains prose ids, or if a
 * framework not listed here starts producing them. When the parser is fixed,
 * these numbers come down and this table shrinks with them.
 *
 * Tracked as issue #35.
 */
const PROSE_ID_BASELINE = Object.freeze({
  'AIUC-1': 3,
  'CIS Controls v8.1': 31,
  'CWE/CVE': 25,
  'EU AI Act': 118,
  'ISO/IEC 42001:2023': 3,
  'NIST SP 800-218A': 40,
  'NIST SP 800-82 Rev 3': 29,
  'OWASP AI Testing Guide': 16,
  'OWASP NHI Top 10': 103,
  'PCI DSS v4.0': 40,
  'SOC 2': 168,
});

/** A control id is "prose" when it reads as a sentence rather than an identifier. */
const isProse = (raw) => String(raw).trim().split(/\s+/).length >= 5;

test('prose-shaped control ids do not spread beyond the known set', () => {
  const fwDir = path.join(ROOT, 'data', 'frameworks');
  const registries = fs.readdirSync(fwDir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(fwDir, f), 'utf8')));

  const counted = {};
  for (const reg of registries) {
    // `--framework` is a partial match, so one call can emit several documents.
    const raw = execFileSync(process.execPath, [
      path.join(ROOT, 'scripts', 'compliance-report.js'),
      '--framework', reg.name, '--format', 'oscal-catalog', '--stdout',
    ], { cwd: ROOT, maxBuffer: 256 * 1024 * 1024, encoding: 'utf8' });

    for (const chunk of raw.split(/\n(?=\{\n)/)) {
      const doc = JSON.parse(chunk);
      const name = doc.catalog.metadata.title.replace(/ — Control Catalog$/, '');
      const sources = [];
      const walk = (c) => {
        const p = (c.props || []).find((x) => x.name === 'source-control-id');
        if (p) sources.push(p.value);
        (c.controls || []).forEach(walk);
      };
      for (const g of doc.catalog.groups || []) (g.controls || []).forEach(walk);
      (doc.catalog.controls || []).forEach(walk);

      const n = sources.filter(isProse).length;
      if (n) counted[name] = n;
    }
  }

  const regressions = [];
  for (const [fw, n] of Object.entries(counted)) {
    const allowed = PROSE_ID_BASELINE[fw];
    if (allowed === undefined) regressions.push(`${fw} newly produces ${n} prose id(s)`);
    else if (n > allowed) regressions.push(`${fw}: ${n} prose ids, baseline ${allowed}`);
  }
  assert.deepEqual(regressions, [], regressions.join('; '));
});

test('the prose-id baseline does not silently overstate the problem', () => {
  // The mirror of the test above. If a framework is fixed, its baseline entry
  // must be removed rather than left as dead permission — otherwise the fence
  // slowly stops fencing anything.
  const fwDir = path.join(ROOT, 'data', 'frameworks');
  const names = new Set(
    fs.readdirSync(fwDir).filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(fwDir, f), 'utf8')).name),
  );
  const unknown = Object.keys(PROSE_ID_BASELINE).filter((f) => !names.has(f));
  assert.deepEqual(unknown, [], `baseline names frameworks that no longer exist: ${unknown.join(', ')}`);
});
