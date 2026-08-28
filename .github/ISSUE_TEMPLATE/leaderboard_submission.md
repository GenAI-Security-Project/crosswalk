---
name: Leaderboard Submission
about: Submit your GenAI Security Crosswalk score to the public leaderboard
title: '[Leaderboard] '
labels: leaderboard
assignees: OWASP GenAI Data Security Initiative
---

## Leaderboard Submission

**Company name:**

**Industry:** (e.g. Financial Services, Healthcare, Technology, Government, etc.)

**Score:** (from the [scoring tool](https://genai-security-project.github.io/crosswalk/#/score))

**Frameworks selected:** (list the frameworks you implement)

**Validation tier:**

- [ ] Self-Assessed (checkboxes only)
- [ ] Tool-Verified (tool outputs attached below)
- [ ] Independently Attested (assessor details below)

**Scoring URL:** (paste the shareable URL from the Score page)

## Evidence (for Tool-Verified)

Attach JSON outputs from any of:

- `node scripts/compliance-report.js --format json`
- Garak scan results
- PyRIT attack results
- `python evals/laaf/laaf_crosswalk.py --format json`

## Independent Attestation (for highest tier)

**Assessor name:**
**Assessor organization:**
**Assessor contact:** (for verification — will not be published)
**Date of assessment:**

## Terms

- [ ] I confirm this score accurately represents our current AI security posture
- [ ] I understand this is a public submission and the company name will be visible
- [ ] I understand OWASP does not certify organizations — this is a community benchmark
