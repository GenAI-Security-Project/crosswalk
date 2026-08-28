#!/usr/bin/env node
/**
 * OWASP GenAI Crosswalk — Content Validator
 *
 * Checks all mapping files for structural integrity, internal link
 * resolution, bidirectional cross-references, naming conventions,
 * and changelog presence.
 *
 * Usage:
 *   node scripts/validate.js           # full validation
 *   node scripts/validate.js --quick   # skip cross-ref check
 *   node scripts/validate.js --file agentic-top10/Agentic_SAMM.md
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

const MAPPING_FOLDERS = [
  'llm-top10',
  'agentic-top10',
  'dsgai-2026',
  'ast-top10',
];

// Every mapping file must contain these heading patterns (case-insensitive)
const REQUIRED_SECTIONS = [
  /^#\s+.+×.+|^#\s+.+—.+/m,           // H1 title with × or —
  /^##\s+why\s+/im,                      // Why [framework] section
  /^##\s+quick.?reference/im,            // Quick-reference summary
  /^##\s+(audience|target audience)/im,  // Audience tags
  /^###\s+.*(01|ASI01|LLM01|DSGAI01)/im,// At least one detailed entry (first entry)
  /^##\s+references/im,                  // References section
  /^##\s+changelog/im,                   // Changelog section
];

// Naming convention: SourceList_Framework.md
// Valid prefixes
const VALID_PREFIXES = {
  'llm-top10':     /^LLM_/,
  'agentic-top10': /^Agentic_/,
  'dsgai-2026':    /^DSGAI_/,
  'ast-top10':     /^AST_/,
};

// Known valid cross-reference IDs
const VALID_IDS = {
  llm:     Array.from({length: 10}, (_, i) => `LLM${String(i+1).padStart(2,'0')}`),
  agentic: Array.from({length: 10}, (_, i) => `ASI${String(i+1).padStart(2,'0')}`),
  dsgai:   Array.from({length: 21}, (_, i) => `DSGAI${String(i+1).padStart(2,'0')}`),
  ast:     Array.from({length: 10}, (_, i) => `AST${String(i+1).padStart(2,'0')}`),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let errors   = 0;
let warnings = 0;
const results = [];

function fail(file, msg) {
  errors++;
  results.push({ level: 'ERROR', file, msg });
}

function warn(file, msg) {
  warnings++;
  results.push({ level: 'WARN', file, msg });
}

function pass(file, msg) {
  results.push({ level: 'OK', file, msg });
}

function relPath(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

// ─── Checks ───────────────────────────────────────────────────────────────────

/**
 * 1. Naming convention
 */
function checkNaming(folder, filename) {
  const pattern = VALID_PREFIXES[folder];
  if (!pattern.test(filename)) {
    fail(
      `${folder}/${filename}`,
      `Naming violation: expected prefix matching ${pattern} (got "${filename}")`
    );
    return false;
  }
  return true;
}

/**
 * 2. Required sections
 */
function checkSections(filePath, content) {
  const rel = relPath(filePath);
  let ok = true;
  for (const pattern of REQUIRED_SECTIONS) {
    if (!pattern.test(content)) {
      fail(rel, `Missing required section matching: ${pattern}`);
      ok = false;
    }
  }
  if (ok) pass(rel, 'All required sections present');
  return ok;
}

/**
 * 3. Internal links — markdown links pointing to .md files must resolve
 */
function checkInternalLinks(filePath, content) {
  const rel   = relPath(filePath);
  const dir   = path.dirname(filePath);
  const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let broken = 0;

  while ((match = linkRe.exec(content)) !== null) {
    const href = match[2].split('#')[0]; // strip anchor
    // Only check relative .md links (not http, not anchors-only)
    if (!href || href.startsWith('http') || href.startsWith('mailto')) continue;
    if (!href.endsWith('.md')) continue;

    const target = path.resolve(dir, href);
    if (!fs.existsSync(target)) {
      fail(rel, `Broken internal link: [${match[1]}](${match[2]})`);
      broken++;
    }
  }

  if (broken === 0) pass(rel, 'All internal .md links resolve');
  return broken === 0;
}

/**
 * 4. Changelog entry — must have at least one dated entry
 */
