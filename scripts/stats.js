#!/usr/bin/env node
/**
 * stats.js — Compute every headline number from the data layer.
 *
 * The repository quotes its own size in a dozen places (README badges, prose,
 * the webapp, reports). Those numbers were maintained by hand and drifted apart:
 * the framework count appeared as 20, 21 and 23 while the registry held 25, and
 * the version badge said 2.0.0 against a package.json of 4.0.0. This script is
 * the single source of truth: everything is derived from `data/`, written to
 * `data/stats.json`, and rendered into the README by `render-stats.mjs`.
 *
 * Two framework counts exist and they are NOT interchangeable:
 *   registries — framework inventories present in data/frameworks/        (25)
 *   mapped     — frameworks at least one entry actually maps a control to (23)
 * Two registries (CoSAI, EU AI Act Code of Practice) are inventory-only. A
 * sentence about coverage must use `mapped`; a sentence about the registry must
 * use `registries`. Conflating them is how "20 frameworks" survived this long.
 *
 * Output is deliberately timestamp-free so `npm run stats:check` can assert
 * `git diff --exit-code` — a generated-on date would make every run dirty.
 *
 * Usage:
 *   node scripts/stats.js            # write data/stats.json
 *   node scripts/stats.js --check    # exit 1 if the file is stale
 *   node scripts/stats.js --print    # print, do not write
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'stats.json');

const CHECK = process.argv.includes('--check');
const PRINT = process.argv.includes('--print');

/** Source lists, in publication order, with the directory holding their mappings. */
const SOURCE_LISTS = [
  { id: 'LLM-Top10-2026', label: 'LLM Top 10', dir: 'llm-top10' },
  { id: 'Agentic-Top10-2026', label: 'Agentic Top 10', dir: 'agentic-top10' },
  { id: 'DSGAI-2026', label: 'DSGAI 2026', dir: 'dsgai-2026' },
];

/** LF-normalise so comparisons are content-based, not checkout-dependent. */
const normalizeEol = (s) => s.replace(/\r\n/g, '\n');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const jsonFiles = (dir) =>
  fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f));
const mdFiles = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];

/**
 * Framework freshness, derived from data/framework-sources.json.
 *
 * A crosswalk's failure mode is not being wrong on day one; it is being right
 * on day one and unmaintained by day four hundred. This surfaces divergence as
 * a number so the decay is visible rather than discovered.
 *
 * `unchecked` is reported separately from `current`: nobody having looked is a
 * different state from having looked and found no drift, and collapsing them
 * would make the figure flattering and useless.
 */
function computeFreshness() {
  const p = path.join(ROOT, 'data', 'framework-sources.json');
  if (!fs.existsSync(p)) return null;
  const doc = readJson(p);
  const out = { current: [], diverged: [], unchecked: [] };

  for (const [key, f] of Object.entries(doc.frameworks || {})) {
    const rec = { key, name: f.name, mapped: f.mapped_version, current: f.current_version, checked: f.checked };
    if (!f.current_version) out.unchecked.push(rec);
    else if (f.current_version !== f.mapped_version) out.diverged.push(rec);
    else out.current.push(rec);
  }
  return {
    checked: out.current.length + out.diverged.length,
    current: out.current.length,
    diverged: out.diverged.length,
    unchecked: out.unchecked.length,
    diverged_frameworks: out.diverged.map((r) => ({
      name: r.name, mapped: r.mapped, current: r.current, checked: r.checked,
    })),
  };
}

