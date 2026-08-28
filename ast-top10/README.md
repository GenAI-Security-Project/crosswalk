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

**It is currently empty of mappings, and that is the accurate state.** The
source list is registered — the validator recognises the `AST` prefix, the ten
entries exist in `data/entries/`, and the counts include them — but no
risk-to-control mapping has been authored.

That is deliberate. A mapping asserts that a specific control addresses a
specific risk, which is security judgment. It is authored by a subject-matter
expert and signed, not generated. The work is tracked as **T-A10-03**.

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
