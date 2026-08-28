<!--
  OWASP GenAI Crosswalk
  File    : shared/UNIVERSAL_SKILL_FORMAT.md
  Purpose : The AST10 Universal Skill Format, cross-linked to the risks it mitigates
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Universal Agentic Skill Format

The OWASP Agentic Skills Top 10 proposes a **Universal Agentic Skill Format**: a
signed, declarative manifest describing what a skill may do, so that a claim
about a skill's behaviour can be checked rather than trusted.

This note summarises the format and cross-links each feature to the `AST` risk it
addresses. It is a **reference, not a specification** — the format is defined by
the AST10 project and the authoritative version is theirs:

> <https://owasp.org/www-project-agentic-skills-top-10/>
>
> **Attribution.** The Universal Agentic Skill Format is the work of the OWASP
> Agentic Skills Top 10 project, a sibling OWASP project with its own leads and
> contributors. It is described here because the crosswalk maps its risks, not
> because it originates here.

---

## Why a manifest at all

The skill layer sits between the model and its tools. MCP defines *what* tools
exist; a skill file defines *how* an agent orchestrates them. That file is
executable configuration, it frequently comes from a third party, and it has
historically received none of the review any other dependency would get.

A manifest turns implicit behaviour into a declaration that can be signed,
diffed, scanned and enforced — which is what makes each of the mitigations below
possible.

## Format features, and the risks they address

| Feature | What it does | Addresses |
|---|---|---|
| `signature` (ed25519) | signs the canonical hash of the manifest | [AST01](../CROSSREF.md) Malicious Skills · AST02 Supply Chain Compromise |
| `content_hash` (sha256) | hash of the complete skill package | AST01 · AST02 · AST07 Update Drift |
| `permissions` allow/deny lists | explicit paths, no wildcards | AST03 Over-Privileged Skills |
| `permissions.deny_write` | protects identity files — `SOUL.md`, `MEMORY.md`, `AGENTS.md` | AST03 · AST05 Untrusted External Instructions |
| `network.allow` domain allowlist | egress by domain, not a binary on/off, with `deny: "*"` default | AST03 · AST05 |
| `requires` | declared binaries and `min_runtime_version` | AST02 · AST07 |
| `risk_tier` (L0–L3) | L0 safe → L3 destructive; a declared blast radius | AST09 No Governance · AST10 Cross-Platform Reuse |
| `scan_status` | scanner identity, last-scanned date, result | AST08 Poor Scanning |
| `changelog` | versioned history of the manifest itself | AST07 · AST09 |

### The identity-file carve-out is the interesting one

`permissions.deny_write` names `SOUL.md`, `MEMORY.md` and `AGENTS.md` explicitly.
Those files define who the agent believes it is and what it remembers. A skill
that can rewrite them does not merely act beyond its remit — it changes the
agent's future behaviour in every later session. Requiring an explicit grant to
touch them treats agent identity as a protected resource rather than as ordinary
state, which is the same instinct behind
[LLM08 Hidden Context Exposure](../llm-top10/LLM_MITREATLAS.md) and
[ASI06 Memory & Context Poisoning](../agentic-top10/Agentic_MITREATLAS.md).

### `risk_tier` is a governance primitive

L0–L3 is not a severity score. It is a declaration of what a skill is *permitted*
to be, which lets an organisation set policy — "no L3 skills outside the sandbox
tier" — without reading every manifest. That is what makes AST09 (No Governance)
and AST10 (Cross-Platform Reuse) tractable at fleet scale.

## Relationship to the crosswalk's own mappings

The format is a **mitigation**, not a framework. It does not appear in
`data/frameworks/`, and it is not something the crosswalk maps risks *to*.

Where a control in a mapped framework requires the property this format
provides — artifact signing, least-privilege manifests, egress allowlisting,
inventory — the mapping lives in the `ast-top10/` files. Those are **not yet
authored**: risk-to-control mapping is expert work, tracked as T-A10-03.

## Status

| | |
|---|---|
| Format | proposed by the AST10 project |
| Included here as | reference and cross-link |
| AST risk mappings | not yet authored — see [`ast-top10/README.md`](../ast-top10/README.md) |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
