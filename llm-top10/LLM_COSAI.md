<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Top 10 for LLM Applications 2026 (LLM01–LLM10)
  Framework   : CoSAI — Coalition for Secure AI
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# LLM Top 10 2026 × CoSAI

Mapping the [OWASP Top 10 for LLM Applications 2026](https://genai.owasp.org/llm-top-10/) to
[CoSAI — Coalition for Secure AI](https://www.coalitionforsecureai.org/), published by OASIS / Coalition for Secure AI.

> **Candidate mapping — SME review required.** Every row below is a `DRAFT`.
> The control ids and titles are read from `data/frameworks/cosai.json`, so they are
> accurate to the published framework. **The pairing of a control to a risk is a
> proposal, not an assertion** — it is a shortlist for a reviewer to keep, cut or
> extend. `Relationship`, `Rationale type` and `Confidence` all read `DRAFT`, the
> "how it applies" column reads `DRAFT — SME review required`, and **Reviewed by**
> is empty, so `validate.js` holds every row at `confidence: unreviewed` and will
> reject a raised confidence with no named reviewer.
>
> This file exists because CoSAI was carried in
> `data/frameworks/` as an inventory-only registry with no mapping at all. A
> reviewed shortlist is a better starting point than an empty directory; a
> shortlist presented as finished would not be.

---

## Why CoSAI for LLM Top 10 2026

CoSAI is an OASIS open project with a specific shape: four workstreams, each
producing practical guidance rather than a certifiable control set. That makes it
unlike most of the frameworks in this crosswalk. There is no auditor asking for
a CoSAI attestation, and there is no clause number to cite in a contract.

What it does have is the only widely-adopted control vocabulary written from the
start for **agentic** systems — WS4 alone covers authority boundaries, purpose-
specific entitlements, blast-radius containment and agent action auditability,
concepts that ISO 42001 and the NIST AI RMF address only obliquely. For the
Agentic Top 10 in particular it is the closest thing to a direct control
counterpart that exists.

Use it where an engineering team needs a design pattern rather than a compliance
obligation, and read it alongside `*_ISO42001.md` for the management-system layer
and `*_NISTAIRMF.md` for the risk-function view.

---

## CoSAI workstreams

| Area | Control ids | Scope |
|---|---|---|
| WS1 — Software Supply Chain Security for AI Systems | `WS1-SSC-1 … WS1-SSC-6` | Provenance, artifact signing, training-data integrity, dependency and distribution security |
| WS2 — Preparing Defenders for a Changing Cybersecurity Landscape | `WS2-DEF-1 … WS2-DEF-6` | Attack-surface mapping, AI-specific telemetry, incident response, red teaming |
| WS3 — AI Security Governance | `WS3-GOV-1 … WS3-GOV-6` | Risk taxonomy, assessment methodology, scorecards, third-party and regulatory mapping |
| WS4 — Secure Design Patterns for Agentic Systems | `WS4-AGT-1 … WS4-AGT-3.4` | Human governance, bounded entitlements, blast-radius containment, telemetry and auditability |

---

## Quick-reference summary

| ID | Risk | Severity | Candidate controls | Status |
|---|---|---|---|---|
| LLM01 | Prompt Injection | Critical | 3 | DRAFT |
| LLM02 | Sensitive Information Disclosure | High | 3 | DRAFT |
| LLM03 | Excessive Agency | Critical | 4 | DRAFT |
| LLM04 | Supply Chain | High | 5 | DRAFT |
| LLM05 | Data and Model Poisoning | Critical | 3 | DRAFT |
| LLM06 | Unbounded Consumption | High | 3 | DRAFT |
| LLM07 | Misinformation | High | 3 | DRAFT |
| LLM08 | Hidden Context Exposure | High | 3 | DRAFT |
| LLM09 | Vector and Embedding Weaknesses | Medium | 3 | DRAFT |
| LLM10 | Improper Output Handling | High | 3 | DRAFT |

**Status is `DRAFT` for every row.** No mapping in this file has been reviewed.

---

## Audience tags

- **Security engineer** — WS1 and WS4 rows: the design patterns that turn a risk
  into a build decision
- **Security architect** — WS4-AGT-2.x rows: entitlements, isolation and blast
  radius
- **Detection / response** — WS2 rows: telemetry, red teaming, AI incident response
- **CISO / governance** — WS3 rows: taxonomy, assessment methodology, third-party risk
- **Reviewer** — every row, because none has been signed

---

## Detailed mappings

Control ids and titles are transcribed from the registry. Everything else is for
the reviewer.

### LLM01 — Prompt Injection

**Severity:** Critical  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM02 — Sensitive Information Disclosure

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM03 — Excessive Agency

**Severity:** Critical  
**Candidate controls:** 4

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Authority boundary definition | WS4-AGT-1.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Risk-based human oversight | WS4-AGT-1.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM04 — Supply Chain

**Severity:** High  
**Candidate controls:** 5

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI software supply chain risk assessment | WS1-SSC-1 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| ML artifact signing and verification | WS1-SSC-2 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Model provenance tracking | WS1-SSC-3 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI dependency management | WS1-SSC-5 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Secure model distribution | WS1-SSC-6 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM05 — Data and Model Poisoning

**Severity:** Critical  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Model provenance tracking | WS1-SSC-3 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| ML artifact signing and verification | WS1-SSC-2 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM06 — Unbounded Consumption

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent cybersecurity baseline | WS4-AGT-2.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM07 — Misinformation

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security scorecard | WS3-GOV-3 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent telemetry and observability | WS4-AGT-3.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM08 — Hidden Context Exposure

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent telemetry and observability | WS4-AGT-3.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security risk taxonomy | WS3-GOV-1 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM09 — Vector and Embedding Weaknesses

**Severity:** Medium  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### LLM10 — Improper Output Handling

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

---

## References

- [Coalition for Secure AI](https://www.coalitionforsecureai.org/)
- [CoSAI Workstream 1 — Software Supply Chain Security for AI Systems](https://www.coalitionforsecureai.org/workstreams/)
- [CoSAI Workstream 4 — Secure Design Patterns for Agentic Systems](https://www.coalitionforsecureai.org/workstreams/)
- [`llm-top10/LLM_ISO42001.md`](LLM_ISO42001.md) — the AI management-system view
- [`llm-top10/LLM_NISTAIRMF.md`](LLM_NISTAIRMF.md) — the risk-function view
- [`docs/SCHEMA_V2_MIGRATION.md`](../docs/SCHEMA_V2_MIGRATION.md) — what the
  relationship, rationale and confidence columns mean and who may fill them

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-08-28 | 1.0.0 | File created. CoSAI was an inventory-only registry with no mapping; this is a candidate shortlist for review. Control ids and titles transcribed from the registry; all relationship, rationale and confidence values are DRAFT. | OWASP GenAI Data Security Initiative |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
