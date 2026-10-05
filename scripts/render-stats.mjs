#!/usr/bin/env node
/**
 * render-stats.mjs — Render generated counts into marker regions.
 *
 * Every headline number in the README, and in the two brand images that repeat
 * those numbers (the social card and the banner), lives between a pair of
 * comments. HTML and SVG share the comment syntax:
 *
 *   <!-- stats:frameworks-mapped -->23<!-- /stats -->
 *
 * The text between the markers is replaced from `data/stats.json`; everything
 * else in each file is left byte-identical. `npm run stats:check` re-renders and
 * fails if any target would change, so a hand-edited count fails CI.
 *
 * Adding a number means wrapping it in a marker and adding the key to KEYS
 * below — never hand-maintaining the digits.
 *
 * Usage:
 *   node scripts/render-stats.mjs           # rewrite every target in place
 *   node scripts/render-stats.mjs --check   # exit 1 if any target is stale
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The badge block is Markdown, so it belongs in README.md only.
const TARGETS = ['README.md', 'docs/og-image.svg', 'docs/banner.svg'];
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
  // Frameworks whose every row is still a candidate placeholder. Rendering this
  // next to the headline count is the difference between "25 frameworks mapped"
  // and "25 frameworks mapped, two of them not yet reviewed by anyone".
  'frameworks-draft': () => {
    const d = stats.frameworks.draft_only || [];
    if (!d.length) return 'none \u2014 every mapped framework has authored rows';
    return `${d.length} of ${stats.frameworks.mapped} carry candidate DRAFT rows only \u2014 ${d.join(' \u00b7 ')}`;
  },
  'incidents': () => stats.incidents.total,
  // Reports the measurement's own coverage alongside the result: a bare
  // "current" count would imply the rest were checked and fine.
  'freshness': () => {
    const f = stats.freshness;
    if (!f) return 'not measured';
    const parts = [`${f.current} current`];
    if (f.diverged) parts.push(`${f.diverged} behind upstream`);
    if (f.unchecked) parts.push(`${f.unchecked} unchecked`);
    return parts.join(' · ');
  },
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
let failed = false;

for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  const before = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { out, seen, unknown } = render(before);

  if (unknown.length) {
    console.error(`✗ unknown stats key(s) in ${rel}: ${[...new Set(unknown)].join(', ')}`);
    console.error(`  known keys: ${Object.keys(KEYS).join(', ')}`);
    failed = true;
    continue;
  }

  if (CHECK) {
    if (out !== before) {
      console.error(`✗ ${rel} is stale — run \`npm run stats\``);
      failed = true;
    } else {
      console.log(`✓ ${rel} is current (${seen.size} marker keys in use)`);
    }
  } else if (out !== before) {
    fs.writeFileSync(file, out, 'utf8');
    console.log(`Rewritten ${rel} (${seen.size} marker keys)`);
  } else {
    console.log(`${rel} already current (${seen.size} marker keys)`);
  }
}

if (failed) process.exit(1);
