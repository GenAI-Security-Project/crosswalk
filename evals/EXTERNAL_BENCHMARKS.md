<!--
  OWASP GenAI Crosswalk
  Document  : External Benchmarks — catalogue of published evaluation corpora
  Version   : 1.0.0 — 2026-09-18
  License   : CC BY-SA 4.0
-->

# External Benchmarks

Published benchmarks and evaluation corpora that test GenAI systems for the risks this
crosswalk maps. They are catalogued here so a reader can find them; **none of them ships
as a profile in this repository.**

## What this file is not

- **Not runnable from here.** Nothing below is a Garak probe, a PyRIT script or a LAAF
  stage. Each is published by its own authors with its own harness and licence, and is
  run from there. `evals/garak/`, `evals/pyrit/` and `evals/laaf/` remain the only
  runnable profiles.
- **Not threshold-bearing.** [`THRESHOLDS.md`](THRESHOLDS.md) covers the profiles this
  repository runs. A pass mark for someone else's benchmark is theirs to set, not ours,
  so no value is recorded here.
- **Not an endorsement or a reproduction.** The figures below are the authors' own,
  transcribed from each paper's abstract. Nothing has been re-run.

## The OWASP entry column is DRAFT

> **DRAFT — SME review required.** The entry each benchmark is listed against is a
> reading of the benchmark's stated scope, not a reviewed mapping. A reviewer should
> confirm or correct it before anything downstream relies on it.

## Catalogue

| Benchmark | What it measures | Scale, as published | OWASP entry (DRAFT) | Source |
|---|---|---|---|---|
| **LongPIBench** | Prompt injection in **long-context** settings, which short-context benchmarks leave unexplored — the authors argue that gap "leads to a substantial overestimation of the effectiveness of current defenses" | 4 realistic application scenarios — paper peer review, resume screening, code review, email summary — each with a synthetic and a real-world dataset, context lengths from thousands to tens of thousands of tokens | LLM01 Prompt Injection | [arXiv:2608.28411](https://arxiv.org/abs/2608.28411) |
| **GenIaC-SecBench** | Security of **LLM-generated Infrastructure-as-Code**, against a human baseline, so results say whether models are worse than engineers rather than reporting raw vulnerability counts | 100 deployment scenarios stratified by architectural complexity; 12 model configurations from 4 vendors; 1,196 IaC artifacts; 3 independent scanners | LLM10 Improper Output Handling | [arXiv:2608.28021](https://arxiv.org/abs/2608.28021) |
| **TIER** | Behavioural safety across **threat implicitness**, replacing binary refuse/comply metrics with a graded scale — the authors find "safety behaviors evolve gradually across threat levels rather than shifting directly from refusal to compliance" | 4 risk domains × 4 threat levels, from explicit harmful requests to sophisticated jailbreaks; 6-label behaviour scale; 2 independent LLM judges; 6 open-weight models | LLM01 Prompt Injection | [arXiv:2609.05117](https://arxiv.org/abs/2609.05117) |

## Why these three and not others

The weekly watcher surfaces new research continuously. A paper earns a row here only if
it publishes a **benchmark or evaluation corpus meant for testing systems** — not if it
demonstrates a technique, proposes a framework, or analyses a vulnerability class. Those
are literature, and they are noted and closed rather than catalogued. Nor do they belong
in `data/incidents.json`, which is reserved for real-world deployment failures.

## Changelog

| Date | Change |
|---|---|
| 2026-09-18 | Created with LongPIBench, GenIaC-SecBench and TIER, from the watcher triage of issues #47, #55 and #70. |
