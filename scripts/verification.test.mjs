/**
 * verification.test.mjs — the rules behind data/verification-methods.json and
 * data/verification-links/ (issue #191).
 *
 * Each rule gets a fixture that breaks it. The schemas are also compiled with
 * Ajv and run against the same fixtures, so the JSON Schema and the hand-written
 * checks in scripts/verification.js cannot drift apart on the rules both express.
 */

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { checkVerification } = require(path.join(ROOT, 'scripts', 'verification.js'));

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const METHODS_SCHEMA = readJson('data/verification-methods-schema.json');
const LINKS_SCHEMA = readJson('data/verification-links-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validMethodsDoc = ajv.compile(METHODS_SCHEMA);
const validLinksDoc = ajv.compile(LINKS_SCHEMA);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const method = (over = {}) => ({
  id: 'VM-0001',
  name: 'Injection test across ingestion paths',
  method_type: 'test',
  procedure: 'Submit a maintained injection payload set through each ingestion path.',
  expected_result: 'No payload alters the agent goal; all attempts are logged.',
  source: null,
  status: 'draft',
  reviewed_by: [],
  ...over,
});

const source = (over = {}) => ({
  name: 'Example Catalogue',
  version: '1.0',
  id: 'C02',
  url: 'https://example.org/catalogue',
  license: 'CC-BY-SA-4.0',
  text: 'Injection test executed through each ingestion path.',
  ...over,
});

const link = (over = {}) => ({
  method_id: 'VM-0001',
  control_id: 'C1',
  entry_id: null,
  reviewed_by: [],
  ...over,
});

// Every throwaway repository is deleted when the tests finish.
const tempRoots = [];
after(() => { for (const r of tempRoots) fs.rmSync(r, { recursive: true, force: true }); });

/**
 * A throwaway repository: the real schemas, one framework registry (`fw`, name
 * "FW") with controls C1 and C2, and one entry ASI01 mapping FW:C1. The ASI01 row
 * is reviewed unless `rowReviewed` is false. `methods: null` writes no methods file.
 */
function repo({ methods = [method()], links, linkFiles, rowReviewed = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'verif-'));
  tempRoots.push(root);
  const w = (p, obj) => {
    fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.writeFileSync(path.join(root, p), typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
  };
  w('data/verification-methods-schema.json', METHODS_SCHEMA);
  w('data/verification-links-schema.json', LINKS_SCHEMA);
  w('data/frameworks/fw.json', {
    id: 'fw', name: 'FW', controls: [{ control_id: 'C1' }, { control_id: 'C2' }],
  });
  w('data/entries/ASI01.json', {
    id: 'ASI01',
    mappings: [{ framework: 'FW', control_id: 'C1', reviewed_by: rowReviewed ? ['A. Reviewer'] : [] }],
  });
  if (methods !== null) w('data/verification-methods.json', { version: '1.0', methods });
  if (links !== undefined) w('data/verification-links/fw.json', { version: '1.0', framework: 'fw', links });
  for (const [name, doc] of Object.entries(linkFiles || {})) w(`data/verification-links/${name}`, doc);
  return root;
}

const run = (opts) => checkVerification(repo(opts));
const errorsMatch = (r, re) => r.errors.some((e) => re.test(e.msg));
const warningsMatch = (r, re) => r.warnings.some((e) => re.test(e.msg));

// ─── The repository's own data ────────────────────────────────────────────────

test('the repository verification data is valid', () => {
  const r = checkVerification(ROOT);
  assert.deepEqual(r.errors, []);
  assert.ok(validMethodsDoc(readJson('data/verification-methods.json')), JSON.stringify(validMethodsDoc.errors));
  const dir = path.join(ROOT, 'data', 'verification-links');
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.json')) : []) {
    assert.ok(validLinksDoc(readJson(`data/verification-links/${f}`)), `${f}: ${JSON.stringify(validLinksDoc.errors)}`);
  }
});

test('the links schema entry_id pattern matches the entry id pattern in data/schema.json', () => {
  const entryPattern = readJson('data/schema.json').properties.id.pattern;
  assert.equal(LINKS_SCHEMA.definitions.Link.properties.entry_id.oneOf[1].pattern, entryPattern);
});

test('no verification files at all is not an error', () => {
  const r = run({ methods: null });
  assert.deepEqual(r.errors, []);
  assert.equal(r.counts.methods, 0);
});

// ─── Methods: structure ───────────────────────────────────────────────────────

test('a complete method passes, with and without optional fields', () => {
  const full = method({
    source: source(),
    frequency: { mode: 'event_driven' },
    evidence: 'Test report with per-path results.',
    review_date: '2026-10-06',
  });
  const r = run({ methods: [full, method({ id: 'VM-0002' })] });
  assert.deepEqual(r.errors, []);
  assert.equal(r.counts.methods, 2);
  assert.ok(validMethodsDoc({ version: '1.0', methods: [full] }), JSON.stringify(validMethodsDoc.errors));
});