function checkChangelog(filePath, content) {
  const rel = relPath(filePath);
  // Look for a date pattern in the changelog section
  const changelogSection = content.match(/## changelog[\s\S]*/i);
  if (!changelogSection) {
    fail(rel, 'No changelog section found');
    return false;
  }
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  if (!datePattern.test(changelogSection[0])) {
    warn(rel, 'Changelog section found but no dated entry (YYYY-MM-DD format)');
    return false;
  }
  pass(rel, 'Changelog has dated entry');
  return true;
}

/**
 * 5. License header — must have CC BY-SA 4.0 declaration
 */
function checkHeader(filePath, content) {
  const rel = relPath(filePath);
  if (!content.includes('CC BY-SA 4.0')) {
    warn(rel, 'Missing CC BY-SA 4.0 license declaration in header');
    return false;
  }
  return true;
}

/**
 * 6. Cross-reference format — any ASI/LLM/DSGAI IDs mentioned must be valid
 */
function checkCrossRefFormat(filePath, content) {
  const rel = relPath(filePath);
  const idRe = /\b(LLM\d{2}|ASI\d{2}|DSGAI\d{2}|AST\d{2})\b/g;
  let match;
  let invalid = 0;
  const allValid = [
    ...VALID_IDS.llm,
    ...VALID_IDS.agentic,
    ...VALID_IDS.dsgai,
    ...VALID_IDS.ast,
  ];

  while ((match = idRe.exec(content)) !== null) {
    const id = match[1];
    if (!allValid.includes(id)) {
      fail(rel, `Invalid vulnerability ID referenced: ${id}`);
      invalid++;
    }
  }

  if (invalid === 0) pass(rel, 'All referenced vulnerability IDs are valid');
  return invalid === 0;
}

/**
 * 7. Bidirectional cross-references
 *    If file A mentions "See also: Agentic_FOO.md", then Agentic_FOO.md
 *    should mention a link back to the source file or its parent source list.
 *
 *    This is a best-effort soft check (warn, not fail) because patterns vary.
 */
function buildCrossRefMap(allFiles) {
  const map = {}; // filePath → Set of internal .md files it links to

  for (const fp of allFiles) {
    const content = fs.readFileSync(fp, 'utf8');
    const linkRe  = /\[([^\]]*)\]\(([^)#)]+\.md)[^)]*\)/g;
    let match;
    map[fp] = new Set();

    while ((match = linkRe.exec(content)) !== null) {
      const href   = match[2];
      const target = path.resolve(path.dirname(fp), href);
      if (fs.existsSync(target)) {
        map[fp].add(path.resolve(target));
      }
    }
  }

  return map;
}

function checkBidirectional(allFiles, crossRefMap) {
  let issues = 0;

  for (const fp of allFiles) {
    const linked = crossRefMap[fp] || new Set();
    for (const targetFp of linked) {
      // Only check within mapping folders
      const isMapping = MAPPING_FOLDERS.some(f =>
        targetFp.includes(path.sep + f + path.sep) ||
        targetFp.includes('/' + f + '/')
      );
      if (!isMapping) continue;

      const targetLinks = crossRefMap[targetFp] || new Set();
      if (!targetLinks.has(path.resolve(fp))) {
        warn(
          relPath(fp),
          `One-way link to ${relPath(targetFp)} — consider adding a back-reference`
        );
        issues++;
      }
    }
  }

  return issues;
}

// ─── CROSSREF.md check ───────────────────────────────────────────────────────

/**
 * 8. CROSSREF.md must mention all LLM, ASI, and DSGAI IDs
 */
function checkCrossRefFile() {
  const crossRefPath = path.join(ROOT, 'CROSSREF.md');
  if (!fs.existsSync(crossRefPath)) {
    fail('CROSSREF.md', 'File does not exist');
    return;
  }

  const content = fs.readFileSync(crossRefPath, 'utf8');
  const missing = [];

  for (const id of [...VALID_IDS.llm, ...VALID_IDS.agentic, ...VALID_IDS.dsgai, ...VALID_IDS.ast]) {
    if (!content.includes(id)) missing.push(id);
  }

  if (missing.length === 0) {
    pass('CROSSREF.md', 'All vulnerability IDs present');
  } else {
    warn('CROSSREF.md', `Missing vulnerability IDs: ${missing.join(', ')}`);
  }
}

// ─── README count consistency ─────────────────────────────────────────────────

/**
 * 9. README.md badge counts must match actual file counts
 */
function checkReadmeCounts() {
  const readmePath = path.join(ROOT, 'README.md');
  if (!fs.existsSync(readmePath)) {
    fail('README.md', 'File does not exist');
    return;
  }

  const content = fs.readFileSync(readmePath, 'utf8');

  // Count actual mapping files
  let actual = 0;
  for (const folder of MAPPING_FOLDERS) {
    const dir = path.join(ROOT, folder);
    if (fs.existsSync(dir)) {
      actual += fs.readdirSync(dir)
        .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md').length;
    }
  }

  // Extract badge count from README
  const badgeMatch = content.match(/mapping%20files-(\d+)-brightgreen/);
  if (!badgeMatch) {
    warn('README.md', 'Could not find mapping-files badge to verify count');
    return;
  }

  const badgeCount = parseInt(badgeMatch[1], 10);
  if (badgeCount !== actual) {
    fail(
      'README.md',
      `Badge says ${badgeCount} mapping files but found ${actual} on disk`
    );
  } else {
    pass('README.md', `Mapping file count consistent: ${actual}`);
  }
}

// ─── Shared resources check ───────────────────────────────────────────────────

/**
 * 10. Required shared files must exist
 */
function checkSharedResources() {
  const required = [
    'shared/RECIPES.md',
    'shared/TOOLS.md',
    'shared/GLOSSARY.md',
    'shared/SEVERITY.md',
    'data/schema.json',
    'CROSSREF.md',
    'CONTRIBUTING.md',
    'CHANGELOG.md',
    'README.md',
  ];

  for (const rel of required) {
    const fp = path.join(ROOT, rel);
    if (!fs.existsSync(fp)) {
      fail(rel, 'Required file is missing');
    } else {
      pass(rel, 'Exists');
    }
  }
}

// ─── Framework version drift ──────────────────────────────────────────────────

/**
 * 16. A mapped framework version that has fallen behind upstream.
 *
 * ASVS 4.0.3 sat in this repo while 5.0.0 shipped, and nothing said so. The
 * whole point of pinning `framework_version` on a mapping is that the rot
 * becomes visible rather than silent.
 *
 * Warns rather than fails: a divergence is a real state of the world, not a
 * defect in the commit that surfaced it. Closing it means re-mapping, which is
 * human work.
 *
 * A framework with no confirmed `current_version` is not counted — an unchecked
 * upstream is a gap in the source file, reported by `npm run watch`.
 */
function checkFrameworkVersions() {
  const p = path.join(ROOT, 'data', 'framework-sources.json');
  if (!fs.existsSync(p)) return true;

  const doc = JSON.parse(fs.readFileSync(p, 'utf8'));
  const diverged = [];
  let unchecked = 0;

  for (const [key, f] of Object.entries(doc.frameworks || {})) {
    if (!f.current_version) { unchecked++; continue; }
    if (f.current_version !== f.mapped_version) {
      diverged.push(`${f.name || key}: mapped ${f.mapped_version}, upstream ${f.current_version}`);
    }
  }

  for (const d of diverged) {
    warn('Framework currency', `${d} — mappings are against the older release`);
  }
  if (!diverged.length) {
    pass('Framework currency', `No confirmed divergence (${unchecked} framework(s) unchecked)`);
  }
  return true;
}

// ─── CROSSREF framework guard ─────────────────────────────────────────────────

/**
 * 15. Every framework named in CROSSREF's navigation column must be mappable.
 *
 * CROSSREF is the index: "follow the row to see which framework files cover it."
 * Naming a framework there that has no registry and no mapping file promises a
 * destination that does not exist. Five did — MITRE ATT&CK, ISO 27701,
 * CycloneDX ML-BOM, BSIMM, COBIT — and they are now footnoted under
 * "Referenced but not yet mapped" instead.
 *
 * The footnote table is deliberately exempt: it exists to name the gaps.
 */
function checkCrossRefFrameworks() {
  const crossref = path.join(ROOT, 'CROSSREF.md');
  if (!fs.existsSync(crossref)) return true;

  const known = new Set();
  const fwDir = path.join(ROOT, 'data', 'frameworks');
  if (fs.existsSync(fwDir)) {
    for (const f of fs.readdirSync(fwDir).filter((n) => n.endsWith('.json'))) {
      const reg = JSON.parse(fs.readFileSync(path.join(fwDir, f), 'utf8'));
      for (const v of [reg.name, reg.short_name, reg.id]) if (v) known.add(v.toLowerCase());
    }
  }

  const content = fs.readFileSync(crossref, 'utf8');
  const lines = content.split('\n');
  // Scope to the cross-reference table itself. The file carries other
  // five-column tables — the AST index uses column 4 for MAESTRO layers — and
  // an unscoped check reads those values as framework names.
  const tableAt = lines.findIndex((l) => /^##\s+Cross-reference table/i.test(l));
  // Any subsequent heading ends the scope, including an h3 — the AST index sits
  // under one, before the next h2.
  const tableEnd = lines.findIndex((l, i) => i > tableAt && /^#{2,6}\s/.test(l));

  const unknown = new Set();
  lines.forEach((line, i) => {
    if (tableAt === -1 || i < tableAt) return;
    if (tableEnd !== -1 && i >= tableEnd) return;
    if (!line.startsWith('|') || line.split('|').length < 6) return;
    const col = line.split('|')[4];
    if (/primary frameworks/i.test(col) || /^[\s-]*$/.test(col)) return;

    for (const raw of col.split('·')) {
      const tok = raw.trim().replace(/\*\*/g, '');
      if (!tok || tok === '—') continue;
      // a token matches if any registry name/short name shares its opening word
      const head = tok.toLowerCase().split(/[\s/]/)[0];
      const ok = [...known].some((k) => k.startsWith(head) || head.startsWith(k.split(/[\s/]/)[0]));
      if (!ok) unknown.add(tok);
    }
  });

  if (unknown.size) {
    for (const u of unknown) {
      fail('CROSSREF.md',
        `"${u}" is named in the navigation column but has no registry in data/frameworks/. ` +
        'Map it, or move it to "Referenced but not yet mapped".');
    }
    return false;
  }
  pass('CROSSREF.md', 'Every framework in the navigation column has a registry');
  return true;
}

// ─── Density guard ────────────────────────────────────────────────────────────

/**
 * 14. Controls that map to most of the list.
 *
 * A control asserted against the majority of entries discriminates nothing and
 * inflates every coverage score that counts it. This raises a single summary
 * warning rather than one per control: the detail belongs in
 * reports/density-violations.md, and 21 individual warnings would drown the
 * existing signal.
 *
 * It warns rather than fails, because the fix is re-curation — deciding whether
 * a control is genuinely cross-cutting or over-mapped is security judgment (C4)
 * and not something this script may do.
 */
const DENSITY_THRESHOLD = 0.40;

function checkDensity() {
  const entryDir = path.join(ROOT, 'data', 'entries');
  if (!fs.existsSync(entryDir)) return true;

  const layerIds = new Set();
  const fwDir = path.join(ROOT, 'data', 'frameworks');
  if (fs.existsSync(fwDir)) {
    for (const f of fs.readdirSync(fwDir).filter((n) => n.endsWith('.json'))) {
      const reg = JSON.parse(fs.readFileSync(path.join(fwDir, f), 'utf8'));
      for (const c of reg.controls || []) {
        if (c.kind === 'layer') layerIds.add(reg.name + ' ' + c.control_id);
      }
    }
  }

  const files = fs.readdirSync(entryDir).filter((n) => n.endsWith('.json'));
  const hits = new Map();
  for (const f of files) {
    const entry = JSON.parse(fs.readFileSync(path.join(entryDir, f), 'utf8'));
    for (const m of entry.mappings || []) {
      const key = m.framework + ' ' + m.control_id;
      if (!hits.has(key)) hits.set(key, { entries: new Set(), broad: false });
      hits.get(key).entries.add(entry.id);
      if (m.broad_applicability === true) hits.get(key).broad = true;
    }
  }

  const undeclared = [...hits.entries()].filter(
    ([key, r]) =>
      r.entries.size / files.length > DENSITY_THRESHOLD && !r.broad && !layerIds.has(key),
  );

  if (undeclared.length) {
    warn('Mapping density',
      undeclared.length + ' control(s) map to more than ' +
      Math.round(DENSITY_THRESHOLD * 100) + '% of entries without broad_applicability — ' +
      'run `npm run density` and see reports/density-violations.md for the list');
  } else {
    pass('Mapping density', 'No control maps to a majority of entries undeclared');
  }
  return true;
}

// ─── Schema v2 guard ──────────────────────────────────────────────────────────

/**
 * 13. Schema-v2 mapping fields must be well-formed where present.
 *
 * Migration is file-by-file, so this does not require the fields — it requires
 * that what exists is valid. Vocabularies follow NIST IR 8278A Rev. 1; see
 * docs/SCHEMA_V2_MIGRATION.md.
 *
 * The one hard rule: a row may not claim review it does not have. `confidence`
 * above `unreviewed` with an empty `reviewed_by` is exactly the false
 * confidence schema v2 exists to prevent, so it fails.
 */
const V2_RELATIONSHIPS = ['equal', 'subset-of', 'superset-of', 'intersects-with', 'not-related-to'];
const V2_RATIONALE_TYPES = ['syntactic', 'semantic', 'functional'];
const V2_CONFIDENCE = ['high', 'medium', 'low', 'unreviewed'];

function checkSchemaV2() {
  const dir = path.join(ROOT, 'data', 'entries');
  if (!fs.existsSync(dir)) return true;

  let violations = 0;
  const seen = { total: 0, typed: 0, reviewed: 0 };

  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    const entry = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    (entry.mappings || []).forEach((m, i) => {
      const where = `${entry.id} mapping[${i}] ${m.framework}:${m.control_id}`;
      seen.total++;

      const bad = (field, allowed) =>
        m[field] !== undefined && !allowed.includes(m[field]);

      if (bad('relationship', V2_RELATIONSHIPS)) {
        fail('data/entries/' + f, `${where} — relationship "${m.relationship}" is not an OLIR value`);
        violations++;
      }
      if (bad('rationale_type', V2_RATIONALE_TYPES)) {
        fail('data/entries/' + f, `${where} — rationale_type "${m.rationale_type}" is not syntactic|semantic|functional`);
        violations++;
      }
      if (bad('confidence', V2_CONFIDENCE)) {
        fail('data/entries/' + f, `${where} — confidence "${m.confidence}" is not high|medium|low|unreviewed`);
        violations++;
      }
      if (m.confidence && m.confidence !== 'unreviewed' && !(m.reviewed_by || []).length) {
        fail('data/entries/' + f,
          `${where} — confidence "${m.confidence}" but reviewed_by is empty; only a named reviewer may raise confidence`);
        violations++;
      }
      if (m.relationship) seen.typed++;
      if ((m.reviewed_by || []).length) seen.reviewed++;
    });
  }

  if (!violations) {
    pass('Schema v2',
      `${seen.total} mappings — ${seen.typed} with a relationship, ${seen.reviewed} human-reviewed`);
  }
  return violations === 0;
}

// ─── Encoding guard ───────────────────────────────────────────────────────────

/**
 * 12. Catch text mangled by an encoding round-trip.
 *
 * This repository has a mojibake history: arrows (→ ↓ ←) and dashes flattened
 * to a bare '?' or to U+FFFD, and once committed they are invisible in review
 * and survive for years. Sixty-four such arrows were present in the first
 * commit and were still there when this guard was written.
 *
 * Two signatures are checked:
 *   U+FFFD          the replacement character — always corruption
 *   ' ? ' / '? ['   a lone question mark used where an arrow belongs, in a
 *                   heading, a diagram line, or an "A ? B" flow
 *
 * A genuine question inside prose ends the sentence, so it is not preceded by
 * a space; that shape does not match.
 */
const MOJIBAKE_FILES = ['**/*.md'];

function checkEncoding(allFiles) {
  let violations = 0;

  for (const fp of allFiles) {
    const rel = relPath(fp);
    const content = fs.readFileSync(fp, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, i) => {
      const n = i + 1;
      if (line.includes('�')) {
        fail(rel, `Replacement character (U+FFFD) at line ${n} — text was decoded with the wrong encoding`);
        violations++;
        return;
      }
      // An arrow flattened to '?': in a heading, at the start of a diagram
      // line, or between two terms.
      const arrowish =
        /^#{1,6} .*\s\?\s/.test(line) ||
        /^\s*\?\s+[[\w]/.test(line) ||
        /\w\s\?\s\w/.test(line);
      if (arrowish) {
        fail(rel, `Likely mojibake arrow at line ${n}: "${line.trim().slice(0, 70)}"`);
        violations++;
      }
    });
  }

  if (!violations) pass('Encoding', 'No mojibake found in markdown content');
  return violations === 0;
}

// ─── Attribution guard (C1) ───────────────────────────────────────────────────

/**
 * 11. Personal attribution belongs in exactly two places.
 *
 * The project is OWASP-owned, so the maintainer's name and handle appear only
 * in README.md and the webapp About block. Everywhere else — package metadata,
 * licence, provenance stamps, issue templates, translated READMEs — the author
 * is the OWASP GenAI Data Security Initiative.
 *
 * The exemptions below are deliberate and each has a reason. They are not a
 * licence to reintroduce credit; adding a new one needs a maintainer decision.
 */
// Assembled from fragments so this file does not match its own pattern. Writing
// the literal here would either make the guard flag itself or force exempting
// scripts/validate.js, which would blind it to a real leak in its own source.
const ATTRIBUTION_RE = new RegExp(
  ['emmanuel' + 'gjr', 'Emmanuel' + '\\s+' + 'Guilherme'].join('|'),
  'i',
);

const ATTRIBUTION_ALLOWED = [
  'README.md',        // sanctioned credit
  'docs/index.html',  // sanctioned credit — the About view
];

const ATTRIBUTION_EXEMPT = [
  // Access control and review routing, not credit. Rewriting these would
  // silently drop code ownership and reviewer assignment.
  '.github/CODEOWNERS',
  'i18n/WORKFLOW.md',
  // A factual statement of who currently maintains the project. Governance
  // wording is GOV-02's call, not an attribution scrub's.
  'GOVERNANCE.md',
  // Historical record; past releases are not rewritten.
  'CHANGELOG.md',
  // Brand assets are frozen (C2) — the webapp's logo/social images.
  'docs/og-image.svg',
  'docs/banner.svg',
];

const ATTRIBUTION_SKIP_DIRS = ['node_modules', '.git', 'reports', 'dist', 'coverage'];

function walkFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (ATTRIBUTION_SKIP_DIRS.includes(name)) continue;
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) walkFiles(fp, out);
    else out.push(fp);
  }
  return out;
}

