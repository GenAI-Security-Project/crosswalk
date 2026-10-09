# Verification methods

A mapping row says that a control addresses a risk. A verification method says
how to check that the control is actually in place. Methods and their links to
controls are held as data, agreed in issue #191 after the pilot in #186.

| File | Holds | Schema |
|---|---|---|
| `data/verification-methods.json` | Each method, once | `data/verification-methods-schema.json` |
| `data/verification-links/<framework-id>.json` | Links methods to framework's controls | `data/verification-links-schema.json` |

Both are hand-edited source files. `scripts/validate.js` checks them on every
full run, through `scripts/verification.js`. Version 1 is data, schemas and
validation only: the generator, the exports and the webapp do not read these
files yet.

---

## Methods

| Field | Required | Content |
|---|---|---|
| `id` | yes | `VM-` and four digits. Sequential, never reused or renumbered. |
| `name` | yes | Short title, at most 80 characters |
| `method_type` | yes | One of: `examine`, `interview`, `test` (below) |
| `procedure` | yes | What the assessor does |
| `expected_result` | yes | What a pass looks like. Must be observable. |
| `source` | yes | The source the method is derived from, or `null` if it was written here |
| `status` | yes | One of: `draft`, `reviewed`, `deprecated` |
| `reviewed_by` | yes | Named humans who reviewed the method. Empty while `draft`. |
| `frequency` | no | Recommended minimum: `{ "mode": "continuous" }`, `periodic` or `event_driven` |
| `evidence` | no | Artefacts the check produces or consumes |
| `review_date` | no | `YYYY-MM-DD` of the latest review |
| `status_note` | no | Status context. Required when `deprecated`: the reason and any replacement id. |

`method_type` follows the assessment methods of NIST SP 800-53A. A method that
combines types records its main one.

| Value | Meaning |
|---|---|
| `examine` | Review, inspect or analyse artefacts: documents, configurations, logs, records |
| `interview` | Discuss with the people responsible for the control |
| `test` | Exercise the control under defined conditions and compare actual with expected behaviour |

### Sources and licences

`source` holds `name`, `version`, `id`, `url`, `license` and, optionally, `text`.
Write `license` as an SPDX identifier where one exists (`CC-BY-SA-4.0`).

- **Include `text`** (the source's original wording, unchanged) only if the
  source's licence allows reproducing it in this CC BY-SA 4.0 repository. The
  method's own fields are then adapted from it.
- **Otherwise cite by `id` and `url` only**, for example for proprietary
  standards.

Contributors and reviewers judge licence compatibility in the PR. The validator
catches only the plain case: a `license` containing "proprietary" or "all rights
reserved" (any case) together with `text` is an error.

### Status and changes

- `reviewed` needs at least one name in `reviewed_by`. An agent never adds itself.
- An editorial change (clarity, typos) keeps the id. A change to what is tested
  or to the pass criteria is a new method. The old one becomes `deprecated`, with
  `status_note` naming the replacement, and its links are re-pointed in the same PR.
- Deprecated methods stay in the file, so an id never comes to mean something else.

---

## Links

A links file is named after a framework's registry id and declares it:

```json
{
  "version": "1.0",
  "framework": "cosai",
  "links": [
    { "method_id": "VM-0001", "control_id": "WS4-AGT-2.2", "entry_id": null, "reviewed_by": [] },
    { "method_id": "VM-0002", "control_id": "WS4-AGT-2.2", "entry_id": "ASI03", "reviewed_by": [] }
  ]
}
```

| Field | Content |
|---|---|
| `method_id` | A method in `data/verification-methods.json` |
| `control_id` | A control in `data/frameworks/<framework-id>.json` |
| `entry_id` | `null` for a control-level link; an entry id (`LLM01`, `ASI04`, `DSGAI07`, `AST01`) for one risk–control row |
| `reviewed_by` | Named humans who confirmed the method verifies this control or row. Empty means draft. |

**Control level or row level?** Ask whether the method verifies the control the
same way regardless of the risk.

- **Yes:** `entry_id: null`. One link covers every row of the control.
- **No:** set `entry_id`. A control stating an outcome ("limit agent actions")
  is usually checked differently for each risk it is mapped to.

Links are sorted by `control_id`, then `entry_id` with control-level links first,
then `method_id`. Sorting spreads parallel additions across the file, so they
rarely conflict.

---

## Validation

Errors fail the build:

- a field missing, undeclared, or outside its allowed values or pattern
- a duplicate method id or a duplicate link
- `reviewed` without a reviewer, or `deprecated` without a `status_note`
- a links file whose name differs from its `framework`, or with no registry
- a link to a method, control or (for row-level links) mapping row that does not
  exist. Row-level links are matched through the registry's display name, since
  mapping rows are keyed by name and the registry id is the stable key.
- links out of order

Warnings flag review states that would overstate each other:

- a reviewed link on a method that is still `draft`
- a reviewed row-level link on a mapping row with no reviewer
- a link to a `deprecated` method
