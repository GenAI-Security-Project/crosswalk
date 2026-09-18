<!--
  OWASP GenAI Crosswalk
  File    : ASVS 4.0.3 -> 5.0.0 identifier translation
  Source  : OWASP/ASVS 5.0/mappings/mapping_v4.0.3_to_v5.0.0.yml
  License : CC BY-SA 4.0
-->

# ASVS 4.0.3 → 5.0.0 translation

Every ASVS identifier this crosswalk cites, and what the **ASVS project’s own mapping
file** says became of it in 5.0.0. Nothing here is our judgment: the disposition column
is quoted from [`mapping_v4.0.3_to_v5.0.0.yml`][official], and the 5.0.0 requirement text
is from the [v5.0.0 release][release].

[official]: https://github.com/OWASP/ASVS/blob/master/5.0/mappings/mapping_v4.0.3_to_v5.0.0.yml
[release]: https://github.com/OWASP/ASVS/releases/tag/v5.0.0_release

| | |
|---|--:|
| Identifiers cited by this crosswalk | 50 |
| Mapping rows they cover | 151 |
| **Translated to a 5.0.0 identifier** | **39 ids / 127 rows** |
| **Retained at 4.0.3 — 5.0.0 has no successor** | **11 ids / 24 rows** |

Dispositions seen:

- `modified` × 16
- `moved` × 12
- `deleted` × 9
- `merged` × 6
- `covered-by` × 3
- `not-in-official-mapping` × 2
- `other` × 1
- `split` × 1

## Translated

The requirement text on each row was replaced with 5.0.0’s own wording. Where the official
file records a **split**, the row takes the first target and the full disposition is recorded
here — an SME decides whether the second target deserves its own row.

| 4.0.3 | → 5.0.0 | Official disposition | Rows | Entries |
|---|---|---|--:|---|
| `V2.1.1` | `V6.2.1` | MODIFIED, MOVED TO v5.0.0-6.2.1 | 3 | ASI03, DSGAI02, DSGAI19 |
| `V2.10.1` | `V13.2.1` | MOVED TO v5.0.0-13.2.1 | 1 | DSGAI02 |
| `V3.1.1` | `V14.2.1` | DELETED, MERGED TO v5.0.0-14.2.1 | 2 | DSGAI11, DSGAI15 |
| `V3.3.1` | `V7.4.1` | MOVED TO v5.0.0-7.4.1 | 2 | ASI07, DSGAI11 |
| `V4.1.1` | `V8.3.1` | MOVED TO v5.0.0-8.3.1 | 7 | ASI02, DSGAI06, DSGAI11, DSGAI12, DSGAI14, DSGAI20, LLM03 |
| `V4.1.2` | `V8.2.1` | DELETED, COVERED BY v5.0.0-8.2.1 | 3 | DSGAI02, DSGAI16, DSGAI19 |
| `V4.1.3` | `V8.2.1` | MODIFIED, MOVED TO v5.0.0-8.2.1 | 11 | ASI02, ASI03, ASI06, ASI07, DSGAI01, DSGAI13, DSGAI15, LLM02, LLM03, LLM08, LLM09 |
| `V4.1.5` | `V16.5.3` | MOVED TO v5.0.0-16.5.3 | 2 | DSGAI03, DSGAI07 |
| `V4.2.2` | `V3.5.1` | MOVED TO v5.0.0-3.5.1 | 1 | LLM10 |
| `V5.1.1` | `V15.3.7` | MOVED TO v5.0.0-15.3.7 | 6 | ASI01, ASI06, DSGAI05, DSGAI12, LLM01, LLM05 |
| `V5.1.2` | `V15.3.3` | MOVED TO v5.0.0-15.3.3 | 1 | LLM01 |
| `V5.1.3` | `V2.2.1` | MOVED TO v5.0.0-2.2.1 | 2 | DSGAI04, DSGAI21 |
| `V5.2.1` | `V1.3.1` | MODIFIED, MOVED TO v5.0.0-1.3.1 | 7 | ASI01, ASI05, ASI09, DSGAI05, LLM01, LLM07, LLM10 |
| `V5.2.4` | `V1.3.2` | MODIFIED, MOVED TO v5.0.0-1.3.2 | 2 | ASI05, LLM10 |
| `V5.2.5` | `V1.3.7` | MODIFIED, MOVED TO v5.0.0-1.3.7 | 5 | ASI01, ASI05, DSGAI09, LLM01, LLM10 |
| `V5.2.6` | `V1.3.6` | MODIFIED, MOVED TO v5.0.0-1.3.6 | 1 | DSGAI10 |
| `V5.2.8` | `V1.3.5` | MODIFIED, MOVED TO v5.0.0-1.3.5 | 1 | DSGAI01 |
| `V5.3.4` | `V1.2.4` | MODIFIED, MOVED TO v5.0.0-1.2.4 | 1 | DSGAI12 |
| `V5.3.5` | `V1.2.4` | DELETED, COVERED BY v5.0.0-1.2.4 | 2 | ASI05, LLM10 |
| `V6.1.1` | `V14.1.1` | DELETED, MERGED TO v5.0.0-14.1.1 | 7 | ASI03, ASI06, DSGAI01, DSGAI13, DSGAI18, LLM02, LLM09 |
| `V7.1.1` | `V16.2.5` | MODIFIED, MOVED TO v5.0.0-16.2.5 | 1 | DSGAI14 |
| `V7.1.2` | `V16.2.5` | DELETED, MERGED TO v5.0.0-16.2.5 | 1 | DSGAI14 |
| `V7.2.1` | `V16.3.1` | MODIFIED, MOVED TO v5.0.0-16.3.1 | 4 | ASI03, ASI07, ASI10, LLM08 |
| `V7.2.2` | `V16.3.2` | MODIFIED, MOVED TO v5.0.0-16.3.2 | 5 | ASI02, ASI10, DSGAI03, DSGAI08, LLM03 |
| `V7.4.1` | `V16.5.1` | MODIFIED, MOVED TO v5.0.0-16.5.1 | 5 | ASI08, ASI09, DSGAI05, LLM06, LLM07 |
| `V8.1.1` | `V14.2.2` | MODIFIED, MOVED TO v5.0.0-14.2.2 | 4 | DSGAI01, DSGAI14, LLM02, LLM08 |
| `V8.3.4` | `V14.1.1` | DELETED, MERGED TO v5.0.0-14.1.1 | 5 | DSGAI01, DSGAI07, DSGAI10, DSGAI18, LLM02 |
| `V8.3.7` | `V14.1.2` | DELETED, COVERED BY v5.0.0-14.1.2 | 1 | DSGAI02 |
| `V9.1.1` | `V12.2.1` | MODIFIED, MOVED TO v5.0.0-12.2.1 | 3 | ASI07, DSGAI06, LLM02 |
| `V11.1.1` | `V2.3.1` | MODIFIED, MOVED TO v5.0.0-2.3.1 | 3 | ASI08, ASI09, LLM07 |
| `V11.1.2` | `V2.4.2` | MOVED TO v5.0.0-2.4.2 | 7 | ASI01, ASI02, ASI05, ASI08, ASI10, LLM01, LLM03 |
| `V11.1.4` | `V2.4.1` | MOVED TO v5.0.0-2.4.1 | 3 | DSGAI06, DSGAI21, LLM06 |
| `V11.1.5` | `V2.2.1` | DELETED, MERGED TO v5.0.0-2.2.1 | 1 | DSGAI16 |
| `V12.1.1` | `V5.2.1` | MODIFIED, MOVED TO v5.0.0-5.2.1 | 5 | ASI06, DSGAI04, DSGAI13, LLM05, LLM09 |
| `V12.1.3` | `V5.2.4` | GRAMMAR, MOVED TO v5.0.0-5.2.4 | 1 | DSGAI09 |
| `V13.1.1` | `V1.5.3` | MOVED TO v5.0.0-1.5.3 | 5 | ASI02, ASI08, ASI10, DSGAI12, LLM06 |
| `V13.1.3` | `V14.2.1` | DELETED, MERGED TO v5.0.0-14.2.1 | 2 | ASI09, LLM06 |
| `V14.2.2` | `V13.4.5` | SPLIT TO v5.0.0-13.4.5, v5.0.0-15.2.3 | 2 | ASI04, LLM04 |
| `V14.2.3` | `V3.6.1` | MOVED TO v5.0.0-3.6.1 | 2 | ASI03, LLM08 |

