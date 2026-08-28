<!--
  OWASP GenAI Crosswalk
  File    : docs/OLIR_SUBMISSION.md
  Purpose : How to file this crosswalk with the NIST OLIR programme
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# NIST OLIR submission

The NIST **National Online Informative References (OLIR)** Program publishes
machine-readable mappings between a NIST Focal Document and someone else's
Reference Document. An accepted entry sits in a government-referenced registry
that other projects then cite.

No competing GenAI crosswalk currently appears there. That is the opportunity.

> NIST IR 8278A Rev. 1, *National Online Informative References (OLIR) Program:
> Submission Guidance for OLIR Developers*, February 2024.
> <https://csrc.nist.gov/pubs/ir/8278/a/r1/final>

---

## The export is a projection, not a translation

Schema v2 was named against IR 8278A so this step would be a column rename
rather than a re-derivation. `scripts/export-olir.mjs` performs it:

| Crosswalk | OLIR template |
|---|---|
| control id + name | Focal Document Element (+ Description) |
| entry id + name | Reference Document Element (+ Description) |
| `relationship` | Relationship — hyphens expanded to the spec's spacing |
| `rationale_type` | Rationale |
| `confidence` | Strength of Relationship |
| `rationale` | Comments |

```bash
node scripts/export-olir.mjs --focal "NIST CSF 2.0"
```

`scripts/export-olir.test.mjs` pins the column set and the relationship spelling.
A drift there would otherwise surface only when NIST rejected the submission.

## Only reviewed rows are exported

OLIR asks a developer to **assert** a relationship. A row nobody has reviewed
asserts nothing, so exporting it would misrepresent the project to a registry
whose value is that its contents are vouched for.

The exporter therefore skips any mapping without a named `reviewed_by`. Today
that means **zero rows export**, which is the honest current state rather than a
bug — the machinery is ready and the judgment is not yet supplied.

`--include-unreviewed` exists for local inspection of the projection shape. It
must never be used to produce a submission.

## Before filing — human steps

These are decisions and correspondence, not automation:

1. **Choose the Focal Document.** CSF 2.0 first: it is the most widely
   referenced and the crosswalk already maps 164 rows to it. SP 800-53 after.
2. **Get the verified core reviewed** (T-METH06, T-STRAT04). A submission is
   only as good as the judgment behind it, and OLIR asks for a named developer
   who stands behind each assertion.
3. **Confirm the current template.** OLIR templates are versioned; re-download
   before filing and re-run the fixture test if the column set has moved.
4. **Complete the Participation Agreement** (IR 8278A Rev. 1, Appendix A).
5. **Decide who signs.** The submitting developer is a named person or
   organisation. This is an OWASP project, so that is an OWASP decision.
6. **File**, then track the review correspondence.

## Status

| Step | State |
|---|---|
| Schema aligned to OLIR vocabulary | done (T-METH01) |
| Exporter + fixture test | done (this ticket) |
| Verified core reviewed | **not started** — blocks a real submission |
| Template re-confirmed at filing time | pending |
| Participation Agreement | pending |
| Submitted | no |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
