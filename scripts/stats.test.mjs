/**
 * stats.test.mjs — invariants for the numbers every headline claim is built on.
 *
 * README badges, the webapp, and the compliance reports all render from
 * data/stats.json. A wrong number here is a wrong number everywhere, and it
 * looks authoritative because it was generated.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { computeStats } = require(path.join(ROOT, 'scripts', 'stats.js'));

const stats = computeStats();

test('every count is a finite non-negative integer', () => {
  const walk = (o, at) => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'number') {
        assert.ok(Number.isInteger(v) && v >= 0, `${at}.${k} is ${v}`);
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        walk(v, `${at}.${k}`);
      }
    }
  };
  walk(stats, 'stats');
});

test('per-source-list entry counts sum to the total', () => {
  const sum = Object.values(stats.entries.by_list).reduce((a, b) => a + b, 0);
  assert.equal(sum, stats.entries.total);
});

test('per-source-list mapping counts sum to the total', () => {
  const sum = Object.values(stats.mappings.by_list).reduce((a, b) => a + b, 0);
  assert.equal(sum, stats.mappings.total);
});

test('per-source-list mapping files sum to the total', () => {
  const sum = Object.values(stats.mapping_files.by_list).reduce((a, b) => a + b, 0);
  assert.equal(sum, stats.mapping_files.total);
});

test('frameworks mapped never exceeds registries present', () => {
  // These two numbers are deliberately separate and were conflated for a long
  // time. `mapped` counts frameworks some entry actually maps a control to;
  // `registries` counts inventories on disk. mapped > registries would mean a
  // mapping names a framework with no registry behind it.
  assert.ok(
    stats.frameworks.mapped <= stats.frameworks.registries,
    `${stats.frameworks.mapped} mapped > ${stats.frameworks.registries} registries`,
  );
});

test('unmapped registries and mapped frameworks account for every registry', () => {
  assert.equal(
    stats.frameworks.mapped + stats.frameworks.unmapped_registries.length,
    stats.frameworks.registries,
  );
});

test('draft_only names only frameworks that are actually mapped', () => {
  const entriesDir = path.join(ROOT, 'data', 'entries');
  const mapped = new Set();
  for (const f of fs.readdirSync(entriesDir).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(entriesDir, f), 'utf8'));
    for (const m of e.mappings || []) mapped.add(m.framework);
  }
  for (const f of stats.frameworks.draft_only) {
    assert.ok(mapped.has(f), `draft_only names "${f}", which no entry maps`);
  }
});

test('draft rows never exceed total mappings', () => {
  assert.ok(
    stats.frameworks.draft_rows <= stats.mappings.total,
    `${stats.frameworks.draft_rows} draft rows > ${stats.mappings.total} mappings`,
  );
});

test('a draft_only framework really has no authored row', () => {
  // The claim the README renders is "these frameworks carry candidate DRAFT
  // rows only". If one of them has an authored row, the caveat understates the
  // project and the reader is misled in the safe direction — still wrong.
  const entriesDir = path.join(ROOT, 'data', 'entries');
  const authored = {};
  for (const f of fs.readdirSync(entriesDir).filter((n) => n.endsWith('.json'))) {
    const e = JSON.parse(fs.readFileSync(path.join(entriesDir, f), 'utf8'));
    for (const m of e.mappings || []) {
      if (!/^DRAFT\b/.test(m.notes || '')) authored[m.framework] = (authored[m.framework] || 0) + 1;
    }
  }
  for (const f of stats.frameworks.draft_only) {
    assert.equal(authored[f], undefined, `"${f}" is listed draft-only but has authored rows`);
  }
});

test('stats.json on disk matches a fresh computation', () => {
  // stats:check enforces this in CI too; having it here means `node --test`
  // alone catches a hand-edited stats.json.
  const onDisk = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'stats.json'), 'utf8'));
  assert.deepEqual(onDisk, stats);
});

test('source list count matches the ids and labels it publishes', () => {
  assert.equal(stats.source_lists.count, stats.source_lists.ids.length);
  assert.equal(stats.source_lists.count, stats.source_lists.labels.length);
});
