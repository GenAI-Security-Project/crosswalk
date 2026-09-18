<!--
  OWASP GenAI Crosswalk
  File    : docs/COMPETITIVE_ANALYSIS.md
  Purpose : Cite-backed comparison with other AI security crosswalks
  Version : 2026-Q3
  License : CC BY-SA 4.0
-->

# Comparison with other AI security control crosswalks

> **Status.** The comparison sections are a research draft with a source for every statement about another
> project. The *Definition of best* and *Recommended verified-core framework list* sections are
> **DRAFT — maintainer ratification required**. They are recommendations for a human decision, not decisions.

This document compares this crosswalk with other published AI security control catalogues and crosswalks.
It is meant to be read by the maintainers of those projects as well as this one. Corrections from them
are welcome and should be filed as issues against this file.

---

## Method

### What was compared

| Project | Owner | Why it is in scope |
|---|---|---|
| This crosswalk | OWASP GenAI Security Project | subject of the comparison |
| Secure Controls Framework (SCF) | SCF Council | AI control domain plus STRM crosswalks to AI frameworks |
| CSA AI Controls Matrix (AICM) | Cloud Security Alliance | AI control catalogue with mappings to AI frameworks |
| MITRE ATLAS | MITRE | AI threat knowledge base with mitigations, used as a mapping target |
| HITRUST AI Security Assessment | HITRUST | certifiable AI security requirements harmonised with other sources |
| NIST OLIR (AI-related entries) | NIST | government-hosted registry of typed mappings |
| NIST AI RMF crosswalks | NIST AI Resource Center | crosswalks listed alongside the AI RMF |
| OWASP AI Exchange | OWASP | AI threat/control guidance with cross-references |
| Google SAIF and the CoSAI Risk Map | Google; Coalition for Secure AI | AI risk/control map with framework mappings |

The last two rows were added because they are control catalogues with published framework cross-references
and primary sources were available. ISO/IEC 42001 Annex mappings published by third parties were not
compared as a separate row; where a compared project maps to ISO/IEC 42001, that is recorded in its row.

### Dimensions

| Dimension | Definition used here |
|---|---|
| Coverage | What is on each side of the mapping, and how many items: controls, risks, frameworks, rows |
| Granularity | The unit mapped: whole framework, domain, control, sub-requirement |
| Relationship semantics | Whether a mapping states *how* two items relate (typed, strength-scored) or only *that* they relate |
| Evidence basis | Who authors and reviews mappings, under what process, and whether real-world evidence is attached |
| Freshness | Release cadence, date of latest release, and whether upstream framework versions are tracked |
| Licensing | The licence under which the catalogue and its mappings can be used and redistributed |
| Machine-readability | Formats published for programmatic use |
| Adoption | Publicly stated usage figures only; GitHub stars and npm downloads are shown as weak indicators |

### Access date, sources and limits

- All sources were accessed on **2026-09-14**. Every cited URL and its fetch result is listed in
  `SOURCES_CHECK.json`.
- Figures for this project are taken from `main` at commit `db56eeb` [2], after #91 and #92.
  `data/stats.json` is identical at `490a7e4`, where the research started; the ATLAS figures were
  recomputed after #92. Counts marked *computed* were
  calculated from the repository data files, not read from a published figure.
- Figures for other projects marked *computed* were counted from the project's own published data file
  (SCF spreadsheet [22], ATLAS YAML [54], NIST OLIR catalogue JSON [75]).
- Some pages were read through a text extractor that summarises content. Quoted phrases from those pages
  were cross-checked where a raw file or API was available; the rest should be re-checked against the live
  page before being quoted elsewhere.
- Paywalled or registration-gated content (SCF commercial tier, CSA download bundle, HITRUST CSF licence
  and MyCSF) was not accessed. What those organisations state publicly is reported; the rest is marked
  **not publicly verifiable**.
- A cell reading **not verified** means no primary source was found. It does not mean the feature is absent.
- This is a documentary comparison. No mapping in any project was checked for correctness, except where
  identifiers in this project were compared mechanically with the upstream ATLAS data (see *MITRE ATLAS*).

---

## Comparison table

Numbers in square brackets refer to the *References* list.