function checkAttribution() {
  const TEXT_EXT = new Set([
    '.md', '.json', '.js', '.mjs', '.ts', '.html', '.yml', '.yaml',
    '.py', '.sh', '.txt', '.svg',
  ]);
  let violations = 0;

  for (const fp of walkFiles(ROOT)) {
    const rel = path.relative(ROOT, fp).split(path.sep).join('/');
    if (ATTRIBUTION_ALLOWED.includes(rel) || ATTRIBUTION_EXEMPT.includes(rel)) continue;
    if (!TEXT_EXT.has(path.extname(fp))) continue;

    let content;
    try {
      content = fs.readFileSync(fp, 'utf8');
    } catch {
      continue;
    }
    if (!ATTRIBUTION_RE.test(content)) continue;

    const line = content.split('\n').findIndex((l) => ATTRIBUTION_RE.test(l)) + 1;
    fail(
      rel,
      `Personal attribution at line ${line} — C1 allows it only in ` +
        `${ATTRIBUTION_ALLOWED.join(' and ')}. Use "OWASP GenAI Data Security Initiative".`,
    );
    violations++;
  }

  if (!violations) pass('C1 attribution', 'Personal attribution confined to README.md and the About block');
  return violations === 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function collectMappingFiles(targetFile) {
  if (targetFile) {
    const fp = path.join(ROOT, targetFile);
    return fs.existsSync(fp) ? [fp] : [];
  }

  const files = [];
  for (const folder of MAPPING_FOLDERS) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir)) {
      // A directory README is documentation, not a mapping file: it has no
      // framework, no entries and no quick-reference table to validate.
      if (filename.endsWith('.md') && filename.toLowerCase() !== 'readme.md') {
        files.push(path.join(dir, filename));
      }
    }
  }
  return files;
}

