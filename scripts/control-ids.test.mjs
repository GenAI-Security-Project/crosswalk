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
const { resolveControlId } = require('./control-ids.js');

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
