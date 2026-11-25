#!/usr/bin/env node
'use strict';
/**
 * export-aibom-index.js — the crosswalk as one file an AI Bill of Materials
 * generator can vendor (T-AIBOM01).
 *
 * Writes data/exports/aibom-index.json: the OWASP GenAI entries, the
 * framework registries, the controls the mappings cite, and every
 * entry → control link with its review status. An AIBOM tool (first
 * consumer: the OWASP AIBOM Generator) uses it to list a model's *candidate*
 * risks and the controls mapped to them. See docs/AIBOM_INTEGRATION.md.
 *
 * What it deliberately does not do
 *   - Decide which risks apply to a model. That table is
 *     data/aibom-applicability.json, hand-authored and DRAFT (C4).
 *   - Upgrade anything. A link is `reviewed` only when its row names a
 *     reviewer; `draft` when its notes carry the DRAFT marker stats.js counts;
 *     `unreviewed` otherwise.
 *   - Redistribute text it may not. Control titles and descriptions ship only
 *     for registries whose `license` is on OPEN_LICENSES; for the rest a
 *     consumer gets the id and a link.
 *
 * Deterministic and timestamp-free (T-ENG03): the same data gives the same
 * bytes, so CI's generator-reproducibility diff can check it. Run by
 * scripts/generate.js on a full run, or directly:
 *
 *   node scripts/export-aibom-index.js          # write
 *   node scripts/export-aibom-index.js --check  # exit 1 if out of date
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_REL = 'data/exports/aibom-index.json'; // posix form; path.join resolves it per platform

/**
 * Registry `license` values whose control text may be redistributed inside a
 * BOM. Exact strings, as written in data/frameworks/*.json. Anything else —
 * "Proprietary (…)", "CC BY-NC-SA 4.0" (non-commercial) — ships id + url only.
 * "Public" is EU legislation (reusable under Commission Decision 2011/833/EU)
 * and MITRE ATLAS (Apache-2.0 data).
 */
const OPEN_LICENSES = new Set([
  'Public Domain',
  'Public',
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'Apache-2.0',
  'MIT',
]);

/** Display names and URLs for the four source lists (as in README.md). */
const SOURCE_LISTS = {
  'LLM-Top10-2026': {
    name: 'OWASP Top 10 for LLM Applications 2026',
    url: 'https://genai.owasp.org/llm-top-10/',
  },
  'Agentic-Top10-2026': {
    name: 'OWASP Top 10 for Agentic Applications 2026',
    url: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
  },
  'DSGAI-2026': {
    name: 'OWASP GenAI Data Security Risks and Mitigations 2026',
    url: 'https://genai.owasp.org/resource/owasp-genai-data-security-risks-mitigations-2026/',
  },
  'AST-Top10-2026': {
    name: 'OWASP Agentic Skills Top 10 2026',
    url: 'https://owasp.org/www-project-agentic-skills-top-10/',
  },
};

/** The marker stats.js counts as a placeholder row (scripts/stats.js, DRAFT_NOTE). */
const DRAFT_NOTE = /^DRAFT\b/;
/** A DRAFT marker anywhere in notes, e.g. "**DRAFT — … pending SME review (#93)**". */
const DRAFT_ANYWHERE = /\bDRAFT\b/;

const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const jsonFiles = (dir) =>
  fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort(byCodeUnit).map((n) => path.join(dir, n));

function reviewStatus(m) {
  if ((m.reviewed_by || []).length) return 'reviewed';
  const notes = m.notes || '';
  if (DRAFT_NOTE.test(notes) || DRAFT_ANYWHERE.test(notes)) return 'draft';
  return 'unreviewed';
}

