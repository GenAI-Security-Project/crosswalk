<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Agentic Skills Top 10 2026 (AST01–AST10)
  Framework   : MAESTRO — Multi-Agent Environment, Security, Threat, Risk and Outcome
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# Agentic Skills Top 10 2026 × MAESTRO

Mapping the [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) to
[MAESTRO](https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro),
the Cloud Security Alliance's seven-layer threat model for agentic AI.

> **Scaffold — SME review required.** This file is deliberately incomplete.
> The layer assignments below are **the AST10 project’s own published mapping**,
> transcribed rather than derived here. Everything this repository treats as
> security judgment — `relationship`, `rationale_type`, `confidence`, and the
> per-layer "how it applies" text — reads `DRAFT`. An agent does not author
> those. Until a named reviewer fills them in and appears under **Reviewed by**,
> every row here is `confidence: unreviewed`.
>
> Tracked as **T-A10-03**. See [`ast-top10/README.md`](README.md) for what the
> rest of the wave still needs.

---

## Why MAESTRO for agentic skills

MAESTRO is the layer model the AST10 project itself uses. Its summary tables
give each of the ten risks a set of layers, so the mapping between the two is
published upstream rather than inferred here — which makes this the one column
in the AST10 wave that can be scaffolded without an agent inventing anything.

The value of the layer view for skills specifically is that a skill is not a
single-layer artifact. A malicious skill is published in the ecosystem (L7),
executed by a framework (L3), granted permissions by a policy layer (L6), run on
infrastructure (L4), and missed by a scanner (L5). Naming all five is what stops
a control conversation from settling on whichever layer the reader owns.

The other priority columns for this source list — NIST AI RMF, ISO 42001, EU AI
Act, SOC 2, ISO 27001 and OWASP NHI — have no upstream mapping to transcribe.
They are expert work and are not scaffolded here.

---

## MAESTRO seven-layer architecture

| Layer | ID | Description | Threat theme |
|---|---|---|---|
| Foundation Models | L1 | Base LLMs providing core reasoning and generation | Model manipulation, extraction, instruction misalignment |
| Data Operations | L2 | Ingestion pipelines, storage, RAG, embeddings, vector stores | Data poisoning, PII exfiltration, retrieval compromise |
| Agent Frameworks | L3 | Orchestration platforms, tool registries, MCP, plugin ecosystems | Tool misuse, orchestration injection, supply chain |
| Deployment & Infrastructure | L4 | Servers, containers, networks, CI/CD, runtime environments | Infrastructure compromise, code execution, resource exhaustion |
| Evaluation & Observability | L5 | Monitoring, logging, telemetry, behavioural baselines | Blind spots, output quality failure detection, evasion |
| Security & Compliance | L6 | Identity, access control, audit, governance, credential management | Privilege abuse, credential exposure, policy failure |
| Agent Ecosystem | L7 | Multi-agent interaction, A2A communication, cascade dynamics | Lateral movement, cascading failures, trust exploitation |

These names are checked against `llm-top10/LLM_MAESTRO.md` on every validation
run, so the seven ids cannot drift apart between files.

---

## AST10's published layer mapping

Transcribed verbatim from the project page, accessed 2026-08-28. First layer
listed is the project's primary assignment.

| AST | Risk | MAESTRO layers |
|---|---|---|
| AST01 | Malicious Skills | 7, 3, 6, 4, 5 |
| AST02 | Supply Chain Compromise | 7, 3, 6, 4 |
| AST03 | Over-Privileged Skills | 6, 4, 3, 7 |
| AST04 | Insecure Metadata | 7, 3, 4, 6 |
| AST05 | Untrusted External Instructions | 3, 2, 7, 6 |
| AST06 | Weak Isolation | 4, 6, 3 |
| AST07 | Update Drift | 4, 6, 7 |
| AST08 | Poor Scanning | 5, 6, 3 |
| AST09 | No Governance | 6, 7, 5 |
| AST10 | Cross-Platform Reuse | 7, 3, 6 |

---

## Quick-reference summary

| ID | Risk | Severity | Primary layer | All layers | Key mitigation (upstream) | Status |
|---|---|---|---|---|---|---|
| AST01 | Malicious Skills | Critical | L7 Agent Ecosystem | L7, L3, L6, L4, L5 | Merkle root signing, registry scanning | DRAFT |
| AST02 | Supply Chain Compromise | Critical | L7 Agent Ecosystem | L7, L3, L6, L4 | Registry transparency, provenance tracking | DRAFT |
| AST03 | Over-Privileged Skills | High | L6 Security & Compliance | L6, L4, L3, L7 | Least-privilege manifests, schema validation | DRAFT |
| AST04 | Insecure Metadata | High | L7 Agent Ecosystem | L7, L3, L4, L6 | Static analysis, safe parsers, sandboxed loading | DRAFT |
| AST05 | Untrusted External Instructions | High | L3 Agent Frameworks | L3, L2, L7, L6 | Source inventory, content pinning, continuous rescanning | DRAFT |
| AST06 | Weak Isolation | High | L4 Deployment & Infrastructure | L4, L6, L3 | Containerization, Docker sandboxing | DRAFT |
| AST07 | Update Drift | Medium | L4 Deployment & Infrastructure | L4, L6, L7 | Immutable pinning, hash verification | DRAFT |
| AST08 | Poor Scanning | Medium | L5 Evaluation & Observability | L5, L6, L3 | Semantic + behavioral multi-tool pipeline | DRAFT |
| AST09 | No Governance | Medium | L6 Security & Compliance | L6, L7, L5 | Skill inventories, agentic identity controls | DRAFT |
| AST10 | Cross-Platform Reuse | Medium | L7 Agent Ecosystem | L7, L3, L6 | Universal YAML format | DRAFT |

