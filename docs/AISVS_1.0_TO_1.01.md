<!--
  OWASP GenAI Crosswalk
  File    : AISVS 1.0 -> 1.01 requirement delta
  Source  : OWASP/AISVS 1.01/en chapter files (frozen October 2026)
  License : CC BY-SA 4.0
-->

# AISVS 1.0 → 1.01 translation

AISVS 1.01 (October 2026) is a minor release: the twelve chapters and the 44 sections are
unchanged, so no identifier moved between sections. What moved is the requirement set — 191 to
213. This page is the requirement-level delta, computed by diffing the frozen `1.0/en` and
`1.01/en` chapter files, and what this crosswalk did with each id.

| | |
|---|--:|
| Requirements in 1.0 | 191 |
| Requirements in 1.01 | 213 |
| Added | 23 |
| Retired | 1 |
| Reworded | 14 |
| Re-levelled | 2 |
| Mapping rows in this crosswalk, before | 306 |
| Mapping rows after | **328** |
| Rows added | 24 |
| Rows dropped | 2 |
| New requirements with no counterpart in the 41 entries | 1 |

## Added — 23 requirements

Every added requirement is mapped to at least one entry except 11.1.6, which is recorded as a
gap below. Most additions are MCP-specific: C10.4 alone takes 13 of the 23.

| Requirement | L | Section | What it adds | Rows | Entries |
|---|---|---|---|--:|---|
| `7.1.3` | L2 | C7.1 Output Format Enforcement | Fail-closed action path: an AI refusal, failure or unreadable response stops the action instead of being read as approval | 1 | LLM10 |
| `9.2.11` | L3 | C9.2 High-Impact Action Approval and Irreversibility Controls | Action chain exceeding its approval is blocked until re-approved, with the cumulative chain's highest reversibility class applied | 1 | ASI08 |
| `9.3.9` | L2 | C9.3 Component Isolation and Tool Authorization | Services reachable from agent or tool sandboxes enforce run/task/tenant isolation on agent-writable state, including object names | 2 | ASI02, DSGAI11 |
| `9.5.7` | L2 | C9.5 Agent Authorization, Delegation, and Continuous Enforcement | Delegated authority may never exceed the delegating agent's current authority | 1 | ASI03 |
| `10.2.8` | L1 | C10.2 Authentication & Authorization | Integrity protection for `requestState` that drives authorization, resource access or business logic | 1 | ASI03 |
| `10.2.9` | L2 | C10.2 Authentication & Authorization | Persisted OAuth client credentials bound to the issuing authorization server | 1 | DSGAI02 |
| `10.2.10` | L2 | C10.2 Authentication & Authorization | Server-side single use for `requestState` that must be consumed at most once | 1 | ASI03 |
| `10.3.6` | L2 | C10.3 Secure Transport | Intermediaries confirm the protocol version requires header and body validation before trusting mirrored headers | 1 | ASI07 |
| `10.4.9` | L2 | C10.4 Schema, Message, and Input Validation | A shared upstream OAuth client identity cannot leak one requesting client's authorization to another | 1 | ASI03 |
| `10.4.10` | L2 | C10.4 Schema, Message, and Input Validation | Consent and authorization bound to the approved MCP server endpoint, re-confirmed when the endpoint changes | 1 | ASI09 |
| `10.4.11` | L1 | C10.4 Schema, Message, and Input Validation | Tool definitions with invalid mirrored-header annotations rejected per tool, not per list | 1 | ASI02 |
| `10.4.12` | L2 | C10.4 Schema, Message, and Input Validation | Mirrored headers must match the request body after decoding | 1 | ASI07 |
| `10.4.13` | L2 | C10.4 Schema, Message, and Input Validation | Resource bounds on schema validation: depth, nested-element cap, per-validation time budget | 1 | LLM06 |
| `10.4.14` | L1 | C10.4 Schema, Message, and Input Validation | No automatic network-URI `$ref` dereference; opt-in resolution blocks loopback, link-local and private addresses | 1 | ASI02 |
| `10.4.15` | L2 | C10.4 Schema, Message, and Input Validation | Schemas failing on an unresolved external `$ref` rejected rather than treated as permissive | 1 | ASI02 |
| `10.4.16` | L2 | C10.4 Schema, Message, and Input Validation | Private-scope cached responses reused only inside the authorization context that produced them; no caching of multi round-trip results | 1 | DSGAI11 |
| `10.4.17` | L2 | C10.4 Schema, Message, and Input Validation | Servers mark cacheable user-specific or authorization-filtered results with a private cache scope | 1 | DSGAI11 |
| `10.4.18` | L2 | C10.4 Schema, Message, and Input Validation | No form-mode elicitation of secrets or payment credentials; URL-mode flow completed by the initiating user | 2 | ASI09, DSGAI02 |
| `10.4.19` | L1 | C10.4 Schema, Message, and Input Validation | No credentials or personal data in URL-mode elicitation URLs, and no pre-authenticated URLs | 1 | DSGAI01 |
| `10.4.20` | L2 | C10.4 Schema, Message, and Input Validation | Explicit consent with the full URL shown before opening a URL-mode target; no pre-fetch | 1 | ASI09 |
| `10.4.21` | L2 | C10.4 Schema, Message, and Input Validation | Client and model cannot observe the URL-mode elicitation page or the user's input | 1 | LLM02 |
| `11.1.6` | L2 | C11.1 Model Alignment, Safety, and Robustness Testing and Training | Adversarial evaluation results reported against an unattacked same-task baseline | 0 | — |
| `11.3.5` | L2 | C11.3 Model-Extraction Defense | Sampling and decoding parameters from untrusted callers clamped to server-side approved ranges | 1 | DSGAI20 |