const methodCases = [
  ['a missing required field', { ...method(), procedure: undefined }, /missing required field "procedure"/],
  ['an undeclared field', method({ severity: 'high' }), /unknown field "severity"/],
  ['an id outside VM-NNNN', method({ id: 'VM-12' }), /does not match/],
  ['a name over 80 characters', method({ name: 'x'.repeat(81) }), /max 80/],
  ['an unknown method_type', method({ method_type: 'observe' }), /method_type "observe"/],
  ['an unknown status', method({ status: 'approved' }), /status "approved"/],
  ['reviewed with no reviewer', method({ status: 'reviewed', reviewed_by: [] }), /reviewed_by is empty/],
  ['a blank reviewer name', method({ reviewed_by: ['  '] }), /list of names/],
  ['deprecated with no note', method({ status: 'deprecated' }), /requires status_note/],
  ['a malformed review_date', method({ review_date: '06/10/2026' }), /YYYY-MM-DD/],
  ['a review_date that is not a calendar day', method({ review_date: '2026-13-45' }), /calendar date/],
  ['proprietary source text', method({ source: source({ license: 'Proprietary (AIUC)' }) }), /does not allow reproduction/],
  ['all-rights-reserved source text', method({ source: source({ license: 'All rights reserved' }) }), /does not allow reproduction/],
  ['an unknown frequency mode', method({ frequency: { mode: 'weekly' } }), /frequency.mode "weekly"/],
  ['an undeclared frequency field', method({ frequency: { mode: 'periodic', interval: 'P3M' } }), /unknown field "interval"/],
  ['a source missing its url', method({ source: { ...source(), url: undefined } }), /missing required field "url"/],
  ['a source url that is not http(s)', method({ source: source({ url: 'ftp://x' }) }), /http/],
];

for (const [what, m, re] of methodCases) {
  test(`a method with ${what} fails — validator and schema agree`, () => {
    const clean = JSON.parse(JSON.stringify(m)); // drops undefined keys
    const r = run({ methods: [clean] });
    assert.ok(errorsMatch(r, re), `expected ${re}, got ${JSON.stringify(r.errors)}`);
    assert.equal(validMethodsDoc({ version: '1.0', methods: [clean] }), false, 'schema should reject it too');
  });
}

const topLevelCases = [
  ['methods', 'a numeric version', { version: 1, methods: [] }, /version must be a non-empty string/],
  ['methods', 'an empty version', { version: '', methods: [] }, /version must be a non-empty string/],
  ['methods', 'a non-string description', { version: '1.0', description: 5, methods: [] }, /description must be a string/],
  ['links', 'a numeric version', { version: 1, framework: 'fw', links: [] }, /version must be a non-empty string/],
  ['links', 'an empty version', { version: '', framework: 'fw', links: [] }, /version must be a non-empty string/],
];

for (const [kind, what, doc, re] of topLevelCases) {
  test(`a ${kind} file with ${what} fails — validator and schema agree`, () => {
    const r = kind === 'methods'
      ? checkVerification(withMethodsDoc(doc))
      : run({ linkFiles: { 'fw.json': doc } });
    assert.ok(errorsMatch(r, re), `expected ${re}, got ${JSON.stringify(r.errors)}`);
    assert.equal((kind === 'methods' ? validMethodsDoc : validLinksDoc)(doc), false, 'schema should reject it too');
  });
}

/** A throwaway repository whose methods file is `doc` verbatim. */
function withMethodsDoc(doc) {
  const root = repo();
  fs.writeFileSync(path.join(root, 'data/verification-methods.json'), JSON.stringify(doc));
  return root;
}

test('method ids are unique', () => {
  const r = run({ methods: [method(), method({ name: 'Another' })] });
  assert.ok(errorsMatch(r, /VM-0001 is used more than once/));
});

// ─── Methods: source ──────────────────────────────────────────────────────────

test('source text is optional and not tied to a licence list', () => {
  // Whether a licence allows reproducing text is checked in review, not here —
  // except a licence that plainly forbids it (see the proprietary cases above).
  for (const m of [
    method({ source: source({ license: 'CC-BY-SA-4.0' }) }),
    method({ source: source({ license: 'Proprietary', text: undefined }) }),
    method({ source: source({ license: 'Some-Other-Licence-2.0' }) }),
  ]) {
    const clean = JSON.parse(JSON.stringify(m));
    assert.deepEqual(run({ methods: [clean] }).errors, [], clean.source.license);
    assert.ok(validMethodsDoc({ version: '1.0', methods: [clean] }), JSON.stringify(validMethodsDoc.errors));
  }
});

