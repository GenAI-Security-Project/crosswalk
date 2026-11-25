/**
 * Fixture test for the OLIR projection.
 *
 * Guards the two things that make this an export rather than a rewrite: the
 * column set matches the OLIR template, and the relationship vocabulary maps
 * back to the spec's spelling. If either drifts, a submission would be
 * rejected — and that failure would otherwise only surface at NIST.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLUMNS, RELATIONSHIP_OUT } from './export-olir.mjs';

test('column set matches the OLIR template', () => {
  assert.deepEqual(COLUMNS, [
    'Focal Document Element',
    'Focal Document Element Description',
    'Security Control Baseline',
    'Relationship',
    'Reference Document Element',
    'Reference Document Element Description',
    'Rationale',
    'Strength of Relationship',
    'Comments',
  ]);
});

test('relationship values map to the IR 8278A Rev. 1 spelling', () => {
  // "subset of, intersects with, equal, superset of, or not related to"
  assert.deepEqual(
    Object.values(RELATIONSHIP_OUT).sort(),
    ['equal', 'intersects with', 'not related to', 'subset of', 'superset of'],
  );
  assert.equal(RELATIONSHIP_OUT['not-related-to'], 'not related to');
});

test('directional relationships are restated from the Reference (entry) side', () => {
  // Stored: the control relative to the risk ("subset-of": the control covers
  // part of the risk). OLIR: the Reference Document Element (the entry)
  // compared to the Focal Document Element (the control) — #99 Decision 7.
  assert.equal(RELATIONSHIP_OUT['subset-of'], 'superset of');
  assert.equal(RELATIONSHIP_OUT['superset-of'], 'subset of');
  assert.equal(RELATIONSHIP_OUT['equal'], 'equal');
  assert.equal(RELATIONSHIP_OUT['intersects-with'], 'intersects with');
});

test('every stored enum value has an export mapping', () => {
  const stored = ['equal', 'subset-of', 'superset-of', 'intersects-with', 'not-related-to'];
  for (const v of stored) {
    assert.ok(RELATIONSHIP_OUT[v], `no OLIR spelling for stored value "${v}"`);
  }
});