function computeStats() {
  const pkg = readJson(path.join(ROOT, 'package.json'));

  // ── entries and mappings ───────────────────────────────────────────────────
  const entries = jsonFiles(path.join(ROOT, 'data', 'entries')).map(readJson);
  const entriesByList = {};
  const mappingsByList = {};
  const frameworksMapped = new Set();

  for (const e of entries) {
    entriesByList[e.source_list] = (entriesByList[e.source_list] || 0) + 1;
    const n = (e.mappings || []).length;
    mappingsByList[e.source_list] = (mappingsByList[e.source_list] || 0) + n;
    for (const m of e.mappings || []) frameworksMapped.add(m.framework);
  }

  const mappingsTotal = Object.values(mappingsByList).reduce((a, b) => a + b, 0);

  // ── framework registries ───────────────────────────────────────────────────
  const registries = jsonFiles(path.join(ROOT, 'data', 'frameworks')).map(readJson);
  const registryNames = registries.map((r) => r.name || r.id);

  // Registry items are not all controls. STRIDE is a 6-item threat mnemonic,
  // CWE entries are weaknesses, ATLAS entries are adversary techniques, and
  // ENISA/MAESTRO L<n> ids are architectural layers. Counting them together
  // inflated the control total to 1,514; only `kind: control` is a control.
  const byKind = {};
  const untyped = [];
  for (const r of registries) {
    for (const c of r.controls || []) {
      if (!c.kind) untyped.push(`${r.name || r.id}:${c.control_id}`);
      byKind[c.kind || 'UNTYPED'] = (byKind[c.kind || 'UNTYPED'] || 0) + 1;
    }
  }
  if (untyped.length) {
    throw new Error(
      `${untyped.length} registry item(s) have no \`kind\` — run the T-DATA02 typing rules. ` +
        `First: ${untyped.slice(0, 3).join(', ')}`,
    );
  }
  const registryItems = Object.values(byKind).reduce((a, b) => a + b, 0);

  // Registries carrying no mapping at all — inventory present, coverage absent.
  const unmapped = registryNames.filter((n) => !frameworksMapped.has(n)).sort();

  // ── mapping files, per source list ─────────────────────────────────────────
  const mappingFilesByList = {};
  for (const l of SOURCE_LISTS) mappingFilesByList[l.id] = mdFiles(path.join(ROOT, l.dir)).length;
  const mappingFilesTotal = Object.values(mappingFilesByList).reduce((a, b) => a + b, 0);

  // ── incidents ──────────────────────────────────────────────────────────────
  // incidents.json is object-form ({version, generated, description, incidents[]}),
  // not a bare array — read the nested list.
  const incidentsDoc = readJson(path.join(ROOT, 'data', 'incidents.json'));
  const incidents = Array.isArray(incidentsDoc) ? incidentsDoc : incidentsDoc.incidents;

  return {
    $comment: 'Generated by scripts/stats.js — do not edit by hand. Run: npm run stats',
    schema: 1,
    version: pkg.version,
    source_lists: {
      count: SOURCE_LISTS.length,
      ids: SOURCE_LISTS.map((l) => l.id),
      labels: SOURCE_LISTS.map((l) => l.label),
    },
    entries: { total: entries.length, by_list: entriesByList },
    mappings: { total: mappingsTotal, by_list: mappingsByList },
    frameworks: {
      registries: registries.length,
      mapped: frameworksMapped.size,
      unmapped_registries: unmapped,
      by_list: Object.fromEntries(
        SOURCE_LISTS.map((l) => [l.id, mdFiles(path.join(ROOT, l.dir)).length]),
      ),
    },
    mapping_files: { total: mappingFilesTotal, by_list: mappingFilesByList },
    incidents: { total: incidents.length },
    freshness: computeFreshness(),
    controls: {
      // `total` is the honest control count: only kind=control. `registry_items`
      // is every line item of any kind, which is what the old "1,514 controls"
      // claim actually measured.
      total: byKind.control || 0,
      registry_items: registryItems,
      by_kind: Object.fromEntries(Object.entries(byKind).sort()),
    },
  };
}

function main() {
  const stats = computeStats();
  const text = JSON.stringify(stats, null, 2) + '\n';

  if (PRINT) {
    process.stdout.write(text);
    return;
  }

  if (CHECK) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    // Compare content, not line endings. With core.autocrlf=true the checked-out
    // file is CRLF while this script emits LF, which would report every Windows
    // working copy as stale even when nothing changed.
    if (normalizeEol(current) !== normalizeEol(text)) {
      console.error('✗ data/stats.json is stale — run `npm run stats`');
      process.exit(1);
    }
    console.log('✓ data/stats.json is current');
    return;
  }

  fs.writeFileSync(OUT, text, 'utf8');
  console.log(`Written data/stats.json`);
  console.log(
    `  ${stats.source_lists.count} source lists · ${stats.entries.total} entries · ` +
      `${stats.mappings.total} mappings · ${stats.frameworks.mapped} frameworks mapped ` +
      `(${stats.frameworks.registries} registries) · ${stats.mapping_files.total} mapping files · ` +
      `${stats.incidents.total} incidents`,
  );
  if (stats.frameworks.unmapped_registries.length) {
    console.log(
      `  note: ${stats.frameworks.unmapped_registries.length} registry/registries carry no mappings — ` +
        stats.frameworks.unmapped_registries.join(', '),
    );
  }
}

if (require.main === module) main();

module.exports = { computeStats };
