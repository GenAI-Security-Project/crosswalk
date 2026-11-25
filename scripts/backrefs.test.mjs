/**
 * backrefs.test.mjs — the generated "Referenced by" blocks (T-FIX02).
 *
 * validate.js warns about one-way links between mapping files; backrefs.js
 * writes the missing direction into a marker-delimited block. The block is
 * only safe to regenerate on every run if it is a fixed point: derived from
 * authored links alone, so a second run changes nothing, and removed when
 * nothing needs it any more.
 *
 * Every fixture is a throwaway tree under the OS temp dir: node --test runs
 * suites in parallel, so nothing here may write to the repository.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { run, applyBlock } = require(path.join(ROOT, 'scripts', 'backrefs.js'));
const crossrefs = require(path.join(ROOT, 'scripts', 'crossrefs.js'));

const doc = (title, body = '') =>
  `# ${title}\n\n${body}\n\n## References\n\n- none\n\n## Changelog\n\n| Version | Date |\n|---|---|\n| 1.0 | 2026-01-01 |\n`;

/** Build a temp tree from { 'llm-top10/LLM_A.md': content, ... }. */
function tree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backrefs-'));
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), content, 'utf8');
  }
  return root;
}
const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const clean = (root) => fs.rmSync(root, { recursive: true, force: true });

/** One-way links as "from -> to", repository-relative, as validate.js sees them. */
function oneWay(root) {
  const files = crossrefs.collectMappingFiles(root);
  const map = crossrefs.buildCrossRefMap(files);
  const rel = (p) => path.relative(root, p).split(path.sep).join('/');
  return crossrefs.findOneWayLinks(root, files, map).map(({ from, to }) => `${rel(from)} -> ${rel(to)}`);
}

test('a one-way link gets a sorted block, placed before the Changelog', () => {
  const root = tree({
    'llm-top10/LLM_A.md': doc('A'),
    'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).'),
    'agentic-top10/Agentic_C.md': doc('C', 'See [A](../llm-top10/LLM_A.md#section).'),
  });
  try {
    assert.deepEqual(oneWay(root).sort(), [
      'agentic-top10/Agentic_C.md -> llm-top10/LLM_A.md',
      'llm-top10/LLM_B.md -> llm-top10/LLM_A.md',
    ]);
    assert.deepEqual(run({ root }), ['llm-top10/LLM_A.md']);

    const a = read(root, 'llm-top10/LLM_A.md');
    const block = a.slice(a.indexOf(crossrefs.BACKREFS_START), a.indexOf(crossrefs.BACKREFS_END));
    assert.match(block, /## Referenced by/);
    // Sorted by repository path: agentic-top10/ before llm-top10/.
    const links = block.match(/^- \[.*$/gm);
    assert.deepEqual(links, [
      '- [Agentic_C.md](../agentic-top10/Agentic_C.md)',
      '- [LLM_B.md](LLM_B.md)',
    ]);
    assert.ok(a.indexOf(crossrefs.BACKREFS_END) < a.indexOf('## Changelog'), 'block precedes Changelog');
    assert.match(a, /- none\n\n<!-- backrefs:start -->/);
    assert.match(a, /<!-- backrefs:end -->\n\n## Changelog/);

    // The files that already link out are untouched, and the warnings are gone.
    assert.equal(read(root, 'llm-top10/LLM_B.md'), doc('B', 'See [A](LLM_A.md).'));
    assert.deepEqual(oneWay(root), []);
  } finally { clean(root); }
});

test('a second run changes nothing', () => {
  const root = tree({
    'llm-top10/LLM_A.md': doc('A'),
    'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).'),
    'dsgai-2026/DSGAI_D.md': doc('D', 'See [B](../llm-top10/LLM_B.md) and [A](../llm-top10/LLM_A.md).'),
  });
  try {
    assert.equal(run({ root }).length, 2);
    const snapshot = ['llm-top10/LLM_A.md', 'llm-top10/LLM_B.md', 'dsgai-2026/DSGAI_D.md']
      .map((f) => read(root, f));
    assert.deepEqual(run({ root }), []);
    assert.deepEqual(run({ root, check: true }), []);
    assert.deepEqual(['llm-top10/LLM_A.md', 'llm-top10/LLM_B.md', 'dsgai-2026/DSGAI_D.md']
      .map((f) => read(root, f)), snapshot);
  } finally { clean(root); }
});

test('links inside a block are not authored links', () => {
  // A's block lists B. If that generated link counted as A linking B, B would
  // in turn get a block listing A — links breeding links on every run.
  const root = tree({
    'llm-top10/LLM_A.md': doc('A'),
    'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).'),
  });
  try {
    run({ root });
    assert.match(read(root, 'llm-top10/LLM_A.md'), /\[LLM_B\.md\]\(LLM_B\.md\)/);
    assert.doesNotMatch(read(root, 'llm-top10/LLM_B.md'), /backrefs:start/);

    // A hand-written, stale block is replaced, not trusted.
    const a = read(root, 'llm-top10/LLM_A.md')
      .replace('- [LLM_B.md](LLM_B.md)', '- [LLM_B.md](LLM_B.md)\n- [Agentic_X.md](../agentic-top10/Agentic_X.md)');
    fs.mkdirSync(path.join(root, 'agentic-top10'));
    fs.writeFileSync(path.join(root, 'agentic-top10', 'Agentic_X.md'), doc('X'), 'utf8');
    fs.writeFileSync(path.join(root, 'llm-top10', 'LLM_A.md'), a, 'utf8');
    assert.deepEqual(run({ root }), ['llm-top10/LLM_A.md']);
    assert.doesNotMatch(read(root, 'llm-top10/LLM_A.md'), /Agentic_X/);
    assert.doesNotMatch(read(root, 'agentic-top10/Agentic_X.md'), /backrefs:start/);
  } finally { clean(root); }
});