Severities and key mitigations are the AST10 project’s, transcribed. **Status is
`DRAFT` for all ten** — no row has been reviewed in this repository.

---

## Audience tags

- **Security engineer** — L3/L4/L6 rows: where a skill executes, what it may
  reach, and what grants it that reach
- **Threat modeller** — the layer sets themselves; use them as the starting
  scope for a per-skill session
- **Red teamer** — L5 rows: every risk that names L5 has a published bypass
  behind it, catalogued in `data/incidents.json`
- **CISO / compliance** — L6/L7 rows: governance and ecosystem exposure
- **Auditor** — treat every row as unreviewed evidence until **Reviewed by** is
  populated

---

## Detailed mappings

Each risk carries one row per layer the AST10 project assigns to it. The layer
and its id are transcription; every other column is for the reviewer.

### AST01 — Malicious Skills

**Severity:** Critical  
**Layers (AST10):** L7, L3, L6, L4, L5  
**Primary layer:** L7 — Agent Ecosystem

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Evaluation & Observability | L5 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast01`.

### AST02 — Supply Chain Compromise

**Severity:** Critical  
**Layers (AST10):** L7, L3, L6, L4  
**Primary layer:** L7 — Agent Ecosystem

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast02`.

### AST03 — Over-Privileged Skills

**Severity:** High  
**Layers (AST10):** L6, L4, L3, L7  
**Primary layer:** L6 — Security & Compliance

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast03`.

### AST04 — Insecure Metadata

**Severity:** High  
**Layers (AST10):** L7, L3, L4, L6  
**Primary layer:** L7 — Agent Ecosystem

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast04`.

### AST05 — Untrusted External Instructions

**Severity:** High  
**Layers (AST10):** L3, L2, L7, L6  
**Primary layer:** L3 — Agent Frameworks

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Data Operations | L2 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast05`.

### AST06 — Weak Isolation

**Severity:** High  
**Layers (AST10):** L4, L6, L3  
**Primary layer:** L4 — Deployment & Infrastructure

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast06`.

### AST07 — Update Drift

**Severity:** Medium  
**Layers (AST10):** L4, L6, L7  
**Primary layer:** L4 — Deployment & Infrastructure

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Deployment & Infrastructure | L4 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast07`.

### AST08 — Poor Scanning

**Severity:** Medium  
**Layers (AST10):** L5, L6, L3  
**Primary layer:** L5 — Evaluation & Observability

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Evaluation & Observability | L5 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast08`.

### AST09 — No Governance

**Severity:** Medium  
**Layers (AST10):** L6, L7, L5  
**Primary layer:** L6 — Security & Compliance

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Evaluation & Observability | L5 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast09`.

### AST10 — Cross-Platform Reuse

**Severity:** Medium  
**Layers (AST10):** L7, L3, L6  
**Primary layer:** L7 — Agent Ecosystem

#### MAESTRO mapping

| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Agent Ecosystem | L7 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Agent Frameworks | L3 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |
| Security & Compliance | L6 | MAESTRO layer | DRAFT — SME review required | DRAFT | DRAFT | DRAFT | MAESTRO 1.0 | (unreviewed) |

#### Notes for the reviewer

- Confirm the layer set still matches the upstream AST10 page before signing
  any row — the project is active and its tables move.
- The relationship value is per row, not per risk: the same risk can be a
  *subset of* one layer’s concerns and merely *intersect with* another’s.
- Incidents evidencing this risk are in `data/incidents.json`, tagged
  `ast10`.

---

## References

- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) — risk definitions,
  severities, the MAESTRO mapping table and the incident timeline transcribed here
- [CSA — Agentic AI Threat Modeling Framework: MAESTRO](https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro)
  — the seven-layer model
- [`llm-top10/LLM_MAESTRO.md`](../llm-top10/LLM_MAESTRO.md) — the same framework
  mapped to the LLM Top 10, and the canonical source for the layer names
- [`agentic-top10/Agentic_MAESTRO.md`](../agentic-top10/Agentic_MAESTRO.md) — the
  Agentic Top 10 view
- [`shared/UNIVERSAL_SKILL_FORMAT.md`](../shared/UNIVERSAL_SKILL_FORMAT.md) — the
  manifest features these risks are mitigated by
- [`ast-top10/README.md`](README.md) — wave status and what is not yet authored

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-08-28 | 1.0.0 | Scaffold created under T-A10-03. Layer assignments, severities and key mitigations transcribed from the AST10 project page. All relationship, rationale and confidence values are DRAFT — no mapping judgment is authored here. | OWASP GenAI Data Security Initiative |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
