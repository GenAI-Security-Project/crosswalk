#!/usr/bin/env node
/**
 * export-olir.mjs — Project verified mappings into the NIST OLIR template shape.
 *
 * The OLIR Program publishes "Informative References": machine-readable
 * mappings between a Focal Document (a NIST publication) and a Reference
 * Document (someone else's framework). Acceptance puts a mapping into the
 * government-referenced canon.
 *
 * This is a projection, not a translation. Schema v2 was named against
 * NIST IR 8278A Rev. 1 precisely so this file could be a column rename:
 *
 *   crosswalk                    OLIR template
 *   ─────────────────────────    ─────────────────────────
 *   control_id + control_name    Focal Document Element (+ Description)
 *   entry id + name              Reference Document Element (+ Description)
 *   relationship                 Relationship        (restated from the entry's side, below)
 *   rationale_type               Rationale
 *   rationale                    Comments
 *   confidence                   Strength of Relationship
 *
 * > NIST IR 8278A Rev. 1, *National Online Informative References (OLIR)
 * > Program: Submission Guidance for OLIR Developers*, February 2024.
 * > https://csrc.nist.gov/pubs/ir/8278/a/r1/final
 *
 * Only rows a named human reviewed are exported. OLIR asks a developer to
 * assert a relationship; an unreviewed row asserts nothing, and submitting one
 * would misrepresent the project. With the verified core still empty this
 * exports zero rows — which is the honest current answer, and the exporter is
 * ready for the first reviewed file.
 *
 * Usage:
 *   node scripts/export-olir.mjs --focal "NIST CSF 2.0"
 *   node scripts/export-olir.mjs --focal "NIST CSF 2.0" --include-unreviewed  # inspection only
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'reports');

const argv = process.argv.slice(2);
const arg = (name, dflt = null) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : dflt;
};
const FOCAL = arg('--focal', 'NIST CSF 2.0');
const INCLUDE_UNREVIEWED = argv.includes('--include-unreviewed');

/**
 * Stored token → the OLIR Relationship value (IR 8278A Rev. 1 §3.1 spelling).
 *
 * Direction (ratified in #99, Decision 7): the framework control is the Focal
 * Document Element and the OWASP entry is the Reference Document Element. OLIR
 * defines Relationship as the comparison "for the Reference Document Element
 * compared to the Focal Document Element" — the entry relative to the control.
 *
 * The crosswalk stores the opposite side: `subset-of` means the control
 * addresses part of the risk (docs/SCHEMA_V2_MIGRATION.md). The same assertion
 * stated from the entry's side is "superset of", so the two directional tokens
 * swap on export. The symmetric ones do not.
 */
const RELATIONSHIP_OUT = {
  'equal': 'equal',
  'subset-of': 'superset of',
  'superset-of': 'subset of',
  'intersects-with': 'intersects with',
  'not-related-to': 'not related to',
};

/** OLIR template column order. */
const COLUMNS = [
  'Focal Document Element',
  'Focal Document Element Description',
  'Security Control Baseline',
  'Relationship',
  'Reference Document Element',
  'Reference Document Element Description',
  'Rationale',
  'Strength of Relationship',
  'Comments',
];

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// registry lookup for control descriptions
const registry = new Map();
const fwDir = path.join(ROOT, 'data', 'frameworks');
for (const f of fs.readdirSync(fwDir).filter((n) => n.endsWith('.json'))) {
  const reg = readJson(path.join(fwDir, f));
  for (const c of reg.controls || []) {
    registry.set(`${reg.name}\u0000${c.control_id}`, c);
  }
}

const rows = [];
const skipped = { unreviewed: 0, noRelationship: 0 };

const entryDir = path.join(ROOT, 'data', 'entries');
for (const f of fs.readdirSync(entryDir).filter((n) => n.endsWith('.json'))) {
  const entry = readJson(path.join(entryDir, f));
  for (const m of entry.mappings || []) {
    if (m.framework !== FOCAL) continue;

    const reviewed = (m.reviewed_by || []).length > 0;
    if (!reviewed && !INCLUDE_UNREVIEWED) { skipped.unreviewed++; continue; }
    if (!m.relationship) { skipped.noRelationship++; continue; }

    const ctl = registry.get(`${m.framework}\u0000${m.control_id}`);
    rows.push({
      'Focal Document Element': m.control_id,
      'Focal Document Element Description': ctl?.title || m.control_name || '',
      'Security Control Baseline': '',
      'Relationship': RELATIONSHIP_OUT[m.relationship] || m.relationship,
      'Reference Document Element': entry.id,
      'Reference Document Element Description': entry.name,
      'Rationale': m.rationale_type || '',
      'Strength of Relationship': m.confidence && m.confidence !== 'unreviewed' ? m.confidence : '',
      'Comments': (m.rationale || '').replace(/\s+/g, ' ').trim(),
    });
  }
}

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';

const slug = FOCAL.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
fs.mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, `olir-${slug}.csv`);
fs.writeFileSync(out, csv, 'utf8');

console.log(`Written reports/olir-${slug}.csv`);
console.log(`  focal document: ${FOCAL}`);
console.log(`  rows exported : ${rows.length}${INCLUDE_UNREVIEWED ? ' (including unreviewed — inspection only)' : ''}`);
console.log(`  skipped       : ${skipped.unreviewed} unreviewed, ${skipped.noRelationship} without a relationship`);
if (!rows.length && !INCLUDE_UNREVIEWED) {
  console.log('');
  console.log('  No reviewed mappings yet. OLIR asks a developer to assert a relationship,');
  console.log('  and an unreviewed row asserts nothing — exporting one would misrepresent');
  console.log('  the project. Re-run once a framework has human-signed rows.');
}

export { COLUMNS, RELATIONSHIP_OUT };
