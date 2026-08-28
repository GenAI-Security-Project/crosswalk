<!--
  OWASP GenAI Crosswalk
  File    : data/schemas/README.md
  Purpose : Why the export schemas here are subsets, and what they do and do not prove
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Export schemas

The crosswalk emits three machine-readable formats that other tools consume:

| Format | Emitted by | Schema here |
|---|---|---|
| OSCAL 1.1.2 Component Definition | `compliance-report.js --format oscal` | `oscal-component-definition.subset.json` |
| OSCAL 1.1.2 Catalog | `compliance-report.js --format oscal-catalog` | `oscal-catalog.subset.json` |
| STIX 2.1 Bundle | `incidents-report.js --format stix` | `stix-bundle.subset.json` |

`scripts/exports.test.mjs` validates every emitted document against these on
each `node --test` run, and `npm run ci` includes it.

## These are subsets, and the filename says so

They are **not** the NIST and OASIS schemas. They encode the structural rules
this project's output has to satisfy — required members, id formats, the
`spec_version` and `oscal-version` constants, UUID and timestamp shapes,
`additionalProperties` where the spec closes an object — and they are written
here, in this repository, by this project.

Passing them proves the export has not silently lost its shape. It does not
prove full OSCAL or STIX conformance, and no sentence in this repository should
claim it does.

## Why not the upstream schemas

Two options were considered and both cost more than they return here:

- **Fetch at CI time.** Makes every build depend on a third-party host being up
  and on a schema that can change without warning. A red build that means
  "NIST changed a description" is a build people learn to ignore.
- **Vendor the upstream files.** The OSCAL complete schema is over a megabyte of
  JSON this project does not control and cannot meaningfully review on update.

A small schema that is read, understood and owned catches the regressions that
actually happen — a renamed member, a dropped `spec_version`, a malformed
UUID — and it does so without pretending to an authority it does not have.

For genuine conformance, run the emitted file through the upstream validators:

```bash
# OSCAL — https://github.com/usnistgov/OSCAL
node scripts/compliance-report.js --framework "NIST AI RMF 1.0" --format oscal --stdout > oscal.json

# STIX 2.1 — https://github.com/oasis-open/cti-stix-validator
node scripts/incidents-report.js --format stix --stdout > stix.json
```

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