## Retained at 4.0.3 — no 5.0.0 successor

These rows keep their 4.0.3 identifier and carry a DRAFT marker naming the disposition.
They are **not** silently renumbered: several of these numbers exist in 5.0.0 as an entirely
different requirement, so reusing them would assert a mapping nobody made.

| 4.0.3 | Official disposition | Rows | Entries |
|---|---|--:|---|
| `V1.1.2` | DELETED, NOT IN SCOPE | 4 | ASI01, ASI04, DSGAI16, LLM01 |
| `V1.1.4` | DELETED, NOT IN SCOPE | 1 | DSGAI03 |
| `V8.1.3` | DELETED, INSUFFICIENT IMPACT | 1 | DSGAI11 |
| `V8.1.4` | DELETED, NOT IN SCOPE | 4 | DSGAI07, DSGAI09, DSGAI15, DSGAI20 |
| `V8.3.3` | DELETED, NOT IN SCOPE | 2 | DSGAI08, DSGAI19 |
| `V8.3.10` | (id absent from the official 4.0.3 mapping) | 1 | DSGAI08 |
| `V10.2.1` | DELETED, NOT PRACTICAL | 4 | ASI04, DSGAI04, LLM04, LLM05 |
| `V10.2.2` | DELETED, NOT PRACTICAL | 4 | ASI04, DSGAI04, DSGAI20, LLM04 |
| `V11.1.7` | DELETED, NOT IN SCOPE | 1 | DSGAI17 |
| `V13.1.2` | (id absent from the official 4.0.3 mapping) | 1 | DSGAI17 |
| `V14.1.4` | DELETED, NOT IN SCOPE | 1 | DSGAI03 |

## What still needs a human

- The 11 retained identifiers above: retarget to a 5.0.0 requirement, or drop the row.
- **Every** translated row’s `relationship`, `rationale type` and `confidence`, all of
  which read `DRAFT`. The identifier translation is mechanical; whether the 5.0.0
  requirement still addresses the GenAI risk the row claims is expert judgment (C4),
  reviewed by an ASVS-leadership reviewer per STRAT-04.
