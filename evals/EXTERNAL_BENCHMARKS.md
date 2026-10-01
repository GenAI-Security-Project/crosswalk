<!--
  OWASP GenAI Crosswalk
  Document  : External Benchmarks — catalogue of published evaluation corpora
  Version   : 1.1.0 — 2026-09-30
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
- **Release and licence are as stated by the authors.** Where the Source column names
  a release, the link was checked to resolve when the row was added; the licence is the
  one the release declares, or "none stated". A release the paper promises but has not
  published is recorded as not released.

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
| **APort Vault** | **Payment authorization** in tool-using agents: whether human-written attacks get an agent to request or execute payments, with and without a deterministic pre-action check implementing the Open Agent Passport (OAP) specification; reports five distinct events per evaluation rather than one collapsed number | 4,371 attacks written by humans against a live payment agent during a public capture-the-flag event; 14 models from 8 labs; five policy configurations; two replay tracks; 225,964 evaluations | LLM01 Prompt Injection · LLM03 Excessive Agency · ASI02 Tool Misuse and Exploitation | [arXiv:2609.22076](https://arxiv.org/abs/2609.22076) · release: [aporthq/vault-benchmark-v1](https://huggingface.co/datasets/aporthq/vault-benchmark-v1) (CC BY 4.0; access-gated). The paper's disclosure section states that the author founded the company that develops the authorization layer evaluated, and that the benchmark was designed, run and analysed by the author. |
| **ClashBench** | **Destructive resource preemption**: whether an agent obtains resources for a requested task "by terminating, overwriting, evicting, or degrading an incumbent task" rather than reporting the conflict | 268 validated conflict cases across 55 resource types; 17 models evaluated through Codex, Claude Code and OpenCode | LLM03 Excessive Agency · ASI02 Tool Misuse and Exploitation | [arXiv:2609.19892](https://arxiv.org/abs/2609.19892) · release: [TarferSoul/CLASHBench](https://github.com/TarferSoul/CLASHBench) and [jinjinyien/CLASHBench](https://huggingface.co/datasets/jinjinyien/CLASHBench) (licence: none stated) |
| **AgentLSD** | **Adversarial task contamination** of AI security agents — deceptive artifacts in the environment, including non-instructional evidence "such as fake results and decoy endpoints", rather than injected instructions alone | Paired clean and trap-augmented runs on CTF challenges with deterministic trap generation; 6 models on 11 web CTF challenges | LLM01 Prompt Injection · ASI01 Agent Goal Hijack | [arXiv:2609.19140](https://arxiv.org/abs/2609.19140) · release: [Golim/agent-lsd](https://github.com/Golim/agent-lsd) (MIT) |
| **AgentXploit-Bench** | **End-to-end exploitability of AI-agent systems** in authorized white-box pre-deployment auditing: attacks must act through the task-defined attacker interface and be confirmed by an external verifier | 72 reproducible vulnerabilities across 12 open-source AI-agent systems and frameworks | ASI02 Tool Misuse and Exploitation · ASI05 Unexpected Code Execution · LLM01 Prompt Injection | [arXiv:2609.31318](https://arxiv.org/abs/2609.31318) · release: [lwd17/AgentXploit](https://github.com/lwd17/AgentXploit) (README states Apache-2.0; no licence file in the repository) |
| **PrivDrift** | **User-secret leakage under topic drift**: whether secrets a user disclosed earlier in an active conversation remain recoverable after the dialogue moves on, under persuasion-based probing | 1,000 controlled multi-turn dialogues with seeded secrets, content-dense drift turns and standardized extraction probes; 3 LLMs with extended context windows | LLM02 Sensitive Information Disclosure · DSGAI11 Cross-Context Conversation Bleed | [arXiv:2609.30094](https://arxiv.org/abs/2609.30094) · not released: the paper states the authors "plan to release" the generation code, probes, scripts and a sanitized subset |

## Why these and not others

Routing — incident, catalogue, or noted and closed — is defined once in [`../docs/TRIAGE_RULES.md`](../docs/TRIAGE_RULES.md).

## Changelog

| Date | Change |
|---|---|
| 2026-09-18 | Created with LongPIBench, GenIaC-SecBench and TIER, from the watcher triage of issues #47, #55 and #70. |
| 2026-09-30 | Added APort Vault, ClashBench, AgentLSD, AgentXploit-Bench and PrivDrift, from the watcher triage of issues #125, #137, #144, #160 and #171; added the release and licence note. |
