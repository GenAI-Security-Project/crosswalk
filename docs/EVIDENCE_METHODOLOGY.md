<!--
  OWASP GenAI Crosswalk
  File    : docs/EVIDENCE_METHODOLOGY.md
  Purpose : How incident control failures become evidence counts on mappings
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Evidence methodology

> **DRAFT — maintainer ratification required.** The plumbing described here is
> built and running. The *rules* it applies are proposals, marked
> `TODO(maintainer)` where a decision is still open. Until they are ratified,
> no evidence count should be quoted outside this repository.

Most crosswalks say that a control addresses a risk. Few can show that the
control mattered: that its absence, or its failure, is what let a real incident
happen. This page describes how the crosswalk records that, and — just as
important — what it refuses to count.

---

## The idea in one paragraph

A **mapping** says *control C addresses risk R*. An **incident** in
`data/incidents.json` can record, in `control_failures[]`, that *control C was
absent, bypassed, misconfigured or failed*. When that incident exemplifies R,
the failure is evidence for the mapping. The number of such incidents is the
mapping's `evidence_count`.

## Counting rules

These are implemented in exactly one place, `scripts/evidence.js`, and every
consumer (stats, generator, compliance report, npm package) goes through it.

| # | Rule | Why |
|---|---|---|
| 1 | A failure supports a mapping only if the incident lists the mapping's entry in `owasp_entries` **and** names the same framework and `control_id`. | A control failing in an unrelated incident says nothing about this risk. |
| 2 | Only a **confirmed** failure — a non-empty `confirmed_by` — counts toward `evidence_count`. | A draft is a claim awaiting review. Counting it would turn a backlog into a statistic. |
| 3 | The unit is the **incident**. One incident naming the same control twice is one piece of evidence. | Otherwise a detailed write-up would outweigh a terse one. |

Drafted failures are still shown — in `evidence.drafted` on the mapping row, and
in reports — so the review backlog is visible. They are never added to a count.

`TODO(maintainer)`: ratify rules 1–3, or amend them.

## What a failure record must contain

Schema: `data/incidents-schema.json` → `control_failures[]`.

```json
{
  "framework": "MAESTRO",
  "control_id": "L6",
  "outcome": "absent",
  "basis": "<verbatim quotation from the source>",
  "source_url": "https://…",
  "confirmed_by": []
}
```

| Field | Rule |
|---|---|
| `framework` | Must be a registry `name` in `data/frameworks/`. |
| `control_id` | Must exist in that registry. |
| `outcome` | `absent` · `present-but-bypassed` · `present-but-misconfigured` · `failed` |
| `basis` | A **quotation** from the source that states the failure. Not an inference from the attack description. |
| `source_url` | Where the quotation can be read. Prefer the primary disclosure over a summary of it. |
| `confirmed_by` | Empty while drafted. A human adds their name on confirmation. |

`npm run validate` enforces the first four rows and fails a **confirmed** record
that has no `source_url`; a drafted one without it is a warning.

## Drafting discipline

Drafting is the part an agent or contributor may do. It is bounded by one rule:
**never assert a failure without a source that says so.**

- The source must *state* that a control was missing or defeated — "no rate
  limiting", "before any trust dialog", "without signature verification". A
  description of what the attacker did is not, by itself, a statement about any
  control.
- Quote; do not paraphrase into a quote. If the source cannot be fetched, the
  failure is not drafted.
- Choosing *which* control failed is a judgment. That is why every draft waits
  for confirmation, and why rule 2 exists.
- Drafts are reviewed in **batches of at most 20 incidents**, and incidents with
  drafted failures carry the `draft-evidence` tag.

## Confirmation

`TODO(maintainer)` — not yet defined. Open questions:

- **Who may confirm.** A maintainer only, or any reviewer recorded in
  `reviewed_by` for that framework?
- **What they check.** Proposed minimum: the quotation appears at `source_url`;
  it states a failure rather than an attack; the named control is the one that
  failed; the outcome is right.
- **Layer-level controls.** MAESTRO layers (`L1`–`L7`) are `kind: layer` —
  architecture context, not controls. A failure recorded against a whole layer
  is coarse. Should such records count, count separately, or be re-homed to a
  sub-control once issue #31 settles the MAESTRO sub-control ids?
- **Disagreement.** What happens to a draft a reviewer rejects — deleted, or
  kept with a rejection note so it is not re-drafted?

## Orphan failures

A failure whose incident's entries do not map that control is an **orphan**.
`npm run validate` warns on each one. It is not an error: it may mean a mapping
is missing. Adding that mapping is expert work, not something to do because a
warning asked for it.

## Where evidence appears

| Surface | What it shows |
|---|---|
| `data/stats.json` → `evidence` | Corpus totals: annotated incidents, confirmed and drafted failures, mappings with evidence, orphans. |
| `data/entries/*.json` → mapping rows | `evidence_count` and `evidence.{confirmed, drafted}`, only on rows with a linked failure. An absent field means no incident evidence. |
| `npm run compliance` | Per framework: a *Controls that failed in the wild* section, an evidence line per control, and a summary row. |
| npm package | `evidenceFor(entry, framework, control)` and `controlFailures(framework?, control?, { confirmedOnly })`. |
| Webapp | Not yet. The data ships in `docs/data.js`; rendering it is a content change that needs maintainer approval. |

## What evidence does not mean

- **No evidence is not weak evidence.** Most mappings will never have an
  incident on record. A mapping with `evidence_count` absent is unevidenced,
  not disproven.
- **Evidence is not a relationship.** An incident can show a control mattered;
  it cannot show the OLIR relationship is `subset-of` rather than
  `intersects-with`. That stays expert work.
- **The count reflects the corpus, not the world.** It measures the incidents
  this project has recorded and reviewed. It will be biased toward what gets
  publicly disclosed.
