<!--
  OWASP GenAI Crosswalk
  File    : docs/TRIAGE_RULES.md
  Purpose : Where an incoming item goes — incident, benchmark catalogue, or noted and closed
  Version : 1.2.0 — 2026-11-25
  License : CC BY-SA 4.0
-->

# Triage rules

The weekly watcher surfaces new research, CVEs and framework changes continuously. This
page says where each one goes, so the decision is made the same way every week and does
not have to be re-argued.

## The rule in one line

**`data/incidents.json` records real-world deployment failures. Nothing else.**

Everything else is either a published evaluation corpus, which is catalogued, or
literature, which is noted and closed.

## Routing

### 1. Default — note and close

Applies to papers that demonstrate a technique, propose a framework or maturity model,
or analyse a class of vulnerability. These are **not incidents**, however sound the work
or alarming the finding. Close as completed with the reason **"Theoretical/Reference"**,
leaving the triage label in place so the watcher's original judgement stays visible in
the history.

A laboratory attack is still literature. A proof-of-concept against a product the
researchers ran themselves is still literature. What makes something an incident is that
a deployed system failed, not that someone showed it could.

### 2. Exception — append as a citation

Applies **only** when the item is a post-mortem, dataset or deep-dive analysis of a
**specific real-world GenAI failure that occurred in the wild**. Append it to the
incident record for that failure, naming the record. If no record exists, the item is
evidence for creating one — under the same standard the index already holds.

A measurement study that finds a flaw **in live third-party deployments** — public MCP
servers, a live skill registry — reports systems that failed in the wild, not a
laboratory demonstration, and gets one incident record for the study. (Precedents
INC-114, INC-118, INC-121 and INC-126; maintainer ruling, 2026-11-25, on #225 and #302.)

### 3. Exception — catalogue as an external benchmark

Applies when the item introduces a **structural benchmark or evaluation dataset meant
for testing systems** rather than reporting a singular event. Add a row to
[`../evals/EXTERNAL_BENCHMARKS.md`](../evals/EXTERNAL_BENCHMARKS.md).

What a catalogue row is not: it is not a profile this repository runs, not a threshold
this repository sets, and not a reproduction of anyone's results. Benchmarks are
published with their own harness and licence, and a pass mark for someone else's
benchmark is theirs to set.

A defense paper that also introduces a **named** benchmark gets a row for the benchmark;
the defense itself is noted. The row names the authors' own defense evaluated on it.
A defense paper with no named benchmark is noted and closed. (Maintainer ruling,
2026-10-09, on #194 and #198.) An attack paper that introduces a named benchmark is
treated the same way: the row is for the benchmark and names the authors' own attack.
(Maintainer ruling, 2026-11-25, on #283.)

## CVEs

A published CVE in GenAI tooling is an incident record when it names an affected version
and has a citable advisory. Two clarifications (maintainer ruling, 2026-11-25, on #324):

- **GenAI tooling means the flaw is in the GenAI-specific function.** A flaw in a
  general-purpose product's AI feature counts (the JeecgBoot AIRAG handler, #254). A
  generic bug in a product that merely serves the GenAI ecosystem does not (the Docling
  parser CVEs, #255–#264).
- **The affected version must be the product's own.** An advisory that names only a
  downstream distribution package, not a version of the product, does not meet the bar
  (Goose, #319).

Record one incident per product per disclosure batch — the advisories a vendor publishes
together — citing every CVE and advisory id, rather than one record per CVE. Record it
with:

- severity **transcribed** from the published CVSS base severity, never authored;
- a `basis` on every control failure quoting the source, with `confirmed_by` empty until
  a human confirms it;
- the provenance stated plainly in the record when it is weak — if the CNA is not the
  vendor, if NVD has deferred analysis, or if the score is a third-party secondary
  metric, the record says so rather than presenting the number as vendor-confirmed.

## When an item blends categories

A paper that introduces a benchmark *and* details a novel real-world breach does not get
routed by whoever reads it first. Flag it for human review and say what the conflict is.
The same applies when a rule and a worked example disagree: surface the disagreement
instead of silently picking one.

## What an agent may decide here

Routing an item is clerical and an agent may do it. Two things it may not do:

- **Assert a mapping.** Which OWASP entry a benchmark or incident exemplifies is a
  security judgment (C4) and is marked DRAFT until a reviewer signs it off.
- **Set a threshold or a severity of its own.** Both are transcribed from the source or
  left to a human.

## Related

- [`../evals/EXTERNAL_BENCHMARKS.md`](../evals/EXTERNAL_BENCHMARKS.md) — the catalogue rule 3 writes to.
- [`EVIDENCE_METHODOLOGY.md`](EVIDENCE_METHODOLOGY.md) — how a control failure earns its place in an incident record.
- [`../GOVERNANCE.md`](../GOVERNANCE.md) — who decides what, and the dispute path.