| Project | Coverage | Granularity | Relationship semantics | Evidence basis | Freshness | Licensing | Machine-readability | Adoption |
|---|---|---|---|---|---|---|---|---|
| **This crosswalk** | 51 OWASP GenAI entries × 25 frameworks; 3,497 rows; 1,372 registry controls [2] | control/clause; ≥576 rows with prose in `control_id` [14] | OLIR-shaped fields defined [3], [4]; 0 of 3,497 rows typed (computed) | 0 rows with a named reviewer (computed); 131 incidents [2]; control-level evidence in review [17] | 3 of 25 frameworks checked, 1 diverged [2]; ASVS 4.0.3 vs 5.0.0 [15] | CC BY-SA 4.0 [8] | JSON + JSON Schema, MD/CSV/JSON/OSCAL 1.1.2/GRC exports [9], OLIR-shape export (0 rows) [10] | 19 stars, 5 forks [20]; 12 npm downloads/month [19] |
| **SCF** | 1,534 controls, 34 domains, 161 AI (AAT) controls (computed [22]); 252 mapped documents [21] | control ↔ individual requirement [22] | STRM: 5 set-theory types + 1–10 strength [23], [24] | human SMEs [23]; public review process not verified | quarterly stated [27]; 2026.2 on 2026-07-08 [21] | CC BY-ND 4.0; paid commercial licence [25], [26] | XLSX; OSCAL JSON stated [28]; STRM as PDF [23] | 542 stars [31]; accepted OLIR entries [75]; adopter count not verified |
| **CSA AICM** | 247 control objectives, 18 domains (v1.1) [32] | control objective with implementation and auditing guidelines [32] | No Gap / Partial Gap / Full Gap labels [34], [36] | Security Controls Catalog Working Group [34]; STAR for AI assessments [37], [38] | v1.0 2025-07-09 [33]; v1.1 2026-06-22 [32] | free download with account [32]; licence terms not publicly verifiable [40] | XLSX/PDF; JSON/YAML/OSCAL bundle stated [32] | named early adopters [37]; count not published |
| **MITRE ATLAS** | 16 tactics, 197 techniques, 39 mitigations, 72 case studies (2026.08) [53], [54] | technique / sub-technique / mitigation [54] | typed relations incl. `mitigates` with prose [54]; ATT&CK links untyped [54] | real-world observations and red-team demonstrations [53]; 72 case studies [54] | monthly [52]; 2026.08 on 2026-08-31 [51] | Apache-2.0 [55] | YAML; STIX, XLSX and Navigator layers generated by tooling [52] | 183 stars on data repo [57]; user count not verified |
| **HITRUST AI Security** | up to 44 AI requirement statements [41]; CSF harmonises 70+ sources [47] | requirement statement, tailored by AI type [41] | not verified | external assessor + central HITRUST QA [41], [49] | CSF v11.8.0 on 2026-05-07 [46] | licence agreement; text not publicly verifiable [50] | MyCSF SaaS [48]; open export format not verified | no AI certification count published; framework downloads stated [47] |
| **NIST OLIR (AI-related)** | 102 entries; 7 against AI RMF 1.0; 2 derived from OWASP documents (computed [75]) | element ↔ element [71] | IR 8278A r1: 5 set-theory types, rationale, strength 0–10 [71]; IR 8477 styles [73] | NIST review + 30-day public review [71]; developer asserts | per-entry dates; e.g. entry 198 posted 2026-05-08 [76] | developer-held; explicit licence not verified [71] | XLSX templates [71]; CPRT JSON/XLSX [78] | government-hosted; downstream use not verified |
| **NIST AI RMF crosswalks** | 11 listed entries; 3 with NIST as provider [80] | function/subcategory ↔ clause [82] | untyped side-by-side tables (reviewed PDFs) [81], [82] | NIST staff check listing criteria; no endorsement implied [80] | NIST-authored crosswalks dated 2023 [80] | not verified | PDF only [80] | not verified |
| **OWASP AI Exchange** | "300+ pages" of guidance [58]; threat/control counts not stated | threat and control sections [59] | OpenCRE links untyped; prose "Gap" notes for ISO 27002/42001 [60] | liaison contributions to ISO/IEC 27090 and prEN 18282 stated [59] | continuous; no releases (GitHub API) [61] | CC0 1.0 [59] | Markdown source + PDF [58]; structured dataset not verified | 424 stars [61] |
| **Google SAIF / CoSAI Risk Map** | SAIF: 15 risks, 24 controls [62], [63]; CoSAI-RM: YAML risks/controls [65] | risk ↔ control ↔ component [65] | ID lists only, no rationale; "not authoritative endorsements" [66] | working-group interpretation; no owner review [66]; SAIF "real examples" [62] | CoSAI: no releases; ATLAS pinned 5.0.1 [67] | SAIF: no content licence found [62]; CoSAI-RM Apache-2.0 [65] | YAML + JSON Schema [65] | 97 stars [69] |

---

## Per-project detail

### This crosswalk

- **P-1 Coverage.** Four OWASP source lists (LLM Top 10 2026, Agentic Top 10 2026, DSGAI 2026, Agentic
  Skills Top 10) with 51 entries, mapped to 25 frameworks in 3,497 mapping rows, with 1,372 registry controls
  and 131 incident records [2]. The mapping runs from an OWASP risk entry to framework controls; the project
  does not publish its own control catalogue. Two frameworks (CoSAI, EU AI Act Code of Practice) carry
  candidate DRAFT rows only [2]. An open PR removes 22 junk rows created by a parser defect (in review)
  [100]; another proposes a 26th framework, OWASP AISVS 1.0 (in review) [103].
- **P-2 Granularity.** Rows target individual controls or clauses. A parser defect put requirement prose in
  `control_id` for 576 rows across 11 frameworks at first scan; the canonical-id rules were decided on
  2026-09-14 and the fix is not yet merged [14].
- **P-3 Relationship semantics.** Schema v2 defines `relationship` (the five NIST IR 8278A Rev. 1
  set-theory values), `rationale_type`, `rationale`, `confidence`, `framework_version`, `reviewed_by` and
  `review_date` [3], [4]. On `main`, 0 of 3,497 rows carry `relationship` or `rationale`; all 3,497 are
  `confidence: unreviewed` (computed). Two further gaps against IR 8278A Rev. 1:
  - *Strength scale.* IR 8278A Rev. 1 defines Strength of Relationship as an integer from 0 to 10 [71].
    This project maps a four-value enum (`high | medium | low | unreviewed`) to that field [4], [10].
  - *Direction.* IR 8278A Rev. 1 states the relationship of the Reference Document Element compared to the
    Focal Document Element [71]. `docs/OLIR_SUBMISSION.md` and the exporter code put the framework control in
    the Focal column [5], [10], while the exporter header comment and the `relationship` description in
    `data/schema.json` describe the control as the Reference Document Element [3], [10]. The meanings given
    for `subset-of` and `superset-of` [4] reverse depending on which reading applies. No row is affected yet
    because no row is typed.
- **P-4 Evidence basis.** No mapping row names a reviewer (computed). The validator refuses a confidence
  above `unreviewed` without a named reviewer [4]. The OLIR exporter skips unreviewed rows, so it exports
  zero rows today [5], [10]. All 131 incident records carry at least one reference (computed); 72 are
  categorised real-world, 56 research-demonstrated and 3 red-team (computed). Linking incident control
  failures to mapping rows is in review, with 0 confirmed failures [17]. One account is the code owner for
  every path [13].
- **P-5 Freshness.** 3 of 25 frameworks have a checked upstream version; 22 are unchecked; ASVS is mapped at
  4.0.3 while 5.0.0 is current [2], [7], [15]. The freshness SLA values are unset (`TODO(maintainer)`) [6].
  The ATLAS registry is pinned to version "4.0", last synced 2026-04-10 [11]. ATLAS now releases monthly and
  its latest release is 2026.08 [51], [52]. The published npm package is version 2.0.0 (last modified
  2026-03-29) while the repository is at 4.0.0 [1], [18]. The repository has no GitHub releases (GitHub API).
- **P-6 Licensing.** CC BY-SA 4.0 [8]. GitHub's licence detection reports `NOASSERTION` for the repository
  [20], so automated licence scanners may not recognise it.
- **P-7 Machine-readability.** Entry data is JSON validated against JSON Schema [3]. The compliance report
  emits Markdown, CSV, JSON, OSCAL 1.1.2 component definitions and catalogues, and a GRC import format [9];
  incidents export to STIX 2.1 [1]. Validation of the OSCAL output against NIST's OSCAL schemas: not verified.
- **P-8 Adoption.** 19 GitHub stars and 5 forks [20]; 12 npm downloads between 2026-08-13 and 2026-09-11 [19].
  No publicly documented downstream adopters were found. No OLIR entry from this project exists [75].

### Secure Controls Framework (SCF)

