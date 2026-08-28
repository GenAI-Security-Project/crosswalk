## What this PR changes

<!-- Which file(s) and which vulnerability IDs are affected -->

## Type of change

- [ ] New mapping file
- [ ] Update to existing mapping (content, controls, CVE refs)
- [ ] Bug fix (broken link, typo, incorrect cross-ref)
- [ ] New recipe (shared/RECIPES.md)
- [ ] New tool (shared/TOOLS.md)
- [ ] Infrastructure (scripts, CI, templates)
- [ ] Translation (i18n/)

## Source / evidence

<!-- Link to framework doc, CVE, incident report, or OWASP page that supports this change -->

## Checklist

### Content

- [ ] Follows the file template structure (header comment, H1, Why section, quick-reference table, audience
  tags, detailed per-entry mappings, references, changelog)
- [ ] Severity ratings consistent with AIVSS / OWASP definitions in `shared/SEVERITY.md`
- [ ] Cross-references are bidirectional — if this file mentions `Agentic_X.md`, that file mentions this one back
- [ ] All referenced vulnerability IDs are valid (`LLM01–LLM10`, `ASI01–ASI10`, `DSGAI01–DSGAI21`)
- [ ] License header present: `CC BY-SA 4.0`

### Links & data

- [ ] All internal `.md` links resolve to real files
- [ ] All external URLs return 200 (checked manually or via `lychee`)
- [ ] `data/schema.json` compatible (if adding a new entry type)

### Project hygiene

- [ ] Changelog entry added at bottom of every modified file (`YYYY-MM-DD` format)
- [ ] `CHANGELOG.md` updated if this is a new mapping file (include in correct version section)
- [ ] `README.md` counts updated if file count changed (badge + summary table + section heading + repo tree)
- [ ] Ran `node scripts/validate.js --file <path>` locally and it passes

### For new mapping files only

- [ ] Added to correct section in `README.md` mapping table with "Standout content" description
- [ ] Added to `CROSSREF.md` primary frameworks column where relevant
- [ ] Framework coverage matrix in `README.md` updated (`✅` for the new cell)
- [ ] File named correctly: `SourceList_Framework.md` (e.g., `Agentic_SAMM.md`)

## Notes for reviewers

<!-- Anything that needs special attention or context during review -->
