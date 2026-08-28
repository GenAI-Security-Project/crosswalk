<!--
  OWASP GenAI Crosswalk
  File    : shared/AIVSS_WORKSHEETS.md
  Purpose : Empty scoring worksheets for AIVSS re-derivation
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# AIVSS scoring worksheets

`DRAFT — SME scoring required`

Every cell below is intentionally empty. These worksheets exist because the
AIVSS vectors currently in [`../agentic-top10/Agentic_AIVSS.md`](../agentic-top10/Agentic_AIVSS.md)
are on the **wrong baseline**, and correcting them is judgment work rather than
a substitution.

## Why re-derivation, not conversion

AIVSS Scoring System For OWASP Agentic AI Core Security Risks v0.8 states:

> AIVSS requires CVSS v4.0 as its baseline scoring input. Practitioners should not use CVSS v3.1
> scores as inputs to the AIVSS formula, as the metric structures are not directly comparable.

The repository's 20 vectors use the v3.1 structure. They cannot be converted:
v4.0 restructures the v3.1 Scope metric into Vulnerable System Impact (VC/VI/VA) and Subsequent
System Impact (SC/SI/SA). The subsequent-system metrics matter most in agentic scenarios, where a
compromise in one agent propagates.

There is no v3.1 field that carries subsequent-system impact, so the values have
to be **assessed against the agent architecture**, not mapped across. An agent
filling these in would be inventing security judgment, which is exactly what
must not happen to a scoring system whose whole value is that a reader can
reproduce the number.

## How to use a worksheet

1. Assess each CVSS v4.0 base metric for the risk, recording *why* in the
   justification column — the justification is the reviewable artefact, not the
   letter.
2. Compute the CVSS v4.0 base score.
3. Apply the AIVSS agentic factors for the supervised and autonomous cases.
4. Check the resulting band against [`SEVERITY.md`](SEVERITY.md).
5. Replace the vector in `Agentic_AIVSS.md` and record the reviewer.

Run `node scripts/validate-aivss.mjs` afterwards; conformant vectors stop being
reported.

---

### ASI01 — Agent Goal Hijack

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI02 — Tool Misuse & Exploitation

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI03 — Identity & Privilege Abuse

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI04 — Agentic Supply Chain Vulnerabilities

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI05 — Unexpected Code Execution

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI06 — Memory & Context Poisoning

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI07 — Insecure Inter-Agent Communication

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI08 — Cascading Agent Failures

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI09 — Human-Agent Trust Exploitation

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

### ASI10 — Rogue Agents

| Metric | Value | Justification |
|---|---|---|
| AV (N/A/L/P) | | |
| AC (L/H) | | |
| AT (N/P) | | |
| PR (N/L/H) | | |
| UI (N/P/A) | | |
| VC (H/L/N) | | |
| VI (H/L/N) | | |
| VA (H/L/N) | | |
| SC (H/L/N) | | |
| SI (H/L/N) | | |
| SA (H/L/N) | | |
| **CVSS v4.0 base score** | | |
| **AIVSS score (supervised)** | | |
| **AIVSS score (autonomous)** | | |

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
