/**
 * genai-security-crosswalk
 * Machine-readable GenAI security risk mappings across the OWASP source lists
 * and the industry framework registries they map to.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface Mapping {
  framework: string;
  control_id: string;
  control_name: string;
  tier?: string;
  notes?: string;
}

export interface Tool {
  name: string;
  url: string;
  type?: string;
}

export interface IncidentRef {
  name: string;
  url: string;
  year: number;
  incident_id: string;
}

export interface Entry {
  id: string;
  name: string;
  source_list: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  aivss_score?: number;
  audience: string[];
  mappings: Mapping[];
  tools: Tool[];
  incidents: IncidentRef[];
  cross_references?: string[];
}

export interface MaestroLayer {
  layer: string;
  label: string;
  role: 'origin' | 'propagation' | 'impact' | 'blind-spot';
  notes: string;
}

export interface Reference {
  title: string;
  url: string;
  type: string;
}

export interface Incident {
  id: string;
  title: string;
  date: string;
  year: number;
  category: 'real-world' | 'research-demonstrated' | 'red-team';
  description: string;
  owasp_entries: string[];
  maestro_layers: MaestroLayer[];
  attack_vector: string;
  affected: string;
  impact: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  mitigations: string[];
  references: Reference[];
  tags: string[];
}

export interface CrosswalkDB {
  entries: Entry[];
  incidents: Incident[];
  frameworks: string[];
  version: string;
}

// ── Data loading ────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');

let _entries: Entry[] | undefined;
let _incidents: Incident[] | undefined;

function loadEntries(): Entry[] {
  if (_entries) return _entries;
  const dir = path.join(DATA_DIR, 'entries');
  _entries = fs.readdirSync(dir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Entry)
    .sort((a: Entry, b: Entry) => a.id.localeCompare(b.id));
  return _entries;
}

function loadIncidents(): Incident[] {
  if (_incidents) return _incidents;
  const file = path.join(DATA_DIR, 'incidents.json');
  const db = JSON.parse(fs.readFileSync(file, 'utf8'));
  _incidents = db.incidents as Incident[];
  return _incidents;
}

// ── Public API ──────────────────────────────────────────────────────────────

/** All 41 OWASP GenAI entries */
export const entries: Entry[] = loadEntries();

/** All documented incidents */
export const incidents: Incident[] = loadIncidents();

/** All framework names found in mappings */
export const frameworks: string[] = [...new Set(
  entries.flatMap(e => e.mappings.map(m => m.framework))
)].sort();

/**
 * Package version.
 *
 * Read from the generated stats rather than hardcoded — this constant said
 * 1.6.0 against a package.json of 4.0.0, the same drift T-DATA01 removed from
 * the README.
 */
export const version: string = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'stats.json'), 'utf8'),
).version as string;

/** Get a single entry by ID (e.g. 'LLM01', 'ASI01', 'DSGAI04') */
export function getEntry(id: string): Entry | undefined {
  return entries.find(e => e.id === id.toUpperCase());
}

/** Get all entries mapped to a specific framework */
export function getFramework(framework: string): { framework: string; entries: Entry[]; controls: Mapping[] } {
  const query = framework.toLowerCase();
  const matched = entries.filter(e =>
    e.mappings.some(m => m.framework.toLowerCase().includes(query))
  );
  const controls = matched.flatMap(e =>
    e.mappings.filter(m => m.framework.toLowerCase().includes(query))
  );
  const fwName = controls[0]?.framework || framework;
  return { framework: fwName, entries: matched, controls };
}

/** Search entries by keyword in name, mappings, or tools */
export function searchEntries(query: string): Entry[] {
  const q = query.toLowerCase();
  return entries.filter(e =>
    e.id.toLowerCase().includes(q) ||
    e.name.toLowerCase().includes(q) ||
    e.mappings.some(m => m.control_id?.toLowerCase().includes(q) || m.control_name?.toLowerCase().includes(q)) ||
    e.tools.some(t => t.name.toLowerCase().includes(q))
  );
}

/** Get entries by severity */
export function getBySeverity(severity: 'Critical' | 'High' | 'Medium' | 'Low'): Entry[] {
  return entries.filter(e => e.severity === severity);
}

/** Get entries by source list */
export function getBySourceList(sourceList: string): Entry[] {
  const q = sourceList.toLowerCase();
  return entries.filter(e => e.source_list.toLowerCase().includes(q));
}

/** Get incidents for a specific OWASP entry */
export function getIncidentsForEntry(id: string): Incident[] {
  const uid = id.toUpperCase();
  return incidents.filter(i => i.owasp_entries.includes(uid));
}

/** Get incidents by MAESTRO layer */
export function getIncidentsByLayer(layer: string): Incident[] {
  return incidents.filter(i => i.maestro_layers.some(l => l.layer === layer));
}

/** Full database export */
export function getDatabase(): CrosswalkDB {
  return { entries, incidents, frameworks, version };
}

