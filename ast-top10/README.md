<!--
  OWASP GenAI Crosswalk
  Source list : OWASP Agentic Skills Top 10 (AST01–AST10)
  Version     : 2026-Q3
  Maintained by: OWASP GenAI Data Security Initiative — https://genai.owasp.org
  License     : CC BY-SA 4.0
-->

# Agentic Skills Top 10 × framework mappings

This directory holds the mappings from the **OWASP Agentic Skills Top 10**
(`AST01`–`AST10`) to the framework set, following the same
`AST_<FRAMEWORK>.md` convention as `llm-top10/`, `agentic-top10/` and
`dsgai-2026/`.

**One file exists, and every row in it is a draft.** The source list is
registered — the validator recognises the `AST` prefix, the ten entries exist in
`data/entries/`, and the counts include them — but no risk-to-control mapping
has been signed off.

That is deliberate. A mapping asserts that a specific control addresses a
specific risk, which is security judgment. It is authored by a subject-matter
expert and signed, not generated. The work is tracked as **T-A10-03**.

## Current state

| File | Status | Why |
|---|---|---|
| [`AST_MAESTRO.md`](AST_MAESTRO.md) | **scaffolded — 36 DRAFT rows** | The AST10 project publishes its own per-risk MAESTRO layer mapping, so the layer assignments are transcription rather than invention. The `relationship`, `rationale_type`, `confidence` and per-row prose are all `DRAFT`. |
| `AST_NISTAIRMF.md` | not written | no upstream mapping to transcribe |
| `AST_ISO42001.md` | not written | no upstream mapping to transcribe |
| `AST_EUAIAct.md` | not written | no upstream mapping to transcribe |
| `AST_SOC2.md` | not written | no upstream mapping to transcribe |
| `AST_ISO27001.md` | not written | no upstream mapping to transcribe |
| `AST_NHI.md` | not written | no upstream mapping to transcribe |

The six unwritten files are the priority columns for this source list — the
three GRC targets the AST10 spec names for AST05, AST09 and AST10, plus NHI,
where AST03 over-privilege meets non-human identity.

**They are left unwritten on purpose.** A scaffold is only honest where there is
something to transcribe. For MAESTRO there is; for the other six there is not,
and generating six files of `DRAFT` placeholder rows would inflate the mapping
count and the file count with rows that assert nothing. An empty file is a
clearer statement of the gap than a full one that says `TODO` 60 times.

## What a reviewer needs to do

1. Confirm the layer sets in `AST_MAESTRO.md` still match the upstream page —
   the AST10 project is active and its tables move.
2. Replace `DRAFT` in each row's `Relationship`, `Rationale type` and
   `Confidence` columns, and write the "how it applies" text.
3. Add a name to **Reviewed by**. Until then `validate.js` holds every row at
   `confidence: unreviewed`, and it will reject a raised confidence with an
   empty reviewer list.
4. Decide whether the six unwritten columns are authored here or deferred.

## What the skill layer is

The mental model from the AST10 project: **MCP defines what tools exist; the
skill layer defines what those tools actually do.** A SKILL.md or manifest file
tells an agent how to orchestrate its tools, and it is a distinct attack surface
from both the model and the tool interface.

## Attribution

The Agentic Skills Top 10 is a **sibling OWASP project** with its own leads and
contributors, credited to that project exactly as the OWASP LLM Top 10 and the
OWASP Top 10 for Agentic Applications are. It is included here as an external
source list.

Canonical specification: <https://owasp.org/www-project-agentic-skills-top-10/>

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