// ─── Links ────────────────────────────────────────────────────────────────────

test('a control-level and a row-level link pass', () => {
  const r = run({ links: [link(), link({ entry_id: 'ASI01' })] });
  assert.deepEqual(r.errors, []);
  assert.equal(r.counts.links, 2);
  assert.ok(validLinksDoc({ version: '1.0', framework: 'fw', links: [link(), link({ entry_id: 'ASI01' })] }));
});

test('the file name must be the registry id it declares', () => {
  const r = run({ linkFiles: { 'other.json': { version: '1.0', framework: 'fw', links: [] } } });
  assert.ok(errorsMatch(r, /does not match the file name "other"/));
});

test('the framework must have a registry', () => {
  const r = run({ linkFiles: { 'nope.json': { version: '1.0', framework: 'nope', links: [] } } });
  assert.ok(errorsMatch(r, /no registry data\/frameworks\/nope.json/));
});

test('a link must name an existing method', () => {
  const r = run({ links: [link({ method_id: 'VM-0099' })] });
  assert.ok(errorsMatch(r, /method VM-0099 is not in/));
});

test('a link must name a control in the registry', () => {
  const r = run({ links: [link({ control_id: 'C9' })] });
  assert.ok(errorsMatch(r, /control C9 is not in data\/frameworks\/fw.json/));
});

test('a row-level link needs a mapping row, matched through the registry name', () => {
  assert.ok(errorsMatch(run({ links: [link({ control_id: 'C2', entry_id: 'ASI01' })] }), /no mapping row for ASI01 × FW C2/));
  assert.ok(errorsMatch(run({ links: [link({ entry_id: 'ASI02' })] }), /no mapping row for ASI02/));
});

test('entry_id is null or an entry id', () => {
  const r = run({ links: [link({ entry_id: 'ASI1' })] });
  assert.ok(errorsMatch(r, /entry_id must be null or an entry id/));
  assert.equal(validLinksDoc({ version: '1.0', framework: 'fw', links: [link({ entry_id: 'ASI1' })] }), false);
});

test('a link has exactly the declared fields', () => {
  const r = run({ links: [{ ...link(), framework: 'fw' }] });
  assert.ok(errorsMatch(r, /unknown field "framework"/));
  assert.equal(validLinksDoc({ version: '1.0', framework: 'fw', links: [{ ...link(), framework: 'fw' }] }), false);
});

test('duplicate links are rejected', () => {
  const r = run({ links: [link(), link()] });
  assert.ok(errorsMatch(r, /duplicate link/));
});

test('links must be sorted: control_id, then control-level before row-level, then method_id', () => {
  const methods = [method(), method({ id: 'VM-0002' })];
  const sorted = [link(), link({ method_id: 'VM-0002' }), link({ entry_id: 'ASI01' }), link({ control_id: 'C2' })];
  assert.deepEqual(run({ methods, links: sorted }).errors, []);
  assert.ok(errorsMatch(run({ methods, links: [link({ control_id: 'C2' }), link()] }), /not sorted at links\[1\]/));
  assert.ok(errorsMatch(run({ methods, links: [link({ entry_id: 'ASI01' }), link()] }), /not sorted/));
  assert.ok(errorsMatch(run({ methods, links: [link({ method_id: 'VM-0002' }), link()] }), /not sorted/));
});

// ─── Review states must not overstate each other ──────────────────────────────

test('a reviewed link on a draft method is a warning, not an error', () => {
  const r = run({ links: [link({ reviewed_by: ['A. Reviewer'] })] });
  assert.deepEqual(r.errors, []);
  assert.ok(warningsMatch(r, /link is reviewed but method VM-0001 is still draft/));
});

test('a reviewed row-level link on an unreviewed mapping row is a warning', () => {
  const methods = [method({ status: 'reviewed', reviewed_by: ['A. Reviewer'] })];
  const reviewedLink = link({ entry_id: 'ASI01', reviewed_by: ['B. Reviewer'] });
  const r = run({ methods, links: [reviewedLink], rowReviewed: false });
  assert.deepEqual(r.errors, []);
  assert.ok(warningsMatch(r, /mapping row ASI01 × C1 is unreviewed/));
  assert.deepEqual(run({ methods, links: [reviewedLink], rowReviewed: true }).warnings, []);
});

test('draft links raise no review warnings', () => {
  const r = run({ links: [link({ entry_id: 'ASI01' })], rowReviewed: false });
  assert.deepEqual(r.warnings, []);
});

test('a link to a deprecated method is a warning, not an error', () => {
  const methods = [method({ status: 'deprecated', status_note: 'Replaced by VM-0002' })];
  const r = run({ methods, links: [link()] });
  assert.deepEqual(r.errors, []);
  assert.ok(warningsMatch(r, /VM-0001 is deprecated/));
});
