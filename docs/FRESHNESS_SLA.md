<!--
  OWASP GenAI Crosswalk
  File    : docs/FRESHNESS_SLA.md
  Purpose : Freshness commitment for mapped frameworks
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Framework freshness

The crosswalk graveyard is full of projects that were accurate once. A mapping
is not wrong on the day it ships — it goes wrong quietly, when a framework
releases and nobody notices for a year.

This repository's own ASVS mapping is the cautionary example: it sat at 4.0.3
while 5.0.0 shipped, and nothing in the project said so until T-ACC02 added the
check. That is the failure this page exists to prevent becoming routine.

---

## Current state

Generated into `data/stats.json` by `scripts/stats.js` and reported by
`npm run freshness`.

| State | Meaning |
|---|---|
| **current** | upstream version confirmed, and it matches what is mapped |
| **diverged** | upstream has moved ahead of the mapping |
| **unchecked** | nobody has confirmed the upstream version |

`unchecked` is deliberately kept separate from `current`. Nobody having looked
is a different state from having looked and found nothing, and merging the two
would produce a flattering number that means nothing.

Run `npm run freshness` for today's figures.

## The commitment

`TODO(maintainer)` — the values below are **not set**. An SLA is a promise
about maintainer capacity, and an agent has no basis on which to make one. Every
number here needs a human who intends to honour it.

| Tier | Frameworks | Verify within | Re-map within |
|---|---|---|---|
| Verified core | `TODO(maintainer)` — see T-METH06 | `TODO(maintainer)` days | `TODO(maintainer)` days |
| Mapped | everything else | `TODO(maintainer)` days | best effort |
| Referenced | not mapped — see CROSSREF | n/a | n/a |

**Verify within** — how long after an upstream release the project confirms
whether existing mappings still hold.
**Re-map within** — how long until affected mappings are updated or explicitly
marked stale.

Setting these too tight produces a promise the project breaks in month three,
which is worse than no promise. Setting them loose and keeping them is the
point.

## How it is enforced

1. `data/framework-sources.json` records mapped vs upstream version per
   framework, with who checked and when.
2. `scripts/validate.js` warns on any confirmed divergence, so it shows up on
   every CI run rather than in an annual review.
3. `scripts/stats.js` computes the freshness block; README badges render from
   it through the stats markers.
4. `npm run watch` monitors upstream sources.

The chain only works if `current_version` is populated. **22 of 25 frameworks
are unchecked**, so the honest reading today is that freshness is measured for
three frameworks and unknown for the rest.

## Filling in an unchecked framework

```bash
# confirm the current upstream release, then:
#   data/framework-sources.json → set current_version, checked, notes
npm run stats && npm run freshness
```

Record *how* it was verified in `notes`. A version number with no provenance is
the same unverified assertion the rest of this project is built to remove.

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
