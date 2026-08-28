<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Data Security for GenAI 2026 (DSGAI01–DSGAI21)
  Framework   : EU AI Act General-Purpose AI Code of Practice
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# DSGAI 2026 × GPAI Code of Practice

Mapping the [OWASP Data Security for GenAI 2026](https://genai.owasp.org/) to
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

## Why GPAI Code of Practice for DSGAI 2026

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
| DSGAI01 | Sensitive Data Leakage | Critical | 3 | DRAFT |
| DSGAI02 | Agent Identity and Credential Exposure | Critical | 3 | DRAFT |
| DSGAI03 | Shadow AI and Unsanctioned Data Flows | High | 3 | DRAFT |
| DSGAI04 | Data Model and Artifact Poisoning | Critical | 3 | DRAFT |
| DSGAI05 | Data Integrity and Validation Failures | High | 3 | DRAFT |
| DSGAI06 | Tool Plugin and Agent Data Exchange | High | 3 | DRAFT |
| DSGAI07 | Data Governance and Lifecycle | High | 3 | DRAFT |
| DSGAI08 | Non-Compliance and Regulatory Violations | High | 3 | DRAFT |
| DSGAI09 | Multimodal Cross-Channel Leakage | High | 3 | DRAFT |
| DSGAI10 | Synthetic Data and Anonymization Pitfalls | Medium | 3 | DRAFT |
| DSGAI11 | Cross-Context Conversation Bleed | High | 3 | DRAFT |
| DSGAI12 | Unsafe Natural Language Data Gateways | Critical | 3 | DRAFT |
| DSGAI13 | Vector Store Platform Security | High | 3 | DRAFT |
| DSGAI14 | Excessive Telemetry and Monitoring Leakage | High | 3 | DRAFT |
| DSGAI15 | Over-Broad Context Windows | High | 3 | DRAFT |
| DSGAI16 | Endpoint and Browser Overreach | High | 3 | DRAFT |
| DSGAI17 | Data Availability and Resilience Failures | High | 3 | DRAFT |
| DSGAI18 | Inference and Data Reconstruction | High | 3 | DRAFT |
| DSGAI19 | Human-in-Loop and Labeler Overexposure | Medium | 3 | DRAFT |
| DSGAI20 | Model Exfiltration and IP Replication | High | 3 | DRAFT |
| DSGAI21 | Disinformation via Data Poisoning | High | 3 | DRAFT |

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

### DSGAI01 — Sensitive Data Leakage

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk documentation | CoP-III-C7-M7.3 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI02 — Agent Identity and Credential Exposure

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Security goal and threat actor definition | CoP-III-C6-M6.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Clear responsibility definition | CoP-III-C8-M8.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI03 — Shadow AI and Unsanctioned Data Flows

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Providing information to downstream providers and AI Office | CoP-I-C1-M1.2 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementing the framework | CoP-III-C1-M1.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Clear responsibility definition | CoP-III-C8-M8.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI04 — Data Model and Artifact Poisoning

**Severity:** Critical  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model-independent information gathering | CoP-III-C3-M3.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Material changes to risk landscape | CoP-III-C7-M7.5 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI05 — Data Integrity and Validation Failures

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Quality, integrity, and security of information | CoP-I-C1-M1.3 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model description and behaviour documentation | CoP-III-C7-M7.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model-independent information gathering | CoP-III-C3-M3.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI06 — Tool Plugin and Agent Data Exchange

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Providing information to downstream providers and AI Office | CoP-I-C1-M1.2 | Ch. I — Transparency | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk identification process | CoP-III-C2-M2.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI07 — Data Governance and Lifecycle

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Creating the safety and security framework | CoP-III-C1-M1.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Updating the framework | CoP-III-C1-M1.3 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Copyright policy | CoP-II-C1-M1.1 | Ch. II — Copyright | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI08 — Non-Compliance and Regulatory Violations

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Framework notifications to AI Office | CoP-III-C1-M1.4 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident reporting to authorities | CoP-III-C9-M9.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementation documentation | CoP-III-C10-M10.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI09 — Multimodal Cross-Channel Leakage

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Model evaluations | CoP-III-C3-M3.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk scenarios | CoP-III-C2-M2.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI10 — Synthetic Data and Anonymization Pitfalls

**Severity:** Medium  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Lawful access to copyright-protected content | CoP-II-C1-M1.2 | Ch. II — Copyright | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model-independent information gathering | CoP-III-C3-M3.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI11 — Cross-Context Conversation Bleed

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Post-market monitoring and external evaluation | CoP-III-C3-M3.5 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model description and behaviour documentation | CoP-III-C7-M7.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI12 — Unsafe Natural Language Data Gateways

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

### DSGAI13 — Vector Store Platform Security

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Security goal and threat actor definition | CoP-III-C6-M6.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementing the framework | CoP-III-C1-M1.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI14 — Excessive Telemetry and Monitoring Leakage

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Systemic risk documentation | CoP-III-C7-M7.3 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementation documentation | CoP-III-C10-M10.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI15 — Over-Broad Context Windows

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Systemic risk scenarios | CoP-III-C2-M2.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk modelling | CoP-III-C3-M3.3 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Model description and behaviour documentation | CoP-III-C7-M7.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI16 — Endpoint and Browser Overreach

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Systemic risk identification process | CoP-III-C2-M2.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementing the framework | CoP-III-C1-M1.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI17 — Data Availability and Resilience Failures

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Incident tracking and documentation | CoP-III-C9-M9.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Corrective actions | CoP-III-C9-M9.3 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Implementing the framework | CoP-III-C1-M1.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI18 — Inference and Data Reconstruction

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Model evaluations | CoP-III-C3-M3.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk estimation | CoP-III-C3-M3.4 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI19 — Human-in-Loop and Labeler Overexposure

**Severity:** Medium  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Clear responsibility definition | CoP-III-C8-M8.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Resource allocation | CoP-III-C8-M8.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Post-market monitoring and external evaluation | CoP-III-C3-M3.5 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI20 — Model Exfiltration and IP Replication

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security mitigation implementation | CoP-III-C6-M6.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Security goal and threat actor definition | CoP-III-C6-M6.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Copyright policy | CoP-II-C1-M1.1 | Ch. II — Copyright | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- Chapter III applies only to GPAI models **with systemic risk**. If this row is
  scoped to a Chapter III measure, say so in the rationale.
- Add missing controls rather than working only from the shortlist.

### DSGAI21 — Disinformation via Data Poisoning

**Severity:** High  
**Candidate controls:** 3

#### GPAI Code of Practice mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Safety mitigation implementation | CoP-III-C5-M5.1 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Systemic risk scenarios | CoP-III-C2-M2.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |
| Public transparency | CoP-III-C10-M10.2 | Ch. III — Safety and Security | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | GPAI CoP Final | (unreviewed) |

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
- [`dsgai-2026/DSGAI_ISO42001.md`](DSGAI_ISO42001.md) — the AI management-system view
- [`dsgai-2026/DSGAI_NISTAIRMF.md`](DSGAI_NISTAIRMF.md) — the risk-function view
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
