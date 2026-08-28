<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Top 10 for LLM Applications 2026 (LLM01–LLM10)
  Framework   : EU AI Act General-Purpose AI Code of Practice
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# LLM Top 10 2026 × GPAI Code of Practice

Mapping the [OWASP Top 10 for LLM Applications 2026](https://genai.owasp.org/llm-top-10/) to
[EU AI Act General-Purpose AI Code of Practice](https://code-of-practice.ai/), published by European Commission / AI Office.

> **Candidate mapping — SME review required.** Every row below is a `DRAFT`.
> The control ids and titles are read from `data/frameworks/eu-ai-act-cop.json`, so they are
> accurate to the published framework. **The pairing of a control to a risk is a
> proposal, not an assertion** — it is a shortlist for a reviewer to keep, cut or
> extend. `Relationship`, `Rationale type` and `Confidence` all read `DRAFT`, the
> "how it applies" column reads `DRAFT — SME review required`, and **Reviewed by**
> is empty, so `validate.js` holds every row at `confidence: unreviewed` and will
> reject a raised confidence with no named reviewer.
>
> This file exists because GPAI Code of Practice was carried in
> `data/frameworks/` as an inventory-only registry with no mapping at all. A
> reviewed shortlist is a better starting point than an empty directory; a
> shortlist presented as finished would not be.

---

## Why GPAI Code of Practice for LLM Top 10 2026

The Code of Practice is the operational layer under the EU AI Act’s
general-purpose AI obligations. Where `*_EUAIAct.md` maps the Act’s articles —
the legal duty — this file maps the Commitments and Measures a provider actually
signs up to in order to demonstrate compliance with them.

That distinction matters in practice. Article 55 says a provider of a model with
systemic risk must assess and mitigate that risk; it does not say what an
assessment looks like. Chapter III of the Code does: a documented framework,
named risk scenarios, model evaluations including red-teaming, an explicit
acceptance determination, and a model report filed with the AI Office. Those are
the artefacts an engineering team has to produce, so those are what a security
control maps onto.

Chapter III applies only to GPAI models with systemic risk; Chapters I and II
apply to all GPAI providers. Rows in this file inherit that scoping, which is one
of the things a reviewer has to confirm per row rather than assume.

---

## Code of Practice structure

| Area | Control ids | Scope |
|---|---|---|
| Chapter I — Transparency | `CoP-I-C1-M1.1 … M1.3` | Model documentation, information to downstream providers and the AI Office (Article 53) |
| Chapter II — Copyright | `CoP-II-C1-M1.1 … M1.5` | Copyright policy, lawful access, rights reservations, infringing-output mitigation |
| Chapter III — Safety and Security | `CoP-III-C1 … C10` | Safety and security framework, systemic risk identification, analysis, acceptance, mitigations, model reports, incident reporting |

---

## Quick-reference summary

| ID | Risk | Severity | Candidate controls | Status |
|---|---|---|---|---|
| LLM01 | Prompt Injection | Critical | 3 | DRAFT |
| LLM02 | Sensitive Information Disclosure | High | 3 | DRAFT |
| LLM03 | Excessive Agency | Critical | 3 | DRAFT |
| LLM04 | Supply Chain | High | 3 | DRAFT |
| LLM05 | Data and Model Poisoning | Critical | 3 | DRAFT |
| LLM06 | Unbounded Consumption | High | 3 | DRAFT |
| LLM07 | Misinformation | High | 3 | DRAFT |
| LLM08 | Hidden Context Exposure | High | 3 | DRAFT |
| LLM09 | Vector and Embedding Weaknesses | Medium | 3 | DRAFT |
| LLM10 | Improper Output Handling | High | 3 | DRAFT |

**Status is `DRAFT` for every row.** No mapping in this file has been reviewed.

---

## Audience tags

- **Compliance / legal** — Chapter I and II rows: documentation, downstream
  information, copyright policy
- **Security engineer** — `CoP-III-C6-*` rows: security goals, threat actors, model
  weight protection, access control
- **AI safety / evaluation** — `CoP-III-C2/C3` rows: risk identification, scenarios,
  evaluations and estimation
- **CISO / governance** — `CoP-III-C1`, `C4`, `C8`, `C9` rows: framework, acceptance
  determination, responsibility allocation, serious incident reporting
- **Reviewer** — every row, because none has been signed

---

## Detailed mappings

Control ids and titles are transcribed from the registry. Everything else is for
the reviewer.

### LLM01 — Prompt Injection

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model evaluations | CoP-III-C3-M3.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk identification process | CoP-III-C2-M2.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM02 — Sensitive Information Disclosure

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Quality, integrity, and security of information | CoP-I-C1-M1.3 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM03 — Excessive Agency

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Systemic risk scenarios | CoP-III-C2-M2.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Risk acceptance criteria and tiers | CoP-III-C4-M4.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Risk justification for market placement | CoP-III-C7-M7.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM04 — Supply Chain

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Providing information to downstream providers and AI Office | CoP-I-C1-M1.2 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementing the framework | CoP-III-C1-M1.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model-independent information gathering | CoP-III-C3-M3.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM05 — Data and Model Poisoning

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Lawful access to copyright-protected content | CoP-II-C1-M1.2 | Ch. II — Copyright | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Material changes to risk landscape | CoP-III-C7-M7.5 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM06 — Unbounded Consumption

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Post-market monitoring and external evaluation | CoP-III-C3-M3.5 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Resource allocation | CoP-III-C8-M8.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM07 — Misinformation

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Model evaluations | CoP-III-C3-M3.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model description and behaviour documentation | CoP-III-C7-M7.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Public transparency | CoP-III-C10-M10.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM08 — Hidden Context Exposure

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Drawing up and maintaining model documentation | CoP-I-C1-M1.1 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model description and behaviour documentation | CoP-III-C7-M7.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk identification process | CoP-III-C2-M2.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM09 — Vector and Embedding Weaknesses

**Severity:** Medium  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model-independent information gathering | CoP-III-C3-M3.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Quality, integrity, and security of information | CoP-I-C1-M1.3 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### LLM10 — Improper Output Handling

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Copyright-infringing output mitigation | CoP-II-C1-M1.4 | Ch. II — Copyright | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model evaluations | CoP-III-C3-M3.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

---

## References

- [EU AI Act General-Purpose AI Code of Practice](https://code-of-practice.ai/)
- [Regulation (EU) 2024/1689 — the AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [European Commission — AI Office](https://digital-strategy.ec.europa.eu/en/policies/ai-office)
- [`llm-top10/LLM_ISO42001.md`](LLM_ISO42001.md) — the AI management-system view
- [`llm-top10/LLM_NISTAIRMF.md`](LLM_NISTAIRMF.md) — the risk-function view
- [`docs/SCHEMA_V2_MIGRATION.md`](../docs/SCHEMA_V2_MIGRATION.md) — what the
  relationship, rationale and confidence columns mean and who may fill them

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-08-28 | 1.0.0 | File created. GPAI Code of Practice was an inventory-only registry with no mapping; this is a candidate shortlist for review. Control ids and titles transcribed from the registry; all relationship, rationale and confidence values are DRAFT. | OWASP GenAI Data Security Initiative |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
