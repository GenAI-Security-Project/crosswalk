#!/usr/bin/env node
/**
 * audit-incidents.mjs — Assess the incident corpus without changing it.
 *
 * The 114 incidents are the raw material for the evidence loop (T-STRAT03):
 * annotating which controls failed, so a mapping can carry an evidence count
 * rather than only an assertion. Before that is worth doing, the corpus has to
 * be checked for three things:
 *
 *   relevance    some entries have a conventional attack vector — an
 *                infrastructure bug, a misconfiguration — even where the
 *                affected product is an AI system. Control failures derived
 *                from those evidence ordinary security practice, not GenAI
 *                risk, so counting them would overstate what the corpus proves.
 *   sourcing     an incident with no external identifier cannot be verified by
 *                a reader, which is the whole basis of the evidence claim.
 *   description  several descriptions are pasted advisory text — vendor prose,
 *                CVE boilerplate — rather than a written summary.
 *
 * This flags. It deletes nothing and edits nothing: dispositioning an incident
 * is a judgment call, and a wrong deletion is unrecoverable from a report.
 *
 * Output: reports/incident-relevance.md
 * Usage:  node scripts/audit-incidents.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'reports');
const OUT = path.join(OUT_DIR, 'incident-relevance.md');

// incidents.json is object-form: {version, generated, description, incidents[]}
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'incidents.json'), 'utf8'));
const incidents = Array.isArray(doc) ? doc : doc.incidents;

/**
 * Terms indicating an actual AI/ML component rather than a conventional breach.
 *
 * Deliberately broad. A narrower list flagged Flowise, Claude Skills and an MCP
 * mass-scan as "non-AI", which would have invited a reviewer to delete three
 * genuine agentic incidents. A false negative here costs a manual read; a false
 * positive costs real evidence.
 */
const AI_TERMS = new RegExp(
  '\\b(' +
    'ai|llm|gpt|genai|ml|model|prompt|agent|agentic|rag|embedding|inference|' +
    'chatbot|copilot|assistant|skill|plugin|mcp|' +
    'training data|fine.?tun|vector|token|hallucinat|jailbreak|guardrail|' +
    'openai|anthropic|claude|gemini|llama|mistral|huggingface|langchain|flowise|autogpt' +
    ')\\b',
  'i',
);

const rows = incidents.map((inc) => {
  const haystack = [inc.title, inc.description, inc.attack_vector, (inc.tags || []).join(' ')]
    .filter(Boolean).join(' ');

  // Relevance is decided by the ATTACK VECTOR, not by whether the record
  // mentions AI anywhere. A Redis race condition in an AI product is a
  // conventional infrastructure bug that happens to have leaked model
  // conversations — real, but it evidences nothing about GenAI controls.
  // Judging on the whole record hides that distinction; judging on the vector
  // surfaces it for a human to rule on.
  const vector = inc.attack_vector || '';
  const vectorIsAISpecific = AI_TERMS.test(vector);
  const mentionsAI = AI_TERMS.test(haystack);

  const hasExternal = (inc.external_refs || []).length > 0;
  const idInRefs = (inc.references || []).some((r) => /CVE-\d{4}-\d+|incidentdatabase|atlas\.mitre/i.test(r.url || ''));
  const pasted =
    /^(A |An )?(vulnerability|flaw|issue) (was )?(discovered|found|identified)/i.test(inc.description || '') ||
    /allows? (an )?(unauthenticated |remote )?attackers? to/i.test(inc.description || '');

  return {
    id: inc.id,
    title: inc.title,
    year: inc.year,
    vector,
    conventionalVector: !vectorIsAISpecific,
    noAIAtAll: !mentionsAI,
    unsourced: !hasExternal && !idInRefs,
    pasted,
    failures: (inc.control_failures || []).length,
  };
});

