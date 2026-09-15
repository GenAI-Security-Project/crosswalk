/**
 * evals.test.mjs — the evaluation profiles name no target, and every threshold
 * is accounted for in one place.
 *
 * T-ENG05 removed the vendor and model that used to be baked into every Garak
 * profile, PyRIT script, runner and the CI template. These tests keep it that
 * way, and pin evals/THRESHOLDS.md to the values actually in the files so the
 * table cannot drift from what runs.
 *
 * No test here executes an evaluation. Run evidence is a human task — see
 * evals/samples/README.md — and this suite must never manufacture any.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVALS = path.join(ROOT, 'evals');
const read = (rel) => fs.readFileSync(path.join(EVALS, rel), 'utf8');
const list = (dir, ext) => fs.readdirSync(path.join(EVALS, dir)).filter((f) => f.endsWith(ext)).sort();

/** Every text file under evals/, relative to evals/. */
function walk(dir = '') {
  const out = [];
  for (const entry of fs.readdirSync(path.join(EVALS, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (/\.(yaml|yml|py|sh|md)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

// A concrete product name or vendor endpoint anywhere in evals/ means a
// profile would run against something the user never chose.
const LITERAL_TARGET = /gpt-4o|gpt-4|gpt-3\.5|claude-3|claude-4|gemini-|api\.openai\.com|OPENAI_MODEL\b|OPENAI_API_BASE/;

test('no file under evals/ names a default model or vendor endpoint', () => {
  const offenders = walk().filter((rel) => LITERAL_TARGET.test(read(rel)));
  assert.deepEqual(offenders, [], 'literal target(s) found');
});

test('every Garak profile leaves the target to the command line', () => {
  for (const f of list('garak', '.yaml')) {
    const src = read(`garak/${f}`);
    assert.doesNotMatch(src, /^\s*model_type:/m, `${f} bakes in a model_type`);
    assert.doesNotMatch(src, /^\s*model_name:/m, `${f} bakes in a model_name`);
    assert.match(src, /^\s*eval_threshold:\s*[0-9.]+/m, `${f} has no eval_threshold`);
    assert.match(src, /--model_type <type> --model_name <name>/, `${f} usage does not show the required flags`);
  }
});

test('every PyRIT script requires its target from the environment', () => {
  for (const f of list('pyrit', '.py')) {
    const src = read(`pyrit/${f}`);
    assert.match(src, /_required_env\("EVAL_MODEL_NAME"\)/, `${f} does not require EVAL_MODEL_NAME`);
    assert.match(src, /_required_env\("EVAL_ENDPOINT"\)/, `${f} does not require EVAL_ENDPOINT`);
    assert.match(src, /_required_env\("OPENAI_API_KEY"\)/, `${f} does not require OPENAI_API_KEY`);
    assert.match(src, /EVAL_FAIL_THRESHOLD/, `${f} threshold cannot be overridden`);
  }
});

test('the runners refuse to start without a target', () => {
  const garak = read('garak/run_all.sh');
  assert.match(garak, /GARAK_MODEL_TYPE:-\}/, 'run_all.sh still defaults GARAK_MODEL_TYPE');
  assert.match(garak, /GARAK_MODEL_NAME:-\}/, 'run_all.sh still defaults GARAK_MODEL_NAME');
  assert.match(garak, /exit 2/, 'run_all.sh has no target guard');

  const laaf = read('laaf/run_laaf.sh');
  assert.match(laaf, /LAAF_TARGET:-\}/, 'run_laaf.sh still defaults LAAF_TARGET');
  assert.match(laaf, /LAAF_MODEL:-\}/, 'run_laaf.sh still defaults LAAF_MODEL');
  assert.match(laaf, /exit 2/, 'run_laaf.sh has no target guard');

  const ci = read('ci/github-action.yml');
  assert.match(ci, /vars\.EVAL_MODEL_TYPE/, 'CI template does not read EVAL_MODEL_TYPE from repository variables');
  assert.match(ci, /vars\.EVAL_MODEL_NAME/, 'CI template does not read EVAL_MODEL_NAME from repository variables');
  assert.equal((ci.match(/Require a configured target/g) || []).length, 3, 'CI template is missing a guard step in one of its three jobs');
});

/** Parse "| `file` | ... | `0.05` | ..." rows out of a THRESHOLDS.md section. */
function tableThresholds(section) {
  const rows = {};
  for (const line of section.split(/\r?\n/)) {
    const m = line.match(/^\| `([^`]+)` \| [^|]+ \| `([0-9.]+)` \|/);
    if (m) rows[m[1]] = m[2];
  }
  return rows;
}

const thresholds = read('THRESHOLDS.md');
const section = (title) => {
  const start = thresholds.indexOf(`## ${title}`);
  assert.notEqual(start, -1, `THRESHOLDS.md has no "${title}" section`);
  const next = thresholds.indexOf('\n## ', start + 1);
  return thresholds.slice(start, next === -1 ? undefined : next);
};

test('THRESHOLDS.md lists every Garak profile with its literal eval_threshold', () => {
  const table = tableThresholds(section('Garak profiles'));
  for (const f of list('garak', '.yaml')) {
    const m = read(`garak/${f}`).match(/^\s*eval_threshold:\s*([0-9.]+)/m);
    assert.ok(table[f], `${f} is missing from THRESHOLDS.md`);
    assert.equal(table[f], m[1], `${f}: THRESHOLDS.md says ${table[f]}, profile says ${m[1]}`);
  }
  assert.deepEqual(Object.keys(table).sort(), list('garak', '.yaml'), 'THRESHOLDS.md lists a profile that does not exist');
});

test('THRESHOLDS.md lists every PyRIT script with its default FAIL_THRESHOLD', () => {
  const table = tableThresholds(section('PyRIT scripts'));
  for (const f of list('pyrit', '.py')) {
    const m = read(`pyrit/${f}`).match(/EVAL_FAIL_THRESHOLD", "([0-9.]+)"/);
    assert.ok(m, `${f} has no EVAL_FAIL_THRESHOLD default`);
    assert.ok(table[f], `${f} is missing from THRESHOLDS.md`);
    assert.equal(table[f], m[1], `${f}: THRESHOLDS.md says ${table[f]}, script says ${m[1]}`);
  }
  assert.deepEqual(Object.keys(table).sort(), list('pyrit', '.py'), 'THRESHOLDS.md lists a script that does not exist');
});

test('THRESHOLDS.md matches the LAAF stage defaults in run_laaf.sh', () => {
  const runner = read('laaf/run_laaf.sh');
  const sec = section('LAAF stages');
  for (const stage of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']) {
    const m = runner.match(new RegExp(`\\[${stage}\\]="\\$\\{LAAF_THRESHOLD_${stage}:-([0-9.]+)\\}"`));
    assert.ok(m, `run_laaf.sh has no overridable default for ${stage}`);
    const row = sec.split(/\r?\n/).find((l) => l.startsWith(`| ${stage} |`));
    assert.ok(row, `${stage} is missing from THRESHOLDS.md`);
    assert.match(row, new RegExp('`' + m[1].replace('.', '\\.') + '`'), `${stage}: THRESHOLDS.md and run_laaf.sh disagree`);
  }
});

test('every threshold row is marked DRAFT — SME review required', () => {
  const rows = thresholds.split(/\r?\n/).filter((l) => /^\| (`[^`]+`|S[1-6]) \|/.test(l));
  assert.ok(rows.length >= 25, `expected at least 25 threshold rows, found ${rows.length}`);
  for (const row of rows) assert.match(row, /DRAFT — SME review required/, `unreviewed row without DRAFT marker: ${row}`);
});

test('evals/samples holds a runbook and no fabricated results', () => {
  const files = fs.readdirSync(path.join(EVALS, 'samples'));
  assert.ok(files.includes('README.md'), 'samples/README.md is missing');
  // Until a human commits a real run, nothing else may be here. When one lands,
  // extend this test to require the RUN.md provenance block beside it.
  const extras = files.filter((f) => f !== 'README.md');
  for (const dir of extras) {
    const runMd = path.join(EVALS, 'samples', dir, 'RUN.md');
    assert.ok(fs.existsSync(runMd), `samples/${dir} has results but no RUN.md provenance record`);
    assert.match(fs.readFileSync(runMd, 'utf8'), /Authorisation\s*:/, `samples/${dir}/RUN.md records no authorisation`);
  }
});
