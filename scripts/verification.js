'use strict';
/**
 * Verification methods and their links to controls (issue #191).
 *
 *   data/verification-methods.json               each method held once
 *   data/verification-links/<framework-id>.json  method ↔ control links, per framework
 *
 * A method says how to check that a control is implemented. A link says that a
 * method verifies a control: everywhere the control is mapped (`entry_id: null`)
 * or on one risk–control row (`entry_id` set). The two carry separate reviews,
 * because "is this method well written?" and "does it verify this control?" are
 * different judgments.
 *
 * v1 is data, schemas and this validator only. Nothing in generate.js, the
 * exports or the webapp reads these files yet.
 *
 * The allowed values (enums, id patterns, length limits) are read from the two
 * schemas, so the schemas stay the single source for them. The schemas cannot
 * express the cross-file rules — a link's method, control and mapping row must
 * exist — so those live here.
 *
 * checkVerification() returns findings; scripts/validate.js reports them.
 * Errors fail the build. Warnings flag review states that would overstate each
 * other: a reviewed link on a draft method, or on a mapping row nobody reviewed.
 */

const fs = require('fs');
const path = require('path');

const METHODS_FILE = path.join('data', 'verification-methods.json');
const LINKS_DIR = path.join('data', 'verification-links');
const METHODS_SCHEMA = path.join('data', 'verification-methods-schema.json');
const LINKS_SCHEMA = path.join('data', 'verification-links-schema.json');

const rel = (root, p) => path.relative(root, p).split(path.sep).join('/');
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isNamedList = (v) => Array.isArray(v) && v.every(isNonEmptyString);