## Retired — 1 requirement

| Requirement | Text in 1.0 | Rows | Disposition |
|---|--:|--:|---|
| `10.2.6` | Verify that MCP servers ensure all session artifacts are removed when a session terminates. | 1 | Row dropped. 1.01 keeps the id only as a
| | | | placeholder marked "Requirement removed.", and no live requirement replaces it —
| | | | 10.2.3 (no token or credential persistence) is the nearest survivor and is already
| | | | mapped in DSGAI02. Retargeting would assert a control AISVS no longer states. |

## Reworded — 14 requirements

The requirement text in every affected row was replaced with the 1.01 wording, and the row note
re-checked against it. 26 rows carry these requirements.

| Requirement | Rows | What changed |
|---|--:|---|
| `2.1.5` | 1 | Allow-list must now be derived from the supported languages and use cases |
| `2.1.6` | 4 | Adds that untrusted content cannot gain instruction priority through retrieval, tool processing or persistence |
| `8.2.3` | 2 | Broadens "agent and tool outputs are not automatically written" to "no component reachable from agent execution can write" |
| `9.1.1` | 3 | Quotas and timeouts now explicitly enforced by the runtime |
| `9.1.2` | 3 | Budgets now explicitly enforced by the runtime (no longer "configured and enforced") |
| `9.2.1` | 2 | Drops "high-impact" from the set of actions requiring approval |
| `9.2.5` | 2 | Boundaries must be runtime-enforced and not changeable or bypassable by the agent |
| `9.2.8` | 1 | Adds rejection when a bound value changes or the nonce is reused |
| `9.2.9` | 1 | Adds that the runtime cannot use the key material to issue approvals |
| `9.2.10` | 1 | Adds that the chain is established outside the gated agent's control |
| `9.3.8` | 2 | Names automatic containment actions: stop execution, isolate, revoke permissions |
| `10.2.4` | 2 | Scopes now the requester's, plus list responses vary only by authorization context, never by connection |
| `10.2.7` | 1 | Now covers token acceptance as well as passthrough, and re-levelled L2 to L1 |
| `10.3.4` | 1 | Adds no retry or fallback to a below-minimum version or legacy handshake |

## Re-levelled — 2 requirements

| Requirement | 1.0 | 1.01 | Rows | Note |
|---|---|---|---|--:|
| `10.2.7` | L2 | L1 | 1 | DSGAI02 |
| `10.3.3` | L2 | L1 | 1 | ASI07 |

Level changes do not silently move a tier: the tier column is the modal level of an entry's
mapped requirements. Only 10.3.3 and 10.2.7 changed level, and neither is modal in its entry.
Three tiers did move for a different reason — the new rows changed the level mix:

| Entry | Was | Now | Cause |
|---|---|---|---|
| LLM10 Improper Output Handling | Foundational | Hardening | +7.1.3 (L2) broke a 3–3 L1/L2 tie |
| ASI03 Identity and Privilege Abuse | Advanced | Hardening | +4 rows (three L2, one L1) make L2 modal at 7 against 5 L3 |
| DSGAI01 Sensitive Data Leakage | Hardening | Foundational | +10.4.19 (L1) broke a 3–3 L1/L2 tie |

## Dropped in review — 1 row

`11.2.3` (output calibration) is also mapped to DSGAI10 Synthetic Data and Anonymization
Pitfalls. Calibration narrows the confidence signal a reconstruction attack exploits, which is
why it stays on DSGAI18; it has no bearing on anonymisation, so the DSGAI10 row was dropped in
review rather than carried over from 1.0. That is the second dropped row in the table above,
and the reason DSGAI 2026 goes 141 to 146 rather than 147.

## Not mapped — 1 requirement

| Requirement | L | Why |
|---|---|---|
| `11.1.6` | L2 | Adversarial evaluation results must be reported alongside an unattacked same-task
| | | baseline. This is evaluation-reporting rigour. None of the 41 entries covers overstated
| | | robustness measurement, and the nearest neighbours (LLM07 Misinformation, ASI09
| | | Human-Agent Trust Exploitation) are about model or agent behaviour, not about how a test
| | | programme reports its own results. Forcing it would degrade those entries for every
| | | framework already attached. Recorded as a candidate new entry, not a mapping. |

## What still needs a human

- **The 11.1.6 gap**: add an entry for measurement rigour, or leave it recorded here.
- **The 10.2.6 drop**: confirm that losing the session-artifact control does not need a
  replacement row on a broader requirement in DSGAI11.
- The schema v2 columns are set, not drafted: 320 rows at high confidence and 8 at medium, of
  which 2 assert `intersects-with` instead of `subset-of`; every row carries `reviewed_by: Otto Sulin`.
  Two were contested on review and are marked as such in the mapping files: the DSGAI10
  calibration row, dropped, and the DSGAI12 policy row, kept at medium because runtime policy
  bounds the invocation surface and never the semantics of the query.

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