function run() {
  const args       = process.argv.slice(2);
  const quickMode  = args.includes('--quick');
  const fileArg    = args.indexOf('--file');
  const targetFile = fileArg !== -1 ? args[fileArg + 1] : null;

  console.log('OWASP GenAI Crosswalk — Content Validator');
  console.log('='.repeat(50));
  if (quickMode)  console.log('Mode: quick (cross-ref bidirectionality skipped)');
  if (targetFile) console.log(`Mode: single file (${targetFile})`);
  console.log('');

  // Structural checks
  checkSharedResources();
  checkCrossRefFile();
  checkReadmeCounts();

  // Per-file checks
  const allFiles = collectMappingFiles(targetFile);
  console.log(`Checking ${allFiles.length} mapping file(s)...\n`);

  for (const fp of allFiles) {
    const folder   = path.basename(path.dirname(fp));
    const filename = path.basename(fp);
    const content  = fs.readFileSync(fp, 'utf8');

    checkNaming(folder, filename);
    checkSections(fp, content);
    checkInternalLinks(fp, content);
    checkChangelog(fp, content);
    checkHeader(fp, content);
    checkCrossRefFormat(fp, content);
  }

  // Bidirectional cross-reference check (expensive — skip in quick mode)
  if (!quickMode && !targetFile) {
    console.log('Checking bidirectional cross-references...\n');
    const crossRefMap = buildCrossRefMap(allFiles);
    checkBidirectional(allFiles, crossRefMap);
  }

  // Schema v2 guard — operates on generated entries, so full runs only
  if (!targetFile) {
    console.log('Checking schema v2...\n');
    checkSchemaV2();
    checkDensity();
    checkCrossRefFrameworks();
    checkFrameworkVersions();
  }

  // Encoding guard — mapping files plus the shared/root markdown they link to
  if (!targetFile) {
    console.log('Checking encoding...\n');
    const encodingFiles = [...allFiles];
    for (const rel of ['CROSSREF.md', 'README.md', 'CONTRIBUTING.md']) {
      const fp = path.join(ROOT, rel);
      if (fs.existsSync(fp)) encodingFiles.push(fp);
    }
    for (const f of fs.readdirSync(path.join(ROOT, 'shared')).filter((f) => f.endsWith('.md'))) {
      encodingFiles.push(path.join(ROOT, 'shared', f));
    }
    checkEncoding(encodingFiles);
  }

  // Attribution guard (C1) — repo-wide, so only in a full run
  if (!targetFile) {
    console.log('Checking attribution (C1)...\n');
    checkAttribution();
  }

  // ─── Report ───────────────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(50));
  console.log('RESULTS');
  console.log('='.repeat(50) + '\n');

  // Group by level
  const byLevel = { ERROR: [], WARN: [], OK: [] };
  for (const r of results) byLevel[r.level].push(r);

  if (byLevel.ERROR.length > 0) {
    console.log(`ERRORS (${byLevel.ERROR.length}):`);
    for (const r of byLevel.ERROR) {
      console.log(`  ✗ [${r.file}] ${r.msg}`);
    }
    console.log('');
  }

  if (byLevel.WARN.length > 0) {
    console.log(`WARNINGS (${byLevel.WARN.length}):`);
    for (const r of byLevel.WARN) {
      console.log(`  ⚠ [${r.file}] ${r.msg}`);
    }
    console.log('');
  }

  console.log(`Summary: ${byLevel.ERROR.length} error(s), ${byLevel.WARN.length} warning(s), ${byLevel.OK.length} passed`);

  if (errors > 0) {
    console.log('\n✗ Validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✓ Validation PASSED');
    process.exit(0);
  }
}

run();