- **SCF-1 Coverage.** Release 2026.2 contains 1,534 controls in 34 domains, of which 161 are in the
  Artificial Intelligence and Autonomous Technologies (AAT) domain (computed from the spreadsheet [22]). The
  release notes state the SCF "currently maps to 252 discrete laws, regulations and frameworks" [21]. AI
  mapping columns are ISO/IEC 42001:2023 (149 SCF controls mapped), NIST AI RMF 1.0 (158), NIST AI 600-1
  (139) and the EU AI Act (119) (computed [22]). The only OWASP column is "OWASP Top 10 2025" [22].
- **SCF-2 Granularity.** Spreadsheet cells map each SCF control to individual requirement identifiers, down
  to AI 600-1 action IDs and EU AI Act article paragraphs [22].
- **SCF-3 Relationship semantics.** STRM uses five set-theory relationships (subset of, intersects with,
  equal, superset of, no relationship), states the direction explicitly against the SCF control, and scores
  strength from 1 to 10 [23]. The STRM files carry a rationale type, relationship, strength and notes per row
  [24]. The spreadsheet columns themselves list identifiers without relationship type [22]. The SCF cites
  NIST IR 8477 as the basis [23]; IR 8477 defines these set-theory relationships [72], [73].
- **SCF-4 Evidence basis.** "The SCF exclusively uses human subject-matter experts to perform STRM crosswalk
  mapping" [23]. A published review or public-comment process for mappings: not verified. The free
  spreadsheet includes Evidence Request List and Assessment Objectives sheets [22]. The SCF Conformity
  Assessment Program issues an "SCF Certified" designation [30]. At least one STRM note (ISO/IEC 42001 clause
  4.1) contains commentary on the standard's intent rather than mapping rationale [24].
- **SCF-5 Freshness.** The FAQ states "one (1) update per quarter" [27]. Releases in the last 12 months:
  2025.3 (2025-10-01), 2025.4 (2025-12-29), 2026.1 (2026-04-02), 2026.1.1 and 2026.2 (2026-07-08) [21].
- **SCF-6 Licensing.** CC BY-ND 4.0: modified material may not be distributed [25]. The terms also restrict
  using AI to generate derivative content from SCF content, and a paid commercial licence is offered for
  derivative use [25], [26]. Editable STRM spreadsheets are sold; STRM PDFs are free [23].
- **SCF-7 Machine-readability.** XLSX is the primary download and an OSCAL JSON version is stated [28].
  The GitHub repository holds the spreadsheet only [21]. STRM mappings are published as PDF [23], [24]. A public
  API: not verified.
- **SCF-8 Adoption.** The SCF states that NIST accepted SCF-submitted OLIRs [29]. The SCF Council has
  Final OLIR entries for CSF 2.0, SP 800-53 Rev. 5.1.1 and
  SP 800-171 [75]; none against AI RMF [75]. 542 GitHub stars [31]. A count of adopting organisations: not
  verified.

### CSA AI Controls Matrix (AICM)

- **CSA-1 Coverage.** v1.1 has 247 control objectives in 18 domains and was released 2026-06-22 [32]; v1.0
  had 243, released 2025-07-09 [33]. The v1.1 package includes mappings to BSI AIC4, ISO/IEC 42001:2023, the
  EU AI Act, AIUC-1, and NIST AI RMF with AI 600-1 [32]. The launch blog lists nine threat categories and
  lifecycle phases as analysis pillars [35].
- **CSA-2 Granularity.** Each control objective has implementation and auditing guidelines, and the package
  includes the AI-CAIQ questionnaire [32]. The launch blog describes shared responsibility across cloud,
  model, orchestrated-service and application providers [35]. Per-control ownership values are in the
  download: not publicly verifiable.
- **CSA-3 Relationship semantics.** Mappings use No Gap / Partial Gap / Full Gap labels [34], [36]. For v1.1,
  CSA reports against NIST AI RMF and AI 600-1: 18 No Gap, 119 Partial Gap, 110 Full Gap; against
  ISO/IEC 42001: 145, 97, 5 [34]. No STRM or OLIR vocabulary was found on the pages fetched.
- **CSA-4 Evidence basis.** v1.1 "represents the collective expertise of the Security Controls Catalog
  Working Group" [34]. STAR for AI launched with a Level 1 self-assessment and a Level 2 that requires
  ISO/IEC 42001 certification [37], [38]. Dates of public peer-review periods: not verified.
- **CSA-5 Freshness.** v1.0 on 2025-07-09 (updated 2025-10-30) [33]; v1.1 on 2026-06-22 [32]. A stated
  release cadence: not verified.
- **CSA-6 Licensing.** The download requires an account [32]. CSA publishes a CCM and AICM licensing FAQ [40];
  the CCM page states that internal use needs no licence and customisation or commercial use does [39].
  Whether the same terms apply to AICM: not publicly verifiable (terms are inside the download).
- **CSA-7 Machine-readability.** "AICM Machine Readable Bundle (JSON/YAML/OSCAL)" is listed in the v1.1
  package [32]. Conformance of the bundle to OSCAL schemas: not verified.
- **CSA-8 Adoption.** CSA names early STAR for AI adopters [37]. No count of AICM users or STAR for AI
  listings is published (not verified).

### MITRE ATLAS

- **ATLAS-1 Coverage.** Release 2026.08 contains 16 tactics, 114 techniques, 83 sub-techniques, 39 mitigations
  and 72 case studies [53], matching counts from the data file [54].
- **ATLAS-2 Granularity.** Mitigations (AML.M0000–AML.M0038) carry lifecycle phases and categories;
  techniques carry maturity and platform fields [54].
- **ATLAS-3 Relationship semantics.** Relations between objects are typed (`mitigates`, `employs`, `achieves`,
  and others), and `mitigates` links carry prose descriptions [54]. Links to ATT&CK are bare ID and URL
  references on 42 techniques and 4 mitigations (computed [54]). No structured mapping to NIST AI RMF or
  OWASP lists was found in the data file; OWASP appears as citations in references [54].
- **ATLAS-4 Evidence basis.** ATLAS "is based on empirical evidence from observations of real-world attacks as
  well as realistic demonstrations from AI red teams and security groups" [53]. 72 case studies are linked
  to techniques [54].
- **ATLAS-5 Freshness.** "ATLAS releases monthly content updates" [52]; release 2026.08 is dated 2026-08-31
  [51]. The legacy `dist/ATLAS.yaml` is deprecated and frozen [52].
- **ATLAS-6 Licensing.** Apache License 2.0 [55].
- **ATLAS-7 Machine-readability.** YAML in the repository; tooling generates STIX, Navigator layers and Excel
  [52], and these files are attached to the 2026.08 GitHub release (GitHub API).