// ── Framework registries: the control-level join ────────────────────────────
//
// The package previously shipped `data/entries/` alone, so a consumer could see
// that LLM02 maps to `A.8.12` but had no way to resolve what `A.8.12` is. The
// registries ship now, which makes the join the README advertises actually
// possible from the package.

/** A single item in a framework registry. */
export interface RegistryControl {
  control_id: string;
  title: string;
  description?: string;
  /**
   * What the item actually is. Only `control` is a control: registries also
   * carry ATLAS techniques, CWE weaknesses, STRIDE threat categories and
   * ENISA/MAESTRO architectural layers.
   */
  kind: 'control' | 'technique' | 'weakness' | 'threat-category' | 'layer';
  parent?: string;
  function?: string;
  url?: string;
}

/** A framework registry — the inventory a mapping's control_id points into. */
export interface Registry {
  id: string;
  name: string;
  short_name?: string;
  version?: string;
  url?: string;
  license?: string;
  publisher?: string;
  category?: string;
  controls: RegistryControl[];
}

/** Generated headline counts (data/stats.json). */
export interface Stats {
  schema: number;
  version: string;
  source_lists: { count: number; ids: string[]; labels: string[] };
  entries: { total: number; by_list: Record<string, number> };
  mappings: { total: number; by_list: Record<string, number> };
  frameworks: {
    registries: number;
    mapped: number;
    unmapped_registries: string[];
    by_list: Record<string, number>;
  };
  mapping_files: { total: number; by_list: Record<string, number> };
  incidents: { total: number };
  controls: { total: number; registry_items: number; by_kind: Record<string, number> };
}

let _registries: Registry[] | undefined;

function loadRegistries(): Registry[] {
  if (_registries) return _registries;
  const dir = path.join(DATA_DIR, 'frameworks');
  _registries = fs.readdirSync(dir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Registry)
    .sort((a: Registry, b: Registry) => a.name.localeCompare(b.name));
  return _registries;
}

/** Every framework registry shipped with the package. */
export const registries: Registry[] = loadRegistries();

/** Generated headline counts. */
export const stats: Stats = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'stats.json'), 'utf8'),
) as Stats;

/** Registry lookup by name or id, case-insensitive. */
function findRegistry(framework: string): Registry | undefined {
  const q = framework.toLowerCase();
  return registries.find(
    (r) => r.name.toLowerCase() === q || r.id.toLowerCase() === q || r.short_name?.toLowerCase() === q,
  );
}

/**
 * Resolve a control id within a framework to its registry entry.
 *
 * Returns undefined when the framework is unknown or the id is not in its
 * registry. Note that in some frameworks the mapping rows carry requirement
 * prose in `control_id` rather than an identifier, so a lookup keyed on a
 * mapping's `control_id` can legitimately miss — `coverage()` reports how often.
 */
export function getControl(framework: string, controlId: string): RegistryControl | undefined {
  return findRegistry(framework)?.controls.find((c) => c.control_id === controlId);
}

/**
 * Every registry control referenced by an entry, resolved to its full record.
 *
 * This is the join the crosswalk exists for: entry → mappings → control titles.
 */
export function controlsFor(
  entryId: string,
): Array<{ framework: string; mapping: Mapping; control?: RegistryControl }> {
  const entry = getEntry(entryId);
  if (!entry) return [];
  return entry.mappings.map((m) => ({
    framework: m.framework,
    mapping: m,
    control: getControl(m.framework, m.control_id),
  }));
}

/** Which entries map to a given control — the reverse join. */
export function entriesFor(framework: string, controlId: string): Entry[] {
  return entries.filter((e) =>
    e.mappings.some((m) => m.framework === framework && m.control_id === controlId),
  );
}

/**
 * Coverage of a framework registry by the crosswalk's mappings.
 *
 * `layer` items are excluded from `coverable`: ENISA/MAESTRO layers are
 * architecture context, not controls to cover, and counting them drags the
 * percentage down for no reason.
 *
 * `unresolved` counts mapping ids that do not exist in the registry. A non-zero
 * value is a broken join, not a coverage gap — most often because the row
 * carries prose where the identifier belongs.
 */
export function coverage(framework: string): {
  framework: string;
  coverable: number;
  referenced: number;
  percent: number;
  layers: number;
  unresolved: number;
} | undefined {
  const reg = findRegistry(framework);
  if (!reg) return undefined;

  const known = new Set(reg.controls.map((c) => c.control_id));
  const cited = new Set<string>();
  for (const e of entries) {
    for (const m of e.mappings) {
      if (m.framework === reg.name) cited.add(m.control_id);
    }
  }

  const coverable = reg.controls.filter((c) => c.kind !== 'layer');
  const referenced = coverable.filter((c) => cited.has(c.control_id)).length;

  return {
    framework: reg.name,
    coverable: coverable.length,
    referenced,
    percent: coverable.length ? Math.round((referenced / coverable.length) * 100) : 0,
    layers: reg.controls.length - coverable.length,
    unresolved: [...cited].filter((id) => !known.has(id)).length,
  };
}
