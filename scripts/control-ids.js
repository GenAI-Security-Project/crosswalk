'use strict';
/**
 * Per-framework control identifier grammar (issue #35).
 *
 * The mapping files write the same framework differently across the source
 * lists — `CC3.2 — Name | prose` in one, `CC3.2 | prose | evidence` in
 * another — so a positional rule ("the id is column 1") cannot hold. The old
 * parser tried `looksLikeId()`, which rejects every identifier containing a
 * space (`Req 6.2.4`, `Art. 9`, `§5.3`), then fell through to "column 0 is the
 * id" and wrote the requirement prose into `control_id` on 612 rows.
 *
 * This scans a row's cells for the framework's own identifier shape instead.
 * Wherever the identifier sits, it becomes `control_id`; the rest of that cell
 * becomes the name, or failing that a short neighbouring cell.
 *
 * Canonical forms are the maintainer's ruling on #35: `§5.3`, `Art. 9`,
 * `Req 6.2.4`, `NHI-5`, ISO clauses bare (`6.1`), SP 800-218A keeping NIST's
 * `-PS` suffix, and CIS identified by safeguard with the control as `parent`.
 */

/** A cell longer than this is prose, not a control name. */
const NAME_MAX = 120;

const GRAMMARS = {
  'SOC 2': {
    re: /\b((?:CC|PI|A|C|P)\d\.\d{1,2})\b/,
  },
  'EU AI Act': {
    // The files cite paragraphs as well as articles — Art. 55(1)(b) — and the
    // paragraph is the part that says which obligation was mapped, so it stays.
    re: /\b(?:Art\.?|Article)\s*(\d{1,3}(?:\(\w{1,3}\))*)|\bAnnex\s+([IVXL]+)\b/i,
    canonical: (m) => (m[1] ? `Art. ${m[1]}` : `Annex ${m[2].toUpperCase()}`),
  },
  'OWASP NHI Top 10': {
    re: /\bNHI[-\s]?(\d{1,2})\b/i,
    canonical: (m) => `NHI-${m[1]}`,
  },
  'CIS Controls v8.1': {
    // The safeguard is the identifier; the control it belongs to is the parent.
    re: /\b(\d{1,2}\.\d{1,2})\b/,
    parentRe: /\bCIS[-\s]?(\d{1,2})\b/i,
    parent: (m) => `CIS-${m[1]}`,
  },
  'PCI DSS v4.0': {
    re: /\bReq(?:uirement)?\.?\s*(\d{1,2}(?:\.\d{1,3}){0,2})\b/i,
    canonical: (m) => `Req ${m[1]}`,
  },
  'NIST SP 800-218A': {
    re: /\b([A-Z]{2}\.\d{1,2}\.\d{1,2}(?:-PS)?)\b/,
  },
  'NIST SP 800-82 Rev 3': {
    // Sections of the overlay, and the SP 800-53 controls it cites (#35 B).
    re: /(?:§|\bSection\s+)(\d{1,2}(?:\.\d{1,2}){0,2})\b|\b([A-Z]{2}-\d{1,2})\b/,
    canonical: (m) => (m[1] ? `§${m[1]}` : m[2]),
  },
  'CWE/CVE': {
    re: /\b(CWE-\d{1,4}|CVE-\d{4}-\d{4,7})\b/i,
    canonical: (m) => m[1].toUpperCase(),
  },
  'OWASP AI Testing Guide': {
    // Category codes, written "IHT — Input Handling". The separator is matched
    // as "any punctuation" because some registry titles carry a U+FFFD where
    // the em dash should be.
    re: /\b([A-Z]{3})\b(?=\s*[^\sA-Za-z0-9])/,
  },
  'OWASP ASVS 4.0.3': {
    // Requirement ids are V<chapter>.<section>.<requirement>; the chapter alone
    // (V8) is the parent, and some tables put the chapter in its own column.
    re: /\b(V\d{1,2}\.\d{1,2}\.\d{1,2})\b/,
    parentRe: /\b(V\d{1,2})\b(?!\.)/,
    parent: (m) => m[1],
  },
  'ISO/IEC 42001:2023': {
    // Annex A controls, Annex B guidance, and management-system clauses.
    re: /\b([AB]\.\d{1,2}(?:\.\d{1,2}){0,2})\b|\bCl(?:ause)?\.?\s*(\d{1,2}(?:\.\d{1,2}){0,2})\b/,
    canonical: (m) => m[1] || m[2],
  },
};

/** Strip the identifier and any leading separator from the cell it was found in. */
function remainder(cell, matchText) {
  return cell
    .replace(matchText, ' ')
    // Leading separator: a dash, punctuation, or the U+FFFD some registry
    // titles carry where an em dash was lost.
    .replace(/^[\s—–\-:.)\]�]+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Resolve one row.
 *
 * @param {string} framework  framework name as the mapping files write it
 * @param {string[]} cells    the row's cells, in order
 * @param {string[]} headers  the table's header cells, when it has them
 * @returns {{id: string, name: string, parent: string|null, cellIndex: number}|null}
 *          null when the framework has no grammar, or no cell carries its id
 */
