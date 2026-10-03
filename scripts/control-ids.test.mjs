/**
 * The identifier grammar behind the #35 repair.
 *
 * Every case below is a row shape that exists in the mapping files today —
 * the same framework written differently across the source lists, which is why
 * a positional rule cannot work.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { resolveControlId, isValidControlId, isValidRegistryId } = require('./control-ids.js');

const cases = [
  // framework, row cells, expected id, expected name, expected parent, table headers
  ['SOC 2', ['C1.1 — Confidentiality policy', 'Policy identifying confidential information in GenAI scope'], 'C1.1', 'Confidentiality policy', null],
  ['SOC 2', ['CC3.2', 'Goal hijack risk identified in risk assessment — prompt injection, indirect injection', 'Risk register'], 'CC3.2', '', null, ['Criteria', 'How it applies', 'Evidence']],
  ['EU AI Act', ['Art. 9', 'Risk management system', 'Mandatory for high-risk'], 'Art. 9', 'Risk management system', null, ['Article', 'Title', 'Relevance']],
  ['EU AI Act', ['Art. 9 — Risk management', 'Goal hijack scenarios identified and mitigated in risk management system'], 'Art. 9', 'Risk management', null],
  ['EU AI Act', ['Article 15', 'Accuracy, robustness, cybersecurity'], 'Art. 15', 'Accuracy, robustness, cybersecurity', null, ['Article', 'Title']],
  // No header to say where the name is, and the id cell holds only the id:
  // the row yields no name rather than promoting a requirement into one.
  ['PCI DSS v4.0', ['Req 11.3', 'Penetration testing covers goal hijack'], 'Req 11.3', '', null],
  ['OWASP NHI Top 10', ['NHI-5 Over-Privileged NHI', 'Hijacked agent with excess privilege causes larger blast radius'], 'NHI-5', 'Over-Privileged NHI', null],
  ['CIS Controls v8.1', ['CIS 16 — Application Software Security', '16.1 Establish secure application development standards', 'IG2', 'Secure development standards'], '16.1', 'Establish secure application development standards', 'CIS-16'],
  ['CIS Controls v8.1', ['3.1 — Safeguard name', 'CIS 3', 'IG1'], '3.1', 'Safeguard name', 'CIS-3'],
  ['PCI DSS v4.0', ['Req 6.2', 'Bespoke agent code reviewed for injection resistance — all agent integration code'], 'Req 6.2', '', null],
  ['PCI DSS v4.0', ['Bespoke and custom software', 'Requirement 6.2.4', 'Injection resistance'], 'Req 6.2.4', 'Bespoke and custom software', null, ['Title', 'Requirement', 'How it applies']],
  ['NIST SP 800-218A', ['PW.2.1-PS – Design software to meet security requirements', 'Threat modelling covers prompt injection'], 'PW.2.1-PS', 'Design software to meet security requirements', null],
  ['NIST SP 800-82 Rev 3', ['§5.3', 'Vulnerabilities common to IT and OT', 'Applies to agent control loops'], '§5.3', 'Vulnerabilities common to IT and OT', null, ['Section', 'Title', 'Relevance']],
  ['NIST SP 800-82 Rev 3', ['Section 5.3 — Threats', 'Guidance', 'How it applies'], '§5.3', 'Threats', null, ['Section', 'Guidance', 'How it applies']],
  ['NIST SP 800-82 Rev 3', ['SI-10 Information Input Validation', 'Validate all inputs to the control system'], 'SI-10', 'Information Input Validation', null],
  ['CWE/CVE', ['Improper Input Validation', 'CWE-20', 'Unvalidated prompt content'], 'CWE-20', 'Improper Input Validation', null],
  ['CWE/CVE', ['CWE-74', 'Injection', 'Prompt injection is an injection flaw'], 'CWE-74', 'Injection', null, ['ID', 'Name', 'Relevance']],
  ['OWASP AI Testing Guide', ['IHT — Input Handling', 'Prompt injection test cases'], 'IHT', 'Input Handling', null],
  ['ISO/IEC 42001:2023', ['A.6.2.3', 'AI system security', 'Controls for AI system security'], 'A.6.2.3', 'AI system security', null, ['Control', 'Title', 'Relevance']],
  ['ISO/IEC 42001:2023', ['Cl. 6.1 — Actions to address risks', 'Risk treatment covers AI-specific risk'], '6.1', 'Actions to address risks', null],
];

test('the grammar finds the identifier wherever the row puts it', () => {
  for (const [framework, cells, id, name, parent, headers] of cases) {
    const got = resolveControlId(framework, cells, headers);
    assert.ok(got, `${framework}: no id found in ${JSON.stringify(cells)}`);
    assert.equal(got.id, id, `${framework}: id from ${JSON.stringify(cells)}`);
    assert.equal(got.name, name, `${framework}: name from ${JSON.stringify(cells)}`);
    assert.equal(got.parent, parent, `${framework}: parent from ${JSON.stringify(cells)}`);
  }
});

test('a framework with no grammar is left to the existing parser', () => {
  assert.equal(resolveControlId('MITRE ATLAS', ['Evade AI Model', 'AML.T0015']), null);
  assert.equal(resolveControlId('NIST AI RMF 1.0', ['GOVERN 1.1', 'Policies']), null);
});

test('a row that carries no identifier resolves to nothing rather than guessing', () => {
  assert.equal(resolveControlId('SOC 2', ['Some heading', 'Some prose about controls']), null);
  assert.equal(resolveControlId('EU AI Act', ['Governance', 'General obligations']), null);
});

test('prose is never returned as a control name', () => {
  const prose = 'Policy identifying confidential information in GenAI scope — training data, RAG corpus, embeddings, outputs, and every downstream copy of them';
  const got = resolveControlId('SOC 2', ['CC6.1', prose]);
  assert.equal(got.id, 'CC6.1');
  assert.notEqual(got.name, prose);
  assert.ok(got.name.length <= 120);
});

test('NIST AI 600-1 suggested-action ids are recognised wherever they sit in the row', () => {
  const cases = [
    [['GV-1.1-001', 'Align GAI development and use with applicable laws'], 'GV-1.1-001'],
    [['Fairness assessments', 'MS-2.11-002', 'prose about the measure'], 'MS-2.11-002'],
    [['MG-4.1-003'], 'MG-4.1-003'],
  ];
  for (const [cells, id] of cases) {
    assert.equal(resolveControlId('NIST AI 600-1', cells).id, id);
  }
});

test('NIST AI 600-1 rejects subcategory ids and malformed sequences', () => {
  // GV-1.1 is an AI RMF subcategory, not a 600-1 suggested action.
  assert.equal(resolveControlId('NIST AI 600-1', ['GV-1.1', 'Legal and regulatory']), null);
  for (const bad of ['GV-1.1', 'GV-1.1-1', 'GV-1.1-0001', 'XX-1.1-001']) {
    assert.equal(isValidControlId('NIST AI 600-1', bad), false, bad);
  }
  for (const good of ['GV-1.1-001', 'MP-5.1-001', 'MS-2.11-002', 'MG-4.1-003']) {
    assert.equal(isValidControlId('NIST AI 600-1', good), true, good);
  }
});

test('every id in the NIST AI 600-1 registry satisfies its own grammar', async () => {
  const { readFileSync } = await import('node:fs');
  const fw = JSON.parse(readFileSync(new URL('../data/frameworks/nist-ai-600-1.json', import.meta.url)));
  assert.equal(fw.controls.length, 211);
  for (const c of fw.controls) {
    assert.ok(isValidRegistryId('NIST AI 600-1', c.control_id), `${c.control_id} fails the id shape`);
  }
});

test('every NIST AI 600-1 action carries GAI risk tags drawn from the document\'s twelve', async () => {
  // The twelve risks enumerated in section 2 of NIST AI 600-1. The suggested-action
  // tables spell four of them differently; the registry normalises to this list.
  const TWELVE = new Set([
    'CBRN Information or Capabilities',
    'Confabulation',
    'Dangerous, Violent, or Hateful Content',
    'Data Privacy',
    'Environmental Impacts',
    'Harmful Bias or Homogenization',
    'Human-AI Configuration',
    'Information Integrity',
    'Information Security',
    'Intellectual Property',
    'Obscene, Degrading, and/or Abusive Content',
    'Value Chain and Component Integration',
  ]);
  const { readFileSync } = await import('node:fs');
  const fw = JSON.parse(readFileSync(new URL('../data/frameworks/nist-ai-600-1.json', import.meta.url)));
  const seen = new Set();
  for (const c of fw.controls) {
    assert.ok(Array.isArray(c.gai_risks) && c.gai_risks.length > 0,
      `${c.control_id} has no gai_risks`);
    assert.equal(new Set(c.gai_risks).size, c.gai_risks.length,
      `${c.control_id} repeats a risk`);
    for (const r of c.gai_risks) {
      assert.ok(TWELVE.has(r), `${c.control_id} cites "${r}", which is not one of the twelve`);
      seen.add(r);
    }
  }
  // All twelve are exercised, so a typo in the list cannot pass unnoticed.
  assert.equal(seen.size, 12);
});
