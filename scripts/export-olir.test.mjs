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
  assert.equal(RELATIONSHIP_OUT['subset-of'], 'subset of');
  assert.equal(RELATIONSHIP_OUT['not-related-to'], 'not related to');
});

test('every stored enum value has an export mapping', () => {
  const stored = ['equal', 'subset-of', 'superset-of', 'intersects-with', 'not-related-to'];
  for (const v of stored) {
    assert.ok(RELATIONSHIP_OUT[v], `no OLIR spelling for stored value "${v}"`);
  }
});