/** Header labels that introduce a control's name rather than its requirement. */
const NAME_HEADER = /^(name|title|control|criteri|safeguard|practice|categor|article|section|clause|requirement|principle|domain)/;

function resolveControlId(framework, cells, headers = []) {
  const g = GRAMMARS[framework];
  if (!g) return null;

  for (let i = 0; i < cells.length; i++) {
    const cell = String(cells[i] || '').replace(/\*\*/g, '').trim();
    if (!cell) continue;
    const m = cell.match(g.re);
    if (!m) continue;

    const id = g.canonical ? g.canonical(m) : m[1];
    if (!id) continue;

    // The name: what is left in this cell once the id is removed. Failing
    // that, the nearest cell *before* the id — these tables write
    // "Name | ID | prose", never "ID | prose | Name", so a later cell is the
    // requirement or its evidence, not a control name.
    let name = remainder(cell, m[0]);
    if (!name || name.length > NAME_MAX) {
      name = '';
      const usable = (j) => {
        const text = String(cells[j] || '').replace(/\*\*/g, '').trim();
        return text && text.length <= NAME_MAX && !g.re.test(text) ? text : null;
      };
      // The table says which column holds the name.
      for (let j = 0; j < cells.length && !name; j++) {
        if (j === i) continue;
        const h = String(headers[j] || '').toLowerCase().replace(/[^a-z ]/g, ' ').trim();
        if (h && NAME_HEADER.test(h)) name = usable(j) || '';
      }
      // Otherwise the nearest cell before the id: these tables write
      // "Name | ID | prose", never "ID | prose | Name".
      for (let j = i - 1; j >= 0 && !name; j--) name = usable(j) || '';
    }

    let parent = null;
    if (g.parentRe) {
      for (const c of cells) {
        const pm = String(c || '').match(g.parentRe);
        if (pm) { parent = g.parent(pm); break; }
      }
    }

    return { id, name, parent, cellIndex: i };
  }
  return null;
}

/**
 * What a finished `control_id` must look like, per framework — the anchored
 * form of the grammar above. The validator uses it to prove the repair holds
 * and to catch a future row that reintroduces prose.
 */
const ID_SHAPES = {
  'SOC 2': /^(?:CC|PI|A|C|P)\d\.\d{1,2}$/,
  'EU AI Act': /^(?:Art\. \d{1,3}(?:\(\w{1,3}\))*|Annex [IVXL]+)$/,
  'OWASP NHI Top 10': /^NHI-\d{1,2}$/,
  'CIS Controls v8.1': /^\d{1,2}\.\d{1,2}$/,
  'PCI DSS v4.0': /^Req \d{1,2}(?:\.\d{1,3}){0,2}$/,
  'NIST SP 800-218A': /^[A-Z]{2}\.\d{1,2}\.\d{1,2}(?:-PS)?$/,
  'NIST SP 800-82 Rev 3': /^(?:§\d{1,2}(?:\.\d{1,2}){0,2}|[A-Z]{2}-\d{1,2})$/,
  'CWE/CVE': /^(?:CWE-\d{1,4}|CVE-\d{4}-\d{4,7})$/,
  'OWASP AI Testing Guide': /^[A-Z]{3}$/,
  'ISO/IEC 42001:2023': /^(?:[AB]\.\d{1,2}(?:\.\d{1,2}){0,2}|\d{1,2}(?:\.\d{1,2}){0,2})$/,
  'OWASP ASVS 4.0.3': /^V\d{1,2}\.\d{1,2}\.\d{1,2}$/,
};

/**
 * Identifiers a *registry* may hold that a mapping row would not.
 *
 * A CIS mapping row cites the safeguard (`16.1`, ruling A on #35), but the
 * registry also carries the parent controls those safeguards belong to.
 */
const REGISTRY_EXTRA_SHAPES = {
  'CIS Controls v8.1': /^CIS-\d{1,2}$/,
  // ASVS registries carry the chapters (V8) beside the requirements (V8.1.1).
  // chapters (V8) and sections (V8.1) sit in the registry beside requirements
  'OWASP ASVS 4.0.3': /^V\d{1,2}(\.\d{1,2})?$/,
};

/** True when `id` is well-formed for `framework` in a registry file. */
function isValidRegistryId(framework, id) {
  const extra = REGISTRY_EXTRA_SHAPES[framework];
  return isValidControlId(framework, id) || (extra ? extra.test(String(id).trim()) : false);
}

/** True when `id` is a well-formed identifier for `framework`. */
function isValidControlId(framework, id) {
  const shape = ID_SHAPES[framework];
  return shape ? shape.test(String(id).trim()) : true;
}

module.exports = { resolveControlId, isValidControlId, isValidRegistryId, GRAMMARS, ID_SHAPES, REGISTRY_EXTRA_SHAPES, NAME_MAX };
