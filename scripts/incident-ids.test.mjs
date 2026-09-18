/**
 * Incident id allocation.
 *
 * INC-132 was allocated twice — by #117 and by #109 — because both read the end
 * of data/incidents.json while the other was open. These cover the guard that
 * now fails on a duplicate, and the helper that hands out a free id.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INCIDENTS = path.join(ROOT, 'data', 'incidents.json');
const run = (script, args = []) =>
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', script), ...args], { cwd: ROOT, encoding: 'utf8' });

test('the committed corpus has no duplicate incident ids', () => {
  const { incidents } = JSON.parse(readFileSync(INCIDENTS, 'utf8'));
  const seen = new Set();
  const duplicates = incidents.map((i) => i.id).filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
  assert.deepEqual(duplicates, [], `duplicate incident ids: ${duplicates.join(', ')}`);
});

// The duplicate case is deliberately NOT tested by mutating data/incidents.json:
// node --test runs suites in parallel, so writing to the shared corpus races the
// other suites reading it. The guard is verified two ways instead — the corpus
// check above, and the wiring check below — and negative-tested by hand when it
// was written (injecting a duplicate made validate.js exit 1 with
// "INC-006 is used by 2 records").
test('the duplicate-id guard is wired into validate.js', () => {
  const src = readFileSync(path.join(ROOT, 'scripts', 'validate.js'), 'utf8');
  assert.match(src, /function checkIncidentIds\(\)/, 'the guard is missing');
  assert.match(src, /^\s*checkIncidentIds\(\);/m, 'the guard is defined but never called');
  assert.match(src, /is used by \$\{n\} records/, 'the guard no longer fails on a duplicate');
});

test('next-incident-id.mjs proposes an unused id', () => {
  const { incidents } = JSON.parse(readFileSync(INCIDENTS, 'utf8'));
  const used = new Set(incidents.map((i) => i.id));
  const next = run('next-incident-id.mjs').trim();

  assert.match(next, /^INC-\d{3}$/);
  assert.ok(!used.has(next), `${next} is already used`);

  const highest = Math.max(...incidents.map((i) => Number(String(i.id).slice(4))).filter(Number.isFinite));
  assert.equal(Number(next.slice(4)), highest + 1);
});

test('--json reports what it based the answer on', () => {
  const out = JSON.parse(run('next-incident-id.mjs', ['--json']));
  assert.match(out.next, /^INC-\d{3}$/);
  assert.match(out.highest_committed, /^INC-\d{3}$/);
  assert.ok(Array.isArray(out.claimed_in_open_prs));
});
