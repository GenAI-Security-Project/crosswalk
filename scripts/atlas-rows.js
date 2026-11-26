'use strict';
/**
 * atlas-rows.js — the mechanical half of the MITRE ATLAS row check (#93, #99).
 *
 * Every `MITRE ATLAS` mapping row cites a technique id and writes that
 * technique's name. The registry (data/frameworks/mitre-atlas.json) is
 * transcribed from the published ATLAS data release, so it is the side known
 * to be right. A row is in violation when:
 *
 *   - `unknown-id`      the id is not in the registry at all;
 *   - `not-in-release`  the registry holds the id only with a `source_status`,
 *                       i.e. the current ATLAS release no longer defines it;
 *   - `name-mismatch`   the name on the row is not the registry name for the
 *                       id, after normalising case, whitespace and typographic
 *                       quotes — nothing more. A legacy "ML" name or the bare
 *                       half of a sub-technique name is a mismatch: ATLAS
 *                       names sub-techniques "<parent>: <sub>".
 *
 * This only *finds* rows. Which technique a row meant is a mapping judgment
 * (C4), so nothing here proposes or applies a fix.
 *
 * A row is DRAFT when its notes carry the inline marker PR #108 introduced —
 * "DRAFT — … pending SME review (#93)". DRAFT rows are already known to be
 * awaiting a ruling.
 */

/** Case, whitespace and typographic quotes — and nothing else. */
function normaliseName(s) {
  return String(s ?? '')
    .normalize('NFKC')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const DRAFT_MARKER = /\bDRAFT\b/;

function isDraftRow(m) {
  return DRAFT_MARKER.test(String(m.notes ?? ''));
}

/**
 * @param {{controls: Array<{control_id: string, title: string, source_status?: string}>}} registry
 * @param {Array<{id?: string, mappings?: Array<object>}>} entries
 * @returns {{rows: number, violations: Array<{entry: string, control_id: string,
 *   control_name: string, kind: string, registry_title: string|null,
 *   source_status: string|null, draft: boolean}>}}
 */
function checkAtlasRows(registry, entries) {
  const byId = new Map();
  for (const c of registry.controls || []) byId.set(c.control_id, c);

  const violations = [];
  let rows = 0;
  for (const entry of entries) {
    for (const m of entry.mappings || []) {
      if (m.framework !== 'MITRE ATLAS') continue;
      rows++;
      const reg = byId.get(m.control_id);
      let kind = null;
      if (!reg) kind = 'unknown-id';
      else if (reg.source_status) kind = 'not-in-release';
      else if (normaliseName(m.control_name) !== normaliseName(reg.title)) kind = 'name-mismatch';
      if (!kind) continue;
      violations.push({
        entry: entry.id ?? '?',
        control_id: m.control_id,
        control_name: m.control_name,
        kind,
        registry_title: reg ? reg.title : null,
        source_status: reg && reg.source_status ? reg.source_status : null,
        draft: isDraftRow(m),
      });
    }
  }
  return { rows, violations };
}

module.exports = { checkAtlasRows, normaliseName, isDraftRow };