/** Pure: build the index object from a repository root. */
function build(root = ROOT) {
  const pkg = readJson(path.join(root, 'package.json'));

  const registries = jsonFiles(path.join(root, 'data', 'frameworks')).map(readJson);
  const regByName = new Map(registries.map((r) => [r.name, r]));

  const frameworks = registries
    .map((r) => ({
      id: r.id,
      name: r.name,
      version: r.version ?? null,
      license: r.license ?? null,
      redistributable: OPEN_LICENSES.has(r.license),
      url: r.url ?? null,
    }))
    .sort((a, b) => byCodeUnit(a.id, b.id));

  const entryFiles = jsonFiles(path.join(root, 'data', 'entries'));
  const entries = [];
  const links = [];
  const cited = new Map(); // `${framework_id}\u0000${control_id}` -> {framework_id, control_id, mapping}
  const unresolvedFrameworks = new Set();

  for (const f of entryFiles) {
    const e = readJson(f);
    entries.push({ id: e.id, name: e.name, source_list: e.source_list, severity: e.severity ?? null });
    for (const m of e.mappings || []) {
      const reg = regByName.get(m.framework);
      if (!reg) { unresolvedFrameworks.add(m.framework); continue; }
      const link = {
        entry: e.id,
        framework_id: reg.id,
        control_id: m.control_id,
        confidence: m.confidence || 'unreviewed',
        review_status: reviewStatus(m),
        reviewed_by: [...(m.reviewed_by || [])],
      };
      if (m.relationship) link.relationship = m.relationship;
      if (Number.isInteger(m.strength)) link.strength = m.strength;
      links.push(link);
      const key = `${reg.id}\u0000${m.control_id}`;
      if (!cited.has(key)) cited.set(key, { framework_id: reg.id, control_id: m.control_id, mapping: m });
    }
  }
  entries.sort((a, b) => byCodeUnit(a.id, b.id));
  links.sort((a, b) =>
    byCodeUnit(a.entry, b.entry) || byCodeUnit(a.framework_id, b.framework_id) || byCodeUnit(a.control_id, b.control_id));

  const regById = new Map(registries.map((r) => [r.id, r]));
  const controls = [...cited.values()].map(({ framework_id, control_id, mapping }) => {
    const reg = regById.get(framework_id);
    const ctl = (reg.controls || []).find((c) => c.control_id === control_id);
    const out = { framework_id, control_id, url: (ctl && ctl.url) || mapping.url || reg.url || null };
    if (OPEN_LICENSES.has(reg.license)) {
      out.title = (ctl && ctl.title) || mapping.control_name || null;
      if (ctl && ctl.description) out.description = ctl.description;
    }
    if (!ctl) out.in_registry = false;
    return out;
  }).sort((a, b) => byCodeUnit(a.framework_id, b.framework_id) || byCodeUnit(a.control_id, b.control_id));

  const counts = { reviewed: 0, unreviewed: 0, draft: 0 };
  for (const l of links) counts[l.review_status]++;

  return {
    meta: {
      name: 'OWASP GenAI Crosswalk — AIBOM index',
      format_version: '1.0.0',
      crosswalk_version: pkg.version,
      source: 'https://github.com/GenAI-Security-Project/crosswalk',
      pin_note: 'Pin consumers to a commit SHA of the crosswalk repository; this file carries no date or commit by design.',
      license: 'CC BY-SA 4.0',
      attribution: 'OWASP GenAI Security Project — GenAI Crosswalk (https://github.com/GenAI-Security-Project/crosswalk), CC BY-SA 4.0',
      status: 'Candidate risks and mapped controls — not an assessment. A link is reviewed only where review_status says so.',
      applicability: 'data/aibom-applicability.json',
      counts: {
        entries: entries.length,
        frameworks: frameworks.length,
        controls: controls.length,
        links: links.length,
        links_by_review_status: counts,
      },
      unresolved_frameworks: [...unresolvedFrameworks].sort(byCodeUnit),
    },
    source_lists: Object.entries(SOURCE_LISTS).map(([id, v]) => ({ id, ...v })),
    entries,
    frameworks,
    controls,
    links,
  };
}

function render(index) {
  return JSON.stringify(index, null, 2) + '\n';
}

/** Write (or with check, compare) data/exports/aibom-index.json. Returns true when it changed / would change. */
function run({ root = ROOT, check = false } = {}) {
  const out = path.join(root, OUT_REL);
  const next = render(build(root));
  const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').replace(/\r\n/g, '\n') : null;
  if (current === next) return false;
  if (!check) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, next, 'utf8');
  }
  return true;
}

module.exports = { build, render, run, reviewStatus, OPEN_LICENSES, SOURCE_LISTS, OUT_REL };

if (require.main === module) {
  const check = process.argv.includes('--check');
  const changed = run({ check });
  if (check) {
    if (changed) {
      console.error(`aibom-index: ${OUT_REL} is out of date — run \`node scripts/export-aibom-index.js\``);
      process.exit(1);
    }
    console.log(`aibom-index: ${OUT_REL} is current`);
  } else {
    console.log(`aibom-index: ${OUT_REL} ${changed ? 'updated' : 'unchanged'}`);
  }
}
