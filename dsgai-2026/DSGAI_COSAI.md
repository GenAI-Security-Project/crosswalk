<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Data Security for GenAI 2026 (DSGAI01–DSGAI21)
  Framework   : CoSAI — Coalition for Secure AI
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# DSGAI 2026 × CoSAI

Mapping the [OWASP Data Security for GenAI 2026](https://genai.owasp.org/) to
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

## Why CoSAI for DSGAI 2026

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

### DSGAI01 — Sensitive Data Leakage

**Severity:** Critical  
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

### DSGAI02 — Agent Identity and Credential Exposure

**Severity:** Critical  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent cybersecurity baseline | WS4-AGT-2.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent accountability chain | WS4-AGT-1.3 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI03 — Shadow AI and Unsanctioned Data Flows

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Third-party AI risk management | WS3-GOV-5 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security risk taxonomy | WS3-GOV-1 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI04 — Data Model and Artifact Poisoning

**Severity:** Critical  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| ML artifact signing and verification | WS1-SSC-2 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Model provenance tracking | WS1-SSC-3 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI05 — Data Integrity and Validation Failures

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI06 — Tool Plugin and Agent Data Exchange

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent supply chain security | WS4-AGT-3.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI dependency management | WS1-SSC-5 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI07 — Data Governance and Lifecycle

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI security risk taxonomy | WS3-GOV-1 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI regulatory compliance mapping | WS3-GOV-6 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI08 — Non-Compliance and Regulatory Violations

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI regulatory compliance mapping | WS3-GOV-6 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security scorecard | WS3-GOV-3 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI09 — Multimodal Cross-Channel Leakage

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI10 — Synthetic Data and Anonymization Pitfalls

**Severity:** Medium  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI11 — Cross-Context Conversation Bleed

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI12 — Unsafe Natural Language Data Gateways

**Severity:** Critical  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI13 — Vector Store Platform Security

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent cybersecurity baseline | WS4-AGT-2.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI dependency management | WS1-SSC-5 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI14 — Excessive Telemetry and Monitoring Leakage

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent telemetry and observability | WS4-AGT-3.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI15 — Over-Broad Context Windows

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Purpose-specific entitlements | WS4-AGT-2.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security controls checklist | WS3-GOV-4 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI16 — Endpoint and Browser Overreach

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent cybersecurity baseline | WS4-AGT-2.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent blast radius containment | WS4-AGT-2.4 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI attack surface mapping | WS2-DEF-2 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI17 — Data Availability and Resilience Failures

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI incident response procedures | WS2-DEF-3 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Agent cybersecurity baseline | WS4-AGT-2.2 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI18 — Inference and Data Reconstruction

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI risk assessment methodology | WS3-GOV-2 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Model provenance tracking | WS1-SSC-3 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI19 — Human-in-Loop and Labeler Overexposure

**Severity:** Medium  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Risk-based human oversight | WS4-AGT-1.1 | WS4 — Secure Design for Agentic Systems | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Third-party AI risk management | WS3-GOV-5 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI20 — Model Exfiltration and IP Replication

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Secure model distribution | WS1-SSC-6 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| ML artifact signing and verification | WS1-SSC-2 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security monitoring and telemetry | WS2-DEF-5 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

#### Notes for the reviewer

- Confirm each row belongs before assigning a relationship. Cutting a candidate
  is as valid an outcome as keeping one.
- CoSAI publishes guidance, not certifiable requirements. A relationship here
  describes conceptual coverage, not an auditable obligation.
- Add missing controls rather than working only from the shortlist.

### DSGAI21 — Disinformation via Data Poisoning

**Severity:** High  
**Candidate controls:** 3

#### CoSAI mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Training data supply chain integrity | WS1-SSC-4 | WS1 — Software Supply Chain | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI red teaming and adversarial testing | WS2-DEF-6 | WS2 — Preparing Defenders | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |
| AI security scorecard | WS3-GOV-3 | WS3 — AI Security Governance | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | CoSAI 2025 | (unreviewed) |

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
- [`dsgai-2026/DSGAI_ISO42001.md`](DSGAI_ISO42001.md) — the AI management-system view
- [`dsgai-2026/DSGAI_NISTAIRMF.md`](DSGAI_NISTAIRMF.md) — the risk-function view
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