function readJson(file) {
  try {
    return { doc: JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch (e) {
    return { error: e.message };
  }
}

/** The vocabulary both schemas define, extracted once. */
function loadRules(root) {
  const ms = JSON.parse(fs.readFileSync(path.join(root, METHODS_SCHEMA), 'utf8'));
  const ls = JSON.parse(fs.readFileSync(path.join(root, LINKS_SCHEMA), 'utf8'));
  const method = ms.definitions.Method;
  const source = ms.definitions.Source;
  const link = ls.definitions.Link;
  return {
    methodsTop: { required: ms.required, keys: Object.keys(ms.properties) },
    method: { required: method.required, keys: Object.keys(method.properties) },
    source: { required: source.required, keys: Object.keys(source.properties) },
    frequency: { required: ms.definitions.Frequency.required, keys: Object.keys(ms.definitions.Frequency.properties) },
    linksTop: { required: ls.required, keys: Object.keys(ls.properties) },
    link: { required: link.required, keys: Object.keys(link.properties) },
    methodId: new RegExp(method.properties.id.pattern),
    nameMax: method.properties.name.maxLength,
    methodTypes: method.properties.method_type.enum,
    statuses: method.properties.status.enum,
    frequencyModes: ms.definitions.Frequency.properties.mode.enum,
    url: new RegExp(source.properties.url.pattern),
    noReproduce: new RegExp(source.if.properties.license.pattern),
    date: new RegExp(method.properties.review_date.pattern),
    frameworkId: new RegExp(ls.properties.framework.pattern),
    entryId: new RegExp(link.properties.entry_id.oneOf[1].pattern),
  };
}

/** Required keys present, no undeclared keys. Returns messages. */
function shape(obj, { required, keys }, label) {
  const out = [];
  for (const k of required) if (!(k in obj)) out.push(`${label}: missing required field "${k}"`);
  for (const k of Object.keys(obj)) if (!keys.includes(k)) out.push(`${label}: unknown field "${k}"`);
  return out;
}

/** The top-level scalars both files share: version required, description optional. */
function topLevel(doc) {
  const out = [];
  if ('version' in doc && !isNonEmptyString(doc.version)) out.push('file: version must be a non-empty string');
  if ('description' in doc && typeof doc.description !== 'string') out.push('file: description must be a string');
  return out;
}

/** YYYY-MM-DD that names a real calendar day, so 2026-13-45 fails. */
function isCalendarDate(s, re) {
  if (!(typeof s === 'string' && re.test(s))) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

// ─── Methods ──────────────────────────────────────────────────────────────────

function checkMethod(m, i, R) {
  const label = `methods[${i}]${isNonEmptyString(m && m.id) ? ` ${m.id}` : ''}`;
  if (!isObject(m)) return [`${label}: not an object`];
  const out = shape(m, R.method, label);

  if ('id' in m && !(typeof m.id === 'string' && R.methodId.test(m.id))) {
    out.push(`${label}: id "${m.id}" does not match ${R.methodId.source}`);
  }
  if ('name' in m) {
    if (!isNonEmptyString(m.name)) out.push(`${label}: name must be a non-empty string`);
    else if (m.name.length > R.nameMax) out.push(`${label}: name is ${m.name.length} characters (max ${R.nameMax})`);
  }
  for (const k of ['procedure', 'expected_result', 'evidence', 'status_note']) {
    if (k in m && !isNonEmptyString(m[k])) out.push(`${label}: ${k} must be a non-empty string`);
  }
  if ('method_type' in m && !R.methodTypes.includes(m.method_type)) {
    out.push(`${label}: method_type "${m.method_type}" is not ${R.methodTypes.join('|')}`);
  }
  if ('status' in m && !R.statuses.includes(m.status)) {
    out.push(`${label}: status "${m.status}" is not ${R.statuses.join('|')}`);
  }
  if ('reviewed_by' in m && !isNamedList(m.reviewed_by)) {
    out.push(`${label}: reviewed_by must be a list of names`);
  }
  if (m.status === 'reviewed' && !(Array.isArray(m.reviewed_by) && m.reviewed_by.length)) {
    out.push(`${label}: status "reviewed" but reviewed_by is empty; only a named reviewer may mark a method reviewed`);
  }
  if (m.status === 'deprecated' && !('status_note' in m)) {
    out.push(`${label}: status "deprecated" requires status_note (the reason, and the replacement id if any)`);
  }
  if ('review_date' in m && !isCalendarDate(m.review_date, R.date)) {
    out.push(`${label}: review_date "${m.review_date}" is not a YYYY-MM-DD calendar date`);
  }
  if ('frequency' in m) {
    if (!isObject(m.frequency)) out.push(`${label}: frequency must be an object`);
    else {
      out.push(...shape(m.frequency, R.frequency, `${label} frequency`));
      if ('mode' in m.frequency && !R.frequencyModes.includes(m.frequency.mode)) {
        out.push(`${label}: frequency.mode "${m.frequency.mode}" is not ${R.frequencyModes.join('|')}`);
      }
    }
  }
  if ('source' in m && m.source !== null) {
    const s = m.source;
    if (!isObject(s)) out.push(`${label}: source must be an object or null`);
    else {
      out.push(...shape(s, R.source, `${label} source`));
      for (const k of R.source.keys) {
        if (k in s && !isNonEmptyString(s[k])) out.push(`${label}: source.${k} must be a non-empty string`);
      }
      if (isNonEmptyString(s.url) && !R.url.test(s.url)) out.push(`${label}: source.url must start with http:// or https://`);
      if (typeof s.license === 'string' && R.noReproduce.test(s.license) && 'text' in s) {
        out.push(`${label}: source.license "${s.license}" does not allow reproduction; cite by id and url and drop source.text`);
      }
    }
  }
  return out;
}

function checkMethods(root, R, findings) {
  const file = path.join(root, METHODS_FILE);
  const methods = new Map();
  if (!fs.existsSync(file)) return methods;
  const where = rel(root, file);

  const { doc, error } = readJson(file);
  if (error) { findings.errors.push({ file: where, msg: `not valid JSON: ${error}` }); return methods; }
  if (!isObject(doc)) { findings.errors.push({ file: where, msg: 'top level must be an object' }); return methods; }
  for (const msg of [...shape(doc, R.methodsTop, 'file'), ...topLevel(doc)]) findings.errors.push({ file: where, msg });
  if (!Array.isArray(doc.methods)) {
    if ('methods' in doc) findings.errors.push({ file: where, msg: 'methods must be an array' });
    return methods;
  }

  doc.methods.forEach((m, i) => {
    for (const msg of checkMethod(m, i, R)) findings.errors.push({ file: where, msg });
    if (isObject(m) && typeof m.id === 'string') {
      if (methods.has(m.id)) {
        findings.errors.push({ file: where, msg: `methods[${i}]: id ${m.id} is used more than once` });
      } else {
        methods.set(m.id, m);
      }
    }
  });
  return methods;
}

// ─── Links ────────────────────────────────────────────────────────────────────

/** Registry id → { name, controls }, and mapping rows keyed entry|name|control. */
function loadContext(root) {
  const registries = new Map();
  const fwDir = path.join(root, 'data', 'frameworks');
  if (fs.existsSync(fwDir)) {
    for (const f of fs.readdirSync(fwDir).filter((n) => n.endsWith('.json'))) {
      const { doc } = readJson(path.join(fwDir, f));
      if (!isObject(doc) || !doc.id) continue;
      registries.set(doc.id, {
        name: doc.name,
        controls: new Set((doc.controls || []).map((c) => c.control_id)),
      });
    }
  }
  const rows = new Map();
  const entDir = path.join(root, 'data', 'entries');
  if (fs.existsSync(entDir)) {
    for (const f of fs.readdirSync(entDir).filter((n) => n.endsWith('.json'))) {
      const { doc } = readJson(path.join(entDir, f));
      if (!isObject(doc)) continue;
      for (const m of doc.mappings || []) rows.set(`${doc.id}|${m.framework}|${m.control_id}`, m);
    }
  }
  return { registries, rows };
}

const sortKey = (l) => [String(l.control_id), l.entry_id === null ? '' : String(l.entry_id), String(l.method_id)];
function compareLinks(a, b) {
  const ka = sortKey(a), kb = sortKey(b);
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
}

function checkLinksFile(root, file, R, methods, ctx, findings) {
  const where = rel(root, file);
  const err = (msg) => findings.errors.push({ file: where, msg });
  const warn = (msg) => findings.warnings.push({ file: where, msg });
  const stem = path.basename(file, '.json');

  const { doc, error } = readJson(file);
  if (error) return err(`not valid JSON: ${error}`);
  if (!isObject(doc)) return err('top level must be an object');
  for (const msg of [...shape(doc, R.linksTop, 'file'), ...topLevel(doc)]) err(msg);

  if (doc.framework !== stem) err(`framework "${doc.framework}" does not match the file name "${stem}"`);
  else if (!R.frameworkId.test(stem)) err(`framework id "${stem}" is not a registry id`);
  const registry = ctx.registries.get(doc.framework);
  if (doc.framework === stem && !registry) err(`no registry data/frameworks/${stem}.json`);

  if (!Array.isArray(doc.links)) {
    if ('links' in doc) err('links must be an array');
    return 0;
  }

  const seen = new Set();
  let reviewed = 0;
  doc.links.forEach((l, i) => {
    const label = `links[${i}]`;
    if (!isObject(l)) return err(`${label}: not an object`);
    const shapeErrors = shape(l, R.link, label);
    shapeErrors.forEach(err);
    if (shapeErrors.length) return;

    const tag = `${label} ${l.method_id} → ${l.control_id}${l.entry_id ? ` @ ${l.entry_id}` : ''}`;
    if (!(typeof l.method_id === 'string' && R.methodId.test(l.method_id))) err(`${tag}: method_id does not match ${R.methodId.source}`);
    if (!isNonEmptyString(l.control_id)) err(`${tag}: control_id must be a non-empty string`);
    if (!(l.entry_id === null || (typeof l.entry_id === 'string' && R.entryId.test(l.entry_id)))) {
      err(`${tag}: entry_id must be null or an entry id such as ASI04`);
    }
    if (!isNamedList(l.reviewed_by)) err(`${tag}: reviewed_by must be a list of names`);

    const key = `${l.method_id}|${l.control_id}|${l.entry_id}`;
    if (seen.has(key)) err(`${tag}: duplicate link`);
    seen.add(key);

    const method = methods.get(l.method_id);
    if (!method) err(`${tag}: method ${l.method_id} is not in ${METHODS_FILE.split(path.sep).join('/')}`);
    else if (method.status === 'deprecated') warn(`${tag}: method ${l.method_id} is deprecated; re-point or delete the link`);

    if (registry && !registry.controls.has(l.control_id)) {
      err(`${tag}: control ${l.control_id} is not in data/frameworks/${doc.framework}.json`);
    }

    // The registry id is the key; mapping rows carry the registry's display name.
    let row;
    if (registry && typeof l.entry_id === 'string') {
      row = ctx.rows.get(`${l.entry_id}|${registry.name}|${l.control_id}`);
      if (!row) err(`${tag}: no mapping row for ${l.entry_id} × ${registry.name} ${l.control_id}`);
    }

    const linkReviewed = Array.isArray(l.reviewed_by) && l.reviewed_by.length > 0;
    if (linkReviewed) {
      reviewed++;
      if (method && method.status === 'draft') {
        warn(`${tag}: link is reviewed but method ${l.method_id} is still draft`);
      }
      if (row && !(Array.isArray(row.reviewed_by) && row.reviewed_by.length)) {
        warn(`${tag}: link is reviewed but the mapping row ${l.entry_id} × ${l.control_id} is unreviewed`);
      }
    }
  });

  // A sorted file spreads parallel additions across it instead of all at its end.
  for (let i = 1; i < doc.links.length; i++) {
    const a = doc.links[i - 1], b = doc.links[i];
    if (isObject(a) && isObject(b) && compareLinks(a, b) > 0) {
      err(`links are not sorted at links[${i}] (expected order: control_id, entry_id with control-level first, method_id)`);
      break;
    }
  }
  findings.counts.links += doc.links.length;
  findings.counts.reviewedLinks += reviewed;
  return doc.links.length;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

/**
 * @param {string} root repository root
 * @returns {{ errors: {file:string,msg:string}[], warnings: {file:string,msg:string}[],
 *             counts: {methods:number, reviewedMethods:number, linkFiles:number, links:number, reviewedLinks:number},
 *             summary: string }}
 */
function checkVerification(root) {
  const findings = {
    errors: [],
    warnings: [],
    counts: { methods: 0, reviewedMethods: 0, linkFiles: 0, links: 0, reviewedLinks: 0 },
  };
  const R = loadRules(root);
  const methods = checkMethods(root, R, findings);
  findings.counts.methods = methods.size;
  findings.counts.reviewedMethods = [...methods.values()].filter((m) => m.status === 'reviewed').length;

  const dir = path.join(root, LINKS_DIR);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort();
    if (files.length) {
      const ctx = loadContext(root);
      for (const f of files) checkLinksFile(root, path.join(dir, f), R, methods, ctx, findings);
    }
    findings.counts.linkFiles = files.length;
  }

  const c = findings.counts;
  findings.summary = `${c.methods} method(s), ${c.reviewedMethods} reviewed; ` +
    `${c.links} link(s) in ${c.linkFiles} file(s), ${c.reviewedLinks} reviewed`;
  return findings;
}

module.exports = { checkVerification, loadRules, compareLinks };