/**
 * watch.test.mjs — the weekly watcher must not flood the tracker with noise.
 *
 * Between 2026-08-31 and 2026-09-14 the arXiv watcher opened 39 issues, 27 of
 * them outside GenAI security (CBDC settlement, 6G NOMA, MIMO lattices),
 * because unquoted multi-word terms turned the query into "any cs.CR paper".
 * Its OWASP hints also pointed at pre-2026 entry ids. These tests pin both.
 *
 * With the query fixed, volume was still the problem: 98 open issues from four
 * runs in October 2026, nearly all routed to "note and close". arXiv and NVD
 * findings now fold into one digest issue per source per run.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const {
  ARXIV_URL, ARXIV_HINT_RULES, mapArxivToOwasp, triageRoute, buildDigests, DIGEST_MAX_BODY,
} = require(path.join(ROOT, 'scripts', 'watch.js'));

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

// Titles from the watcher's October 2026 issues.
test('papers that name a benchmark in the title are routed as rule 3 candidates', () => {
  for (const title of [
    'AgentPhishing: A Benchmark of LLM Email Agents Under Adaptive Attack',
    'AfterDeleteBench: Auditing Post-Deletion Information Persistence in LLM Agents',
    'Omni-UBench: Benchmarking Omni-Modal LLM-based Guardrails Across Safety, Utility',
  ]) assert.equal(triageRoute(title, ''), 'benchmark', title);
});

test('papers that only evaluate on a benchmark stay literature', () => {
  assert.equal(triageRoute('Amplifying Latency and Cost of LLM Inference via Rowhammer Attack',
    'We evaluate on three public benchmarks and show a 4x slowdown.'), 'literature');
  assert.equal(triageRoute('Securing the LLM workbench', ''), 'literature');
});

test('a paper that says it releases a dataset is a rule 3 candidate', () => {
  assert.equal(triageRoute('Prompt leakage in the wild',
    'We introduce a new dataset of 4,000 leaked system prompts.'), 'benchmark');
});

const paper = (n, title = `Paper ${n}`) => ({
  label: 'new-research', title: `[new-research] arXiv:2610.${n}`, body: 'per-item body',
  digest: { kind: 'research', id: `2610.${n}`, title, url: `https://arxiv.org/abs/2610.${n}`,
    authors: ['A', 'B', 'C', 'D'], abstract: 'x'.repeat(500), hints: ['LLM01'], route: triageRoute(title, '') },
});
const cve = (n) => ({
  label: 'new-cve', title: `[new-cve] CVE-2026-${n}`, body: 'per-item body',
  digest: { kind: 'cve', id: `CVE-2026-${n}`, url: `https://nvd.nist.gov/vuln/detail/CVE-2026-${n}`,
    cvss: 7.5, description: 'A flaw in an LLM gateway.', hint: '_Manual mapping required_' },
});
const framework = { label: 'framework-update', title: '[framework-update] MITRE ATLAS changed', body: 'b' };

test('arXiv and NVD findings fold into one digest each; other findings keep their own issue', () => {
  const papers = Array.from({ length: 20 }, (_, i) => paper(10000 + i));
  const cves = Array.from({ length: 31 }, (_, i) => cve(100000 + i));
  const out = buildDigests([framework, ...papers, ...cves], '2026-10-26');

  assert.equal(out.length, 3);
  assert.equal(out[0], framework);
  const [research, cveIssue] = out.slice(1);
  assert.equal(research.label, 'new-research');
  assert.equal(research.title, '[watch-digest] Research — 2026-10-26 (20 papers)');
  assert.equal((research.body.match(/^- \[ \] /gm) || []).length, 20);
  assert.equal(cveIssue.label, 'new-cve');
  assert.equal(cveIssue.title, '[watch-digest] CVEs — 2026-10-26 (31 CVEs)');
  assert.equal((cveIssue.body.match(/^- \[ \] /gm) || []).length, 31);
});

test('the research digest lists benchmark candidates before literature', () => {
  const [digest] = buildDigests([paper(1), paper(2, 'XBench: a benchmark for agents')], '2026-10-26');
  const body = digest.body;
  assert.ok(body.indexOf('Possible benchmarks') < body.indexOf('Literature'));
  assert.ok(body.indexOf('2610.2') < body.indexOf('2610.1'), 'the benchmark paper is listed first');
  assert.match(body, /A, B, C et al\./);
  assert.match(body, /x{300}…/, 'abstracts are cut to an excerpt');
});

test('a run with nothing from arXiv or NVD opens no digest', () => {
  assert.deepEqual(buildDigests([framework], '2026-10-26'), [framework]);
  assert.deepEqual(buildDigests([], '2026-10-26'), []);
});

test('an oversized digest is cut at an item boundary under the GitHub limit', () => {
  const papers = Array.from({ length: 400 }, (_, i) => paper(10000 + i));
  const [digest] = buildDigests(papers, '2026-10-26');
  assert.ok(digest.body.length < 65_536);
  assert.ok(digest.body.length <= DIGEST_MAX_BODY + 200);
  assert.match(digest.body, /Digest truncated/);
  assert.match(digest.body, /x{300}…\n\n_Digest truncated/, 'the last item before the note is complete');
});
