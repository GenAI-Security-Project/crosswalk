<!--
  OWASP GenAI Crosswalk
  File    : docs/SCHEMA_V2_MIGRATION.md
  Purpose : Mapping schema v2 — what the fields mean, why they are named this way
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Mapping schema v2

Every mapping in this repository asserts that a framework control addresses a
GenAI risk. Until now the row said only *that* — not how strongly, on whose
judgment, against which version of the framework, or on what reasoning. An
auditor cannot accept "control A.8.16 applies" without those answers, and
neither should a reader.

Schema v2 adds them. It is deliberately modelled on **NIST IR 8278A Rev. 1**,
the submission guidance for the NIST National Online Informative References
(OLIR) Program, so that an OLIR submission is a projection of this data rather
than a rewrite of it.

> NIST IR 8278A Rev. 1, *National Online Informative References (OLIR) Program:
> Submission Guidance for OLIR Developers*, February 2024.
> <https://csrc.nist.gov/pubs/ir/8278/a/r1/final>

---

## The fields

| Field | Type | Source |
|---|---|---|
| `relationship` | enum | OLIR **Relationship** |
| `rationale_type` | enum | OLIR **Rationale** |
| `rationale` | string | OLIR **Comments** |
| `confidence` | enum | OLIR **Strength of Relationship** |
| `framework_version` | string | crosswalk |
| `reviewed_by` | string[] | crosswalk |
| `review_date` | date | crosswalk |

### `relationship` — the logical comparison

IR 8278A Rev. 1 §3.1 defines the Relationship field as *"the type of logical
comparison that the OLIR Developer asserts for the Reference Document Element
compared to the Focal Document Element,"* and states the vocabulary verbatim:

> This will be one of the following: **subset of, intersects with, equal,
> superset of, or not related to.**

Stored hyphenated so the value is a stable machine token:

| Stored | OLIR spelling | Means |
|---|---|---|
| `equal` | equal | the control and the risk cover the same ground |
| `subset-of` | subset of | the control addresses part of the risk |
| `superset-of` | superset of | the control covers the risk and more besides |
| `intersects-with` | intersects with | they overlap, neither contains the other |
| `not-related-to` | not related to | asserted non-relationship — useful, and rarely recorded |

The export expands the hyphens back to the spec's spacing. Nothing else in the
vocabulary is invented, extended, or renamed.

### `rationale_type` vs `rationale` — why there are two

This is the one place where the obvious naming would have been wrong.

In OLIR, **Rationale is an enum**, not prose: *"The explanation for why a
Reference Document Element and a Focal Document Element are related. This will
be one of the following: syntactic, semantic, or functional."*

A single free-text field called `rationale` would therefore collide with an
OLIR field of the same name and a different type, and the export would have to
rewrite rather than project — the exact outcome this schema is shaped to avoid.
So the two concepts are kept apart:

- **`rationale_type`** — `syntactic | semantic | functional`, exports to OLIR *Rationale*
- **`rationale`** — prose citing the specific clause, exports to OLIR *Comments*,
  which the spec describes as optional supplemental information for OLIR users

A useful `rationale` names the clause and says what it does and does not reach.
"ISO A.8.12 DLP addresses the egress vector of LLM02 but not prompt-side
disclosure — hence subset, not equal" is a rationale. "Applies to LLM02" is not.

### `confidence` — and the rule that protects it

`high | medium | low | unreviewed`, mapping to the optional OLIR *Strength of
Relationship*.

**A row may not claim review it does not have.** `validate.js` fails any mapping
whose `confidence` is above `unreviewed` while `reviewed_by` is empty. Confidence
is a claim about human judgment; without a name attached there is no judgment to
point at, and a scale that can be raised by whoever last edited the file measures
nothing.

Rows written before schema v2 carry `confidence: unreviewed`. That is an honest
label, not a defect: it says the relationship has not been typed, scored, or
signed by anyone. Leaving the field absent would have read as "fine".

### `framework_version`, `reviewed_by`, `review_date`

Crosswalk-specific provenance. Pinning the framework release a row was authored
against is what makes version rot **detectable** — without it, a mapping written
against ASVS 4.0.3 and a mapping written against 5.0 are indistinguishable.

`reviewed_by` holds named humans. An agent never adds itself.

---

## Migration state

Migration is file by file. The schema does **not** require the v2 fields, so an
unmigrated file stays valid; the validator checks that whatever is present is
well-formed.

| State | What it means |
|---|---|
| `confidence: unreviewed`, no `relationship` | legacy row, untouched since before v2 |
| v2 fields present, `reviewed_by: []` | migrated shape, judgment still outstanding |
| v2 fields present, `reviewed_by` named | verified |

**`llm-top10/LLM_ISO27001.md` is the template.** Its 40 rows carry the v2
columns with every value set to `DRAFT`, because under the project's
constraints an agent does not author a relationship type, a confidence level,
or a rationale — that judgment is the thing the crosswalk exists to carry, and
it must be human and attributable. The file is a request for review, not a
finished migration.

## Adding the columns to a mapping file

Append to the existing control table; the parser matches columns by header
name, so order is free and partial migration is fine:

```markdown
| Control | ID | Domain | How it applies | Relationship | Rationale type | Confidence | Framework ver. | Reviewed by |
|---|---|---|---|---|---|---|---|---|
| Data leakage prevention | A.8.12 | Technological | DLP on all LLM output channels | subset-of | functional | medium | ISO 27001:2022 | A. Reviewer |
```

Then regenerate and validate:

```bash
node scripts/generate.js
node scripts/validate.js
```

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