test('a block is removed once the link becomes two-way, restoring the file', () => {
  const original = doc('A');
  const root = tree({
    'llm-top10/LLM_A.md': original,
    'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).'),
  });
  try {
    run({ root });
    assert.match(read(root, 'llm-top10/LLM_A.md'), /backrefs:start/);

    // An author links back from A by hand: the generated block is now empty.
    const authored = doc('A', 'Compare [B](LLM_B.md).');
    const withBlock = read(root, 'llm-top10/LLM_A.md').replace('# A\n\n', '# A\n\nCompare [B](LLM_B.md).');
    fs.writeFileSync(path.join(root, 'llm-top10', 'LLM_A.md'), withBlock, 'utf8');
    assert.deepEqual(run({ root }), ['llm-top10/LLM_A.md']);
    assert.equal(read(root, 'llm-top10/LLM_A.md'), authored);

    // And if the referring link goes away, so does the block, byte for byte.
    const root2 = tree({ 'llm-top10/LLM_A.md': original, 'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).') });
    try {
      run({ root: root2 });
      fs.writeFileSync(path.join(root2, 'llm-top10', 'LLM_B.md'), doc('B'), 'utf8');
      assert.deepEqual(run({ root: root2 }), ['llm-top10/LLM_A.md']);
      assert.equal(read(root2, 'llm-top10/LLM_A.md'), original);
    } finally { clean(root2); }
  } finally { clean(root); }
});

test('applyBlock: no Changelog puts the block at the end; extra blank lines do not break idempotence', () => {
  const block = `${crossrefs.BACKREFS_START}\n\n## Referenced by\n\n- [x.md](x.md)\n\n${crossrefs.BACKREFS_END}`;
  const noLog = '# T\n\nBody.\n';
  const once = applyBlock(noLog, block);
  assert.equal(once, `# T\n\nBody.\n\n${block}\n`);
  assert.equal(applyBlock(once, block), once);
  assert.equal(applyBlock(once, null), noLog);

  const loose = '# T\n\nBody.\n\n\n\n## Changelog\n\n- 2026-01-01\n';
  const placed = applyBlock(loose, block);
  assert.equal(placed, `# T\n\nBody.\n\n${block}\n\n## Changelog\n\n- 2026-01-01\n`);
  assert.equal(applyBlock(placed, block), placed);
});

test('a folder README that links back is not reported as one-way', () => {
  // READMEs are not mapping files, so the old check never read their links
  // and reported AST_MAESTRO.md -> ast-top10/README.md though the README
  // links it.
  const root = tree({
    'ast-top10/README.md': '# AST\n\n- [AST_M.md](AST_M.md)\n',
    'ast-top10/AST_M.md': doc('M', 'See [README](README.md).'),
  });
  try {
    assert.deepEqual(oneWay(root), []);
    fs.writeFileSync(path.join(root, 'ast-top10', 'README.md'), '# AST\n', 'utf8');
    assert.deepEqual(oneWay(root), ['ast-top10/AST_M.md -> ast-top10/README.md']);
    // backrefs.js writes only to mapping files, never to the README.
    assert.deepEqual(run({ root }), []);
  } finally { clean(root); }
});

test('CRLF files keep their line endings', () => {
  const root = tree({
    'llm-top10/LLM_A.md': doc('A').replace(/\n/g, '\r\n'),
    'llm-top10/LLM_B.md': doc('B', 'See [A](LLM_A.md).'),
  });
  try {
    run({ root });
    const a = read(root, 'llm-top10/LLM_A.md');
    assert.match(a, /backrefs:start/);
    assert.doesNotMatch(a.replace(/\r\n/g, ''), /\n/, 'no bare LF in a CRLF file');
    assert.deepEqual(run({ root }), []);
  } finally { clean(root); }
});

test('the committed mapping files are current', () => {
  // Read-only: check mode never writes.
  assert.deepEqual(run({ check: true }), [], 'run `node scripts/backrefs.js` and commit the result');
});
