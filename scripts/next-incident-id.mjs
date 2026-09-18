#!/usr/bin/env node
/**
 * next-incident-id.mjs — print the next free incident id.
 *
 * Two contributors adding an incident at the same time both read the end of
 * data/incidents.json and both pick the same number; the second one to merge
 * finds their PR conflicting (this happened to INC-132). This prints an id that
 * accounts for what is already merged, and optionally for what open pull
 * requests have claimed.
 *
 * Usage:
 *   node scripts/next-incident-id.mjs              # next id after data/incidents.json
 *   node scripts/next-incident-id.mjs --check-prs  # also scan open PRs (needs gh)
 *   node scripts/next-incident-id.mjs --json
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_PRS = process.argv.includes('--check-prs');
const AS_JSON = process.argv.includes('--json');

const ID = /INC-(\d{3})\b/g;
const format = (n) => `INC-${String(n).padStart(3, '0')}`;

const db = JSON.parse(readFileSync(path.join(ROOT, 'data', 'incidents.json'), 'utf8'));
const committed = db.incidents.map((i) => Number(String(i.id).slice(4))).filter(Number.isFinite);
const highestCommitted = Math.max(0, ...committed);

const claimed = new Map(); // id -> where it is claimed
if (CHECK_PRS) {
  try {
    const list = JSON.parse(execFileSync('gh', ['pr', 'list', '--state', 'open', '--json', 'number,title,headRefName'], { encoding: 'utf8' }));
    for (const pr of list) {
      // The title and branch name are cheap to read; a full diff per PR is not.
      const text = `${pr.title} ${pr.headRefName}`;
      for (const m of text.matchAll(ID)) claimed.set(Number(m[1]), `PR #${pr.number}`);
    }
  } catch (err) {
    if (!AS_JSON) console.error(`(could not read open PRs: ${err.message.split('\n')[0]})`);
  }
}

const highestClaimed = Math.max(0, ...claimed.keys());
const next = Math.max(highestCommitted, highestClaimed) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({
    next: format(next),
    highest_committed: format(highestCommitted),
    claimed_in_open_prs: [...claimed].sort((a, b) => a[0] - b[0]).map(([n, where]) => ({ id: format(n), where })),
  }, null, 2));
} else {
  console.log(format(next));
  if (highestCommitted) console.error(`  highest in data/incidents.json: ${format(highestCommitted)}`);
  for (const [n, where] of [...claimed].sort((a, b) => a[0] - b[0])) {
    if (n > highestCommitted) console.error(`  claimed by ${where}: ${format(n)}`);
  }
  if (!CHECK_PRS) console.error('  (pass --check-prs to account for ids claimed by open pull requests)');
}
