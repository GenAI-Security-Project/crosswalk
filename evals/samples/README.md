# Committed run evidence — runbook

**Status: no run has been committed for any track.** This directory holds the
procedure, not results. Anything that appears here later must come from a real
execution against a system the runner was authorised to test. Synthesised,
edited-to-look-right, or partial-but-labelled-complete output is never acceptable —
an eval suite with fabricated evidence is worse than one with none.

Why this matters: `evals/` shipped for months as configuration only. Nothing in the
repository demonstrated that a single profile had ever been executed end to end, so
nobody could tell a working probe list from a typo. One recorded run per track is the
minimum that turns the profiles from a claim into a tool.

## Why no sample is committed yet

Producing one requires all of the following, none of which is available to an
automated contributor working in this repository:

1. Garak, PyRIT and LAAF installed (`pip install garak pyrit` plus the LAAF repository).
2. A credential for a model deployment, and **written authorisation** to run adversarial
   prompts against it (see the notice at the top of [`../README.md`](../README.md)).
3. A budget — a full pass over the three tracks is on the order of a dollar with a
   small hosted model, more with a larger one.

The maintainer-side request is tracked in the `needs-human-run` issue linked from the
pull request that added this file.

## Producing a sample

Each track gets one directory: `garak/`, `pyrit/`, `laaf/`. Inside it, one run.

### Garak

```bash
export GARAK_MODEL_TYPE=<type>
export GARAK_MODEL_NAME=<name>
# plus the credential the generator needs, e.g. OPENAI_API_KEY
bash evals/garak/run_all.sh
```

Garak writes `<profile>.report.jsonl`, `<profile>.hitlog.jsonl` and `<profile>.log`
per profile into `evals/results/<timestamp>/`. Commit **only** the `report.jsonl`
files plus the `run_all.sh` summary (the last ~20 lines of the console output, saved
as `SUMMARY.txt`). The hit logs contain the model's raw harmful completions — do not
commit them.

### PyRIT

```bash
export EVAL_MODEL_NAME=<deployment or model name>
export EVAL_ENDPOINT=<OpenAI-compatible chat endpoint URL>
export OPENAI_API_KEY=...
for s in evals/pyrit/*.py; do python "$s" | tee "evals/results/pyrit-$(basename "$s" .py).txt"; done
```

Each script prints a summary block (prompts sent, successful attacks, verdict). Commit
the summary blocks only, as `<script>.txt`. Strip any echoed model output above the
summary.

### LAAF

```bash
export LAAF_TARGET=<target>
export LAAF_MODEL=<model>
bash evals/laaf/run_laaf.sh
```

Commit `crosswalk-report.md` and the per-stage `S<n>.json` files with the
`responses` / `payload` arrays removed (they hold the attack strings and the model's
replies). Keep the counts and rates.

## Sanitising before commit — checklist

Every item, every time. The repository is public.

- [ ] No credential, token, organisation id, project id or account id anywhere in the files
      (`grep -rniE 'sk-|api[_-]?key|bearer|org-|proj_' evals/samples/` must be empty).
- [ ] No endpoint hostname that identifies an internal system. Replace with `<endpoint>`.
- [ ] No raw model completions of successful attacks (hit logs, `responses` arrays).
      Counts and rates are the evidence; the payloads are not.
- [ ] No personal data in prompts or outputs. The bias and leakage scripts are the ones to
      check most carefully.
- [ ] The model / deployment **name** may stay if the runner is comfortable publishing it;
      otherwise replace it with a neutral label and say so in `RUN.md`.
- [ ] Files are UTF-8 without BOM.

## What to record alongside the files

A `RUN.md` in the track directory, filled in by the person who ran it:

```
Run date        : YYYY-MM-DD
Tool version    : garak x.y.z / pyrit x.y.z / laaf commit <sha>
Target          : <type> / <name or neutral label>
Authorisation   : <who authorised the run, in one line — no contact details>
Profiles run    : <list, or "all">
Thresholds      : defaults from evals/THRESHOLDS.md, or the overrides used
Outcome         : <n> pass / <m> fail
Sanitisation    : checklist above completed; what was removed
```

Then update the table at the top of [`../README.md`](../README.md) ("Committed run
evidence") and, if the run says anything about a threshold, note it in
[`../THRESHOLDS.md`](../THRESHOLDS.md) under the reviewer's name.

## What this directory is not

- Not a results archive. One run per track, replaced when a newer run lands.
- Not a benchmark of any vendor. The target label is incidental.
- Not a place for partial runs presented as complete. A run that stopped early is
  committed with its actual profile count in `RUN.md`, or not at all.
