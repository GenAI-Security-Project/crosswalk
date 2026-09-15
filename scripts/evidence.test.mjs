/**
 * evidence.test.mjs — the counting rules behind `evidence_count` (T-STRAT03).
 *
 * An evidence count is only worth publishing if it cannot be inflated: by a
 * draft nobody reviewed, by a control failing in an unrelated incident, or by
 * one incident recorded twice. Each rule gets a fixture that would break it.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { deriveEvidence, evidenceForMapping, indexFailures, isConfirmed, readEntries, readIncidents } =
  require(path.join(ROOT, 'scripts', 'evidence.js'));

const BASIS = 'The source states plainly that the control was not in place.';

const failure = (control_id, confirmed_by = [], framework = 'FW') =>
  ({ framework, control_id, outcome: 'absent', basis: BASIS, confirmed_by });

const entries = [
  { id: 'R01', mappings: [{ framework: 'FW', control_id: 'C1' }, { framework: 'FW', control_id: 'C2' }] },
  { id: 'R02', mappings: [{ framework: 'FW', control_id: 'C1' }] },
];

test('a draft is reported but never counted', () => {
  const idx = indexFailures([{ id: 'INC-001', owasp_entries: ['R01'], control_failures: [failure('C1')] }]);
  const ev = evidenceForMapping(idx, 'R01', 'FW', 'C1');
  assert.equal(ev.evidence_count, 0);
  assert.deepEqual(ev.drafted, ['INC-001']);
  assert.deepEqual(ev.confirmed, []);
});

test('confirmation needs a named human, not an empty or blank list', () => {
  assert.equal(isConfirmed(failure('C1', [])), false);
  assert.equal(isConfirmed(failure('C1', ['  '])), false);
  assert.equal(isConfirmed({ framework: 'FW', control_id: 'C1' }), false);
  assert.equal(isConfirmed(failure('C1', ['reviewer'])), true);
});

test('a failure only supports mappings for the entries its incident exemplifies', () => {
  const idx = indexFailures([
    { id: 'INC-001', owasp_entries: ['R01'], control_failures: [failure('C1', ['reviewer'])] },
  ]);
  assert.equal(evidenceForMapping(idx, 'R01', 'FW', 'C1').evidence_count, 1);
  // R02 also maps C1, but INC-001 is not an R02 incident.
  assert.equal(evidenceForMapping(idx, 'R02', 'FW', 'C1').evidence_count, 0);
});

test('framework and control must both match', () => {
  const idx = indexFailures([
    { id: 'INC-001', owasp_entries: ['R01'], control_failures: [failure('C1', ['reviewer'], 'OTHER')] },
  ]);
  assert.equal(evidenceForMapping(idx, 'R01', 'FW', 'C1').evidence_count, 0);
});

test('one incident naming a control twice is one piece of evidence', () => {
  const idx = indexFailures([
    { id: 'INC-001', owasp_entries: ['R01'], control_failures: [failure('C1', ['a']), failure('C1', ['b'])] },
  ]);
  assert.equal(evidenceForMapping(idx, 'R01', 'FW', 'C1').evidence_count, 1);
});

test('a confirmed record outranks a draft for the same incident and control', () => {
  const idx = indexFailures([
    { id: 'INC-001', owasp_entries: ['R01'], control_failures: [failure('C1'), failure('C1', ['reviewer'])] },
  ]);
  const ev = evidenceForMapping(idx, 'R01', 'FW', 'C1');
  assert.deepEqual([ev.confirmed, ev.drafted], [['INC-001'], []]);
});

test('a failure no mapping absorbs is an orphan, and adds no count', () => {
  const { orphans, rows, summary } = deriveEvidence(entries, [
    { id: 'INC-002', owasp_entries: ['R02'], control_failures: [failure('C2', ['reviewer'])] },
  ]);
  assert.deepEqual(orphans, [{ incident: 'INC-002', framework: 'FW', control_id: 'C2', entries: ['R02'] }]);
  assert.equal(rows.length, 0);
  assert.equal(summary.mappings_with_confirmed_evidence, 0);
});

test('summary counts reconcile with the corpus', () => {
  const { summary, rows, failedControls } = deriveEvidence(entries, [
    { id: 'INC-001', owasp_entries: ['R01', 'R02'], control_failures: [failure('C1', ['reviewer']), failure('C2')] },
    { id: 'INC-002', owasp_entries: ['R02'], control_failures: [] },
  ]);
  assert.equal(summary.incidents_annotated, 1);
  assert.equal(summary.control_failures, 2);
  assert.equal(summary.confirmed + summary.drafted, summary.control_failures);
  // C1 confirmed on R01 and R02; C2 drafted on R01.
  assert.equal(summary.mappings_with_confirmed_evidence, 2);
  assert.equal(summary.mappings_with_drafted_evidence_only, 1);
  assert.equal(rows.length, 3);
  assert.equal(failedControls[0].control_id, 'C1', 'confirmed failures sort first');
});

test('the real corpus: every row count is backed by a confirmed failure it can name', () => {
  const { rows, summary } = deriveEvidence(readEntries(ROOT), readIncidents(ROOT));
  for (const r of rows) {
    assert.equal(r.evidence_count, r.confirmed.length, `${r.entry} ${r.framework} ${r.control_id}`);
  }
  const counted = rows.reduce((n, r) => n + r.evidence_count, 0);
  assert.ok(summary.confirmed > 0 || counted === 0, 'evidence counted with no confirmed failure in the corpus');
});
