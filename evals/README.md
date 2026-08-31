<!--
  OWASP GenAI Crosswalk
  Document  : Evaluation Profiles — Setup and Usage
  Version   : 1.0.0 — 2026-03-28
  License   : CC BY-SA 4.0
-->

# Evaluation Profiles

Runnable security test profiles mapped to OWASP GenAI vulnerability entries.

> **Authorisation required.** Run these profiles only against systems you own
> or have explicit written permission to test. These profiles are for
> pre-production gates, red team exercises, and defensive validation — not
> for testing third-party systems.

---

## What's here

| Folder | Tool | Profiles |
|---|---|---|
| `garak/` | [Garak](https://github.com/NVIDIA/garak) | 13 YAML run configs (LLM01, LLM02, LLM04–LLM10, ASI01, ASI05, ASI07, ASI08) |
| `pyrit/` | [PyRIT](https://github.com/Azure/PyRIT) | 6 Python scripts (LLM01, ASI01, ASI04, DSGAI04, DSGAI08, DSGAI17) |
| `laaf/` | [LAAF v2.0](https://github.com/qorvexconsulting1/laaf-V2.0) | 6 LPCI stage configs (S1–S6) + crosswalk reporter — see [`laaf/README.md`](laaf/README.md) |
| `ci/` | GitHub Actions | 1 workflow template for CI/CD integration |
| `samples/` | — | Runbook for committing sanitised run evidence. **No runs are committed yet** — see [`samples/README.md`](samples/README.md). |

Each profile maps explicitly to an OWASP entry and the framework controls it validates.
Pass/fail thresholds are listed in one place, [`THRESHOLDS.md`](THRESHOLDS.md), and are
**DRAFT — SME review required**: they were set when the profiles were written and have
not yet been calibrated against a recorded run.

---

## Choosing a target

Nothing in `evals/` names a vendor or a model. Every runner refuses to start until you
tell it what to test, so a profile can never silently run against the wrong deployment.

| Track | How the target is supplied | Required |
|---|---|---|
| Garak (single profile) | `--model_type <type> --model_name <name>` on the command line | both flags |
| Garak (`run_all.sh`) | `GARAK_MODEL_TYPE`, `GARAK_MODEL_NAME` | both variables |
| PyRIT | `EVAL_MODEL_NAME`, `EVAL_ENDPOINT` (OpenAI-compatible chat endpoint), `OPENAI_API_KEY` | all three |
| LAAF (`run_laaf.sh`) | `LAAF_TARGET`, `LAAF_MODEL` (`LAAF_TARGET=mock` needs no model or key) | both variables |
| CI template | repository variables `EVAL_MODEL_TYPE`, `EVAL_MODEL_NAME`, `EVAL_ENDPOINT` | all three |

`<type>` is a Garak generator family (`openai`, `huggingface`, `rest`, `ollama`, …); `<name>` is
the deployment or model identifier your platform expects. Thresholds can be overridden the
same way — see [`THRESHOLDS.md`](THRESHOLDS.md).

---

## Prerequisites

### Garak

```bash
pip install garak
```

Set your model credentials:

```bash
export OPENAI_API_KEY=sk-...
# or for Azure OpenAI:
export AZURE_OPENAI_KEY=...
export AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

Run a profile:

```bash
# Single profile
garak --config evals/garak/LLM01_prompt_injection.yaml \
      --model_type <type> --model_name <name>

# The flags are required — the profile names no default target
```

### PyRIT

```bash
pip install pyrit
```

Configure your target (all three are required):

```bash
export EVAL_MODEL_NAME=<deployment or model name>
export EVAL_ENDPOINT=<OpenAI-compatible chat endpoint URL>
export OPENAI_API_KEY=...
# Any OpenAI-compatible endpoint works (Azure OpenAI, Ollama, vLLM, …) — see pyrit docs
```

Run a script:

```bash
python evals/pyrit/llm01_prompt_injection.py
```

---

## Running all Garak profiles

```bash
GARAK_MODEL_TYPE=<type> GARAK_MODEL_NAME=<name> bash evals/garak/run_all.sh
```

This runs every profile in `evals/garak/` (13 today) sequentially and writes results to
`evals/results/`. Both variables are required; the script exits before running anything if
either is missing.

---

## Profile → OWASP mapping

| Profile | OWASP Entry | MITRE ATLAS Techniques | Controls validated |
|---|---|---|---|
| `LLM01_prompt_injection.yaml` | LLM01 Prompt Injection | AML.T0051.000, AML.T0051.001, AML.T0054 | Input validation, context separation, injection detection |
| `LLM02_sensitive_disclosure.yaml` | LLM02 Sensitive Information Disclosure | AML.T0021, AML.T0024 | Output scanning, DLP, access control on RAG |
| `LLM05_data_poisoning.yaml` | LLM05 Data and Model Poisoning | AML.T0020, AML.T0031, AML.T0032 | Input integrity, adversarial robustness |
| `LLM08_hidden_context_exposure.yaml` | LLM08 Hidden Context Exposure | AML.T0041, AML.T0051.000 | System prompt confidentiality |
| `LLM07_misinformation.yaml` | LLM07 Misinformation | AML.T0045, AML.T0047 | Output factuality, hallucination detection |
| `ASI01_goal_hijack.yaml` | ASI01 Agent Goal Hijack | AML.T0051, AML.T0054 | Goal integrity, instruction hierarchy, human oversight |
| `ASI05_code_execution.yaml` | ASI05 Unexpected Code Execution | AML.T0057, CWE-78, CWE-94 | Sandboxing, code execution controls |
| `ASI07_lateral_chaining.yaml` | ASI07 Insecure Inter-Agent Communications | AML.T0051.000, AML.T0051.001, AML.T0054, AML.T0057 | Inter-agent identity and authentication, communication channel controls |
| `ASI08_cascade_failure.yaml` | ASI08 Cascading Agent Failures | AML.T0029, AML.T0048.004, CWE-754, CWE-755 | Failure-mode handling, monitoring and response, denial-of-service protection |
| `LLM04_supply_chain.yaml` | LLM04 Supply Chain | AML.T0010, AML.T0057, CWE-502 | Supply chain risk management, artefact integrity, supplier monitoring |
| `LLM06_resource_exhaustion.yaml` | LLM06 Unbounded Consumption | AML.T0034, AML.T0029, CWE-400, CWE-770 | Capacity management, rate limiting, denial-of-service protection |
| `LLM09_embeddings.yaml` | LLM09 Vector and Embedding Weaknesses | AML.T0051.001, AML.T0043, AML.T0049 | Retrieval-context validation, embedding store hygiene, vector store access logging |
| `LLM10_output_handling.yaml` | LLM10 Improper Output Handling | AML.T0048.004, CWE-79, CWE-89, CWE-78, CWE-116 | Output encoding, sanitisation and sandboxing, injection prevention |

---

## Interpreting results

### Garak

Garak reports a **pass rate** per probe. A pass means the model **did not** produce the harmful output the probe sought.

```text
garak run: LLM01_prompt_injection
  promptinject.HijackHateHumans     PASS  100% (50/50)
  promptinject.HijackKillHumans     PASS   96% (48/50)  ← 2 failures
  dan.DAN_Jailbreak                 FAIL   72% (36/50)  ← 14 failures
```

The `eval_threshold` in each profile means: **fail if more than that fraction of probes succeed**
(i.e., elicit harmful output). Every value is tabulated in [`THRESHOLDS.md`](THRESHOLDS.md) with the
reasoning the profile author left; override per run with `--eval_threshold <0.0–1.0>` on the
Garak command line.

### PyRIT

Scripts print a summary table:

```text
OWASP LLM01 — Prompt Injection Evaluation
==========================================
Prompts sent   : 25
Successful attacks : 3  (12.0%)
Risk verdict   : MEDIUM — review flagged responses
```

Exit code `0` = pass, `1` = fail (use in CI/CD pipelines).

---

## CI/CD integration

Copy `evals/ci/github-action.yml` into `.github/workflows/` to run Garak profiles
on every PR that touches LLM integration code. Set the `EVAL_MODEL_TYPE`, `EVAL_MODEL_NAME`
and `EVAL_ENDPOINT` repository variables first — the workflow fails early without them.
See inline comments for the rest of the configuration.

---

## Committed run evidence

These profiles are configuration; a profile that has never been executed proves nothing.
**No sanitised run has been committed for any track yet.** The procedure for producing
one, what to strip before committing, and where it goes is in
[`samples/README.md`](samples/README.md). Runs must come from a real execution against a
system the runner is authorised to test — never synthesised.

---

## Adding profiles for new entries

1. Copy the nearest existing profile as a starting point.
2. Update the OWASP mapping comment block at the top.
3. Replace the probe list with probes relevant to the new entry — consult
   `data/entries/<ID>.json` for the MITRE ATLAS techniques to target.
4. Add its threshold and reasoning to [`THRESHOLDS.md`](THRESHOLDS.md) (`run_all.sh` picks up every `*.yaml` automatically).
5. Submit a PR following [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## References

- [Garak documentation](https://docs.garak.ai)
- [PyRIT documentation](https://github.com/Azure/PyRIT/tree/main/doc)
- [OWASP LLM Top 10 — llm-top10/](../llm-top10/)
- [OWASP Agentic Top 10 — agentic-top10/](../agentic-top10/)
- [shared/TOOLS.md](../shared/TOOLS.md) — full tool catalogue
- [shared/RECIPES.md](../shared/RECIPES.md) — implementation patterns

---

*Part of the
[OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/GenAI-Data-Security-Initiative/tree/main/crosswalk)
*
*License: CC BY-SA 4.0*
