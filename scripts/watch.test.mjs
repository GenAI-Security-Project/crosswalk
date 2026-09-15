/**
 * watch.test.mjs — the weekly watcher must not flood the tracker with noise.
 *
 * Between 2026-08-31 and 2026-09-14 the arXiv watcher opened 39 issues, 27 of
 * them outside GenAI security (CBDC settlement, 6G NOMA, MIMO lattices),
 * because unquoted multi-word terms turned the query into "any cs.CR paper".
 * Its OWASP hints also pointed at pre-2026 entry ids. These tests pin both.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { ARXIV_URL, ARXIV_HINT_RULES, mapArxivToOwasp } = require(path.join(ROOT, 'scripts', 'watch.js'));

/**
 * Field terms followed by a bare word, e.g. `ti:LLM security`. arXiv reads the
 * bare word as a separate all-fields term, which is the defect. `+` in the URL
 * is a space once parsed, and quoted phrases are one token.
 */
function unquotedPhrases(url) {
  const query = new URL(url).searchParams.get('search_query');
  const tokens = query.replace(/"[^"]*"/g, '"q"').replace(/[()]/g, ' $& ').split(/\s+/).filter(Boolean);
  const bad = [];
  tokens.forEach((tok, i) => {
    const next = tokens[i + 1];
    if (/^(ti|abs|all|au|cat):/.test(tok) && next && !/^(AND|OR|ANDNOT|\))$/.test(next)) bad.push(`${tok} ${next}`);
  });
  return bad;
}

test('every multi-word arXiv search term is quoted', () => {
  assert.deepEqual(unquotedPhrases(ARXIV_URL), []);
});

test('the phrase check catches the query that caused the flood', () => {
  const before = 'https://export.arxiv.org/api/query?search_query=cat:cs.CR+AND+'
    + '(ti:prompt+injection+OR+ti:jailbreak+OR+ti:LLM+security+OR+ti:agentic+AI+OR+ti:RAG+poisoning)';
  assert.deepEqual(unquotedPhrases(before),
    ['ti:prompt injection', 'ti:LLM security', 'ti:agentic AI', 'ti:RAG poisoning']);
});

test('the arXiv query stays inside cs.CR', () => {
  assert.match(decodeURIComponent(ARXIV_URL), /search_query=cat:cs\.CR\+AND\+\(/);
});

test('hints do not fire on substrings of unrelated words', () => {
  assert.deepEqual(mapArxivToOwasp('Storage-average leverage in fragmented disks'), []);
  assert.deepEqual(mapArxivToOwasp('Toolchain hardening for embedded bootloaders'), []);
});

test('hints use the 2026 entry ids', () => {
  assert.deepEqual(mapArxivToOwasp('A supply chain attack on model hubs').sort(), ['ASI04', 'LLM04']);
  assert.ok(mapArxivToOwasp('Knowledge poisoning of RAG pipelines').includes('LLM05'));
  assert.ok(mapArxivToOwasp('Indirect prompt injection in email agents').includes('LLM01'));
});

test('every hint id exists and still carries the title its rule names', () => {
  const titles = Object.fromEntries(
    fs.readdirSync(path.join(ROOT, 'data', 'entries')).filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entries', f), 'utf8')))
      .map((e) => [e.id, e.name]),
  );
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const rule of ARXIV_HINT_RULES) {
    for (const [id, title] of Object.entries(rule.ids)) {
      assert.ok(titles[id], `${id} is not an entry`);
      assert.equal(norm(titles[id]), norm(title), `${id} is now "${titles[id]}", rule expects "${title}"`);
    }
  }
});