- **ATLAS-8 Adoption.** 183 stars on the data repository [57]. A count of ATLAS users: not verified.
- **ATLAS-9 Identifier check against this project.** On `main` after #92, which corrected eleven ATLAS
  citations [102], this project has 117 MITRE ATLAS mapping rows using 34 distinct IDs (computed). 56 rows
  carry exactly the ATLAS 2026.08 name for their ID; 53 differ, and 8 rows cite IDs absent from 2026.08 [54]
  (computed). Some differences are renames, but 56 rows name a different technique or a name that has not
  appeared in any ATLAS release since 2.0.0, for example AML.T0035 labelled "Exfiltrate via ML Inference API",
  where ATLAS names it "AI Artifact Collection" (and 4.0.1 named it "ML Artifact Collection" [56]). The full
  row list and a proposed sequence are in issue #93 [101]. The project's ATLAS registry records the
  licence as "Public" [11]; upstream is Apache-2.0 [55]. This is a mechanical comparison of identifiers
  and names; which technique each row *should* cite is a subject-matter decision.

### HITRUST AI Security Assessment and Certification

- **HITRUST-1 Coverage.** "Up to 44" AI security requirement statements, tailored by AI type [41], [42]. The
  AI Risk Management Assessment (a separate, non-certifying assessment) was launched with 51 control
  requirements [44]. The HITRUST framework page states that the CSF harmonises over 70 standards and
  regulations [47]. Harmonised AI sources include the OWASP AI Exchange, ML Top 10 and Top 10 for LLM
  Applications [41].
- **HITRUST-2 Granularity.** Requirement statements, tailored by three scoping questions, with inheritance
  from service providers [41]. The certification is combined with an e1, i1 or r2 assessment [41], [45].
- **HITRUST-3 Relationship semantics.** How HITRUST expresses the relationship between a CSF requirement and a
  harmonised source: not verified (no public description found).
- **HITRUST-4 Evidence basis.** Built from threat research and an open RFC process [43]. Certification needs
  an external assessment and HITRUST central quality review [41], [49]. The certification covers AI security,
  not broader responsible-AI risks [41].
- **HITRUST-5 Freshness.** CSF v11.8.0 was released 2026-05-07 and adds the OWASP Top 10 for LLM Applications
  2025 as a selectable compliance factor [46].
- **HITRUST-6 Licensing.** The CSF is distributed under a licence agreement [50]; its terms could not be read
  and are **not publicly verifiable**. MyCSF pricing is not publicly stated.
- **HITRUST-7 Machine-readability.** MyCSF is a SaaS platform [48]. An openly published JSON or OSCAL form of
  the CSF: not verified.
