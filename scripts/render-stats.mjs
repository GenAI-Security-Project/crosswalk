#!/usr/bin/env node
/**
 * render-stats.mjs — Render generated counts into README marker regions.
 *
 * Every headline number in the README lives between a pair of HTML comments:
 *
 *   <!-- stats:frameworks-mapped -->23<!-- /stats -->
 *
 * The text between the markers is replaced from `data/stats.json`; everything
 * else in the file is left byte-identical. `npm run stats:check` re-renders and
 * asserts `git diff --exit-code`, so a hand-edited count fails CI.
 *
 * Adding a number to the README means wrapping it in a marker and adding the
 * key to KEYS below — never hand-maintaining the digits.
 *
 * Usage:
 *   node scripts/render-stats.mjs           # rewrite README.md in place
 *   node scripts/render-stats.mjs --check   # exit 1 if the README is stale
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const README = path.join(ROOT, 'README.md');
const STATS = path.join(ROOT, 'data', 'stats.json');

const CHECK = process.argv.includes('--check');

const stats = JSON.parse(fs.readFileSync(STATS, 'utf8'));

/**
 * Marker key → rendered value.
 *
 * `frameworks-mapped` and `frameworks-registries` are deliberately separate.
 * A claim about coverage ("mapped to controls in N frameworks") uses mapped;
 * a claim about the inventory uses registries. They differ by two, and using
 * the larger number for a coverage claim would overstate the crosswalk.
 */
const KEYS = {
  // The four generated shields.io badges render as one block: an HTML comment
  // cannot sit inside a URL without corrupting it, so the whole line group is
  // regenerated rather than the digits patched in place.
  'badges': () =>
    '\n' +
    [
      `[![Version](https://img.shields.io/badge/version-${stats.version}-green)](CHANGELOG.md)`,
      `[![Source Lists](https://img.shields.io/badge/source%20lists-${stats.source_lists.count}-blueviolet)](README.md)`,
      `[![Mapping Files](https://img.shields.io/badge/mapping%20files-${stats.mapping_files.total}-brightgreen)](README.md)`,
      `[![Frameworks](https://img.shields.io/badge/frameworks-${stats.frameworks.mapped}-orange)](README.md)`,
    ].join('\n') +
    '\n',
  'version': () => stats.version,
  'source-lists': () => stats.source_lists.count,
  'entries': () => stats.entries.total,
  'mappings': () => stats.mappings.total.toLocaleString('en-US'),
  'mapping-files': () => stats.mapping_files.total,
  'frameworks-mapped': () => stats.frameworks.mapped,
  'frameworks-registries': () => stats.frameworks.registries,
  'incidents': () => stats.incidents.total,
  'frameworks-llm': () => stats.frameworks.by_list['LLM-Top10-2026'],
  'frameworks-agentic': () => stats.frameworks.by_list['Agentic-Top10-2026'],
  'frameworks-dsgai': () => stats.frameworks.by_list['DSGAI-2026'],
};

const MARKER = /<!-- stats:([a-z0-9-]+) -->([\s\S]*?)<!-- \/stats -->/g;

function render(src) {
  const seen = new Set();
  const unknown = [];

  const out = src.replace(MARKER, (whole, key) => {
    if (!(key in KEYS)) {
      unknown.push(key);
      return whole;
    }
    seen.add(key);
    return `<!-- stats:${key} -->${KEYS[key]()}<!-- /stats -->`;
  });

  return { out, seen, unknown };
}

/**
 * LF-normalise on read. With core.autocrlf=true a Windows checkout is CRLF while
 * the rendered badge block is emitted with LF — writing that back would leave the
 * file with mixed line endings, and comparing raw would report every Windows
 * working copy as stale. The repo is LF-canonical in the index either way, so all
 * work happens in LF and git converts on checkout.
 */
const before = fs.readFileSync(README, 'utf8').replace(/\r\n/g, '\n');
const { out, seen, unknown } = render(before);

if (unknown.length) {
  console.error(`✗ unknown stats key(s) in README: ${[...new Set(unknown)].join(', ')}`);
  console.error(`  known keys: ${Object.keys(KEYS).join(', ')}`);
  process.exit(1);
}

if (CHECK) {
  if (out !== before) {
    console.error('✗ README.md is stale — run `npm run stats`');
    process.exit(1);
  }
  console.log(`✓ README.md is current (${seen.size} marker keys in use)`);
} else {
  if (out !== before) {
    fs.writeFileSync(README, out, 'utf8');
    console.log(`Rewritten README.md (${seen.size} marker keys)`);
  } else {
    console.log(`README.md already current (${seen.size} marker keys)`);
  }
}