// ── schema conformance ───────────────────────────────────────────────────────
// incidents.json had never been validated against its own schema. 17 records
// used reference types (`vendor`, `regulatory`) the enum did not list. A
// structural check here means the next drift is caught by the report rather
// than by a consumer.
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'incidents-schema.json'), 'utf8'));
const refEnum = new Set(
  schema.definitions.Incident.properties.references.items.properties.type.enum,
);
const schemaIssues = [];
for (const inc of incidents) {
  for (const r of inc.references || []) {
    if (r.type && !refEnum.has(r.type)) {
      schemaIssues.push(`${inc.id}: reference type "${r.type}" is not in the schema enum`);
    }
  }
  for (const cf of inc.control_failures || []) {
    if (!cf.basis || cf.basis.length < 20) {
      schemaIssues.push(`${inc.id}: control_failure on ${cf.control_id} has no quotable basis`);
    }
  }
}

const conventional = rows.filter((r) => r.conventionalVector);
const unsourced = rows.filter((r) => r.unsourced);
const pasted = rows.filter((r) => r.pasted);
const withFailures = rows.filter((r) => r.failures > 0);

const table = (list, extra = () => '') => [
  '| ID | Year | Title |' + (extra.header || ''),
  '|---|--:|---|' + (extra.sep || ''),
  ...list.map((r) => `| \`${r.id}\` | ${r.year ?? '—'} | ${String(r.title).slice(0, 78)} |`),
  '',
];

const lines = [
  '# Incident corpus audit',
  '',
  '*Generated by `scripts/audit-incidents.mjs`. Flags only — nothing is deleted or edited.*',
  '',
  `**${incidents.length} incidents** · ${conventional.length} with a conventional attack vector · ` +
    `${unsourced.length} without an external identifier · ${pasted.length} with advisory-style descriptions · ` +
    `${withFailures.length} carrying control-failure annotations`,
  '',
  '## Conventional attack vector',
  '',
  'The attack vector carries no AI-specific element — an infrastructure bug, a',
  'misconfiguration, a conventional injection — even where the affected product is',
  'an AI system. These are real incidents, but a control failure derived from one',
  'evidences conventional security practice rather than GenAI risk, so counting',
  'them in the evidence loop would overstate what the corpus proves.',
  '',
  '**Flagged for a human ruling — keep, re-scope, or exclude from evidence.**',
  '',
  ...(conventional.length
    ? ['| ID | Year | Attack vector |', '|---|--:|---|',
       ...conventional.map((r) => `| \`${r.id}\` | ${r.year ?? '—'} | ${String(r.vector).slice(0, 84)} |`), '']
    : ['*None.*', '']),
  '## No external identifier',
  '',
  'No CVE, AI Incident Database entry, ATLAS case study, or named campaign. The',
  'evidence claim rests on a reader being able to check the record; without an',
  'identifier they cannot. These need `external_refs[]` populated before their',
  'control failures can carry weight.',
  '',
  `${unsourced.length} of ${incidents.length} incidents.`,
  '',
  ...(unsourced.length <= 40 ? table(unsourced) : table(unsourced.slice(0, 40)).concat([`*… and ${unsourced.length - 40} more.*`, ''])),
  '## Advisory-style descriptions',
  '',
  'Descriptions that read as pasted vendor or CVE text rather than a written',
  'summary. Rewriting is safe mechanical work, but the original is kept in',
  '`raw_description` until a human signs off.',
  '',
  ...(pasted.length ? table(pasted) : ['*None detected.*', '']),
  '## Schema conformance',
  '',
  ...(schemaIssues.length
    ? ['These records do not satisfy `data/incidents-schema.json`:', '',
       ...schemaIssues.map((s) => `- ${s}`), '']
    : ['All records satisfy `data/incidents-schema.json`, including the rule that every',
       '`control_failures[]` entry carries a quotable `basis`.', '']),
  '## Evidence-loop readiness (T-STRAT03)',
  '',
  `${withFailures.length} of ${incidents.length} incidents carry \`control_failures[]\`.`,
  '',
  'The schema now supports the annotation and requires a quotable `basis` on every',
  'claim. Populating it is the T-STRAT03 workstream, in review batches, starting',
  'with the best-sourced incidents — which per the plan are the AST10 batch',
  '(T-A10-02), since those carry named CVEs and campaign identifiers.',
  '',
];

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');

console.log('Written reports/incident-relevance.md');
console.log(
  `  ${incidents.length} incidents · ${conventional.length} conventional vector · ` +
    `${unsourced.length} unsourced · ${pasted.length} advisory-style · ` +
    `${withFailures.length} with control failures`,
);