- **HITRUST-8 Adoption.** HITRUST reports that 99.62% of HITRUST-certified environments did not report a
  breach in 2025 [49] (HITRUST's figure, not independently checked) and that nearly 30,000 users have
  downloaded the framework in five years [47]. No count of AI Security certifications is published.

### NIST OLIR and CPRT (AI-related entries)

- **OLIR-1 Coverage.** The OLIR catalogue [74] lists 102 informative references: 92 Final, 3 Draft,
  6 Work-in-progress Draft, 1 Archive (computed [75]). AI RMF 1.0 is a focal document with 7 entries, all from
  companies or independent developers; NIST AI 600-1 is not a focal document (computed [75]).
- **OLIR-2 OWASP-derived entries.** Two entries map OWASP documents, both submitted by developers who are not
  the document owner:
  - Entry 198, OWASP Top 10 for LLM Applications (2025) to CSF 2.0, Final, posted 2026-05-08, developer
    "Independent", 169 set-theory relationship entries with strength scores on the 0–10 scale [76].
  - Entry 229, OWASP AISVS 1.0 to SP 800-53 Rev. 5.2.0, Final, posted 2026-08-14, developer a private
    company [77].
  This contradicts the statement in this project's `docs/OLIR_SUBMISSION.md` that "No competing GenAI
  crosswalk currently appears there" [5].
- **OLIR-3 Relationship semantics.** IR 8278A Rev. 1 [70] defines five set-theory relationships, three rationale
  types (syntactic, semantic, functional) and an optional integer strength from 0 to 10 [71]. IR 8477 defines
  four mapping styles; NIST accepts three (concept crosswalk, supportive relationship, set theory) [73].
- **OLIR-4 Evidence basis.** NIST reviews each submission and holds a 30-day public review of a draft
  candidate [71]. The developer asserts the relationships [71].
- **OLIR-5 Freshness.** Entries are versioned and dated individually; entries remain tied to the focal
  document version (e.g. CSF v1.1 entries remain listed) [75].
- **OLIR-6 Licensing.** Submitters represent that submissions do not infringe intellectual property, and
  element descriptions may be left blank for copyrighted text [71]. An explicit open licence for entries:
  not verified.
- **OLIR-7 Machine-readability.** Spreadsheet templates, with CSV and JSON templates possible [71]; CPRT offers
  reference data in XLSX and JSON [78]. CPRT lists datasets for AI RMF, OWASP LLM Top 10 2025 and AISVS 1.0
  (computed from CPRT metadata [79]).
- **OLIR-8 Adoption.** Downstream use of OLIR entries: not verified.

### NIST AI RMF crosswalks

- **RMF-1 Coverage.** The AI Resource Center lists crosswalks submitted by the AI RMF user community,
  including ISO/IEC 42001, ISO/IEC 23894, ISO/IEC 42005, Singapore AI Verify, Japan and Korea guidance [80].
  Three list NIST as provider: OECD / EO 13960 / EU AI Act (proposed) / Blueprint, ISO/IEC FDIS 23894
  (superseded), and Singapore AI Verify [80]. The ISO/IEC 42001 crosswalk lists Microsoft as provider [80].
- **RMF-2 Granularity.** AI RMF functions or subcategories against clause lists [82].
- **RMF-3 Relationship semantics.** The PDFs reviewed present side-by-side tables without typed relationships
  [81], [82]. The page states that inclusion "does not imply NIST endorsement of the resource the AI RMF is
  mapped to, nor does it imply that either resource comprehensively covers the contents of the other" [80].
- **RMF-4 Evidence basis.** Provider-authored. "NIST staff will review all submissions before posting" for
  the listing requirements, which include that the crosswalk "accurately reflect the contents of the AI RMF"
  and map to a freely available resource [80]. A review of the mapped resource side is not stated.
- **RMF-5 Freshness.** The NIST-authored crosswalks are dated 2023 [80]; one maps the EU AI Act as proposed,
  not as adopted [81]. NIST states that AI RMF 1.0 is being revised [83].
- **RMF-6 Licensing.** Not verified.
- **RMF-7 Machine-readability.** PDF only on the listing page [80].
- **RMF-8 Adoption.** Not verified.

### OWASP AI Exchange

- **AIX-1 Coverage.** "300+ pages of free, constantly-evolving, practical guidance" [58]. A total count of
  threats or controls: not stated.
- **AIX-2 Granularity.** Threats and controls organised by asset, impact and attack surface [59].
- **AIX-3 Relationship semantics.** Cross-references are OpenCRE links to other frameworks without a type;
  some ISO/IEC 27002 and 42001 references carry prose "Gap" notes such as "covers this control fully" [60].
- **AIX-4 Evidence basis.** The overview states content contributions to ISO/IEC 27090 and to prEN 18282 for
  the EU AI Act through a liaison partnership [59].
- **AIX-5 Freshness.** Continuous editing; no tagged releases [61].
- **AIX-6 Licensing.** CC0 1.0 [59].
- **AIX-7 Machine-readability.** Markdown source and a PDF [58]. A structured threat/control dataset: not
  verified.
- **AIX-8 Adoption.** 424 GitHub stars [61]. Named users: not verified.

### Google SAIF and the CoSAI Risk Map

- **SAIF-1 Coverage.** The SAIF site lists 15 risks and 24 controls [62], [63]. Google has donated the SAIF
  risk map data to CoSAI as the CoSAI Risk Map [64], [68].
- **SAIF-2 Relationship semantics.** SAIF maps each risk to controls and to the model creator, consumer or
  both, without relationship types [62]. CoSAI-RM mappings are version-pinned ID lists with "no per-mapping
  rationale fields", and "No framework maintainer has reviewed or approved these mappings" [66]. The ATLAS
  mapping target is pinned to 5.0.1 [67].
- **SAIF-3 Evidence basis.** SAIF risks include "Real examples" sections [62].
- **SAIF-4 Licensing.** No content licence was found on the SAIF site [62]. CoSAI-RM content is Apache-2.0
  [65].
- **SAIF-5 Machine-readability.** CoSAI-RM ships YAML with JSON Schema [65]; SAIF itself offers no download
  (not verified beyond the pages fetched).
- **SAIF-6 Adoption.** 97 stars on the CoSAI tooling repository [69]. Member count: not verified.

---

## Where this project is behind

1. **Review.** No row has a named reviewer (P-4). Each compared control catalogue names an authoring body or
   process: human SMEs (SCF-4), a CSA working group (CSA-4), HITRUST assessor and QA review (HITRUST-4), NIST
   review with public comment (OLIR-4).
2. **Typed relationships.** No row is typed (P-3). SCF publishes typed, strength-scored STRM rows for its AI
   mappings (SCF-3). An OLIR entry already maps the OWASP LLM Top 10 to CSF 2.0 with 169 typed rows
   (OLIR-2).
3. **Vocabulary conformance.** The strength field uses a four-value enum where IR 8278A Rev. 1 specifies an
   integer 0–10, and the direction of `subset-of` / `superset-of` is described inconsistently (P-3).
4. **Identifier integrity.** Prose in `control_id` (P-2) and ATLAS IDs whose names do not match upstream
   (ATLAS-9). None of the compared projects was checked the same way, so this is a statement about this
   project only.
5. **Freshness.** 22 of 25 frameworks unchecked, ASVS a major version behind, ATLAS pinned to "4.0" against a
   monthly upstream (P-5). SCF (SCF-5), ATLAS (ATLAS-5) and HITRUST (HITRUST-5) publish dated releases; this
   project's npm package lags the repository by two major versions (P-5).
6. **Registry position.** `docs/OLIR_SUBMISSION.md` is out of date on OLIR: two OWASP-derived entries exist,
   both by non-owner developers (OLIR-2). A submission from this project would be a later entry, not the
   first.
7. **Adoption.** Indicators are small in absolute terms (P-8), and no adopter is publicly documented.
8. **Maintainer concentration.** A single code owner covers all paths (P-4). Bus-factor data for the other
   projects was not collected.

## Where this project is ahead or distinctive

1. **Source side.** The only compared project whose source side is the OWASP GenAI lists, including the
   Agentic Top 10 2026 and DSGAI 2026 (P-1). HITRUST (HITRUST-5), CoSAI-RM (SAIF-2) and OLIR entry 198
   (OLIR-2) reference the OWASP LLM Top 10 2025; no compared source maps the Agentic Top 10 or DSGAI lists
   (based on the sources fetched).
2. **Target mix.** Maps GenAI risks to OT/ICS (ISA/IEC 62443, SP 800-82), financial (DORA, PCI DSS) and
   agentic (MAESTRO, AIUC-1) frameworks in one dataset [1], [2]. SCF maps far more documents overall (SCF-1),
   so the distinction is the combination, not the count.
3. **Licence for adaptation.** CC BY-SA 4.0 permits distributing adaptations (P-6), which SCF's CC BY-ND 4.0
   does not (SCF-6) and HITRUST's and CSA's terms could not be verified to allow (HITRUST-6, CSA-6). ATLAS
   (Apache-2.0), CoSAI-RM (Apache-2.0) and the AI Exchange (CC0) are more permissive than this project.
   Licence compatibility between projects was not assessed and is a question for the maintainer.
4. **Honesty guards in tooling.** The validator blocks unearned confidence, freshness keeps "unchecked"
   separate from "current", and the OLIR exporter refuses unreviewed rows (P-3, P-4, P-5). These are process
   controls; they do not yet produce reviewed content.
5. **Incident corpus linked to GenAI entries.** 131 incident records with references (P-4). ATLAS links 72
   case studies to techniques (ATLAS-4); this project's link from incidents to specific controls is still in
   review (P-4).
6. **Export breadth.** OSCAL, CSV, GRC JSON, STIX 2.1 and an OLIR-shaped export from one dataset (P-7);
   conformance testing of those exports against external schemas is not verified.

---

## Definition of best (DRAFT — `TODO(maintainer): ratify`)

Each criterion comes from a gap above. "Current" is measured on `main` at `db56eeb`. Targets that are value
judgements are left as `TODO(maintainer)`.

| # | Criterion (gap) | Metric | Current | Target |
|---|---|---|---|---|
| B1 | Named review (Behind 1) | % of verified-core rows with non-empty `reviewed_by` and `review_date` | 0% | `TODO(maintainer)` |
| B2 | Typed relationships (Behind 2) | % of verified-core rows with `relationship`, `rationale_type` and `rationale` | 0% | `TODO(maintainer)` |
| B3 | Vocabulary aligned to NIST IR 8278A Rev. 1 (Behind 3) | Test passes: 5 set-theory tokens, strength as integer 0–10, one documented direction | fails (strength enum; direction inconsistent) | pass |
| B4 | Identifier integrity (Behind 4) | % of rows whose `control_id` resolves to an ID in the pinned upstream release and whose name matches it | not measured project-wide; ATLAS: 56 of 117 rows match exactly (computed, after #92) | 100% resolve; name-match `TODO(maintainer)` |
| B5 | Version pinning (Behind 5) | % of rows with `framework_version` | 9.3% (326/3,497, computed) | `TODO(maintainer)` |
| B6 | Freshness verified (Behind 5) | % of frameworks with `current_version` checked within the SLA window | 12% (3/25) | `TODO(maintainer)` (window in FRESHNESS_SLA) |
| B7 | Upstream lag (Behind 5) | days from upstream release to verify / to re-map, per verified-core framework | not measured | `TODO(maintainer)` days |
| B8 | External acceptance (Behind 6) | reviewed mapping sets accepted in NIST OLIR (or reviewed by the framework owner) | 0 | `TODO(maintainer)` |
| B9 | Evidence (Behind 1, Ahead 5) | % of verified-core rows with ≥1 confirmed incident control failure | 0% (in review) | `TODO(maintainer)` |
| B10 | Export conformance (Ahead 6) | OSCAL exports validate against the NIST OSCAL schema in CI | not verified | pass |
| B11 | Maintainer depth (Behind 8) | number of named reviewers with merge rights per verified-core framework | 1 code owner overall | `TODO(maintainer)` |
| B12 | Release parity (Behind 5) | published npm version equals repository version | 2.0.0 vs 4.0.0 | equal |

B4's ATLAS figure: 117 rows, less 53 rows with a differing name and 8 rows whose ID is absent from 2026.08
(ATLAS-9). Adoption counts (stars, downloads) are deliberately not criteria: they measure reach, not
quality.

---

## Recommended verified-core framework list (DRAFT — `TODO(maintainer): ratify`)

Five of the 25 mapped frameworks, chosen for regulatory or registry pull and for how much existing work
elsewhere can be compared against. Row counts are on `main` (computed).

1. **NIST CSF 2.0** (164 rows). An OLIR focal document with 24 entries [75], and the focal document already
   chosen in `docs/OLIR_SUBMISSION.md` [5]; CSF 2.0 was published in February 2024 [88]. OLIR entry 198
   maps the OWASP LLM Top 10 to it [76], giving an external set of typed rows to reconcile with. NIST's
   draft Cyber AI Profile is organised by CSF 2.0 outcomes [86].
2. **NIST AI RMF 1.0** (164 rows). An OLIR focal document with 7 AI-related entries [75]. SCF maps 158
   controls to it [22] and CSA maps AICM to it [34]. Risk: NIST states the AI RMF is being revised [83], so
   reviewed rows may need re-mapping.
3. **ISO/IEC 42001:2023** (164 rows). Mapped by SCF [22], CSA AICM [34] and a crosswalk listed by NIST [80], [82];
   a certification-body standard (ISO/IEC 42006:2025) exists [97] and STAR for AI Level 2 requires 42001
   certification [38]. Constraint: the standard's text is paywalled, which limits public checking of rows.
4. **EU AI Act** (124 rows). Regulatory pull with fixed application dates [98]; the AI Omnibus moved Annex III
   high-risk obligations to 2 December 2027 and Annex I to 2 August 2028 [99]. The text is freely available
   on EUR-Lex [98]. This framework's rows are affected by the `control_id` defect [14], so a review pass would
   also repair them.
5. **MITRE ATLAS** (117 rows). Apache-2.0 data with monthly dated releases [52], [55] and a public repository
   [57], so reviewers can check every ID. The identifier mismatch found here (ATLAS-9) is the largest
   measured accuracy gap, and CoSAI-RM also maps to ATLAS [67].

Alternative considered: **OWASP ASVS** (151 rows). The owner community is inside OWASP, but the 5.0.0
renumbering means review would be a re-map rather than a verification [15].

`TODO(maintainer)`: confirm the five, and decide whether owner-community review (for example, requests to
the ATLAS or ISO liaison communities) is a requirement for "verified".

---

## Recommended order for adding the dangling frameworks

These frameworks are named in CROSSREF.md's *Referenced but not yet mapped* table [12] and roadmap issue #19
[16]. The order is a recommendation for the scope decision in #19.

1. **NIST AI 600-1** — the GenAI profile of the AI RMF, with 12 GAI risks [84]; SCF maps 139 controls to it
   [22] and CSA maps AICM to it [32]. It is not an OLIR focal document [75], so the value is content, not
   registry.
2. **NIST SP 800-53 Rev. 5 (Release 5.2.0)** — an OLIR focal document [75] with an OSCAL version [87]; NIST's
   AI control overlays (COSAiS) are built on SP 800-53 [85]; OLIR entry 229 maps OWASP AISVS to it [77].
3. **MITRE ATT&CK** — ATLAS already carries ATT&CK references on 42 techniques and 4 mitigations [54];
   royalty-free licence [90]; current version v19.2 [89].
4. **ISO/IEC 27701:2025** — second edition, usable as a standalone privacy management system standard [96];
   relevant to DSGAI data risks. Paywalled, like ISO/IEC 42001.
5. **CycloneDX (ECMA-424)** — a bill-of-materials specification that covers machine learning models
   [91], [92]. It is a data format, not a control set, so a supportive-relationship mapping (IR 8477 [73]) fits
   better than set theory.
6. **BSIMM16** — a descriptive measurement of 111 organisations with an AI/ML section and no structural change
   in this version [93], [94]; licensed CC BY-SA 3.0 [94].
7. **COBIT 2019** — no AI-specific COBIT release was found; ISACA addresses AI through a January 2025 white
   paper [95]. Its only OLIR entry maps to CSF v1.1 [75]. Licensing: not verified.

---

## References

All accessed 2026-09-14. Fetch status for each is in `SOURCES_CHECK.json`.

1. GenAI Security Crosswalk, README.md (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/README.md>
2. data/stats.json (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/data/stats.json>
3. data/schema.json (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/data/schema.json>
4. docs/SCHEMA_V2_MIGRATION.md (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/docs/SCHEMA_V2_MIGRATION.md>
5. docs/OLIR_SUBMISSION.md (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/docs/OLIR_SUBMISSION.md>
6. docs/FRESHNESS_SLA.md (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/docs/FRESHNESS_SLA.md>
7. data/framework-sources.json (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/data/framework-sources.json>
8. LICENSE.md (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/LICENSE.md>
9. scripts/compliance-report.js (main at db56eeb) —
   <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/scripts/compliance-report.js>
10. scripts/export-olir.mjs (main at db56eeb) —
    <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/scripts/export-olir.mjs>
11. data/frameworks/mitre-atlas.json (main at db56eeb) —
    <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/data/frameworks/mitre-atlas.json>
12. CROSSREF.md (main at db56eeb) —
    <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/CROSSREF.md>
13. .github/CODEOWNERS (main at db56eeb) —
    <https://github.com/GenAI-Security-Project/crosswalk/blob/db56eeb/.github/CODEOWNERS>
14. Issue #35, Swapped control_id / control_name —
    <https://github.com/GenAI-Security-Project/crosswalk/issues/35>
15. Issue #22, ASVS 5.0 re-map — <https://github.com/GenAI-Security-Project/crosswalk/issues/22>
16. Issue #19, roadmap: framework additions — <https://github.com/GenAI-Security-Project/crosswalk/issues/19>
17. PR #87, T-STRAT03 evidence loop (in review) — <https://github.com/GenAI-Security-Project/crosswalk/pull/87>
18. npm, genai-security-crosswalk — <https://www.npmjs.com/package/genai-security-crosswalk>
19. npm downloads API, last month —
    <https://api.npmjs.org/downloads/point/last-month/genai-security-crosswalk>
20. GitHub API, crosswalk repository metadata — <https://api.github.com/repos/GenAI-Security-Project/crosswalk>
21. SCF, GitHub releases — <https://github.com/securecontrolsframework/securecontrolsframework/releases>
22. SCF 2026.2 spreadsheet —
    <https://github.com/securecontrolsframework/securecontrolsframework/raw/main/secure-controls-framework-scf-2026-2.xlsx>
23. SCF, Set Theory Relationship Mapping (STRM) —
    <https://securecontrolsframework.com/start-here/set-theory-relationship-mapping-strm>
24. SCF, STRM: ISO/IEC 42001:2023 (PDF) —
    <https://content.securecontrolsframework.com/strm/scf-strm-general-iso-42001-2023.pdf>
25. SCF, Terms and Conditions — <https://securecontrolsframework.com/terms-conditions>
26. SCF, Commercial License — <https://securecontrolsframework.com/commercial-license>
27. SCF, FAQs — <https://securecontrolsframework.com/faqs>
28. SCF, Download — <https://securecontrolsframework.com/free-content/scf-download>
29. SCF, NIST OLIR participation — <https://securecontrolsframework.com/start-here/nist-olir-participation>
30. SCF, Conformity Assessment Program —
    <https://securecontrolsframework.com/scr-certified/organization-level-scr-certifications/scr-conformity-assessment-program-cap>
31. GitHub API, SCF repository metadata —
    <https://api.github.com/repos/securecontrolsframework/securecontrolsframework>
32. CSA, AI Controls Matrix v1.1 — <https://cloudsecurityalliance.org/artifacts/ai-controls-matrix-v1-1>
33. CSA, AI Controls Matrix (v1.0) — <https://cloudsecurityalliance.org/artifacts/ai-controls-matrix>
34. CSA blog, AI Controls Matrix v1.1 —
    <https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai>
35. CSA blog, Introducing the CSA AI Controls Matrix —
    <https://cloudsecurityalliance.org/blog/2025/07/10/introducing-the-csa-ai-controls-matrix-a-comprehensive-framework-for-trustworthy-ai>
36. CSA blog, AICM and ISO/IEC 42001 mapping —
    <https://cloudsecurityalliance.org/blog/2025/08/20/announcing-the-ai-controls-matrix-and-iso-iec-42001-mapping-and-the-roadmap-to-star-for-ai-42001>
37. CSA press release, STAR for AI launch —
    <https://cloudsecurityalliance.org/press-releases/2025/10/23/cloud-security-alliance-launches-star-for-ai-establishing-the-global-framework-for-responsible-and-auditable-artificial-intelligence>
38. CSA, STAR for AI — <https://cloudsecurityalliance.org/star/ai>
39. CSA, Cloud Controls Matrix — <https://cloudsecurityalliance.org/research/cloud-controls-matrix>
40. CSA, CCM and AICM Licensing FAQ — <https://cloudsecurityalliance.org/artifacts/ccm-aicm-licensing-faq>
41. HITRUST help, AI Security Assessment — <https://hitrustalliance.net/help/ai-sec-assessment>
42. HITRUST, AI Security Assessment and Certification —
    <https://hitrustalliance.net/assessments-and-certifications/aisecurityassessment>
43. HITRUST press release, AI Security Assessment and Certification —
    <https://hitrustalliance.net/press-releases/hitrust_launches_ai_security_assessment_and_certification>
44. HITRUST press release, AI Risk Management Assessment —
    <https://hitrustalliance.net/press-releases/hitrust-launches-new-ai-risk-management-assessment>
45. HITRUST Assessment Advisory HAA 2024-008 — <https://hitrustalliance.net/advisories/haa-2024-008>
46. HITRUST Assessment Advisory HAA 2026-002, CSF v11.8.0 —
    <https://hitrustalliance.net/advisories/haa-2026-002-csf-version-11.8.0-release>
47. HITRUST Framework — <https://hitrustalliance.net/hitrust-framework>
48. HITRUST MyCSF — <https://hitrustalliance.net/mycsf>
49. HITRUST press release, 2026 Trust Report —
    <https://hitrustalliance.net/press-releases/the-cybersecurity-trust-crisis-why-99.62-of-hitrust-certified-environments-stay-breach-free-while-third-party-risk-and-exploits-surge>
50. HITRUST CSF License Agreement (PDF) —
    <https://hitrustalliance.net/hubfs/Agreements/HITRUST%20CSF%20License%20Agreement.pdf>
51. MITRE ATLAS data, release manifest —
    <https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/manifest.yaml>
52. MITRE ATLAS data, README — <https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/README.md>
53. MITRE ATLAS data, CHANGELOG — <https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/CHANGELOG.md>
54. MITRE ATLAS data 2026.08 (YAML) —
    <https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/v6/ATLAS-2026.08.yaml>
55. MITRE ATLAS data, LICENSE — <https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/LICENSE>
56. MITRE ATLAS data 4.0.1 (YAML) —
    <https://raw.githubusercontent.com/mitre-atlas/atlas-data/v4.0.1/dist/ATLAS.yaml>
57. GitHub API, atlas-data repository metadata — <https://api.github.com/repos/mitre-atlas/atlas-data>
58. OWASP AI Exchange — <https://owaspai.org/>
59. OWASP AI Exchange, AI security overview — <https://owaspai.org/docs/ai_security_overview/>
60. OWASP AI Exchange source, threats through use —
    <https://raw.githubusercontent.com/OWASP/www-project-ai-security-and-privacy-guide/main/content/ai_exchange/content/docs/2_threats_through_use.md>
61. GitHub API, AI Exchange repository metadata —
    <https://api.github.com/repos/OWASP/www-project-ai-security-and-privacy-guide>
62. Google SAIF, Risks — <https://saif.google/secure-ai-framework/risks>
63. Google SAIF, Controls — <https://saif.google/secure-ai-framework/controls>
64. Google SAIF, Secure AI Framework — <https://saif.google/secure-ai-framework>
65. CoSAI secure-ai-tooling, README —
    <https://raw.githubusercontent.com/cosai-oasis/secure-ai-tooling/main/README.md>
66. CoSAI Risk Map, framework mappings style guide —
    <https://raw.githubusercontent.com/cosai-oasis/secure-ai-tooling/main/risk-map/docs/contributing/framework-mappings-style-guide.md>
67. CoSAI Risk Map, frameworks.yaml —
    <https://raw.githubusercontent.com/cosai-oasis/secure-ai-tooling/main/risk-map/yaml/frameworks.yaml>
68. CoSAI, Google donates SAIF data to CoSAI —
    <https://www.coalitionforsecureai.org/google-donates-secure-ai-framework-saif-data-to-coalition-for-secure-ai/>
69. GitHub API, secure-ai-tooling repository metadata — <https://api.github.com/repos/cosai-oasis/secure-ai-tooling>
70. NIST IR 8278A Rev. 1 — <https://csrc.nist.gov/pubs/ir/8278/a/r1/final>
71. NIST IR 8278A Rev. 1 (PDF) — <https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8278Ar1.pdf>
72. NIST IR 8477 — <https://csrc.nist.gov/pubs/ir/8477/final>
73. NIST IR 8477 (PDF) — <https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8477.pdf>
74. NIST OLIR Informative Reference Catalog — <https://csrc.nist.gov/projects/olir/informative-reference-catalog>
75. NIST OLIR catalogue JSON endpoint —
    <https://csrc.nist.gov/extensions/nudp/services/json/olir/informative-reference-catalog?focalDocId=&keyword=>
76. NIST OLIR entry 198, OWASP LLM Top 10 to CSF 2.0 —
    <https://csrc.nist.gov/extensions/nudp/services/json/olir/informative-reference-catalog/details/198>
77. NIST OLIR entry 229, OWASP AISVS 1.0 to SP 800-53 Rev. 5.2.0 —
    <https://csrc.nist.gov/extensions/nudp/services/json/olir/informative-reference-catalog/details/229>
78. NIST Cybersecurity and Privacy Reference Tool (CPRT) — <https://csrc.nist.gov/projects/cprt>
79. NIST CPRT framework metadata JSON endpoint —
    <https://csrc.nist.gov/extensions/nudp/services/json/nudp/framework/metadata>
80. NIST AI Resource Center, AI RMF Crosswalks — <https://airc.nist.gov/airmf-resources/crosswalks/>
81. NIST, crosswalk AI RMF 1.0 to OECD, EO 13960, EU AI Act (proposed), Blueprint (PDF) —
    <https://www.nist.gov/system/files/documents/2023/01/26/crosswalk_AI_RMF_1_0_OECD_EO_AIA_BoR.pdf>
82. Crosswalk, NIST AI RMF to ISO/IEC 42001 (PDF) —
    <https://airc.nist.gov/docs/NIST_AI_RMF_to_ISO_IEC_42001_Crosswalk.pdf>
83. NIST, AI Risk Management Framework — <https://www.nist.gov/itl/ai-risk-management-framework>
84. NIST AI 600-1, Generative AI Profile (PDF) — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>
85. NIST, Control Overlays for Securing AI Systems (COSAiS) — <https://csrc.nist.gov/projects/cosais>
86. NIST IR 8596 initial preliminary draft, Cyber AI Profile — <https://csrc.nist.gov/pubs/ir/8596/iprd>
87. NIST SP 800-53 Rev. 5, Release 5.2.0 — <https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final>
88. NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 —
    <https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final>
89. MITRE ATT&CK, Versions — <https://attack.mitre.org/resources/versions/>
90. MITRE ATT&CK, Terms of Use — <https://attack.mitre.org/resources/legal-and-branding/terms-of-use/>
91. CycloneDX, v1.5 released — <https://cyclonedx.org/news/cyclonedx-v1.5-released/>
92. Ecma International, ECMA-424 —
    <https://ecma-international.org/publications-and-standards/standards/ecma-424/>
93. Black Duck press release, BSIMM16 —
    <https://news.blackduck.com/2026-02-04-Black-Duck-Releases-BSIMM16-Revealing-AI-and-Regulatory-Compliance-Reshaping-Application-Security-Processes>
94. BSIMM16 report (PDF) — <https://www.blackduck.com/content/dam/black-duck/en-us/reports/bsimm-report.pdf>
95. ISACA white paper, Leveraging COBIT for Effective AI System Governance —
    <https://www.isaca.org/resources/white-papers/2025/leveraging-cobit-for-effective-ai-system-governance>
96. ISO, ISO/IEC 27701:2025 — <https://www.iso.org/standard/27701>
97. ISO, ISO/IEC 42006:2025 — <https://www.iso.org/standard/42006>
98. EUR-Lex, Regulation (EU) 2024/1689 (Artificial Intelligence Act) —
    <https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689>
99. European Commission, AI Omnibus enters into force —
    <https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force>
100. PR #90, last entry in a mapping file swallowed closing tables (in review) —
     <https://github.com/GenAI-Security-Project/crosswalk/pull/90>
101. Issue #93, MITRE ATLAS identifier and name mismatches —
     <https://github.com/GenAI-Security-Project/crosswalk/issues/93>
102. PR #92, correct eleven MITRE ATLAS technique citations (merged) —
     <https://github.com/GenAI-Security-Project/crosswalk/pull/92>
103. PR #94, add OWASP AISVS 1.0 mapping (in review) —
     <https://github.com/GenAI-Security-Project/crosswalk/pull/94>

---

*Part of the [OWASP GenAI Crosswalk](https://github.com/GenAI-Security-Project/crosswalk) —
maintained by the [OWASP GenAI Data Security Initiative](https://genai.owasp.org)*
