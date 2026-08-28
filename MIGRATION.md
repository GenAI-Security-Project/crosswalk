<!--
  OWASP GenAI Crosswalk
  File    : MIGRATION.md
  Purpose : LLM Top 10 2025 → 2026 entry map and what changed in this crosswalk
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# LLM Top 10 — 2025 → 2026 Migration

The crosswalk's `llm-top10/` mappings now target the
[OWASP Top 10 for LLM Applications 2026](https://genai.owasp.org/llm-top-10/).
Every entry kept its subject matter, but eight of the ten changed number and two
changed name and scope. This file is the map: use it to rewrite references in
your own policies, findings, dashboards, and CI configuration.

> **Nothing here changes the Agentic Top 10 (ASI) or DSGAI 2026 entries.** Their
> IDs are unchanged; only their cross-references to LLM entries were renumbered.

---

## Entry map

| 2025 ID | 2025 name | → | 2026 ID | 2026 name | Movement |
|---|---|:--:|---|---|---|
| LLM01 | Prompt Injection | → | **LLM01** | Prompt Injection | Steady |
| LLM02 | Sensitive Information Disclosure | → | **LLM02** | Sensitive Information Disclosure | Steady |
| LLM06 | Excessive Agency | → | **LLM03** | Excessive Agency | ▲ 3 places |
| LLM03 | Supply Chain Vulnerabilities | → | **LLM04** | Supply Chain | ▼ 1 place, renamed |
| LLM04 | Data and Model Poisoning | → | **LLM05** | Data and Model Poisoning | ▼ 1 place |
| LLM10 | Unbounded Consumption | → | **LLM06** | Unbounded Consumption | ▲ 4 places |
| LLM09 | Misinformation | → | **LLM07** | Misinformation | ▲ 2 places |
| LLM07 | System Prompt Leakage | → | **LLM08** | Hidden Context Exposure | ▼ 1 place, re-scoped |
| LLM08 | Vector and Embedding Weaknesses | → | **LLM09** | Vector and Embedding Weaknesses | ▼ 1 place |
| LLM05 | Insecure Output Handling | → | **LLM10** | Improper Output Handling | ▼ 5 places, renamed |

### Reverse lookup

`LLM01→LLM01 · LLM02→LLM02 · LLM03→LLM04 · LLM04→LLM05 · LLM05→LLM10 ·
LLM06→LLM03 · LLM07→LLM08 · LLM08→LLM09 · LLM09→LLM07 · LLM10→LLM06`

---

## Entries that changed scope

### LLM08 — System Prompt Leakage → Hidden Context Exposure

The broadest change on the list. The 2026 entry covers the extraction,
inference, or reconstruction of **any** non-user-facing context the application
assembles into the model's context window — the system prompt, developer
instructions, retrieved policy text, and the tool and function schemas exposed
to the model — not just the system prompt.

Severity tracks what that context holds: internal rules and workflow logic are
medium, embedded credentials or reliance on context secrecy for authorisation
are high, and disclosure that chains to code execution or broad exfiltration is
critical. The design principle is that hidden context is discoverable and is
never a security boundary.

### LLM10 — Insecure Output Handling → Improper Output Handling

Renamed, and widened to cover the insecure code that coding assistants generate
at scale. Output that reaches a compiler, a repository, or a production system
carries the same downstream-execution risk as output that reaches a shell, a
browser, or a database.

### Entries that grew without changing name

| Entry | Absorbed in 2026 |
|---|---|
| **LLM01** Prompt Injection | Cross-modal attacks — instructions hidden in image, audio, or video content |
| **LLM04** Supply Chain | Artifact provenance — unsigned weights, hijacked conversion/merge services, model namespace reuse |
| **LLM05** Data and Model Poisoning | Fine-tuning subversion — backdoored adapters, customer fine-tunes, distilled checkpoints |
| **LLM10** Improper Output Handling | Insecure generated code reaching compilers, repositories, and production |

---

## Severity re-baselining

Three entries moved severity. Each change follows the rank movement the 2026
list published, and its rationale in the OWASP project leads' preface. See
[RATIONALE.md § 4.5](RATIONALE.md#45-2026-severity-re-baselining) for the full
justification.

| Entry | 2025 | 2026 | Basis |
|---|---|---|---|
| **LLM03** Excessive Agency | High | **Critical** | Climbed to third, the largest move on the list; vote and incident record agree that agentic deployments are where damage lands |
| **LLM06** Unbounded Consumption | Medium | **High** | Rose four places on practitioner weighting of resource and cost exhaustion |
| **LLM07** Misinformation | Medium | **High** | Widest vote-versus-evidence gap on the list, with the incident record placing it near the top |

The other seven entries kept their 2025 severity.

---

## What to update on your side

1. **Findings and risk registers** — rewrite entry IDs using the map above. Eight
   of ten change, and five of the changes are a permutation, so a naive
   find-and-replace run in ID order will corrupt them. Substitute all IDs in one
   pass, or map by entry name.
2. **CI eval configuration** — the garak profiles under `evals/garak/` were
   renamed to the 2026 numbering. See the table in [evals/README.md](evals/README.md).
3. **Dashboards and queries** — `source_list` in `data/entries/*.json` is now
   `LLM-Top10-2026`. Anything filtering on `LLM-Top10-2025` returns nothing.
4. **Scope boundary** — the 2026 list draws a sharper line: it owns the risk
   while the model is a component inside your application. Once the model
   becomes an actor, with tools it can call and memory it carries between
   sessions, pair the entry with the
   [OWASP Agentic Top 10](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/).

---

## Corrections made during the migration

Three framework files carried entries from the **2023** list that earlier
updates had missed. They were reconciled to the 2026 list as part of this work:

| File | Problem | Resolution |
|---|---|---|
| `llm-top10/LLM_DORA.md` | Carried both `Model DoS` (2023) and `Unbounded Consumption`; `Training Data Poisoning` (2023) in place of `Data and Model Poisoning`; no output-handling entry | Dropped the stale `Model DoS` duplicate, folded `Training Data Poisoning` into LLM05, authored LLM10 |
| `llm-top10/LLM_FedRAMP.md` | Same three problems | Same resolution |
| `llm-top10/LLM_SP800218A.md` | Same duplication, plus no `Sensitive Information Disclosure` entry | Dropped the stale duplicate, folded `Training Data Poisoning` into LLM05, authored LLM02 |

Their quick-reference tables were keyed to the pre-2025 numbering, so each file
was remapped by entry **name** rather than by ID.

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
